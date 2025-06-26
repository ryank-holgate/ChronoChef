import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { recipeRequestSchema, type RecipeRequest, type RecipeResponse, type Recipe } from "@shared/schema";
import { Clock, Carrot, Heart, Utensils, Search, Plus, Loader2 } from "lucide-react";

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [showResults, setShowResults] = useState(false);
  const { toast } = useToast();

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

  const onSubmit = (data: RecipeRequest) => {
    generateRecipesMutation.mutate(data);
  };

  const handleFindMore = () => {
    setShowResults(false);
    form.reset();
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <Utensils className="text-white text-lg" />
                </div>
                <h1 className="text-2xl font-bold text-dark-slate">ChronoChef</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="flex items-center justify-center mb-8">
            <div className="text-center">
              <h3 className="text-3xl font-bold text-dark-slate mb-2">Your Personalized Recipes</h3>
              <p className="text-gray-600">Crafted just for you based on your preferences</p>
            </div>
          </div>

          {/* Recipe Results */}
          <div className="grid gap-8">
            {recipes.map((recipe, index) => (
              <Card key={index} className="recipe-card bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gradient-to-br from-orange-200 to-yellow-200 flex items-center justify-center">
                      <Utensils className="text-4xl text-orange-500" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-dark-slate">{recipe.name}</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="mr-1 h-4 w-4" />
                        <span>{recipe.cookTime}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{recipe.description}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-dark-slate mb-2">Ingredients:</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {recipe.ingredients.map((ingredient, idx) => (
                          <li key={idx}>• {ingredient}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-dark-slate mb-2">Instructions:</h5>
                      <ol className="text-sm text-gray-600 space-y-1">
                        {recipe.instructions.map((step, idx) => (
                          <li key={idx}>{idx + 1}. {step}</li>
                        ))}
                      </ol>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <button className="text-primary hover:text-accent transition-colors">
                        <Heart className="mr-1 h-4 w-4 inline" />
                        Save Recipe
                      </button>
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
            <Button onClick={handleFindMore} className="bg-secondary text-white hover:bg-secondary/90">
              <Plus className="mr-2 h-4 w-4" />
              Find More Recipes
            </Button>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark-slate text-white py-8 mt-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Utensils className="text-white text-sm" />
              </div>
              <span className="text-lg font-semibold">ChronoChef</span>
            </div>
            <p className="text-gray-400">Discover your perfect recipe, one mood at a time.</p>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-green-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <Utensils className="text-white text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-dark-slate">ChronoChef</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="mb-6">
            <h2 className="text-4xl md:text-5xl font-bold text-dark-slate mb-4">
              Discover Your Perfect Recipe
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Tell us how much time you have, what ingredients you've got, and how you're feeling. 
              We'll create personalized recipes just for you.
            </p>
          </div>
        </section>

        {/* Recipe Form */}
        <section className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                {/* Time Input */}
                <FormField
                  control={form.control}
                  name="cookingTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Clock className="text-primary mr-2 h-4 w-4" />
                        How much time do you have?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
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
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Carrot className="text-secondary mr-2 h-4 w-4" />
                        What ingredients do you have?
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., chicken, rice, tomatoes, onions..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors resize-none h-20"
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
                      <FormLabel className="flex items-center text-sm font-medium text-gray-700">
                        <Heart className="text-accent mr-2 h-4 w-4" />
                        What's your mood?
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors">
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

              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={generateRecipesMutation.isPending}
                  className="bg-gradient-to-r from-primary to-accent text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
              </div>
            </form>
          </Form>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark-slate text-white py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
              <Utensils className="text-white text-sm" />
            </div>
            <span className="text-lg font-semibold">ChronoChef</span>
          </div>
          <p className="text-gray-400">Discover your perfect recipe, one mood at a time.</p>
        </div>
      </footer>
    </div>
  );
}
