"use client";

import { useState } from "react";
import { Plus, Upload } from "lucide-react";
import Link from "next/link";
import { useFiles } from "@/hooks/useFiles";
import { FileList } from "@/components/files/FileList";
import { FolderBreadcrumb } from "@/components/files/FolderBreadcrumb";
import { CreateFolderModal } from "@/components/files/CreateFolderModal";
import { Button } from "@/components/ui/Button";

export default function FilesPage() {
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  const {
    files,
    folders,
    currentFolder,
    breadcrumb,
    isLoading,
    selectedFiles,
    viewMode,
    createFolder,
    deleteFolder,
    renameFolder,
    deleteFile,
    renameFile,
    downloadFile,
    shareFile,
    unshareFile,
    toggleSelection,
    selectAll,
    clearSelection,
    setViewMode,
  } = useFiles(null); // null = root folder

  const handleGetDownloadUrl = async (fileId: string) => {
    const { getDownloadUrl } = await import("@/store/fileStore").then((m) =>
      m.useFileStore.getState()
    );
    return getDownloadUrl(fileId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Files</h1>
          <div className="mt-2">
            <FolderBreadcrumb
              breadcrumb={breadcrumb}
              currentFolder={currentFolder}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setShowCreateFolder(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Folder
          </Button>
          <Link href="/dashboard/upload">
            <Button leftIcon={<Upload className="w-4 h-4" />}>Upload</Button>
          </Link>
        </div>
      </div>

      {/* File List */}
      <FileList
        files={files}
        folders={folders}
        isLoading={isLoading}
        viewMode={viewMode}
        selectedFiles={selectedFiles}
        onViewModeChange={setViewMode}
        onToggleSelection={toggleSelection}
        onSelectAll={selectAll}
        onClearSelection={clearSelection}
        onDownloadFile={downloadFile}
        onShareFile={shareFile}
        onUnshareFile={unshareFile}
        onRenameFile={renameFile}
        onDeleteFile={deleteFile}
        onRenameFolder={renameFolder}
        onDeleteFolder={deleteFolder}
        onGetDownloadUrl={handleGetDownloadUrl}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={showCreateFolder}
        onClose={() => setShowCreateFolder(false)}
        onCreate={createFolder}
      />
    </div>
  );
}
