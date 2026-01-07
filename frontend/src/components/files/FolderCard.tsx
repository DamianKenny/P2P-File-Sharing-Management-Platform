"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Folder as FolderIcon,
  MoreVertical,
  Edit2,
  Trash2,
} from "lucide-react";
import { Folder } from "@/types";
import { formatRelativeTime, cn } from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";

interface FolderCardProps {
  folder: Folder;
  viewMode: "grid" | "list";
  onRename: () => void;
  onDelete: () => void;
}

export function FolderCard({
  folder,
  viewMode,
  onRename,
  onDelete,
}: FolderCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dropdownItems = [
    {
      label: "Rename",
      icon: <Edit2 className="w-4 h-4" />,
      onClick: onRename,
    },
    {
      label: "Delete",
      icon: <Trash2 className="w-4 h-4" />,
      onClick: onDelete,
      danger: true,
    },
  ];

  if (viewMode === "list") {
    return (
      <Link
        href={`/dashboard/files/${folder._id}`}
        className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Spacer for checkbox alignment */}
        <div className="w-4" />

        {/* Folder icon */}
        <div className="flex-shrink-0">
          <FolderIcon className="w-6 h-6 text-yellow-500 fill-yellow-100" />
        </div>

        {/* Folder info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {folder.name}
          </p>
          <p className="text-xs text-gray-500">
            Folder • {formatRelativeTime(folder.createdAt)}
          </p>
        </div>

        {/* Actions */}
        <div
          className={cn("flex-shrink-0", !isHovered && "opacity-0")}
          onClick={(e) => e.preventDefault()}
        >
          <Dropdown
            trigger={
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={dropdownItems}
          />
        </div>
      </Link>
    );
  }

  // Grid view
  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={`/dashboard/files/${folder._id}`}
        className="block bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all"
      >
        {/* Menu button */}
        <div
          className={cn(
            "absolute top-3 right-3 z-10 transition-opacity",
            isHovered ? "opacity-100" : "opacity-0"
          )}
          onClick={(e) => e.preventDefault()}
        >
          <Dropdown
            trigger={
              <button className="p-1.5 bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg shadow-sm transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={dropdownItems}
          />
        </div>

        {/* Folder icon */}
        <div className="flex justify-center items-center h-24 mb-3">
          <FolderIcon className="w-16 h-16 text-yellow-500 fill-yellow-100" />
        </div>

        {/* Folder name */}
        <div className="text-center">
          <p className="text-sm font-medium text-gray-900 truncate">
            {folder.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">Folder</p>
        </div>
      </Link>
    </div>
  );
}
