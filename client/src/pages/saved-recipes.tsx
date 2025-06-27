import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type SavedRecipe, RECIPE_CATEGORIES } from "@shared/schema";
import { Utensils, Clock, Trash2, ArrowLeft, BookOpen, LogOut, Plus, ChefHat, Sparkles } from "lucide-react";

function HeaderActions() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <span className="text-muted-foreground text-sm">Welcome, {user?.username}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="text-muted-foreground hover:text-destructive transition-colors duration-300"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function SavedRecipes() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const { data: savedRecipes = [], isLoading } = useQuery({
    queryKey: ["/api/recipes/saved", activeCategory],
    queryFn: async () => {
      const url = activeCategory === "all" 
        ? "/api/recipes/saved" 
        : `/api/recipes/saved?category=${activeCategory}`;
      const response = await fetch(url, {
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Failed to fetch saved recipes');
      }
      return response.json() as Promise<SavedRecipe[]>;
    },
  });

  const deleteRecipeMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recipes/saved/${id}`);
    },
    onSuccess: () => {
      toast({
        title: "Recipe Deleted",
        description: "Recipe has been removed from your collection.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes/saved"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast({
        title: "Failed to Delete Recipe",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign in Required</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to view your saved recipes.</p>
          <Link href="/auth">
            <Button className="btn-primary text-white">Sign In</Button>
          </Link>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your recipes...</p>
        </div>
      </div>
    );
  }

  // Group recipes by category
  const groupedRecipes = savedRecipes.reduce((acc, recipe) => {
    const category = recipe.category || "main-entrees";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(recipe);
    return acc;
  }, {} as Record<string, SavedRecipe[]>);

  // Get recipe count by category
  const categorycounts = Object.entries(RECIPE_CATEGORIES).map(([key, label]) => ({
    key,
    label,
    count: groupedRecipes[key]?.length || 0
  }));

  const totalRecipes = savedRecipes.length;

  return (
    <div className="min-h-screen bg-gradient-dark">
      {/* Header */}
      <header className="glass sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow">
                <Utensils className="text-dark-slate text-lg" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">ChronoChef</h1>
            </div>
            <HeaderActions />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Recipe Generator
            </Button>
          </Link>
          
          <Link href="/add-recipe">
            <Button className="btn-primary text-white">
              <Plus className="mr-2 h-4 w-4" />
              Add Your Recipe
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
              <BookOpen className="text-dark-slate text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            My Recipe Collection
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Your personal cookbook with {totalRecipes} saved recipe{totalRecipes !== 1 ? 's' : ''}
          </p>
          
          {totalRecipes === 0 && (
            <div className="glass-card rounded-xl p-8 max-w-md mx-auto">
              <ChefHat className="text-primary w-12 h-12 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">Start Building Your Collection</h3>
              <p className="text-muted-foreground mb-6">
                Generate recipes with AI or add your own favorite recipes to get started.
              </p>
              <div className="flex gap-3 justify-center">
                <Link href="/">
                  <Button variant="outline" size="sm">
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate Recipes
                  </Button>
                </Link>
                <Link href="/add-recipe">
                  <Button size="sm" className="btn-primary text-white">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Recipe
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </section>

        {totalRecipes > 0 && (
          <>
            {/* Category Tabs */}
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
              <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-9 bg-surface-elevated p-1 rounded-xl">
                <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-white">
                  All ({totalRecipes})
                </TabsTrigger>
                {categorycounts.map(({ key, label, count }) => (
                  <TabsTrigger
                    key={key}
                    value={key}
                    className="data-[state=active]:bg-primary data-[state=active]:text-white text-xs"
                    disabled={count === 0}
                  >
                    {label} ({count})
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>

            {/* Recipe Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {(activeCategory === "all" ? savedRecipes : (groupedRecipes[activeCategory] || [])).map((recipe) => (
                <Card key={recipe.id} className="recipe-card glass-card rounded-xl overflow-hidden transform hover:scale-105 transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-foreground line-clamp-1">{recipe.recipeName}</h4>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${recipe.source === 'user-added' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'}`}
                          >
                            {recipe.source === 'user-added' ? (
                              <><ChefHat className="w-3 h-3 mr-1" /> My Recipe</>
                            ) : (
                              <><Sparkles className="w-3 h-3 mr-1" /> AI Generated</>
                            )}
                          </Badge>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mb-3">
                          <Clock className="mr-1 h-4 w-4" />
                          <span>{recipe.cookTime}</span>
                          <span className="mx-2">•</span>
                          <Badge variant="outline" className="text-xs">
                            {RECIPE_CATEGORIES[recipe.category as keyof typeof RECIPE_CATEGORIES] || "Main Entrees"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{recipe.recipeDescription}</p>
                    
                    <div className="mb-4">
                      <h5 className="font-semibold text-foreground mb-2 text-sm">Ingredients:</h5>
                      <ul className="text-xs text-muted-foreground space-y-1 max-h-20 overflow-hidden">
                        {recipe.ingredients.slice(0, 3).map((ingredient, idx) => (
                          <li key={idx} className="line-clamp-1">• {ingredient}</li>
                        ))}
                        {recipe.ingredients.length > 3 && (
                          <li className="text-primary font-medium">+ {recipe.ingredients.length - 3} more</li>
                        )}
                      </ul>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        Added {new Date(recipe.createdAt!).toLocaleDateString()}
                      </span>
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
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}