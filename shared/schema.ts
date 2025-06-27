import { pgTable, text, serial, integer, boolean, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Saved recipes table
export const savedRecipes = pgTable("saved_recipes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  recipeName: text("recipe_name").notNull(),
  recipeDescription: text("recipe_description").notNull(),
  cookTime: text("cook_time").notNull(),
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  createdAt: text("created_at").notNull().default(new Date().toISOString()),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Saved recipe schemas
export const insertSavedRecipeSchema = createInsertSchema(savedRecipes).omit({
  id: true,
  createdAt: true,
});

export type InsertSavedRecipe = z.infer<typeof insertSavedRecipeSchema>;
export type SavedRecipe = typeof savedRecipes.$inferSelect;

// Recipe generation request schema
export const recipeRequestSchema = z.object({
  cookingTime: z.string().min(1, "Cooking time is required"),
  ingredients: z.string().min(3, "Please provide more details about your ingredients"),
  mood: z.string().min(1, "Mood is required"),
});

export type RecipeRequest = z.infer<typeof recipeRequestSchema>;

// Recipe response schema
export const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  cookTime: z.string(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
});

export const recipeResponseSchema = z.object({
  recipes: z.array(recipeSchema).min(1).max(3),
});

export type Recipe = z.infer<typeof recipeSchema>;
export type RecipeResponse = z.infer<typeof recipeResponseSchema>;
