
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const AuthForm = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "You've successfully logged in.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            email: formData.email,
          },
        }
      });

      if (error) throw error;

      toast({
        title: "Account created!",
        description: "Please check your email to confirm your account.",
      });

      // If email confirmation is disabled in Supabase, automatically redirect
      if (data?.user && !data.session) {
        toast({
          title: "Email verification required",
          description: "Please check your email to confirm your account before logging in."
        });
      } else if (data?.session) {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please try again with a different email.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      toast({
        title: "Email required",
        description: "Please enter your email address to reset your password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email);

      if (error) throw error;

      toast({
        title: "Password reset email sent",
        description: "Check your inbox for instructions to reset your password.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        title: "Reset failed",
        description: error.message || "Failed to send reset password email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-muted/30">
      <Card className="w-full max-w-md mx-auto animate-fade-in shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Teacher Toolkit</CardTitle>
          <CardDescription className="text-center">
            Create AI-powered educational content in seconds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="animate-fade-in">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      name="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="login-password">Password</Label>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="text-xs p-0 h-auto"
                        type="button"
                        disabled={isLoading}
                        onClick={handleResetPassword}
                      >
                        Forgot password?
                      </Button>
                    </div>
                    <Input 
                      id="login-password" 
                      name="password" 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging in...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="animate-fade-in">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      name="email" 
                      type="email" 
                      placeholder="your.email@example.com" 
                      required
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <Input 
                      id="signup-password" 
                      name="password" 
                      type="password" 
                      required
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                      className="transition-all"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </Button>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-muted-foreground w-full">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AuthForm;
