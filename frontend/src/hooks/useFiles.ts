'use client';

import { useEffect, useCallback } from 'react';
import { useFileStore } from '@/store/fileStore';
import toast from 'react-hot-toast';
import { copyToClipboard, downloadFile } from '@/lib/utils';

//file operatiosn hook
export function useFiles(folderId: string | null = null) {
  const store = useFileStore();

  // Fetch contents on mount or folder change
  useEffect(() => {
    store.fetchFolderContents(folderId);
  }, [folderId]);

  const handleCreateFolder = useCallback(async (name: string) => {
    try {
      await store.createFolder(name, folderId);
      toast.success('Folder created');
    } catch (error) {
      toast.error('Failed to create folder');
      throw error;
    }
  }, [folderId, store]);

  const handleDeleteFolder = useCallback(async (id: string) => {
    try {
      await store.deleteFolder(id);
      toast.success('Folder deleted');
    } catch (error) {
      toast.error('Failed to delete folder');
      throw error;
    }
  }, [store]);

  const handleRenameFolder = useCallback(async (id: string, newName: string) => {
    try {
      await store.renameFolder(id, newName);
      toast.success('Folder renamed');
    } catch (error) {
      toast.error('Failed to rename folder');
      throw error;
    }
  }, [store]);

  const handleDeleteFile = useCallback(async (id: string) => {
    try {
      await store.deleteFile(id);
      toast.success('File deleted');
    } catch (error) {
      toast.error('Failed to delete file');
      throw error;
    }
  }, [store]);

  const handleRenameFile = useCallback(async (id: string, newName: string) => {
    try {
      await store.renameFile(id, newName);
      toast.success('File renamed');
    } catch (error) {
      toast.error('Failed to rename file');
      throw error;
    }
  }, [store]);

  const handleDownloadFile = useCallback(async (id: string, fileName: string) => {
    try {
      const url = await store.getDownloadUrl(id);
      downloadFile(url, fileName);
      toast.success('Download started');
    } catch (error) {
      toast.error('Failed to download file');
      throw error;
    }
  }, [store]);

  const handleShareFile = useCallback(async (id: string, expiresIn?: number) => {
    try {
      const result = await store.shareFile(id, expiresIn);
      const fullUrl = `${window.location.origin}/shared/${result.shareToken}`;
      await copyToClipboard(fullUrl);
      toast.success('Share link copied to clipboard');
      return result;
    } catch (error) {
      toast.error('Failed to share file');
      throw error;
    }
  }, [store]);

  const handleUnshareFile = useCallback(async (id: string) => {
    try {
      await store.unshareFile(id);
      toast.success('File sharing disabled');
    } catch (error) {
      toast.error('Failed to unshare file');
      throw error;
    }
  }, [store]);

  const refresh = useCallback(() => {
    store.fetchFolderContents(folderId);
  }, [folderId, store]);

  return {
    files: store.files,
    folders: store.folders,
    currentFolder: store.currentFolder,
    breadcrumb: store.breadcrumb,
    isLoading: store.isLoading,
    error: store.error,
    selectedFiles: store.selectedFiles,
    viewMode: store.viewMode,
    
    // Actions
    createFolder: handleCreateFolder,
    deleteFolder: handleDeleteFolder,
    renameFolder: handleRenameFolder,
    deleteFile: handleDeleteFile,
    renameFile: handleRenameFile,
    downloadFile: handleDownloadFile,
    shareFile: handleShareFile,
    unshareFile: handleUnshareFile,
    moveFile: store.moveFile,
    toggleSelection: store.toggleFileSelection,
    selectAll: store.selectAllFiles,
    clearSelection: store.clearSelection,
    setViewMode: store.setViewMode,
    refresh,
  };
}