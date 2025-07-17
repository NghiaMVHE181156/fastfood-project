"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/api/auth";
import type { LoginData } from "@/types/auth";
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

export default function LoginPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Prevent multiple submissions
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.target as HTMLFormElement);
    const loginData: LoginData = {
      user_name: formData.get("username") as string,
      password: formData.get("password") as string,
    };

    try {
      const response = await authApi.login(loginData);

      if (response.data.success && response.data.data) {
        // Store token
        authApi.setToken(response.data.data.token);

        // Redirect based on role
        const role = response.data.data.role;
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else if (role === "shipper") {
          navigate("/shipper/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Handle case where response is not successful
        setError(response.data.message);
      }
    } catch (err: unknown) {
      console.error("Login error:", err);

      // Handle different types of errors
      if (typeof err === "object" && err !== null && "message" in err) {
        setError((err as { message: string }).message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed. Please try again.");
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
              Welcome back
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="user123"
                  required
                  disabled={isLoading}
                  autoComplete="username"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isLoading) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  autoComplete="current-password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && isLoading) {
                      e.preventDefault();
                    }
                  }}
                />
              </div>
              <div className="flex items-center justify-between">
                <Button
                  variant="link"
                  className="px-0 text-sm text-orange-600 hover:text-orange-700"
                  type="button"
                >
                  Forgot password?
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isLoading}
                onClick={(e) => {
                  if (isLoading) {
                    e.preventDefault();
                  }
                }}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
              <div className="text-center text-sm text-gray-600">
                {"Don't have an account? "}
                <Button
                  variant="link"
                  className="px-0 font-semibold text-orange-600 hover:text-orange-700"
                  type="button"
                  onClick={() => navigate("/register")}
                  disabled={isLoading}
                >
                  Sign up
                </Button>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
