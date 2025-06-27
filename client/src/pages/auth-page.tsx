import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema, loginSchema } from "@shared/schema";
import { type InsertUser, type LoginUser } from "@shared/schema";
import { Redirect } from "wouter";
import { Utensils, Mail, User, Lock, Loader2 } from "lucide-react";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const [activeTab, setActiveTab] = useState("login");

  const loginForm = useForm<LoginUser>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const registerForm = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema.extend({
      email: insertUserSchema.shape.email.email("Please enter a valid email address"),
      password: insertUserSchema.shape.password.min(6, "Password must be at least 6 characters"),
    })),
    defaultValues: {
      email: "",
      username: "",
      password: "",
    },
  });

  const onLogin = (data: LoginUser) => {
    loginMutation.mutate(data);
  };

  const onRegister = (data: InsertUser) => {
    registerMutation.mutate(data);
  };

  // Redirect if already logged in - after all hooks
  if (user) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen bg-gradient-dark flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center animate-glow">
                <Utensils className="text-dark-slate text-xl" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Welcome to ChronoChef</h1>
            <p className="text-muted-foreground">
              {activeTab === "login" 
                ? "Sign in to access your saved recipes" 
                : "Create an account to start saving recipes"
              }
            </p>
          </div>

          <Card className="glass-card border-0">
            <CardHeader className="pb-4">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-surface-elevated">
                  <TabsTrigger value="login" className="text-foreground">Sign In</TabsTrigger>
                  <TabsTrigger value="register" className="text-foreground">Sign Up</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>

            <CardContent className="space-y-6">
              <Tabs value={activeTab} className="w-full">
                {/* Login Form */}
                <TabsContent value="login" className="space-y-4">
                  <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-foreground flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="Enter your email"
                        className="input-field"
                        {...loginForm.register("email")}
                      />
                      {loginForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-foreground flex items-center">
                        <Lock className="mr-2 h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        className="input-field"
                        {...loginForm.register("password")}
                      />
                      {loginForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={loginMutation.isPending}
                      className="btn-primary text-white w-full py-3 font-semibold"
                    >
                      {loginMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                  </form>
                </TabsContent>

                {/* Register Form */}
                <TabsContent value="register" className="space-y-4">
                  <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-foreground flex items-center">
                        <Mail className="mr-2 h-4 w-4 text-primary" />
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="Enter your email"
                        className="input-field"
                        {...registerForm.register("email")}
                      />
                      {registerForm.formState.errors.email && (
                        <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-username" className="text-foreground flex items-center">
                        <User className="mr-2 h-4 w-4 text-primary" />
                        Username
                      </Label>
                      <Input
                        id="register-username"
                        type="text"
                        placeholder="Choose a username"
                        className="input-field"
                        {...registerForm.register("username")}
                      />
                      {registerForm.formState.errors.username && (
                        <p className="text-sm text-destructive">{registerForm.formState.errors.username.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password" className="text-foreground flex items-center">
                        <Lock className="mr-2 h-4 w-4 text-primary" />
                        Password
                      </Label>
                      <Input
                        id="register-password"
                        type="password"
                        placeholder="Create a password (min 6 characters)"
                        className="input-field"
                        {...registerForm.register("password")}
                      />
                      {registerForm.formState.errors.password && (
                        <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                      )}
                    </div>

                    <Button
                      type="submit"
                      disabled={registerMutation.isPending}
                      className="btn-primary text-white w-full py-3 font-semibold"
                    >
                      {registerMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-24 h-24 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mb-6 mx-auto animate-glow">
            <Utensils className="text-dark-slate text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-4">
            AI-Powered Recipe Generation
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Discover personalized recipes based on your available time, ingredients, and mood. 
            Save your favorites and build your personal recipe collection with ChronoChef.
          </p>
          <div className="mt-8 space-y-3 text-left">
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
              Smart recipe generation with AI
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-secondary rounded-full mr-3"></div>
              Personal recipe collection
            </div>
            <div className="flex items-center text-muted-foreground">
              <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
              Time and ingredient-aware suggestions
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}