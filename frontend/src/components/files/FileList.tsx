"use client";

import { useState } from "react";
import { FileItem, Folder } from "@/types";
import { FileCard } from "./FileCard";
import { FolderCard } from "./FolderCard";
import { EmptyState } from "./EmptyState";
import { RenameModal } from "./RenameModal";
import { DeleteConfirmModal } from "./DeleteConfirmModal";
import { ShareModal } from "./ShareModal";
import { FilePreviewModal } from "@/components/upload/FilePreview";
import { Grid, List, CheckSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface FileListProps {
  files: FileItem[];
  folders: Folder[];
  isLoading: boolean;
  viewMode: "grid" | "list";
  selectedFiles: Set<string>;
  onViewModeChange: (mode: "grid" | "list") => void;
  onToggleSelection: (fileId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onDownloadFile: (fileId: string, fileName: string) => void;
  onShareFile: (fileId: string) => Promise<any>;
  onUnshareFile: (fileId: string) => Promise<void>;
  onRenameFile: (fileId: string, newName: string) => Promise<void>;
  onDeleteFile: (fileId: string) => Promise<void>;
  onRenameFolder: (folderId: string, newName: string) => Promise<void>;
  onDeleteFolder: (folderId: string) => Promise<void>;
  onGetDownloadUrl: (fileId: string) => Promise<string>;
}

export function FileList({
  files,
  folders,
  isLoading,
  viewMode,
  selectedFiles,
  onViewModeChange,
  onToggleSelection,
  onSelectAll,
  onClearSelection,
  onDownloadFile,
  onShareFile,
  onUnshareFile,
  onRenameFile,
  onDeleteFile,
  onRenameFolder,
  onDeleteFolder,
  onGetDownloadUrl,
}: FileListProps) {
  // Modal states
  const [renameModal, setRenameModal] = useState<{
    isOpen: boolean;
    type: "file" | "folder";
    id: string;
    currentName: string;
  }>({ isOpen: false, type: "file", id: "", currentName: "" });

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: "file" | "folder";
    id: string;
    name: string;
  }>({ isOpen: false, type: "file", id: "", name: "" });

  const [shareModal, setShareModal] = useState<{
    isOpen: boolean;
    file: FileItem | null;
  }>({ isOpen: false, file: null });

  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    file: FileItem | null;
    downloadUrl: string;
  }>({ isOpen: false, file: null, downloadUrl: "" });

  // Handlers
  const handlePreview = async (file: FileItem) => {
    try {
      const downloadUrl = await onGetDownloadUrl(file._id);
      setPreviewModal({ isOpen: true, file, downloadUrl });
    } catch (error) {
      console.error("Failed to get preview URL:", error);
    }
  };

  const handleRename = async (newName: string) => {
    if (renameModal.type === "file") {
      await onRenameFile(renameModal.id, newName);
    } else {
      await onRenameFolder(renameModal.id, newName);
    }
    setRenameModal({ isOpen: false, type: "file", id: "", currentName: "" });
  };

  const handleDelete = async () => {
    if (deleteModal.type === "file") {
      await onDeleteFile(deleteModal.id);
    } else {
      await onDeleteFolder(deleteModal.id);
    }
    setDeleteModal({ isOpen: false, type: "file", id: "", name: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (folders.length === 0 && files.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {selectedFiles.size > 0 ? (
            <>
              <span className="text-sm text-gray-600">
                {selectedFiles.size} selected
              </span>
              <Button variant="ghost" size="sm" onClick={onClearSelection}>
                Clear
              </Button>
            </>
          ) : (
            <span className="text-sm text-gray-600">
              {folders.length} folder(s), {files.length} file(s)
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {files.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={
                selectedFiles.size === files.length
                  ? onClearSelection
                  : onSelectAll
              }
              leftIcon={<CheckSquare className="w-4 h-4" />}
            >
              {selectedFiles.size === files.length
                ? "Deselect All"
                : "Select All"}
            </Button>
          )}

          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={() => onViewModeChange("grid")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "grid"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => onViewModeChange("list")}
              className={cn(
                "p-2 transition-colors",
                viewMode === "list"
                  ? "bg-primary-50 text-primary-600"
                  : "text-gray-500 hover:bg-gray-50"
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
            : "bg-white border border-gray-200 rounded-xl overflow-hidden"
        )}
      >
        {/* Folders first */}
        {folders.map((folder) => (
          <FolderCard
            key={folder._id}
            folder={folder}
            viewMode={viewMode}
            onRename={() =>
              setRenameModal({
                isOpen: true,
                type: "folder",
                id: folder._id,
                currentName: folder.name,
              })
            }
            onDelete={() =>
              setDeleteModal({
                isOpen: true,
                type: "folder",
                id: folder._id,
                name: folder.name,
              })
            }
          />
        ))}

        {/* Then files */}
        {files.map((file) => (
          <FileCard
            key={file._id}
            file={file}
            viewMode={viewMode}
            isSelected={selectedFiles.has(file._id)}
            onSelect={() => onToggleSelection(file._id)}
            onDownload={() => onDownloadFile(file._id, file.name)}
            onShare={() => setShareModal({ isOpen: true, file })}
            onRename={() =>
              setRenameModal({
                isOpen: true,
                type: "file",
                id: file._id,
                currentName: file.name,
              })
            }
            onDelete={() =>
              setDeleteModal({
                isOpen: true,
                type: "file",
                id: file._id,
                name: file.name,
              })
            }
            onPreview={() => handlePreview(file)}
          />
        ))}
      </div>

      {/* Modals */}
      <RenameModal
        isOpen={renameModal.isOpen}
        onClose={() =>
          setRenameModal({
            isOpen: false,
            type: "file",
            id: "",
            currentName: "",
          })
        }
        currentName={renameModal.currentName}
        itemType={renameModal.type}
        onRename={handleRename}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() =>
          setDeleteModal({ isOpen: false, type: "file", id: "", name: "" })
        }
        itemName={deleteModal.name}
        itemType={deleteModal.type}
        onConfirm={handleDelete}
      />

      {shareModal.file && (
        <ShareModal
          isOpen={shareModal.isOpen}
          onClose={() => setShareModal({ isOpen: false, file: null })}
          file={shareModal.file}
          onShare={() => onShareFile(shareModal.file!._id)}
          onUnshare={() => onUnshareFile(shareModal.file!._id)}
        />
      )}

      {previewModal.file && (
        <FilePreviewModal
          isOpen={previewModal.isOpen}
          onClose={() =>
            setPreviewModal({ isOpen: false, file: null, downloadUrl: "" })
          }
          fileName={previewModal.file.name}
          mimeType={previewModal.file.mimeType}
          downloadUrl={previewModal.downloadUrl}
        />
      )}
    </div>
  );
}
