import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import sharp from "sharp";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { insertPlantIdentificationSchema } from "@shared/schema";
import { z } from "zod";

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
  // Initialize Gemini AI
  const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY || 
    process.env.GOOGLE_AI_API_KEY || 
    process.env.API_KEY || 
    ""
  );

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

      // Save identification to storage
      const identificationData = {
        userId: null, // No user system for now
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
        imageUrl: null, // Could implement image storage later
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
  app.get('/api/identifications', async (req: Request, res: Response) => {
    try {
      const identifications = await storage.getPlantIdentificationsByUser();
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

  const httpServer = createServer(app);
  return httpServer;
}
