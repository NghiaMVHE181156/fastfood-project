"use client";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Check if user is authenticated
        if (!authApi.isAuthenticated()) {
          navigate("/login");
          return;
        }

        const response = await authApi.getProfile();
        if (response.data.success && response.data.data) {
          setUser(response.data.data);
        }
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load profile";
        setError(errorMessage);
        // If unauthorized, redirect to login
        if (err instanceof Error && err.message.includes("401")) {
          authApi.logout();
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button onClick={handleLogout} variant="outline">
            Logout
          </Button>
        </div>

        {user && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Username
                  </label>
                  <p className="text-lg">{user.user_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Full Name
                  </label>
                  <p className="text-lg">{user.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Email
                  </label>
                  <p className="text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-lg">{user.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Role
                  </label>
                  <p className="text-lg capitalize">{user.role}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Member Since
                  </label>
                  <p className="text-lg">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" variant="outline">
                  Edit Profile
                </Button>
                <Button className="w-full" variant="outline">
                  Change Password
                </Button>
                <Button className="w-full" variant="outline">
                  View Orders
                </Button>
                <Button className="w-full" variant="outline">
                  Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
