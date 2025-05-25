import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const contactMessages = pgTable("contact_messages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  subject: text("subject").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plantIdentifications = pgTable("plant_identifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  commonName: text("common_name").notNull(),
  scientificName: text("scientific_name").notNull(),
  family: text("family"),
  origin: text("origin"),
  confidence: real("confidence").notNull(),
  wateringInstructions: text("watering_instructions"),
  lightRequirements: text("light_requirements"),
  temperatureRange: text("temperature_range"),
  humidityRequirements: text("humidity_requirements"),
  soilRequirements: text("soil_requirements"),
  careTips: text("care_tips").array(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const plantDiseases = pgTable("plant_diseases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  plantName: text("plant_name").notNull(),
  diseaseName: text("disease_name").notNull(),
  diseaseType: text("disease_type").notNull(), // 'disease', 'pest', 'deficiency', 'environmental'
  severity: text("severity").notNull(), // 'mild', 'moderate', 'severe'
  confidence: real("confidence").notNull(),
  symptoms: text("symptoms").array(),
  causes: text("causes").array(),
  treatmentOptions: text("treatment_options").array(),
  preventionTips: text("prevention_tips").array(),
  immediateActions: text("immediate_actions").array(),
  affectedParts: text("affected_parts").array(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const userSavedPlants = pgTable("user_saved_plants", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  plantIdentificationId: integer("plant_identification_id").notNull(),
  commonName: text("common_name"),
  scientificName: text("scientific_name"),
  family: text("family"),
  origin: text("origin"),
  confidence: real("confidence"),
  wateringInstructions: text("watering_instructions"),
  lightRequirements: text("light_requirements"),
  temperatureRange: text("temperature_range"),
  humidityRequirements: text("humidity_requirements"),
  soilRequirements: text("soil_requirements"),
  careTips: text("care_tips").array(),
  imageUrl: text("image_url"),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
});

export const userSavedPlantsSchema = createInsertSchema(userSavedPlants).omit({
  id: true,
  savedAt: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  email: true,
  password: true,
  firstName: true,
  lastName: true,
});

export const loginUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
});

export const insertPlantIdentificationSchema = createInsertSchema(plantIdentifications).omit({
  id: true,
  createdAt: true,
});

export const insertPlantDiseaseSchema = createInsertSchema(plantDiseases).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type UserSavedPlant = typeof userSavedPlants.$inferSelect;
export type InsertUserSavedPlant = typeof userSavedPlants.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertPlantIdentification = z.infer<typeof insertPlantIdentificationSchema>;
export type PlantIdentification = typeof plantIdentifications.$inferSelect;
export type InsertPlantDisease = z.infer<typeof insertPlantDiseaseSchema>;
export type PlantDisease = typeof plantDiseases.$inferSelect;
