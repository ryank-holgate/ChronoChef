import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { type SavedRecipe } from "@shared/schema";
import { Clock, Utensils, Trash2, ArrowLeft, BookOpen } from "lucide-react";

export default function SavedRecipes() {
  const { toast } = useToast();

  // For demo purposes, using userId = 1. In a real app, this would come from authentication
  const userId = 1;

  const { data: savedRecipes = [], isLoading } = useQuery({
    queryKey: ["/api/recipes/saved", userId],
    queryFn: async () => {
      const response = await fetch(`/api/recipes/saved/${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch saved recipes");
      }
      return await response.json() as SavedRecipe[];
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: async (recipeId: number) => {
      const response = await fetch(`/api/recipes/saved/${recipeId}/${userId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete recipe");
      }
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe Deleted",
        description: "The recipe has been removed from your collection.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes/saved", userId] });
    },
    onError: (error) => {
      console.error("Delete recipe failed:", error);
      toast({
        title: "Delete Failed",
        description: "Could not delete the recipe. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" size="sm" className="text-foreground hover:text-primary transition-colors duration-300">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Recipe Generator
              </Button>
            </Link>
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
        {/* Page Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="text-4xl text-primary mr-3" />
              <h2 className="text-3xl font-bold text-foreground">Your Saved Recipes</h2>
            </div>
            <p className="text-muted-foreground">Your personal collection of favorite recipes</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading your saved recipes...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && savedRecipes.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="text-6xl text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No saved recipes yet</h3>
            <p className="text-muted-foreground mb-6">Start by generating some recipes and saving your favorites!</p>
            <Link href="/">
              <Button className="btn-primary text-white">
                <Utensils className="mr-2 h-4 w-4" />
                Generate Recipes
              </Button>
            </Link>
          </div>
        )}

        {/* Recipe List */}
        {!isLoading && savedRecipes.length > 0 && (
          <div className="grid gap-6">
            {savedRecipes.map((recipe) => (
              <Card key={recipe.id} className="glass-card rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <Utensils className="text-4xl text-primary" />
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold text-foreground pr-4">{recipe.recipeName}</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{recipe.cookTime}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteRecipeMutation.mutate(recipe.id)}
                          disabled={deleteRecipeMutation.isPending}
                          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 p-1 h-auto"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">{recipe.recipeDescription}</p>
                    
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
                    
                    <div className="text-xs text-muted-foreground/70 mt-4">
                      Saved on {new Date(recipe.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
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