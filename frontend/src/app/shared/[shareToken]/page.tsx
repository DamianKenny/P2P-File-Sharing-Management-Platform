"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Download, File, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export default function SharedFilePage() {
  const params = useParams();
  const shareToken = params.shareToken as string;

  const [file, setFile] = useState<any>(null);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFile = async () => {
      try {
        const response = await api.get(`/files/shared/${shareToken}`);
        setFile(response.data.data.file);
        setDownloadUrl(response.data.data.downloadUrl);
      } catch (err: any) {
        setError(err.response?.data?.message || "File not found");
      } finally {
        setIsLoading(false);
      }
    };

    fetchFile();
  }, [shareToken]);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = file.name;
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow-lg">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            File Not Found
          </h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="max-w-4xl mx-auto">
          <span className="font-bold text-xl">P2P File Platform</span>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg">
          <File className="w-20 h-20 text-blue-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">
            {file.name}
          </h1>
          <p className="text-gray-600 mb-6">{formatBytes(file.size)}</p>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors text-lg font-medium"
          >
            <Download className="w-5 h-5" />
            Download File
          </button>

          <p className="text-sm text-gray-500 mt-6">
            Downloaded {file.downloadCount} times
          </p>
        </div>
      </main>
    </div>
  );
}
