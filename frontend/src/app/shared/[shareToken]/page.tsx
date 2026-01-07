"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, FileIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { formatBytes, getFileIcon, downloadFile } from "@/lib/utils";
import { FilePreview } from "@/components/upload/FilePreview";
import { APP_NAME } from "@/lib/constants";
import api from "@/lib/api";

interface SharedFile {
  file: {
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    downloadCount: number;
  };
  downloadUrl: string;
}

export default function SharedFilePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const [data, setData] = useState<SharedFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSharedFile = async () => {
      try {
        const response = await api.get(`/files/shared/${shareToken}`);
        setData(response.data.data);
      } catch (err: any) {
        setError(
          err.response?.data?.message || "File not found or link expired"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchSharedFile();
  }, [shareToken]);

  const handleDownload = () => {
    if (data) {
      downloadFile(data.downloadUrl, data.file.name);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="text-center py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 mb-2">
              File Not Found
            </h1>
            <p className="text-gray-600">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P2P</span>
            </div>
            <span className="font-semibold text-gray-900">{APP_NAME}</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        <Card>
          <CardContent className="text-center py-12">
            {/* File Preview */}
            <div className="flex justify-center mb-6">
              <FilePreview
                fileName={data.file.name}
                mimeType={data.file.mimeType}
                size="lg"
                url={
                  data.file.mimeType.startsWith("image/")
                    ? data.downloadUrl
                    : undefined
                }
              />
            </div>

            {/* File Info */}
            <h1 className="text-xl font-semibold text-gray-900 mb-2 break-all">
              {data.file.name}
            </h1>
            <p className="text-gray-600 mb-6">{formatBytes(data.file.size)}</p>

            {/* Download Button */}
            <Button
              size="lg"
              onClick={handleDownload}
              leftIcon={<Download className="w-5 h-5" />}
              className="px-8"
            >
              Download File
            </Button>

            {/* Stats */}
            <p className="text-sm text-gray-500 mt-6">
              Downloaded {data.file.downloadCount} time
              {data.file.downloadCount !== 1 && "s"}
            </p>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-gray-500 mt-8">
          Shared via{" "}
          <a href="/" className="text-primary-600 hover:underline">
            {APP_NAME}
          </a>
        </p>
      </main>
    </div>
  );
}
