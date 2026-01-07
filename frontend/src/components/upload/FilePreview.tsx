"use client";

import { useState } from "react";
import Image from "next/image";
import { FileIcon, Play, Music, FileText, Archive, X } from "lucide-react";
import { cn, isImageFile, isVideoFile } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";

interface FilePreviewProps {
  fileName: string;
  mimeType: string;
  url?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
}

export function FilePreview({
  fileName,
  mimeType,
  url,
  size = "md",
  className,
  onClick,
}: FilePreviewProps) {
  const sizes = {
    sm: "w-10 h-10",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  // Image preview
  if (isImageFile(mimeType) && url) {
    return (
      <div
        className={cn(
          "relative rounded-lg overflow-hidden bg-gray-100 cursor-pointer",
          sizes[size],
          className
        )}
        onClick={onClick}
      >
        <Image
          src={url}
          alt={fileName}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  }

  // Icon-based preview
  const getIcon = () => {
    if (isVideoFile(mimeType)) {
      return <Play className={cn(iconSizes[size], "text-purple-500")} />;
    }
    if (mimeType.startsWith("audio/")) {
      return <Music className={cn(iconSizes[size], "text-pink-500")} />;
    }
    if (
      mimeType.includes("pdf") ||
      mimeType.includes("document") ||
      mimeType.includes("text")
    ) {
      return <FileText className={cn(iconSizes[size], "text-blue-500")} />;
    }
    if (
      mimeType.includes("zip") ||
      mimeType.includes("rar") ||
      mimeType.includes("7z")
    ) {
      return <Archive className={cn(iconSizes[size], "text-yellow-600")} />;
    }
    return <FileIcon className={cn(iconSizes[size], "text-gray-400")} />;
  };

  const getBackgroundColor = () => {
    if (isVideoFile(mimeType)) return "bg-purple-50";
    if (mimeType.startsWith("audio/")) return "bg-pink-50";
    if (mimeType.includes("pdf") || mimeType.includes("document"))
      return "bg-blue-50";
    if (mimeType.includes("zip") || mimeType.includes("rar"))
      return "bg-yellow-50";
    return "bg-gray-100";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-lg",
        sizes[size],
        getBackgroundColor(),
        onClick && "cursor-pointer hover:opacity-80 transition-opacity",
        className
      )}
      onClick={onClick}
    >
      {getIcon()}
    </div>
  );
}

/**
 * Full-screen file preview modal
 */
interface FilePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  mimeType: string;
  downloadUrl: string;
}

export function FilePreviewModal({
  isOpen,
  onClose,
  fileName,
  mimeType,
  downloadUrl,
}: FilePreviewModalProps) {
  const [isLoading, setIsLoading] = useState(true);

  const renderContent = () => {
    if (isImageFile(mimeType)) {
      return (
        <div className="relative w-full h-full min-h-[400px]">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          <Image
            src={downloadUrl}
            alt={fileName}
            fill
            className="object-contain"
            onLoad={() => setIsLoading(false)}
            sizes="100vw"
          />
        </div>
      );
    }

    if (isVideoFile(mimeType)) {
      return (
        <video
          src={downloadUrl}
          controls
          className="w-full max-h-[70vh] rounded-lg"
          autoPlay={false}
        >
          Your browser does not support video playback.
        </video>
      );
    }

    if (mimeType.startsWith("audio/")) {
      return (
        <div className="p-8 flex flex-col items-center gap-4">
          <Music className="w-16 h-16 text-pink-500" />
          <p className="text-lg font-medium text-gray-900">{fileName}</p>
          <audio src={downloadUrl} controls className="w-full max-w-md">
            Your browser does not support audio playback.
          </audio>
        </div>
      );
    }

    if (mimeType === "application/pdf") {
      return (
        <iframe
          src={downloadUrl}
          className="w-full h-[70vh] rounded-lg"
          title={fileName}
        />
      );
    }

    // Unsupported file type
    return (
      <div className="p-8 flex flex-col items-center gap-4 text-center">
        <FileIcon className="w-16 h-16 text-gray-400" />
        <p className="text-lg font-medium text-gray-900">{fileName}</p>
        <p className="text-gray-500">
          Preview not available for this file type.
        </p>
        <a
          href={downloadUrl}
          download={fileName}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Download File
        </a>
      </div>
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" title={fileName}>
      <div className="min-h-[300px]">{renderContent()}</div>
    </Modal>
  );
}
