import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
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

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertPlantIdentificationSchema = createInsertSchema(plantIdentifications).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertPlantIdentification = z.infer<typeof insertPlantIdentificationSchema>;
export type PlantIdentification = typeof plantIdentifications.$inferSelect;
