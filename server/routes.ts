import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recipeRequestSchema, insertSavedRecipeSchema } from "@shared/schema";
import { generateRecipes } from "./services/gemini";
import { setupAuth } from "./auth";

// Authentication middleware
function requireAuth(req: any, res: any, next: any) {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);
  // Recipe generation endpoint
  app.post("/api/recipes/generate", async (req, res) => {
    try {
      // Validate request body
      const validatedRequest = recipeRequestSchema.parse(req.body);
      
      // Generate recipes using Gemini AI
      const recipes = await generateRecipes(validatedRequest);
      
      res.json(recipes);
    } catch (error) {
      console.error("Recipe generation error:", error);
      
      if (error instanceof Error) {
        // Handle validation errors
        if (error.name === "ZodError") {
          return res.status(400).json({ 
            message: "Invalid request data", 
            errors: error.message 
          });
        }
        
        // Handle Gemini API errors
        if (error.message.includes("API key")) {
          return res.status(500).json({ 
            message: "Recipe generation service is temporarily unavailable" 
          });
        }
        
        return res.status(500).json({ 
          message: error.message || "Failed to generate recipes" 
        });
      }
      
      res.status(500).json({ 
        message: "An unexpected error occurred while generating recipes" 
      });
    }
  });

  // Save recipe endpoint (requires auth)
  app.post("/api/recipes/save", requireAuth, async (req: any, res) => {
    try {
      const validatedRecipe = insertSavedRecipeSchema.parse({
        ...req.body,
        userId: req.user.id
      });
      const savedRecipe = await storage.saveRecipe(validatedRecipe);
      res.json(savedRecipe);
    } catch (error) {
      console.error("Save recipe error:", error);
      if (error instanceof Error && error.name === "ZodError") {
        return res.status(400).json({ 
          message: "Invalid recipe data", 
          errors: error.message 
        });
      }
      res.status(500).json({ 
        message: "Failed to save recipe" 
      });
    }
  });

  // Get saved recipes endpoint (requires auth)
  app.get("/api/recipes/saved", requireAuth, async (req: any, res) => {
    try {
      const category = req.query.category as string;
      const savedRecipes = category 
        ? await storage.getSavedRecipesByCategory(req.user.id, category)
        : await storage.getSavedRecipes(req.user.id);
      res.json(savedRecipes);
    } catch (error) {
      console.error("Get saved recipes error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve saved recipes" 
      });
    }
  });

  // Add user recipe endpoint (requires auth)
  app.post("/api/recipes/add", requireAuth, async (req: any, res) => {
    try {
      const { recipeName, recipeDescription, cookTime, ingredients, instructions, category } = req.body;
      
      // Parse ingredients and instructions from text to arrays
      const ingredientsList = ingredients.split('\n').filter((item: string) => item.trim().length > 0);
      const instructionsList = instructions.split('\n').filter((item: string) => item.trim().length > 0);
      
      const recipeData = {
        userId: req.user.id,
        recipeName,
        recipeDescription,
        cookTime,
        ingredients: ingredientsList,
        instructions: instructionsList,
        category: category || "main-entrees",
        source: "user-added"
      };
      
      const savedRecipe = await storage.addUserRecipe(recipeData);
      res.json(savedRecipe);
    } catch (error) {
      console.error("Add user recipe error:", error);
      res.status(500).json({ 
        message: "Failed to add recipe" 
      });
    }
  });

  // Delete saved recipe endpoint (requires auth)
  app.delete("/api/recipes/saved/:id", requireAuth, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      await storage.deleteSavedRecipe(id, req.user.id);
      res.json({ message: "Recipe deleted successfully" });
    } catch (error) {
      console.error("Delete recipe error:", error);
      res.status(500).json({ 
        message: "Failed to delete recipe" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
