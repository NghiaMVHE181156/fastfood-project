"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/api/auth";
import type { RegisterData } from "@/types/auth";
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
import { Header } from "../user/components/Header";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setIsLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const userData: RegisterData = {
      user_name: formData.get("user_name") as string,
      email: formData.get("email") as string,
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await authApi.register(userData);

      if (response.data.success) {
        // Registration successful, show success message then redirect
        setSuccess(response.data.message);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        // Handle case where response is not successful
        setError(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);

      // Handle different types of errors
      if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      <Header />
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-orange-600">
            Create an account
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter your information to create your account
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-md">
                {success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="user_name">Username</Label>
              <Input
                id="user_name"
                name="user_name"
                placeholder="user123"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                name="full_name"
                placeholder="Nguyễn Văn A"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="user@example.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="909123456"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 mt-4">
            <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
            <div className="text-center text-sm text-gray-600">
              {"Already have an account? "}
              <Button
                variant="link"
                className="px-0 font-semibold text-orange-600 hover:text-orange-700"
                type="button"
                onClick={() => navigate("/login")}
                disabled={isLoading}
              >
                Sign in
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
