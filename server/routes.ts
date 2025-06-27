import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recipeRequestSchema, insertSavedRecipeSchema } from "@shared/schema";
import { generateRecipes } from "./services/gemini";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
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

  // Save recipe endpoint (protected)
  app.post("/api/recipes/save", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Validate request body and add userId
      const validatedRecipe = insertSavedRecipeSchema.parse({
        ...req.body,
        userId
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

  // Get saved recipes endpoint (protected)
  app.get("/api/recipes/saved", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const savedRecipes = await storage.getSavedRecipes(userId);
      res.json(savedRecipes);
    } catch (error) {
      console.error("Get saved recipes error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve saved recipes" 
      });
    }
  });

  // Delete saved recipe endpoint (protected)
  app.delete("/api/recipes/saved/:id", isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      await storage.deleteSavedRecipe(id, userId);
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
