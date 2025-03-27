"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

// Form validation schemas
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  username: z.string().min(3, "Username must be at least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

type LoginFormValues = z.infer<typeof loginSchema>;
type SignupFormValues = z.infer<typeof signupSchema>;

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize forms
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  
  const signupForm = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      fullName: "",
      username: "",
    },
  });
  
  // Check for mode parameter in URL on component mount
  useEffect(() => {
    const modeParam = searchParams.get("mode");
    if (modeParam === "signup") {
      setMode("signup");
    }
  }, [searchParams]);
  
  // Handle sign in
  const onSignIn = async (values: LoginFormValues) => {
    setIsLoading(true);
    
    try {
      // Mock successful sign in
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Demo credentials
      if (values.email === "user@eventify.com" && values.password === "user123") {
        // Set user auth in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem("eventify_user_auth", "true");
          localStorage.setItem("eventify_user_email", values.email);
        }
        
        toast.success("Signed in successfully!");
        router.push("/dashboard");
      } else {
        toast.error("Invalid credentials. Try user@eventify.com / user123");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle sign up
  const onSignUp = async (values: SignupFormValues) => {
    setIsLoading(true);
    
    try {
      // Mock successful sign up
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set user auth in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem("eventify_user_auth", "true");
        localStorage.setItem("eventify_user_email", values.email);
        localStorage.setItem("eventify_user_name", values.fullName);
        localStorage.setItem("eventify_username", values.username);
      }
      
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (error: any) {
      toast.error(error.message || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-lg border bg-card p-8 shadow-sm">
        <div className="mb-6 text-center">
          <Link href="/" className="text-2xl font-bold text-orange-500">
            Eventify
          </Link>
          <h1 className="mt-4 text-xl font-bold text-foreground">
            {mode === "signin" ? "Sign in to your account" : "Create a new account"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mode === "signin"
              ? "Enter your credentials to access your account"
              : "Fill in your details to create a new account"}
          </p>
        </div>
        
        {mode === "signin" ? (
          <form onSubmit={loginForm.handleSubmit(onSignIn)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...loginForm.register("email")}
              />
              {loginForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link href="/auth/forgot-password" className="text-xs text-orange-500 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...loginForm.register("password")}
              />
              {loginForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {loginForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <button
                type="button"
                className="text-orange-500 hover:underline"
                onClick={() => setMode("signup")}
              >
                Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={signupForm.handleSubmit(onSignUp)} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium">
                Full Name
              </label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...signupForm.register("fullName")}
              />
              {signupForm.formState.errors.fullName && (
                <p className="text-xs text-destructive">
                  {signupForm.formState.errors.fullName.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium">
                Username
              </label>
              <Input
                id="username"
                placeholder="johndoe"
                {...signupForm.register("username")}
              />
              {signupForm.formState.errors.username && (
                <p className="text-xs text-destructive">
                  {signupForm.formState.errors.username.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...signupForm.register("email")}
              />
              {signupForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {signupForm.formState.errors.email.message}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <Input
                id="password" 
                type="password"
                placeholder="••••••••"
                {...signupForm.register("password")}
              />
              {signupForm.formState.errors.password && (
                <p className="text-xs text-destructive">
                  {signupForm.formState.errors.password.message}
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            
            <div className="text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <button
                type="button"
                className="text-orange-500 hover:underline"
                onClick={() => setMode("signin")}
              >
                Sign in
              </button>
            </div>
          </form>
        )}
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Email: user@eventify.com<br />
            Password: user123
          </p>
        </div>
      </div>
    </div>
  );
} 