"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  FolderOpen,
  Upload,
  Share2,
  Star,
  Trash2,
  Settings,
  HelpCircle,
  X,
  ChevronRight,
  FolderPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileStore } from "@/store/fileStore";
import api from "@/lib/api";
import type { Folder } from "@/types";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <Home className="w-5 h-5" />,
  },
  {
    label: "My Files",
    href: "/dashboard/files",
    icon: <FolderOpen className="w-5 h-5" />,
  },
  {
    label: "Upload",
    href: "/dashboard/upload",
    icon: <Upload className="w-5 h-5" />,
  },
  {
    label: "Shared",
    href: "/dashboard/shared",
    icon: <Share2 className="w-5 h-5" />,
  },
];

const secondaryNavItems: NavItem[] = [
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <Settings className="w-5 h-5" />,
  },
  {
    label: "Help",
    href: "/dashboard/help",
    icon: <HelpCircle className="w-5 h-5" />,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(false);

  // Fetch root folders for sidebar
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      try {
        const response = await api.get("/folders");
        setFolders(response.data.data.slice(0, 5)); // Show only first 5
      } catch (error) {
        console.error("Failed to fetch folders:", error);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, []);

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive =
      pathname === item.href || pathname.startsWith(item.href + "/");

    return (
      <Link
        href={item.href}
        onClick={onClose}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-primary-50 text-primary-700"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        {item.icon}
        {item.label}
      </Link>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Close button (mobile) */}
      <div className="flex items-center justify-between p-4 lg:hidden">
        <span className="font-semibold text-gray-900">Menu</span>
        <button
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {mainNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}

        {/* Folders section */}
        <div className="pt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Folders
            </span>
            <Link
              href="/dashboard/files"
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <FolderPlus className="w-4 h-4" />
            </Link>
          </div>

          {isLoadingFolders ? (
            <div className="px-3 py-2 text-sm text-gray-500">Loading...</div>
          ) : folders.length === 0 ? (
            <div className="px-3 py-2 text-sm text-gray-500">
              No folders yet
            </div>
          ) : (
            <div className="space-y-1">
              {folders.map((folder) => (
                <Link
                  key={folder._id}
                  href={`/dashboard/files/${folder._id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <FolderOpen className="w-4 h-4 text-yellow-500" />
                  <span className="truncate">{folder.name}</span>
                </Link>
              ))}
              {folders.length >= 5 && (
                <Link
                  href="/dashboard/files"
                  className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                  View all folders
                </Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Secondary navigation */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-1">
        {secondaryNavItems.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
