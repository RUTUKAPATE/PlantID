import bcrypt from 'bcrypt';
import session from 'express-session';
import type { Express, Request, Response, NextFunction } from 'express';
import { storage } from './storage';
import { insertUserSchema, loginUserSchema } from '@shared/schema';

declare module 'express-session' {
  interface SessionData {
    userId: number;
    username: string;
  }
}

const SALT_ROUNDS = 10;

export function setupSession(app: Express) {
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    }
  }));
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: 'Authentication required' });
  }
  next();
}

export async function registerUser(userData: any) {
  // Validate input
  const validatedData = insertUserSchema.parse(userData);
  
  // Check if user already exists
  const existingUserByUsername = await storage.getUserByUsername(validatedData.username);
  if (existingUserByUsername) {
    throw new Error('Username already exists');
  }
  
  const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
  if (existingUserByEmail) {
    throw new Error('Email already exists');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(validatedData.password);
  
  // Create user
  const newUser = await storage.createUser({
    ...validatedData,
    password: hashedPassword,
  });
  
  // Return user without password
  const { password, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function loginUser(loginData: any) {
  // Validate input
  const validatedData = loginUserSchema.parse(loginData);
  
  // Find user
  const user = await storage.getUserByUsername(validatedData.username);
  if (!user) {
    throw new Error('Invalid username or password');
  }
  
  // Verify password
  const isPasswordValid = await verifyPassword(validatedData.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid username or password');
  }
  
  // Return user without password
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}