import { 
  users, 
  savedRecipes, 
  type User, 
  type InsertUser, 
  type SavedRecipe, 
  type InsertSavedRecipe 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Recipe operations
  saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
  getSavedRecipes(userId: number): Promise<SavedRecipe[]>;
  deleteSavedRecipe(id: number, userId: number): Promise<void>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  // Recipe operations
  async saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const [savedRecipe] = await db
      .insert(savedRecipes)
      .values(recipe)
      .returning();
    return savedRecipe;
  }

  async getSavedRecipes(userId: number): Promise<SavedRecipe[]> {
    return await db.select().from(savedRecipes).where(eq(savedRecipes.userId, userId));
  }

  async deleteSavedRecipe(id: number, userId: number): Promise<void> {
    await db.delete(savedRecipes)
      .where(and(eq(savedRecipes.id, id), eq(savedRecipes.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
