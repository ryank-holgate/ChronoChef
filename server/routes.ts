import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { recipeRequestSchema, insertSavedRecipeSchema, insertUserSchema } from "@shared/schema";
import { generateRecipes } from "./services/gemini";
import { setupSimpleAuth, requireAuth, optionalAuth } from "./simpleAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Simple auth middleware
  setupSimpleAuth(app);

  // Auth routes
  app.post('/api/signup', async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this email" });
      }

      // Create new user
      const user = await storage.createUser(userData);
      
      // Set session
      (req.session as any).userId = user.id;
      
      res.status(201).json(user);
    } catch (error) {
      console.error("Signup error:", error);
      res.status(400).json({ message: "Invalid signup data" });
    }
  });

  app.post('/api/signin', async (req, res) => {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Set session
      (req.session as any).userId = user.id;
      
      res.json(user);
    } catch (error) {
      console.error("Signin error:", error);
      res.status(500).json({ message: "Signin failed" });
    }
  });

  app.post('/api/signout', (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Signout failed" });
      }
      res.json({ message: "Signed out successfully" });
    });
  });

  app.get('/api/user', optionalAuth, async (req, res) => {
    try {
      if (!req.userId) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const user = await storage.getUser(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
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
  app.post("/api/recipes/save", requireAuth, async (req, res) => {
    try {
      // Validate request body and add userId
      const validatedRecipe = insertSavedRecipeSchema.parse({
        ...req.body,
        userId: req.userId
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
  app.get("/api/recipes/saved", requireAuth, async (req, res) => {
    try {
      const savedRecipes = await storage.getSavedRecipes(req.userId!);
      res.json(savedRecipes);
    } catch (error) {
      console.error("Get saved recipes error:", error);
      res.status(500).json({ 
        message: "Failed to retrieve saved recipes" 
      });
    }
  });

  // Delete saved recipe endpoint (protected)
  app.delete("/api/recipes/saved/:id", requireAuth, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid recipe ID" });
      }
      
      await storage.deleteSavedRecipe(id, req.userId!);
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
