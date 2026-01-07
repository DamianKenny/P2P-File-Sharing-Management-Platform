"use client";

import { useState } from "react";
import {
  MoreVertical,
  Download,
  Share2,
  Edit2,
  Trash2,
  Link,
  Eye,
} from "lucide-react";
import { FileItem } from "@/types";
import {
  formatBytes,
  formatRelativeTime,
  getFileIcon,
  truncate,
  cn,
} from "@/lib/utils";
import { Dropdown } from "@/components/ui/Dropdown";
import { FilePreview } from "@/components/upload/FilePreview";

interface FileCardProps {
  file: FileItem;
  isSelected?: boolean;
  viewMode: "grid" | "list";
  onSelect?: () => void;
  onDownload: () => void;
  onShare: () => void;
  onRename: () => void;
  onDelete: () => void;
  onPreview?: () => void;
}

export function FileCard({
  file,
  isSelected = false,
  viewMode,
  onSelect,
  onDownload,
  onShare,
  onRename,
  onDelete,
  onPreview,
}: FileCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const dropdownItems = [
    {
      label: "Preview",
      icon: <Eye className="w-4 h-4" />,
      onClick: onPreview || (() => {}),
      disabled: !onPreview,
    },
    {
      label: "Download",
      icon: <Download className="w-4 h-4" />,
      onClick: onDownload,
    },
    {
      label: file.isPublic ? "Manage Share" : "Share",
      icon: <Share2 className="w-4 h-4" />,
      onClick: onShare,
    },
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
      <div
        className={cn(
          "flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0",
          isSelected && "bg-primary-50"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />

        {/* File icon */}
        <div className="flex-shrink-0 text-2xl">
          {getFileIcon(file.mimeType)}
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {file.name}
          </p>
          <p className="text-xs text-gray-500">
            {formatBytes(file.size)} • {formatRelativeTime(file.createdAt)}
          </p>
        </div>

        {/* Share indicator */}
        {file.isPublic && (
          <div className="flex-shrink-0">
            <Link className="w-4 h-4 text-green-600" />
          </div>
        )}

        {/* Actions */}
        <div className={cn("flex-shrink-0", !isHovered && "opacity-0")}>
          <Dropdown
            trigger={
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={dropdownItems}
          />
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={cn(
        "group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer",
        isSelected && "ring-2 ring-primary-500 border-primary-500"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onPreview}
    >
      {/* Checkbox */}
      <div
        className={cn(
          "absolute top-3 left-3 z-10 transition-opacity",
          isHovered || isSelected ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={onSelect}
          className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
        />
      </div>

      {/* Menu */}
      <div
        className={cn(
          "absolute top-3 right-3 z-10 transition-opacity",
          isHovered ? "opacity-100" : "opacity-0"
        )}
        onClick={(e) => e.stopPropagation()}
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

      {/* Share indicator */}
      {file.isPublic && (
        <div className="absolute top-3 right-3 z-10 group-hover:opacity-0 transition-opacity">
          <div className="p-1.5 bg-green-100 rounded-lg">
            <Link className="w-3 h-3 text-green-600" />
          </div>
        </div>
      )}

      {/* File preview */}
      <div className="flex justify-center items-center h-24 mb-3">
        <FilePreview fileName={file.name} mimeType={file.mimeType} size="lg" />
      </div>

      {/* File info */}
      <div className="text-center">
        <p
          className="text-sm font-medium text-gray-900 truncate"
          title={file.name}
        >
          {truncate(file.name, 25)}
        </p>
        <p className="text-xs text-gray-500 mt-1">{formatBytes(file.size)}</p>
      </div>
    </div>
  );
}
