"use client";

import { Download, Trash2, Share2, FolderInput } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface FileActionsProps {
  selectedCount: number;
  onDownload: () => void;
  onDelete: () => void;
  onShare: () => void;
  onMove: () => void;
}

export function FileActions({
  selectedCount,
  onDownload,
  onDelete,
  onShare,
  onMove,
}: FileActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-900 text-white rounded-xl shadow-lg">
        <span className="text-sm font-medium mr-2">
          {selectedCount} selected
        </span>

        <div className="w-px h-6 bg-gray-700" />

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-800"
          onClick={onDownload}
          leftIcon={<Download className="w-4 h-4" />}
        >
          Download
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-800"
          onClick={onShare}
          leftIcon={<Share2 className="w-4 h-4" />}
        >
          Share
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-800"
          onClick={onMove}
          leftIcon={<FolderInput className="w-4 h-4" />}
        >
          Move
        </Button>

        <div className="w-px h-6 bg-gray-700" />

        <Button
          variant="ghost"
          size="sm"
          className="text-red-400 hover:bg-red-900/30"
          onClick={onDelete}
          leftIcon={<Trash2 className="w-4 h-4" />}
        >
          Delete
        </Button>
      </div>
    </div>
  );
}
