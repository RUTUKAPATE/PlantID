import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupSession, requireAuth, registerUser, loginUser } from "./auth";
import multer from "multer";
import sharp from "sharp";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { insertPlantIdentificationSchema, insertPlantDiseaseSchema, insertContactMessageSchema, contactMessages, userSavedPlants, plantIdentifications } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt"; 
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { db } from "./db";
import { and, eq } from "drizzle-orm";

// Add these lines at the top of your file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  app.use('/uploads', express.static(path.join(__dirname, "..", "uploads")));
  // Setup session middleware
  setupSession(app);

  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || 
    process.env.GOOGLE_AI_API_KEY || 
    process.env.API_KEY || 
    ""
  );

app.post('/api/contact', async (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!email || !message || !name || !subject) {
    return res.status(400).json({ message: "Name, email, subject, and message are required." });
  }

  // Validate input using Zod schema
  const parse = insertContactMessageSchema.safeParse({ name, email, subject, message });
  if (!parse.success) {
    return res.status(400).json({ message: "Invalid input.", errors: parse.error.errors });
  }

  // Store in Neon DB
  try {
    await db.insert(contactMessages).values(parse.data);
  } catch (dbError) {
    console.error("DB insert error:", dbError);
    return res.status(500).json({ message: "Failed to save contact message." });
  }

  // Configure transporter (use environment variables for real projects)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: email,
      to: "rutuja16kapate@gmail.com",
      subject: subject || "New Contact Message from PlantID",
      text: `From: ${name} <${email}>\n\n${message}`,
    });
    res.json({ message: "Message sent and saved!" });
  } catch (err) {
    console.error("Email send error:", err);
    res.status(500).json({ message: "Failed to send message, but it was saved." });
  }
});

  // Authentication routes
  app.post('/api/auth/register', async (req: Request, res: Response) => {
    try {
      const user = await registerUser(req.body);
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({ user, message: 'Registration successful' });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  });

  app.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
      const user = await loginUser(req.body);
      req.session.userId = user.id;
      req.session.username = user.username;
      res.json({ user, message: 'Login successful' });
    } catch (error) {
      console.error('Login error:', error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  });

  app.post('/api/auth/logout', (req: Request, res: Response) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: 'Could not log out' });
      }
      res.json({ message: 'Logout successful' });
    });
  });

  app.get('/api/auth/user', async (req: Request, res: Response) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Failed to get user information' });
    }
  });

  // Plant identification endpoint
  app.post('/api/identify-plant', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Process image with sharp for optimization
      const processedImage = await sharp(req.file.buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Convert to base64 for Gemini API
      const base64Image = processedImage.toString('base64');

      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze this plant image and provide detailed identification and care information in JSON format.
        Please respond with a JSON object containing the following fields:
        {
          "commonName": "string - most common name for this plant",
          "scientificName": "string - scientific/botanical name",
          "family": "string - plant family",
          "origin": "string - native region/origin",
          "confidence": number - confidence percentage (0-100),
          "wateringInstructions": "string - detailed watering guidance",
          "lightRequirements": "string - light requirements and preferences",
          "temperatureRange": "string - ideal temperature range",
          "humidityRequirements": "string - humidity needs",
          "soilRequirements": "string - soil type and drainage needs",
          "careTips": ["array of strings - 3-5 specific care tips"]
        }
        
        If you cannot identify the plant with reasonable confidence, set confidence to 0 and provide general plant care advice.
        Be specific and practical in your care instructions.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let plantData;
      try {
        // Extract JSON from response (remove any markdown formatting)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        plantData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        return res.status(500).json({ 
          message: 'Failed to process plant identification response' 
        });
      }

      // Validate the response structure
      if (!plantData.commonName || !plantData.scientificName || typeof plantData.confidence !== 'number') {
        return res.status(500).json({ 
          message: 'Invalid plant identification response format' 
        });
      }

      // Save image to disk
      const uploadsDir = path.join(__dirname, "..", "uploads");
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

      const fileName = `${Date.now()}_${req.file.originalname}`;
      const filePath = path.join(uploadsDir, fileName);
      fs.writeFileSync(filePath, req.file.buffer);

      // Set imageUrl to be accessible from the frontend (you may need to serve this statically)
      const imageUrl = `/uploads/${fileName}`;

      // Save identification to storage
      const identificationData = {
        userId: req.session.userId || null,
        commonName: plantData.commonName,
        scientificName: plantData.scientificName,
        family: plantData.family || null,
        origin: plantData.origin || null,
        confidence: plantData.confidence,
        wateringInstructions: plantData.wateringInstructions || null,
        lightRequirements: plantData.lightRequirements || null,
        temperatureRange: plantData.temperatureRange || null,
        humidityRequirements: plantData.humidityRequirements || null,
        soilRequirements: plantData.soilRequirements || null,
        careTips: plantData.careTips || [],
        imageUrl, // Could implement image storage later
      };

      const savedIdentification = await storage.createPlantIdentification(identificationData);

      res.json({
        success: true,
        identification: savedIdentification,
      });

    } catch (error) {
      console.error('Plant identification error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return res.status(401).json({ 
            message: 'API key is missing or invalid. Please check your Gemini API configuration.' 
          });
        }
        if (error.message.includes('quota') || error.message.includes('limit')) {
          return res.status(429).json({ 
            message: 'API quota exceeded. Please try again later.' 
          });
        }
      }

      res.status(500).json({ 
        message: 'Failed to identify plant. Please try again with a clearer image.' 
      });
    }
  });

  // Get plant identifications history
  app.get('/api/identifications', requireAuth, async (req: Request, res: Response) => {
    try {
      const identifications = await storage.getPlantIdentificationsByUser(req.session.userId!);
      res.json(identifications);
    } catch (error) {
      console.error('Failed to fetch identifications:', error);
      res.status(500).json({ message: 'Failed to fetch identification history' });
    }
  });

  // Get single plant identification
  app.get('/api/identifications/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid identification ID' });
      }

      const identification = await storage.getPlantIdentification(id);
      if (!identification) {
        return res.status(404).json({ message: 'Plant identification not found' });
      }

      res.json(identification);
    } catch (error) {
      console.error('Failed to fetch identification:', error);
      res.status(500).json({ message: 'Failed to fetch plant identification' });
    }
  });

  // Plant disease identification endpoint
  app.post('/api/diagnose-plant', upload.single('image'), async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      // Process image with sharp for optimization
      const processedImage = await sharp(req.file.buffer)
        .resize(1024, 1024, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 85 })
        .toBuffer();

      // Convert to base64 for Gemini API
      const base64Image = processedImage.toString('base64');

      // Initialize Gemini model
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const prompt = `
        Analyze this plant image for diseases, pests, nutrient deficiencies, and health issues. 
        Provide detailed diagnosis information in JSON format.
        Please respond with a JSON object containing the following fields:
        {
          "plantName": "string - if you can identify the plant, otherwise 'Unknown Plant'",
          "diseaseName": "string - name of the disease, pest, or issue identified",
          "diseaseType": "string - one of: 'disease', 'pest', 'deficiency', 'environmental'",
          "severity": "string - one of: 'mild', 'moderate', 'severe'",
          "confidence": number - confidence percentage (0-100),
          "symptoms": ["array of strings - visible symptoms observed"],
          "causes": ["array of strings - potential causes of this issue"],
          "treatmentOptions": ["array of strings - specific treatment recommendations"],
          "preventionTips": ["array of strings - how to prevent this issue in future"],
          "immediateActions": ["array of strings - urgent actions to take now"],
          "affectedParts": ["array of strings - which parts of plant are affected"]
        }
        
        If the plant appears healthy, set diseaseName to "Healthy Plant", diseaseType to "healthy", 
        and provide general care advice. Be specific and practical in your recommendations.
        Focus on actionable advice that plant owners can implement.
      `;

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: base64Image
          }
        }
      ]);

      const response = await result.response;
      const text = response.text();

      // Parse JSON response
      let diseaseData;
      try {
        // Extract JSON from response (remove any markdown formatting)
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        diseaseData = JSON.parse(jsonMatch[0]);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', text);
        return res.status(500).json({ 
          message: 'Failed to process plant disease diagnosis response' 
        });
      }

      // Validate the response structure
      if (!diseaseData.diseaseName || !diseaseData.diseaseType || typeof diseaseData.confidence !== 'number') {
        return res.status(500).json({ 
          message: 'Invalid plant disease diagnosis response format' 
        });
      }

      // Save diagnosis to storage
      const diagnosisData = {
        userId: req.session.userId || null,
        plantName: diseaseData.plantName || 'Unknown Plant',
        diseaseName: diseaseData.diseaseName,
        diseaseType: diseaseData.diseaseType,
        severity: diseaseData.severity || 'moderate',
        confidence: diseaseData.confidence,
        symptoms: diseaseData.symptoms || [],
        causes: diseaseData.causes || [],
        treatmentOptions: diseaseData.treatmentOptions || [],
        preventionTips: diseaseData.preventionTips || [],
        immediateActions: diseaseData.immediateActions || [],
        affectedParts: diseaseData.affectedParts || [],
        imageUrl: null, // Could implement image storage later
      };

      const savedDiagnosis = await storage.createPlantDisease(diagnosisData);

      res.json({
        success: true,
        diagnosis: savedDiagnosis,
      });

    } catch (error) {
      console.error('Plant disease diagnosis error:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          return res.status(401).json({ 
            message: 'API key is missing or invalid. Please check your Gemini API configuration.' 
          });
        }
        if (error.message.includes('quota') || error.message.includes('limit')) {
          return res.status(429).json({ 
            message: 'API quota exceeded. Please try again later.' 
          });
        }
      }

      res.status(500).json({ 
        message: 'Failed to diagnose plant health. Please try again with a clearer image.' 
      });
    }
  });

  // Get plant disease diagnoses history
  app.get('/api/diagnoses', requireAuth, async (req: Request, res: Response) => {
    try {
      const diagnoses = await storage.getPlantDiseasesByUser(req.session.userId!);
      res.json(diagnoses);
    } catch (error) {
      console.error('Failed to fetch diagnoses:', error);
      res.status(500).json({ message: 'Failed to fetch diagnosis history' });
    }
  });

  // Get single plant disease diagnosis
  app.get('/api/diagnoses/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: 'Invalid diagnosis ID' });
      }

      const diagnosis = await storage.getPlantDisease(id);
      if (!diagnosis) {
        return res.status(404).json({ message: 'Plant diagnosis not found' });
      }

      res.json(diagnosis);
    } catch (error) {
      console.error('Failed to fetch diagnosis:', error);
      res.status(500).json({ message: 'Failed to fetch plant diagnosis' });
    }
  });

app.post('/api/my-plants', requireAuth, async (req, res) => {
  const { plantIdentificationId } = req.body;
  const userId = req.session.userId;
  if (typeof userId !== "number") {
    return res.status(401).json({ message: "User not authenticated" });
  }

  // Get plant details
  const plant = await db.query.plantIdentifications.findFirst({
    where: (pi, { eq }) => eq(pi.id, plantIdentificationId),
  });
  if (!plant) {
    return res.status(404).json({ message: "Plant identification not found" });
  }

  // Check for duplicate by imageUrl for this user
  const existing = await db.query.userSavedPlants.findFirst({
    where: (usp, { eq, and }) =>
      and(
        eq(usp.userId, userId),
        eq(usp.imageUrl, plant.imageUrl ?? "")
      ),
  });
  if (existing) {
    return res.status(200).json({ success: false, message: "This image has already been saved." });
  }

  // Insert as usual
  await db.insert(userSavedPlants).values({
    userId,
    plantIdentificationId: plant.id,
    commonName: plant.commonName,
    scientificName: plant.scientificName,
    family: plant.family,
    origin: plant.origin,
    confidence: plant.confidence,
    wateringInstructions: plant.wateringInstructions,
    lightRequirements: plant.lightRequirements,
    temperatureRange: plant.temperatureRange,
    humidityRequirements: plant.humidityRequirements,
    soilRequirements: plant.soilRequirements,
    careTips: plant.careTips,
    imageUrl: plant.imageUrl,
  });
  res.json({ success: true });
});

app.get('/api/my-plants', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  if (typeof userId !== "number") {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    // Adjust this query for your ORM and schema
    const saved = await db.select()
      .from(userSavedPlants)
      .where(eq(userSavedPlants.userId, userId))
      .leftJoin(plantIdentifications, eq(userSavedPlants.plantIdentificationId, plantIdentifications.id));
    // Map to just the plant details
    const plants = saved.map(row => row.plant_identifications);
    res.json(plants);
  } catch (err) {
    console.error("Failed to fetch saved plants:", err);
    res.status(500).json({ message: "Failed to fetch saved plants" });
  }
});

   // Update user profile
app.put('/api/auth/profile', requireAuth, async (req: Request, res: Response) => {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  try {
    const { username, firstName, lastName, email, currentPassword, newPassword, confirmPassword } = req.body;
    const updateData: any = { username, firstName, lastName, email };

    // Handle password change logic
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "All password fields are required." });
      }
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New passwords do not match." });
      }

      // Fetch user to check current password
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
      const passwordMatch = await bcrypt.compare(currentPassword, user.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: "Current password is incorrect." });
      }

      // Hash and set new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedPassword;
    }

    // Remove undefined fields (optional, but good practice)
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key]
    );

    const updatedUser = await storage.updateUser(req.session.userId, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    const { password, ...userWithoutPassword } = updatedUser;
    res.json({ user: userWithoutPassword, message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

app.delete('/api/my-plants/:id', requireAuth, async (req, res) => {
  const userId = req.session.userId;
  const plantIdentificationId = parseInt(req.params.id, 10);
  if (isNaN(plantIdentificationId)) {
    return res.status(400).json({ message: "Invalid plant identification ID" });
  }
  if (typeof userId !== "number") {
    return res.status(401).json({ message: "User not authenticated" });
  }
  try {
    await db.delete(userSavedPlants).where(
      and(
        eq(userSavedPlants.userId, userId),
        eq(userSavedPlants.plantIdentificationId, plantIdentificationId)
      )
    );
    res.json({ message: "Plant removed from your collection" });
  } catch (error) {
    console.error("Failed to remove saved plant:", error);
    res.status(500).json({ message: "Failed to remove saved plant" });
  }
});
  const httpServer = createServer(app);
  return httpServer;
}
