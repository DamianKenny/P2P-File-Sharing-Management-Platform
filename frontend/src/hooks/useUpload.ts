'use client';

import { useCallback } from 'react';
import { useUploadStore } from '@/store/uploadStore';
import { useFileStore } from '@/store/fileStore';

//upload state and operations hook
export function useUpload() {
  const uploadStore = useUploadStore();
  const fileStore = useFileStore();

  const handleUploadComplete = useCallback((fileData: any) => {
    fileStore.addFile(fileData);
  }, [fileStore]);

  return {
    uploads: uploadStore.getUploadList(),
    isUploading: uploadStore.isUploading,
    addUpload: uploadStore.addUpload,
    updateProgress: uploadStore.updateProgress,
    setStatus: uploadStore.setStatus,
    removeUpload: uploadStore.removeUpload,
    clearCompleted: uploadStore.clearCompleted,
    onUploadComplete: handleUploadComplete,
  };
}