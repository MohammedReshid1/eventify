import { useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function Auth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/");
      }
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        if (!acceptedTerms) {
          toast({
            title: "Error",
            description: "You must accept the Terms of Service and Privacy Policy to create an account.",
            variant: "destructive",
          });
          return;
        }

        if (!fullName.trim()) {
          toast({
            title: "Error",
            description: "Full name is required",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const { data: { user }, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (error) throw error;

        if (user) {
          setShowSuccessDialog(true);
          setTimeout(() => {
            setShowSuccessDialog(false);
            navigate("/");
          }, 3000);
        }
      } else {
        const { data: { user }, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (user) {
          toast({
            title: "Welcome back!",
            description: "You've successfully signed in.",
          });
          navigate("/");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-amber-500">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {isSignUp ? "Sign up to start creating events" : "Sign in to your account"}
          </p>
        </div>

        <div className="space-y-6">
          <Button
            onClick={handleGoogleSignIn}
            className="w-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 border shadow-sm"
            disabled={isLoading}
          >
            <img
              src="https://www.google.com/favicon.ico"
              alt="Google"
              className="w-5 h-5 mr-2"
            />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white dark:bg-gray-900 px-2 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {isSignUp && (
                <div>
                  <Input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                  />
                </div>
              )}
              <div>
                <Input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
              {isSignUp && (
                <div className="space-y-4">
                  <div className="flex items-start space-x-2">
                    <Checkbox
                      id="terms"
                      checked={acceptedTerms}
                      onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)}
                      required
                      className="mt-1"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-tight text-gray-600 dark:text-gray-400"
                    >
                      I accept the{" "}
                      <Link
                        to="/terms"
                        className="text-orange-500 hover:underline"
                        target="_blank"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-orange-500 hover:underline"
                        target="_blank"
                      >
                        Privacy Policy
                      </Link>
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600"
              disabled={isLoading || (isSignUp && !acceptedTerms)}
            >
              <Mail className="mr-2 h-4 w-4" />
              {isLoading ? "Loading..." : isSignUp ? "Sign Up with Email" : "Sign In with Email"}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {isSignUp ? "Already have an account? " : "Don't have an account? "}
              <button
                type="button"
                className="text-orange-500 hover:underline"
                onClick={() => setIsSignUp(!isSignUp)}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </button>
            </p>

            <div className="pt-4 border-t mt-6 dark:border-gray-700">
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-3">
                Are you an administrator?
              </p>
              <Button
                type="button"
                variant="outline"
                className="w-full border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                onClick={() => navigate('/admin/login')}
              >
                Admin Login
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Registration Successful!</DialogTitle>
            <DialogDescription>
              Your account has been created successfully. You can now sign in to access all features.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center p-4">
            <div className="rounded-full bg-green-100 p-3">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
