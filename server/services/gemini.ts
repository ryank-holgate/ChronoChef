import { GoogleGenAI } from "@google/genai";
import { RecipeRequest, RecipeResponse, recipeResponseSchema } from "@shared/schema";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_ENV_VAR || "" 
});

export async function generateRecipes(request: RecipeRequest): Promise<RecipeResponse> {
  try {
    const { cookingTime, ingredients, mood } = request;
    
    const systemPrompt = `You are a professional chef and recipe creator. Generate 1-3 unique, creative recipes based on the user's requirements.

IMPORTANT: You must respond with valid JSON in exactly this format:
{
  "recipes": [
    {
      "name": "Recipe Name",
      "description": "Brief, appetizing description (1-2 sentences)",
      "cookTime": "cooking time estimate",
      "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3"],
      "instructions": ["step 1", "step 2", "step 3"]
    }
  ]
}

Requirements:
- Cooking Time Available: ${cookingTime}
- Available Ingredients: ${ingredients}
- Desired Mood/Style: ${mood}

Guidelines:
- Create 1-3 recipes that can be made within the specified time
- Use the provided ingredients as much as possible, but you can suggest additional common pantry items
- Match the mood/style requested (comfort food should be hearty, healthy should be nutritious, etc.)
- Provide clear, step-by-step instructions
- Make sure each recipe is unique and different from the others
- Keep ingredient lists practical and not overly long
- Instructions should be clear and easy to follow`;

    const userPrompt = `Please create personalized recipes for someone who has ${cookingTime} to cook, has these ingredients: ${ingredients}, and is in the mood for: ${mood}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            recipes: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  cookTime: { type: "string" },
                  ingredients: {
                    type: "array",
                    items: { type: "string" }
                  },
                  instructions: {
                    type: "array",
                    items: { type: "string" }
                  }
                },
                required: ["name", "description", "cookTime", "ingredients", "instructions"]
              },
              minItems: 1,
              maxItems: 3
            }
          },
          required: ["recipes"]
        },
      },
      contents: userPrompt,
    });

    const rawJson = response.text;
    
    if (!rawJson) {
      throw new Error("Empty response from Gemini API");
    }

    const parsedResponse = JSON.parse(rawJson);
    const validatedResponse = recipeResponseSchema.parse(parsedResponse);
    
    return validatedResponse;
  } catch (error) {
    console.error("Failed to generate recipes:", error);
    throw new Error(`Failed to generate recipes: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
