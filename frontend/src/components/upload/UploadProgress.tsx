"use client";

import { useUploadStore, UploadItem } from "@/store/uploadStore";
import { X, CheckCircle, AlertCircle, Loader2, FileIcon } from "lucide-react";
import { formatBytes, cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function UploadProgress() {
  const { uploads, isUploading, removeUpload, clearCompleted, getUploadList } =
    useUploadStore();
  const uploadList = getUploadList();

  if (uploadList.length === 0) {
    return null;
  }

  const completedCount = uploadList.filter(
    (u) => u.status === "complete"
  ).length;
  const errorCount = uploadList.filter((u) => u.status === "error").length;
  const inProgressCount = uploadList.filter(
    (u) =>
      u.status === "uploading" ||
      u.status === "pending" ||
      u.status === "processing"
  ).length;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center gap-2">
          {isUploading ? (
            <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />
          ) : completedCount === uploadList.length ? (
            <CheckCircle className="w-4 h-4 text-green-600" />
          ) : errorCount > 0 ? (
            <AlertCircle className="w-4 h-4 text-red-600" />
          ) : null}
          <span className="font-medium text-sm text-gray-900">
            {isUploading
              ? `Uploading ${inProgressCount} file(s)...`
              : `${completedCount} of ${uploadList.length} complete`}
          </span>
        </div>

        {!isUploading && (completedCount > 0 || errorCount > 0) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCompleted}
            className="text-xs"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Upload list */}
      <div className="max-h-64 overflow-y-auto">
        {uploadList.map((upload) => (
          <UploadItemRow
            key={upload.id}
            upload={upload}
            onRemove={() => removeUpload(upload.id)}
          />
        ))}
      </div>
    </div>
  );
}

interface UploadItemRowProps {
  upload: UploadItem;
  onRemove: () => void;
}

function UploadItemRow({ upload, onRemove }: UploadItemRowProps) {
  const getStatusIcon = () => {
    switch (upload.status) {
      case "complete":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      case "uploading":
      case "processing":
        return <Loader2 className="w-4 h-4 text-primary-600 animate-spin" />;
      default:
        return <FileIcon className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusText = () => {
    switch (upload.status) {
      case "complete":
        return "Complete";
      case "error":
        return upload.error || "Failed";
      case "processing":
        return "Processing...";
      case "uploading":
        return `${upload.progress}%`;
      default:
        return "Waiting...";
    }
  };

  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50">
      {/* Status icon */}
      <div className="flex-shrink-0">{getStatusIcon()}</div>

      {/* File info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {upload.fileName}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatBytes(upload.fileSize)}</span>
          <span>•</span>
          <span
            className={cn(
              upload.status === "error" && "text-red-600",
              upload.status === "complete" && "text-green-600"
            )}
          >
            {getStatusText()}
          </span>
        </div>

        {/* Progress bar */}
        {(upload.status === "uploading" || upload.status === "processing") && (
          <div className="mt-1.5 h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-300",
                upload.status === "processing"
                  ? "bg-yellow-500 animate-pulse"
                  : "bg-primary-600"
              )}
              style={{ width: `${upload.progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Remove button */}
      {(upload.status === "complete" || upload.status === "error") && (
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Floating upload button with progress indicator
 */
export function UploadProgressFab() {
  const { isUploading, getUploadList } = useUploadStore();
  const uploads = getUploadList();

  if (!isUploading || uploads.length === 0) {
    return null;
  }

  const totalProgress = Math.round(
    uploads.reduce((acc, u) => acc + u.progress, 0) / uploads.length
  );

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <div className="relative">
        {/* Progress ring */}
        <svg className="w-14 h-14 transform -rotate-90">
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="#e5e7eb"
            strokeWidth="4"
            fill="white"
          />
          <circle
            cx="28"
            cy="28"
            r="24"
            stroke="#2563eb"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={`${(totalProgress / 100) * 150.8} 150.8`}
            strokeLinecap="round"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-gray-900">
            {totalProgress}%
          </span>
        </div>
      </div>
    </div>
  );
}
