import { users, savedRecipes, type User, type InsertUser, type SavedRecipe, type InsertSavedRecipe } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
  getSavedRecipes(userId: number): Promise<SavedRecipe[]>;
  deleteSavedRecipe(id: number, userId: number): Promise<void>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

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

  async saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const [savedRecipe] = await db
      .insert(savedRecipes)
      .values({
        ...recipe,
        createdAt: new Date().toISOString(),
      })
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
