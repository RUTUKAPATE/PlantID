import { users, plantIdentifications, type User, type InsertUser, type PlantIdentification, type InsertPlantIdentification } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPlantIdentification(identification: InsertPlantIdentification): Promise<PlantIdentification>;
  getPlantIdentificationsByUser(userId?: number): Promise<PlantIdentification[]>;
  getPlantIdentification(id: number): Promise<PlantIdentification | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createPlantIdentification(insertIdentification: InsertPlantIdentification): Promise<PlantIdentification> {
    const [identification] = await db
      .insert(plantIdentifications)
      .values(insertIdentification)
      .returning();
    return identification;
  }

  async getPlantIdentificationsByUser(userId?: number): Promise<PlantIdentification[]> {
    if (userId) {
      return await db.select().from(plantIdentifications).where(eq(plantIdentifications.userId, userId));
    }
    return await db.select().from(plantIdentifications);
  }

  async getPlantIdentification(id: number): Promise<PlantIdentification | undefined> {
    const [identification] = await db.select().from(plantIdentifications).where(eq(plantIdentifications.id, id));
    return identification || undefined;
  }
}

export const storage = new DatabaseStorage();
