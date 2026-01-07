"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  File,
  Loader2,
} from "lucide-react";
import api from "@/lib/api";
import toast from "react-hot-toast";

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "complete" | "error";
  error?: string;
}

interface UppyUploaderProps {
  folderId?: string | null;
}

export function UppyUploader({ folderId }: UppyUploaderProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const addFiles = (newFiles: FileList | File[]) => {
    const fileArray = Array.from(newFiles);
    const uploadFiles: UploadFile[] = fileArray.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: "pending",
    }));
    setFiles((prev) => [...prev, ...uploadFiles]);
  };

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      // Reset input so same file can be selected again
      e.target.value = "";
    }
  };

  const uploadFile = async (uploadFile: UploadFile): Promise<void> => {
    const { id, file } = uploadFile;

    try {
      // Update status to uploading
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "uploading" as const } : f
        )
      );

      // Step 1: Initialize upload
      const initResponse = await api.post("/upload/init", {
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        folderId: folderId || null,
      });

      const { uploadId, key, urls, partSize } = initResponse.data.data;

      // Step 2: Upload parts
      const parts: { ETag: string; PartNumber: number }[] = [];
      const totalParts = urls.length;

      for (let i = 0; i < totalParts; i++) {
        const start = i * partSize;
        const end = Math.min(start + partSize, file.size);
        const chunk = file.slice(start, end);

        const uploadResponse = await fetch(urls[i], {
          method: "PUT",
          body: chunk,
          headers: {
            "Content-Type": file.type || "application/octet-stream",
          },
        });

        if (!uploadResponse.ok) {
          throw new Error(`Failed to upload part ${i + 1}`);
        }

        // Get ETag from response headers
        const etag =
          uploadResponse.headers.get("ETag") ||
          uploadResponse.headers.get("etag");
        parts.push({
          ETag: etag?.replace(/"/g, "") || `part-${i + 1}`,
          PartNumber: i + 1,
        });

        // Update progress
        const progress = Math.round(((i + 1) / totalParts) * 100);
        setFiles((prev) =>
          prev.map((f) => (f.id === id ? { ...f, progress } : f))
        );
      }

      // Step 3: Complete upload
      await api.post("/upload/complete", {
        uploadId,
        key,
        parts,
        fileName: file.name,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        folderId: folderId || null,
      });

      // Update status to complete
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id ? { ...f, status: "complete" as const, progress: 100 } : f
        )
      );
    } catch (error: any) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.message || error.message || "Upload failed";
      setFiles((prev) =>
        prev.map((f) =>
          f.id === id
            ? { ...f, status: "error" as const, error: errorMessage }
            : f
        )
      );
    }
  };

  const startUpload = async () => {
    const pendingFiles = files.filter((f) => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Upload files one by one
    for (const file of pendingFiles) {
      await uploadFile(file);
    }

    setIsUploading(false);

    // Show summary
    const updatedFiles = files;
    const successCount = updatedFiles.filter(
      (f) => f.status === "complete"
    ).length;
    const errorCount = updatedFiles.filter((f) => f.status === "error").length;

    if (successCount > 0 && errorCount === 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`);
    } else if (successCount > 0 && errorCount > 0) {
      toast.success(`Uploaded ${successCount}, failed ${errorCount}`);
    } else if (errorCount > 0) {
      toast.error(`Failed to upload ${errorCount} file(s)`);
    }
  };

  const clearCompleted = () => {
    setFiles((prev) =>
      prev.filter((f) => f.status !== "complete" && f.status !== "error")
    );
  };

  const goToFiles = () => {
    router.push(folderId ? `/dashboard/files/${folderId}` : "/dashboard/files");
  };

  const pendingCount = files.filter((f) => f.status === "pending").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const completeCount = files.filter((f) => f.status === "complete").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        className={`
          relative border-2 border-dashed rounded-xl p-12 text-center transition-all
          ${isUploading ? "cursor-not-allowed opacity-60" : "cursor-pointer"}
          ${
            isDragging
              ? "border-blue-500 bg-blue-50"
              : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
          }
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />
        <Upload
          className={`w-12 h-12 mx-auto mb-4 ${
            isDragging ? "text-blue-500" : "text-gray-400"
          }`}
        />
        <p className="text-lg font-medium text-gray-700 mb-1">
          {isDragging ? "Drop files here" : "Drag & drop files here"}
        </p>
        <p className="text-sm text-gray-500 mb-2">or click to browse</p>
        <p className="text-xs text-gray-400">Maximum 5GB per file</p>
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Files ({files.length})
              {completeCount > 0 && (
                <span className="text-green-600 ml-2">
                  • {completeCount} complete
                </span>
              )}
              {errorCount > 0 && (
                <span className="text-red-600 ml-2">• {errorCount} failed</span>
              )}
            </h3>
            {(completeCount > 0 || errorCount > 0) && !isUploading && (
              <button
                onClick={clearCompleted}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear finished
              </button>
            )}
          </div>

          {/* Files */}
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
              >
                {/* Status icon */}
                <div className="flex-shrink-0">
                  {file.status === "complete" ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : file.status === "error" ? (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  ) : file.status === "uploading" ? (
                    <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                  ) : (
                    <File className="w-5 h-5 text-gray-400" />
                  )}
                </div>

                {/* File info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.file.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{formatBytes(file.file.size)}</span>
                    {file.status === "uploading" && (
                      <>
                        <span>•</span>
                        <span className="text-blue-600">{file.progress}%</span>
                      </>
                    )}
                    {file.status === "complete" && (
                      <>
                        <span>•</span>
                        <span className="text-green-600">Complete</span>
                      </>
                    )}
                    {file.status === "error" && (
                      <>
                        <span>•</span>
                        <span className="text-red-600">{file.error}</span>
                      </>
                    )}
                  </div>

                  {/* Progress bar */}
                  {(file.status === "uploading" ||
                    file.status === "pending") && (
                    <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          file.status === "uploading"
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                        style={{ width: `${file.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Remove button (only for pending files) */}
                {file.status === "pending" && !isUploading && (
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        {/* Upload button */}
        {pendingCount > 0 && (
          <button
            onClick={startUpload}
            disabled={isUploading}
            className="flex-1 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading... (
                {uploadingCount > 0
                  ? `${uploadingCount} in progress`
                  : "preparing"}
                )
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload {pendingCount} file{pendingCount !== 1 && "s"}
              </>
            )}
          </button>
        )}

        {/* Done button */}
        {completeCount > 0 && pendingCount === 0 && !isUploading && (
          <button
            onClick={goToFiles}
            className="flex-1 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            Done - View Files
          </button>
        )}
      </div>
    </div>
  );
}
