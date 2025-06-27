import { 
  users, 
  savedRecipes, 
  type User, 
  type UpsertUser, 
  type SavedRecipe, 
  type InsertSavedRecipe 
} from "@shared/schema";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  // Recipe operations
  saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
  getSavedRecipes(userId: string): Promise<SavedRecipe[]>;
  deleteSavedRecipe(id: number, userId: string): Promise<void>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
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

  async getSavedRecipes(userId: string): Promise<SavedRecipe[]> {
    return await db.select().from(savedRecipes).where(eq(savedRecipes.userId, userId));
  }

  async deleteSavedRecipe(id: number, userId: string): Promise<void> {
    await db.delete(savedRecipes)
      .where(and(eq(savedRecipes.id, id), eq(savedRecipes.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
