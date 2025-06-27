import { pgTable, text, serial, integer, boolean, json, varchar, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for authentication
export const session = pgTable(
  "session",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table with email/password authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email").notNull().unique(),
  username: varchar("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  category: text("category").notNull().default("main-entrees"),
  source: text("source").notNull().default("generated"), // "generated" or "user-added"
  createdAt: timestamp("created_at").defaultNow(),
});

// User schemas
export const insertUserSchema = createInsertSchema(users).pick({
  email: true,
  username: true,
  password: true,
});

export const loginSchema = createInsertSchema(users).pick({
  email: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type LoginUser = z.infer<typeof loginSchema>;
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

// User-added recipe schema
export const userRecipeSchema = z.object({
  recipeName: z.string().min(1, "Recipe name is required"),
  recipeDescription: z.string().min(10, "Please provide a description (min 10 characters)"),
  cookTime: z.string().min(1, "Cook time is required"),
  ingredients: z.string().min(10, "Please provide ingredients (min 10 characters)"),
  instructions: z.string().min(20, "Please provide instructions (min 20 characters)"),
  category: z.enum(["appetizers", "main-entrees", "desserts", "bread", "soups", "salads", "beverages", "snacks"]).default("main-entrees"),
});

export type UserRecipe = z.infer<typeof userRecipeSchema>;

// Recipe categories
export const RECIPE_CATEGORIES = {
  "appetizers": "Appetizers",
  "main-entrees": "Main Entrees", 
  "desserts": "Desserts",
  "bread": "Bread & Baked Goods",
  "soups": "Soups",
  "salads": "Salads",
  "beverages": "Beverages", 
  "snacks": "Snacks"
} as const;
