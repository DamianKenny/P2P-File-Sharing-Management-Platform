"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  Upload,
  Search,
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Dropdown } from "@/components/ui/Dropdown";
import {
  getInitials,
  getAvatarColor,
  formatBytes,
  calculateStoragePercentage,
} from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

interface HeaderProps {
  onMenuClick?: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/dashboard/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const storagePercentage = user
    ? calculateStoragePercentage(user.storageUsed, user.storageLimit)
    : 0;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6">
        {/* Left section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P2P</span>
            </div>
            <span className="font-semibold text-gray-900 hidden sm:block">
              {APP_NAME}
            </span>
          </Link>
        </div>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="hidden md:block flex-1 max-w-md mx-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 border border-transparent rounded-lg focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 focus:outline-none transition-all"
            />
          </div>
        </form>

        {/* Right section */}
        <div className="flex items-center gap-2">
          <Link href="/dashboard/upload">
            <Button size="sm" leftIcon={<Upload className="w-4 h-4" />}>
              <span className="hidden sm:inline">Upload</span>
            </Button>
          </Link>

          {/* User menu */}
          {user && (
            <Dropdown
              trigger={
                <button className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${getAvatarColor(
                      user.name
                    )}`}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(user.storageUsed)} /{" "}
                      {formatBytes(user.storageLimit)}
                    </p>
                  </div>
                </button>
              }
              items={[
                {
                  label: "Profile",
                  icon: <User className="w-4 h-4" />,
                  onClick: () => router.push("/dashboard/profile"),
                },
                {
                  label: "Settings",
                  icon: <Settings className="w-4 h-4" />,
                  onClick: () => router.push("/dashboard/settings"),
                },
                {
                  label: "Logout",
                  icon: <LogOut className="w-4 h-4" />,
                  onClick: handleLogout,
                  danger: true,
                },
              ]}
            />
          )}
        </div>
      </div>

      {/* Storage bar */}
      {user && (
        <div className="h-1 bg-gray-100">
          <div
            className={`h-full transition-all ${
              storagePercentage > 90
                ? "bg-red-500"
                : storagePercentage > 70
                ? "bg-yellow-500"
                : "bg-primary-500"
            }`}
            style={{ width: `${Math.min(storagePercentage, 100)}%` }}
          />
        </div>
      )}
    </header>
  );
}
