"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { emailOtp, signIn } from "@/lib/auth-client";

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "email";

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });

      // Navigate to OTP step with email in URL
      router.push(`/auth/sign-in?step=otp&email=${encodeURIComponent(email)}`);
    } catch (err) {
      setError("Failed to send OTP. Please try again.");
      console.error("OTP send error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      await signIn.emailOtp({
        email,
        otp,
      });

      // Redirect will be handled by better-auth callbacks
      router.push("/app");
    } catch (err) {
      setError("Invalid OTP. Please try again.");
      console.error("OTP verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToEmail = () => {
    router.push("/auth/sign-in?step=email");
    setOtp("");
    setError("");
  };

  if (step === "otp") {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-center text-2xl">Enter OTP</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              We sent a code to {email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleOtpSubmit}>
              <div className="space-y-2">
                <Label htmlFor="otp">One-Time Password</Label>
                <Input
                  disabled={isLoading}
                  id="otp"
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  required
                  type="text"
                  value={otp}
                  maxLength={6}
                  pattern="[0-9]{6}"
                />
              </div>
              {error && (
                <div className="text-center text-destructive text-sm">
                  {error}
                </div>
              )}
              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? "Verifying..." : "Verify & Sign In"}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleBackToEmail}
                disabled={isLoading}
              >
                ← Back to Email
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Welcome Back</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Enter your email to receive a sign-in code
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleEmailSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={isLoading}
                id="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                type="email"
                value={email}
              />
            </div>
            {error && (
              <div className="text-center text-destructive text-sm">
                {error}
              </div>
            )}
            <Button
              className="w-full"
              disabled={isLoading || !email}
              type="submit"
            >
              {isLoading ? "Sending Code..." : "Send Sign-In Code"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
