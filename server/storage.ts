import { users, plantIdentifications, type User, type InsertUser, type PlantIdentification, type InsertPlantIdentification } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createPlantIdentification(identification: InsertPlantIdentification): Promise<PlantIdentification>;
  getPlantIdentificationsByUser(userId?: number): Promise<PlantIdentification[]>;
  getPlantIdentification(id: number): Promise<PlantIdentification | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plantIdentifications: Map<number, PlantIdentification>;
  private currentUserId: number;
  private currentPlantId: number;

  constructor() {
    this.users = new Map();
    this.plantIdentifications = new Map();
    this.currentUserId = 1;
    this.currentPlantId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createPlantIdentification(insertIdentification: InsertPlantIdentification): Promise<PlantIdentification> {
    const id = this.currentPlantId++;
    const identification: PlantIdentification = {
      ...insertIdentification,
      id,
      createdAt: new Date(),
    };
    this.plantIdentifications.set(id, identification);
    return identification;
  }

  async getPlantIdentificationsByUser(userId?: number): Promise<PlantIdentification[]> {
    const identifications = Array.from(this.plantIdentifications.values());
    if (userId) {
      return identifications.filter(i => i.userId === userId);
    }
    return identifications;
  }

  async getPlantIdentification(id: number): Promise<PlantIdentification | undefined> {
    return this.plantIdentifications.get(id);
  }
}

export const storage = new MemStorage();
