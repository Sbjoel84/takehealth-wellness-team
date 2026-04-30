import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, ApiError } from "@/services/api";
import loginImage from "@/assets/spa.png";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    try {
      await apiRequest("/auth/forget-password", "POST", {
        email: email.trim(),
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitted(true);
    } catch (err) {
      // Show success even on error to avoid email enumeration
      const isNotFound = err instanceof ApiError && err.status === 404;
      if (isNotFound) {
        setSubmitted(true);
      } else {
        const message = err instanceof ApiError ? err.message : "Something went wrong. Please try again.";
        toast({ title: "Error", description: message, variant: "destructive" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <img src="/logo.svg" alt="takehealth Logo" className="h-20 object-contain" />
          </Link>

          {submitted ? (
            /* Success state */
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground">Check your email</h1>
              <p className="text-muted-foreground">
                If <strong>{email}</strong> is registered, you'll receive a password reset link
                shortly. Check your spam folder if it doesn't arrive within a few minutes.
              </p>
              <Button asChild className="w-full mt-4">
                <Link to="/login">Back to Login</Link>
              </Button>
            </div>
          ) : (
            /* Request form */
            <>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground mb-8">
                Enter your email and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending…" : "Send Reset Link"}
                </Button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mt-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Login
              </Link>
            </>
          )}
        </motion.div>
      </div>

      {/* Right Side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src={loginImage} alt="Wellness" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-primary/80" />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="text-center text-white max-w-md">
            <h2 className="font-serif text-4xl font-bold mb-4">Reset Your Password</h2>
            <p className="text-white/90 text-lg">
              No worries — it happens to everyone. We'll help you get back on track in just a few steps.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
