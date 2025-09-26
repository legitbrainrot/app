"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    robloxUsername: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setIsLoading(true);
    setError("");

    // Simulate API call
    const LoadingDelay = 1500;
    await new Promise((resolve) => setTimeout(resolve, LoadingDelay));
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">Create Account</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Join the trading platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                disabled={isLoading}
                id="email"
                name="email"
                onChange={handleInputChange}
                placeholder="your@email.com"
                required
                type="email"
                value={formData.email}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="robloxUsername">Roblox Username</Label>
              <Input
                disabled={isLoading}
                id="robloxUsername"
                name="robloxUsername"
                onChange={handleInputChange}
                placeholder="YourRobloxUsername"
                required
                type="text"
                value={formData.robloxUsername}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                disabled={isLoading}
                id="password"
                name="password"
                onChange={handleInputChange}
                required
                type="password"
                value={formData.password}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                disabled={isLoading}
                id="confirmPassword"
                name="confirmPassword"
                onChange={handleInputChange}
                required
                type="password"
                value={formData.confirmPassword}
              />
            </div>
            {error && (
              <div className="text-center text-destructive text-sm">
                {error}
              </div>
            )}
            <Button
              className="btn-primary w-full"
              disabled={isLoading}
              type="submit"
            >
              {isLoading ? "Creating Account..." : "Sign Up"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{" "}
            <Link className="text-primary hover:underline" href="/auth/sign-in">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
