"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { Folder } from "@/types";

interface FolderBreadcrumbProps {
  breadcrumb: Folder[];
  currentFolder: Folder | null;
}

export function FolderBreadcrumb({
  breadcrumb,
  currentFolder,
}: FolderBreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm overflow-x-auto">
      {/* Home/Root */}
      <Link
        href="/dashboard/files"
        className="flex items-center gap-1 px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
      >
        <Home className="w-4 h-4" />
        <span>My Files</span>
      </Link>

      {/* Breadcrumb items */}
      {breadcrumb.map((folder) => (
        <div key={folder._id} className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <Link
            href={`/dashboard/files/${folder._id}`}
            className="px-2 py-1 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors whitespace-nowrap"
          >
            {folder.name}
          </Link>
        </div>
      ))}

      {/* Current folder */}
      {currentFolder && (
        <div className="flex items-center gap-1">
          <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span className="px-2 py-1 font-medium text-gray-900 whitespace-nowrap">
            {currentFolder.name}
          </span>
        </div>
      )}
    </nav>
  );
}
