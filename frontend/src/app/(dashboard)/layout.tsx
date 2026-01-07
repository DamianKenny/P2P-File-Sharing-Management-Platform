"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { UploadProgress } from "@/components/upload/UploadProgress";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          <main className="flex-1 p-6 lg:p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto animate-fadeIn">{children}</div>
          </main>
        </div>

        {/* Global upload progress indicator */}
        <UploadProgress />
      </div>
    </ProtectedRoute>
  );
}
