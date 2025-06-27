import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { userRecipeSchema, RECIPE_CATEGORIES, type UserRecipe } from "@shared/schema";
import { Utensils, Clock, ChefHat, ArrowLeft, Plus, BookOpen } from "lucide-react";

function HeaderActions() {
  const { user, logoutMutation } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <Link href="/saved">
        <Button variant="ghost" className="text-foreground hover:text-primary transition-colors duration-300">
          <BookOpen className="mr-2 h-4 w-4" />
          My Recipes
        </Button>
      </Link>
      <span className="text-muted-foreground text-sm">Welcome, {user?.username}</span>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => logoutMutation.mutate()}
        disabled={logoutMutation.isPending}
        className="text-muted-foreground hover:text-destructive transition-colors duration-300"
      >
        Logout
      </Button>
    </div>
  );
}

export default function AddRecipe() {
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const form = useForm<UserRecipe>({
    resolver: zodResolver(userRecipeSchema),
    defaultValues: {
      recipeName: "",
      recipeContent: "",
      category: "main-entrees",
    },
  });

  const addRecipeMutation = useMutation({
    mutationFn: async (data: UserRecipe) => {
      const response = await apiRequest("POST", "/api/recipes/add", data);
      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Recipe Added Successfully!",
        description: "Your recipe has been saved to your collection.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/recipes/saved"] });
      setLocation("/saved");
    },
    onError: (error) => {
      console.error("Add recipe failed:", error);
      toast({
        title: "Failed to Add Recipe",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: UserRecipe) => {
    addRecipeMutation.mutate(data);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-dark flex items-center justify-center">
        <Card className="glass-card p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Sign in Required</h2>
          <p className="text-muted-foreground mb-6">You need to be signed in to add recipes.</p>
          <Link href="/auth">
            <Button className="btn-primary text-white">Sign In</Button>
          </Link>
        </Card>
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
            <HeaderActions />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link href="/saved">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to My Recipes
            </Button>
          </Link>
        </div>

        {/* Hero Section */}
        <section className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center animate-glow">
              <ChefHat className="text-dark-slate text-2xl" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Add Your Own Recipe
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Share your favorite recipes and organize them in your personal collection. 
            Simply copy and paste your complete recipe from anywhere - no need to separate ingredients and instructions.
          </p>
        </section>

        {/* Recipe Form */}
        <Card className="glass-card rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
            <CardTitle className="flex items-center text-xl font-bold text-foreground">
              <Plus className="mr-2 h-5 w-5 text-primary" />
              Recipe Details
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Recipe Name */}
                <FormField
                  control={form.control}
                  name="recipeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Recipe Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Grandma's Chocolate Chip Cookies"
                          className="input-field"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="input-field">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(RECIPE_CATEGORIES).map(([key, label]) => (
                            <SelectItem key={key} value={key}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Recipe Content */}
                <FormField
                  control={form.control}
                  name="recipeContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-medium">
                        Complete Recipe
                        <span className="text-sm text-muted-foreground ml-2">(copy and paste your entire recipe here)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Paste your complete recipe here, including ingredients, instructions, cooking time, and any notes.

Example:
Chocolate Chip Cookies

Ingredients:
- 2 cups all-purpose flour
- 1 cup butter, softened
- 3/4 cup brown sugar
- 1 tsp vanilla extract
- 2 large eggs
- 1 cup chocolate chips

Instructions:
1. Preheat oven to 375°F (190°C)
2. Cream butter and brown sugar until light and fluffy
3. Beat in eggs and vanilla extract
4. Gradually mix in flour until just combined
5. Fold in chocolate chips
6. Drop spoonfuls onto baking sheet
7. Bake for 9-11 minutes until golden brown

Cooking Time: 25 minutes
Notes: Store in airtight container for up to one week.`}
                          className="input-field min-h-[300px] font-mono text-sm resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <div className="flex justify-end space-x-4 pt-6">
                  <Link href="/saved">
                    <Button variant="outline" type="button">
                      Cancel
                    </Button>
                  </Link>
                  <Button
                    type="submit"
                    disabled={addRecipeMutation.isPending}
                    className="btn-primary text-white px-8"
                  >
                    {addRecipeMutation.isPending ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        Adding Recipe...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-4 w-4" />
                        Add Recipe
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}