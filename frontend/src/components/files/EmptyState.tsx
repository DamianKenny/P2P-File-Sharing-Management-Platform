"use client";

import Link from "next/link";
import { FolderOpen, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  showActions?: boolean;
  onCreateFolder?: () => void;
}

export function EmptyState({
  title = "No files yet",
  description = "Upload files or create folders to get started",
  showActions = true,
  onCreateFolder,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <FolderOpen className="w-10 h-10 text-gray-400" />
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 text-center max-w-sm mb-6">{description}</p>

      {showActions && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/dashboard/upload">
            <Button leftIcon={<Upload className="w-4 h-4" />}>
              Upload Files
            </Button>
          </Link>

          {onCreateFolder && (
            <Button
              variant="outline"
              onClick={onCreateFolder}
              leftIcon={<Plus className="w-4 h-4" />}
            >
              Create Folder
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
