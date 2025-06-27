import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { recipeRequestSchema, type RecipeRequest, type RecipeResponse, type Recipe } from "@shared/schema";
import { Clock, Carrot, Heart, Utensils, Search, Plus, Loader2, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<RecipeRequest>({
    resolver: zodResolver(recipeRequestSchema),
    defaultValues: {
      cookingTime: "",
      ingredients: "",
      mood: "",
    },
  });

  const generateRecipesMutation = useMutation({
    mutationFn: async (data: RecipeRequest) => {
      const response = await apiRequest("POST", "/api/recipes/generate", data);
      return await response.json() as RecipeResponse;
    },
    onSuccess: (data) => {
      setRecipes(data.recipes);
      setShowResults(true);
    },
    onError: (error) => {
      console.error("Recipe generation failed:", error);
      toast({
        title: "Recipe Generation Failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const surpriseMeMutation = useMutation({
    mutationFn: async () => {
      const surpriseData: RecipeRequest = {
        cookingTime: "45 minutes",
        ingredients: "chef's choice of seasonal and fresh ingredients",
        mood: "adventurous and creative"
      };
      const response = await apiRequest("POST", "/api/recipes/generate", surpriseData);
      return await response.json() as RecipeResponse;
    },
    onSuccess: (data) => {
      setRecipes(data.recipes);
      setShowResults(true);
    },
    onError: (error) => {
      console.error("Surprise recipe generation failed:", error);
      toast({
        title: "Surprise Recipe Failed",
        description: error instanceof Error ? error.message : "Please try again in a moment.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: RecipeRequest) => {
    generateRecipesMutation.mutate(data);
  };

  const handleFindMore = () => {
    setShowResults(false);
    form.reset();
  };

  const saveRecipeMutation = useMutation({
    mutationFn: async (recipe: Recipe) => {
      // For demo purposes, using userId = 1. In a real app, this would come from authentication
      const recipeData = {
        userId: 1,
        recipeName: recipe.name,
        recipeDescription: recipe.description,
        cookTime: recipe.cookTime,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
      };
      const response = await apiRequest("POST", "/api/recipes/save", recipeData);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe Saved!",
        description: "Your recipe has been saved to your collection.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes/saved"] });
    },
    onError: (error) => {
      console.error("Save recipe failed:", error);
      toast({
        title: "Save Failed",
        description: "Could not save the recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-dark">
        {/* Header */}
        <header className="glass sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow">
                  <Utensils className="text-dark-slate text-lg" />
                </div>
                <h1 className="text-2xl font-bold text-foreground">ChronoChef</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-foreground mb-2">Your Personalized Recipes</h3>
              <p className="text-muted-foreground">Crafted just for you based on your preferences</p>
            </div>
          </div>

          {/* Recipe Results */}
          <div className="grid gap-8">
            {recipes.map((recipe, index) => (
              <Card key={index} className="recipe-card glass-card rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Utensils className="text-4xl text-primary" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-foreground">{recipe.name}</h4>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{recipe.cookTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{recipe.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-foreground mb-2">Ingredients:</h5>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-foreground mb-2">Instructions:</h5>
                      <ol className="text-sm text-muted-foreground space-y-1">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{idx + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => saveRecipeMutation.mutate(recipe)}
                        disabled={saveRecipeMutation.isPending}
                        className="text-primary hover:text-accent transition-colors p-0 h-auto"
                      >
                        <Heart className="mr-1 h-4 w-4 inline" />
                        {saveRecipeMutation.isPending ? "Saving..." : "Save Recipe"}
                      </Button>
                      <button className="text-secondary hover:text-primary transition-colors">
                        <Search className="mr-1 h-4 w-4 inline" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button onClick={handleFindMore} className="btn-secondary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Find More Recipes
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-surface-elevated border-t border-border py-8 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Utensils className="text-dark-slate text-sm" />
              </div>
              <span className="text-lg font-semibold text-foreground">ChronoChef</span>
            </div>
            <p className="text-muted-foreground">Discover your perfect recipe, one mood at a time.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow">
                <Utensils className="text-dark-slate text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ChronoChef</h1>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <div className="flex items-center space-x-2">
                  {(user as any).profileImageUrl && (
                    <img 
                      src={(user as any).profileImageUrl} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-foreground">
                    {(user as any).firstName || (user as any).email}
                  </span>
                </div>
              )}
              <Link href="/saved">
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors duration-300">
                  <BookOpen className="mr-2 h-4 w-4" />
                  My Recipes
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                onClick={() => window.location.href = "/api/logout"}
                className="text-foreground hover:text-primary transition-colors duration-300"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Discover Your Perfect Recipe
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us how much time you have, what ingredients you've got, and how you're feeling. 
              We'll create personalized recipes just for you. Or click "Surprise Me!" for an amazing chef's choice recipe.
            </p>
          </div>
        </section>

        {/* Recipe Form */}
        <section className="glass-card rounded-2xl p-8 mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Time Input */}
                <FormField
                  control={form.control}
                  name="cookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <Clock className="text-primary mr-2 h-4 w-4" />
                        How much time do you have?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg">
                            <SelectValue placeholder="Select time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="15 minutes">15 minutes</SelectItem>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="45 minutes">45 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                          <SelectItem value="2+ hours">2+ hours</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Ingredients Input */}
                <FormField
                  control={form.control}
                  name="ingredients"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <Carrot className="text-secondary mr-2 h-4 w-4" />
                        What ingredients do you have?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., chicken, rice, tomatoes, onions..."
                          className="input-field w-full px-4 py-3 rounded-lg resize-none h-20"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Mood Input */}
                <FormField
                  control={form.control}
                  name="mood"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-foreground">
                        <Heart className="text-accent mr-2 h-4 w-4" />
                        What's your mood?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="input-field w-full px-4 py-3 rounded-lg">
                            <SelectValue placeholder="Select mood" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Comfort food">Comfort food</SelectItem>
                          <SelectItem value="Healthy & fresh">Healthy & fresh</SelectItem>
                          <SelectItem value="Adventurous">Adventurous</SelectItem>
                          <SelectItem value="Simple & easy">Simple & easy</SelectItem>
                          <SelectItem value="Fancy & impressive">Fancy & impressive</SelectItem>
                          <SelectItem value="Spicy & bold">Spicy & bold</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={generateRecipesMutation.isPending || surpriseMeMutation.isPending}
                  className="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {generateRecipesMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Your Recipes...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Find My Recipes
                    </>
                  )}
                </Button>
                
                <div className="flex items-center">
                  <div className="flex-1 border-t border-border sm:hidden"></div>
                  <span className="px-4 text-muted-foreground text-sm font-medium sm:hidden">OR</span>
                  <div className="flex-1 border-t border-border sm:hidden"></div>
                  <span className="hidden sm:inline px-4 text-muted-foreground text-sm font-medium">OR</span>
                </div>
                
                <Button
                  type="button"
                  onClick={() => surpriseMeMutation.mutate()}
                  disabled={generateRecipesMutation.isPending || surpriseMeMutation.isPending}
                  className="btn-secondary text-white px-8 py-4 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {surpriseMeMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Surprise...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Surprise Me!
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface-elevated border-t border-border py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Utensils className="text-dark-slate text-sm" />
            </div>
            <span className="text-lg font-semibold text-foreground">ChronoChef</span>
          </div>
          <p className="text-muted-foreground">Discover your perfect recipe, one mood at a time.</p>
        </div>
      </footer>
    </div>
  );
}
