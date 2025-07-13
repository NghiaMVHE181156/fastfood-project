"use client";

import { useState } from "react";
import { AdminSidebar } from "./components/AdminSidebar";
import { CategoriesManagement } from "./components/CategoriesManagement";
import { DishesManagement } from "./components/DishesManagement";
import { ShippersManagement } from "./components/ShipperManagement";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("categories");

  const renderContent = () => {
    switch (activeTab) {
      case "categories":
        return <CategoriesManagement />;
      case "dishes":
        return <DishesManagement />;
      case "shippers":
        return <ShippersManagement />;
      default:
        return <CategoriesManagement />;
    }
  };

  return (
    <SidebarProvider>
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-lg font-semibold capitalize">
            {activeTab} Management
          </h1>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{renderContent()}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
