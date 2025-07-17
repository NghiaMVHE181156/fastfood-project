"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api/auth";
import type { UserProfile } from "@/types/auth";
import { AdminSidebar } from "./components/AdminSidebar";
import { CategoriesManagement } from "./components/CategoriesManagement";
import { DishesManagement } from "./components/DishesManagement";
import { ShippersManagement } from "./components/ShipperManagement";
import { OrderManagement } from "./components/OrderManagement";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("categories");
  const [admin, setAdmin] = useState<UserProfile | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        if (!authApi.isAuthenticated()) {
          navigate("/login");
          return;
        }
        const response = await authApi.getAdminProfile();
        if (response.data.success && response.data.data) {
          setAdmin(response.data.data);
        }
      } catch {
        authApi.logout();
        navigate("/login");
      }
    };
    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = () => {
    authApi.logout();
    navigate("/login");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoriesManagement />;
      case "dishes":
        return <DishesManagement />;
      case "shippers":
        return <ShippersManagement />;
      case "orders":
        return <OrderManagement />;
      default:
        return <CategoriesManagement />;
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 justify-between">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <h1 className="text-lg font-semibold capitalize">
              {activeTab} Management
            </h1>
          </div>
          <div className="flex items-center gap-4">
            {admin && (
              <span className="font-medium text-base">
                {admin.full_name || admin.user_name}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
