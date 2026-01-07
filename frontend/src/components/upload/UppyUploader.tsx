"use client";

import { useEffect, useRef } from "react";
import Uppy from "@uppy/core";
import Dashboard from "@uppy/dashboard";
import AwsS3Multipart from "@uppy/aws-s3-multipart";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";

import api from "@/lib/api";
import { useUploadStore } from "@/store/uploadStore";
import { useFileStore } from "@/store/fileStore";
import { MAX_FILE_SIZE } from "@/lib/constants";

interface UppyUploaderProps {
  folderId?: string | null;
  onComplete?: () => void;
}

// Define types for file metadata
interface FileMeta {
  uploadId?: string;
  key?: string;
  partUrls?: string[];
  partSize?: number;
  [key: string]: any;
}

// Define types for the multipart upload functions
interface MultipartUploadData {
  uploadId: string;
  key: string;
}

interface PartData {
  uploadId: string;
  key: string;
  partNumber: number;
}

interface CompleteMultipartUploadParams {
  uploadId: string;
  key: string;
  parts: Array<{
    ETag: string;
    PartNumber: number;
  }>;
}

interface AbortMultipartUploadParams {
  uploadId: string;
  key: string;
}

export function UppyUploader({
  folderId = null,
  onComplete,
}: UppyUploaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const uppyRef = useRef<Uppy<FileMeta> | null>(null);
  const router = useRouter();

  const { addUpload, updateProgress, setStatus } = useUploadStore();
  const { addFile } = useFileStore();

  // Initialize Uppy
  useEffect(() => {
    if (!containerRef.current || uppyRef.current) return;

    const uppy = new Uppy<FileMeta>({
      id: "file-uploader",
      autoProceed: false,
      allowMultipleUploadBatches: true,
      restrictions: {
        maxFileSize: MAX_FILE_SIZE,
        maxNumberOfFiles: 20,
        allowedFileTypes: null,
      },
    });

    // Configure Dashboard
    uppy.use(Dashboard, {
      target: containerRef.current,
      inline: true,
      height: 470,
      width: "100%",
      hideProgressDetails: false,
      showRemoveButtonAfterComplete: true,
      proudlyDisplayPoweredByUppy: false,
      note: "Upload files up to 5 GB each. Maximum 20 files at once.",
      theme: "light",
      hideUploadButton: false,
      hideRetryButton: false,
      hidePauseResumeButton: false,
      hideCancelButton: false,
      doneButtonHandler: () => {
        uppy.cancelAll();
        if (onComplete) {
          onComplete();
        } else {
          router.push(
            folderId ? `/dashboard/files/${folderId}` : "/dashboard/files"
          );
        }
      },
    });

    // Create a separate configuration object with proper typing
    const awsS3Config: any = {
      companionUrl: "",

      // Step 1: Create multipart upload and get presigned URLs
      createMultipartUpload: async (file: {
        name?: string;
        type?: string;
        size?: number;
        id: string;
      }) => {
        try {
          const response = await api.post("/upload/init", {
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            folderId: folderId,
          });

          const data = response.data.data;
          addUpload(file.id, file.name || "unknown", file.size || 0);

          uppy.setFileMeta(file.id, {
            uploadId: data.uploadId,
            key: data.key,
            partUrls: data.urls,
            partSize: data.partSize,
          });

          return {
            uploadId: data.uploadId,
            key: data.key,
          };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to initialize upload";
          toast.error(message);
          throw new Error(message);
        }
      },

      // Step 2: Get presigned URL for each part
      signPart: async (file: { meta?: FileMeta }, partData: PartData) => {
        const meta = file.meta;
        const partIndex = partData.partNumber - 1;

        if (meta?.partUrls && meta.partUrls[partIndex]) {
          return { url: meta.partUrls[partIndex] };
        }

        try {
          const response = await api.post("/upload/sign-part", {
            uploadId: partData.uploadId,
            key: partData.key,
            partNumber: partData.partNumber,
          });
          return { url: response.data.data.url };
        } catch (error: any) {
          throw new Error("Failed to get upload URL");
        }
      },

      // Step 3: Complete the multipart upload
      completeMultipartUpload: async (
        file: { name?: string; type?: string; size?: number; id: string },
        { uploadId, key, parts }: CompleteMultipartUploadParams
      ) => {
        try {
          setStatus(file.id, "processing");

          const response = await api.post("/upload/complete", {
            uploadId,
            key,
            parts: parts.map((part) => ({
              ETag: part.ETag,
              PartNumber: part.PartNumber,
            })),
            fileName: file.name,
            fileType: file.type || "application/octet-stream",
            fileSize: file.size,
            folderId: folderId,
          });

          const newFile = response.data.data;
          addFile(newFile);
          setStatus(file.id, "complete");

          return { location: key };
        } catch (error: any) {
          const message =
            error.response?.data?.message || "Failed to complete upload";
          setStatus(file.id, "error", message);
          throw new Error(message);
        }
      },

      // Handle abort
      abortMultipartUpload: async (
        file: any,
        { uploadId, key }: AbortMultipartUploadParams
      ) => {
        try {
          await api.post("/upload/abort", { uploadId, key });
        } catch (error) {
          console.error("Failed to abort upload:", error);
        }
      },

      // List uploaded parts (for resume functionality)
      listParts: async (
        file: any,
        { uploadId, key }: AbortMultipartUploadParams
      ) => {
        return [];
      },
    };

    // Use the plugin with a different approach
    // Cast the entire plugin to avoid TypeScript issues
    const plugin: any = AwsS3Multipart;
    (uppy as any).use(plugin, awsS3Config);

    // Event: Upload progress
    uppy.on("upload-progress", (file, progress) => {
      if (file && progress.bytesTotal) {
        const percentage = Math.round(
          (progress.bytesUploaded / progress.bytesTotal) * 100
        );
        updateProgress(file.id, percentage);
      }
    });

    // Event: File added
    uppy.on("file-added", (file) => {
      console.log("File added:", file.name);
    });

    // Event: Upload started
    uppy.on("upload", () => {
      toast.loading("Uploading files...", { id: "upload-toast" });
    });

    // Event: Single file upload success
    uppy.on("upload-success", (file, response) => {
      if (file) {
        console.log("Upload success:", file.name);
      }
    });

    // Event: Single file upload error
    uppy.on("upload-error", (file, error) => {
      if (file) {
        console.error("Upload error:", file.name, error);
        setStatus(file.id, "error", error.message);
        toast.error(`Failed to upload ${file.name}`);
      }
    });

    // Event: All uploads complete
    uppy.on("complete", (result) => {
      toast.dismiss("upload-toast");

      const successCount = result.successful?.length || 0;
      const failedCount = result.failed?.length || 0;

      if (successCount > 0 && failedCount === 0) {
        toast.success(`Successfully uploaded ${successCount} file(s)`);
      } else if (successCount > 0 && failedCount > 0) {
        toast.success(
          `Uploaded ${successCount} file(s), ${failedCount} failed`
        );
      } else if (failedCount > 0) {
        toast.error(`Failed to upload ${failedCount} file(s)`);
      }
    });

    // Event: Upload cancelled
    uppy.on("cancel-all", () => {
      toast.dismiss("upload-toast");
    });

    uppyRef.current = uppy;

    // Cleanup
    return () => {
      if (uppyRef.current) {
        uppyRef.current.cancelAll();
        uppyRef.current = null;
      }
    };
  }, [
    folderId,
    addUpload,
    updateProgress,
    setStatus,
    addFile,
    router,
    onComplete,
  ]);

  return (
    <div className="uppy-wrapper">
      <div ref={containerRef} />

      {/* Custom styles for Uppy */}
      <style>{`
        .uppy-wrapper {
          width: 100%;
        }

        .uppy-Dashboard-inner {
          border: 2px dashed #e5e7eb !important;
          border-radius: 12px !important;
          background: #fafafa !important;
        }

        .uppy-Dashboard-innerWrap {
          border-radius: 10px !important;
        }

        .uppy-Dashboard-AddFiles {
          border: none !important;
        }

        .uppy-Dashboard-AddFiles-title {
          color: #374151 !important;
          font-size: 1.1rem !important;
        }

        .uppy-Dashboard-AddFiles-info {
          color: #6b7280 !important;
        }

        .uppy-Dashboard-browse {
          color: #2563eb !important;
        }

        .uppy-Dashboard-browse:hover {
          color: #1d4ed8 !important;
        }

        .uppy-StatusBar-actionBtn--upload {
          background-color: #2563eb !important;
        }

        .uppy-StatusBar-actionBtn--upload:hover {
          background-color: #1d4ed8 !important;
        }

        .uppy-DashboardContent-back,
        .uppy-DashboardContent-addMore {
          color: #2563eb !important;
        }

        .uppy-Dashboard-Item-action--remove {
          color: #ef4444 !important;
        }

        .uppy-StatusBar.is-complete .uppy-StatusBar-progress {
          background-color: #10b981 !important;
        }

        .uppy-StatusBar.is-error .uppy-StatusBar-progress {
          background-color: #ef4444 !important;
        }

        .uppy-StatusBar-progress {
          background-color: #2563eb !important;
        }

        .uppy-Dashboard-note {
          color: #6b7280 !important;
          font-size: 0.875rem !important;
        }

        .uppy-DashboardTab-btn {
          border-radius: 8px !important;
        }

        .uppy-DashboardTab-btn:hover {
          background-color: #f3f4f6 !important;
        }

        .uppy-Dashboard-Item {
          border-radius: 8px !important;
        }

        .uppy-Dashboard-Item-preview {
          border-radius: 6px !important;
        }
      `}</style>
    </div>
  );
}
