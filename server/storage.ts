import { users, plantIdentifications, plantDiseases, type User, type InsertUser, type PlantIdentification, type InsertPlantIdentification, type PlantDisease, type InsertPlantDisease } from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPlantIdentification(identification: InsertPlantIdentification): Promise<PlantIdentification>;
  getPlantIdentificationsByUser(userId: number): Promise<PlantIdentification[]>;
  getPlantIdentification(id: number): Promise<PlantIdentification | undefined>;
  createPlantDisease(disease: InsertPlantDisease): Promise<PlantDisease>;
  getPlantDiseasesByUser(userId: number): Promise<PlantDisease[]>;
  getPlantDisease(id: number): Promise<PlantDisease | undefined>;
  updateUser(userId: number, updateData: Partial<InsertUser>): Promise<User | null>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  async getPlantIdentificationsByUser(userId: number): Promise<PlantIdentification[]> {
    return await db.select().from(plantIdentifications).where(eq(plantIdentifications.userId, userId));
  }

  async getPlantIdentification(id: number): Promise<PlantIdentification | undefined> {
    const [identification] = await db.select().from(plantIdentifications).where(eq(plantIdentifications.id, id));
    return identification || undefined;
  }

  async createPlantDisease(insertDisease: InsertPlantDisease): Promise<PlantDisease> {
    const [disease] = await db
      .insert(plantDiseases)
      .values(insertDisease)
      .returning();
    return disease;
  }

  async getPlantDiseasesByUser(userId: number): Promise<PlantDisease[]> {
    return await db.select().from(plantDiseases).where(eq(plantDiseases.userId, userId));
  }

  async getPlantDisease(id: number): Promise<PlantDisease | undefined> {
    const [disease] = await db.select().from(plantDiseases).where(eq(plantDiseases.id, id));
    return disease || undefined;
  }

  async updateUser(userId: number, updateData: Partial<InsertUser>): Promise<User | null> {
    const [user] = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();
    return user || null;
  }

  async deletePlantIdentification(id: number, userId: number): Promise<void> {
  await db.delete(plantIdentifications).where(
    and(eq(plantIdentifications.id, id), eq(plantIdentifications.userId, userId))
  );
}
}

export const storage = new DatabaseStorage();
