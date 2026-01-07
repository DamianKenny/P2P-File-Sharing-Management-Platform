"use client";

import { useState, useEffect } from "react";
import { Link as LinkIcon, Copy, Trash2 } from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface SharedFile {
  _id: string;
  name: string;
  size: number;
  shareToken: string;
  downloadCount: number;
}

export default function SharedPage() {
  const [files, setFiles] = useState<SharedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSharedFiles();
  }, []);

  const fetchSharedFiles = async () => {
    try {
      const response = await api.get("/files");
      const sharedFiles = response.data.data.filter((f: any) => f.isPublic);
      setFiles(sharedFiles);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyLink = async (shareToken: string) => {
    const url = `${window.location.origin}/shared/${shareToken}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  const stopSharing = async (fileId: string) => {
    try {
      await api.delete(`/files/${fileId}/share`);
      toast.success("Sharing disabled");
      fetchSharedFiles();
    } catch (error) {
      toast.error("Failed to stop sharing");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Shared Files</h1>
        <p className="text-gray-600 mt-1">Manage files you've shared</p>
      </div>

      {files.length === 0 ? (
        <div className="text-center py-16">
          <LinkIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No shared files
          </h3>
          <p className="text-gray-500">Files you share will appear here</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {files.map((file) => (
            <div
              key={file._id}
              className="flex items-center gap-4 px-6 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50"
            >
              <LinkIcon className="w-5 h-5 text-green-600" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-sm text-gray-500">
                  {formatBytes(file.size)} • {file.downloadCount} downloads
                </p>
              </div>
              <button
                onClick={() => copyLink(file.shareToken)}
                className="p-2 hover:bg-gray-100 rounded-lg"
                title="Copy link"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => stopSharing(file._id)}
                className="p-2 hover:bg-red-50 text-red-600 rounded-lg"
                title="Stop sharing"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
