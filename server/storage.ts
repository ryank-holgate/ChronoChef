import {
  users,
  savedRecipes,
  type User,
  type InsertUser,
  type SavedRecipe,
  type InsertSavedRecipe,
} from "@shared/schema";
import { db } from "./db";
import { eq, and } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Recipe operations
  saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
  getSavedRecipes(userId: number): Promise<SavedRecipe[]>;
  getSavedRecipesByCategory(userId: number, category?: string): Promise<SavedRecipe[]>;
  deleteSavedRecipe(id: number, userId: number): Promise<void>;
  addUserRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
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

  // Recipe operations
  async saveRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const [savedRecipe] = await db
      .insert(savedRecipes)
      .values(recipe)
      .returning();
    return savedRecipe;
  }

  async getSavedRecipes(userId: number): Promise<SavedRecipe[]> {
    return db
      .select()
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId))
      .orderBy(savedRecipes.createdAt);
  }

  async getSavedRecipesByCategory(userId: number, category?: string): Promise<SavedRecipe[]> {
    if (category) {
      return db
        .select()
        .from(savedRecipes)
        .where(and(eq(savedRecipes.userId, userId), eq(savedRecipes.category, category)))
        .orderBy(savedRecipes.createdAt);
    }
    
    return db
      .select()
      .from(savedRecipes)
      .where(eq(savedRecipes.userId, userId))
      .orderBy(savedRecipes.createdAt);
  }

  async deleteSavedRecipe(id: number, userId: number): Promise<void> {
    await db
      .delete(savedRecipes)
      .where(and(eq(savedRecipes.id, id), eq(savedRecipes.userId, userId)));
  }

  async addUserRecipe(recipe: InsertSavedRecipe): Promise<SavedRecipe> {
    const [savedRecipe] = await db
      .insert(savedRecipes)
      .values({
        ...recipe,
        source: "user-added"
      })
      .returning();
    return savedRecipe;
  }
}

export const storage = new DatabaseStorage();