"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Copy, ExternalLink, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/files/EmptyState";
import {
  formatBytes,
  formatRelativeTime,
  copyToClipboard,
  getFileIcon,
} from "@/lib/utils";
import api from "@/lib/api";
import { FileItem } from "@/types";
import toast from "react-hot-toast";

export default function SharedPage() {
  const [sharedFiles, setSharedFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      const response = await api.get("/files?isPublic=true");
      const files = response.data.data.filter((f: FileItem) => f.isPublic);
      setSharedFiles(files);
    } catch (error) {
      console.error("Failed to fetch shared files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = async (file: FileItem) => {
    const url = `${window.location.origin}/shared/${file.shareToken}`;
    const success = await copyToClipboard(url);
    if (success) {
      toast.success("Link copied to clipboard");
    }
  };

  const handleStopSharing = async (fileId: string) => {
    try {
      await api.delete(`/files/${fileId}/share`);
      setSharedFiles((prev) => prev.filter((f) => f._id !== fileId));
      toast.success("File sharing disabled");
    } catch (error) {
      toast.error("Failed to stop sharing");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shared Files</h1>
        <p className="text-gray-600 mt-1">
          Manage files you've shared with others
        </p>
      </div>

      {sharedFiles.length === 0 ? (
        <EmptyState
          title="No shared files"
          description="Files you share will appear here"
          showActions={false}
        />
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">
                {sharedFiles.length} Shared File
                {sharedFiles.length !== 1 && "s"}
              </h2>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {sharedFiles.map((file) => (
                <div
                  key={file._id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* File icon */}
                  <div className="text-2xl flex-shrink-0">
                    {getFileIcon(file.mimeType)}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatBytes(file.size)} • Shared{" "}
                      {formatRelativeTime(file.createdAt)}
                      {file.downloadCount > 0 &&
                        ` • ${file.downloadCount} download${
                          file.downloadCount !== 1 ? "s" : ""
                        }`}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyLink(file)}
                      leftIcon={<Copy className="w-4 h-4" />}
                    >
                      Copy Link
                    </Button>
                    <a
                      href={`/shared/${file.shareToken}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleStopSharing(file._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
