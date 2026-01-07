import { create } from 'zustand';

export interface UploadItem {
  id: string;
  fileName: string;
  fileSize: number;
  progress: number;
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

interface UploadState {
  uploads: Map<string, UploadItem>;
  isUploading: boolean;

  // Actions
  addUpload: (id: string, fileName: string, fileSize: number) => void;
  updateProgress: (id: string, progress: number) => void;
  setStatus: (id: string, status: UploadItem['status'], error?: string) => void;
  removeUpload: (id: string) => void;
  clearCompleted: () => void;
  getUploadList: () => UploadItem[];
}

export const useUploadStore = create<UploadState>((set, get) => ({
  uploads: new Map(),
  isUploading: false,

  addUpload: (id, fileName, fileSize) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      newUploads.set(id, {
        id,
        fileName,
        fileSize,
        progress: 0,
        status: 'pending',
      });
      return { uploads: newUploads, isUploading: true };
    });
  },

  updateProgress: (id, progress) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      const upload = newUploads.get(id);
      if (upload) {
        newUploads.set(id, { ...upload, progress, status: 'uploading' });
      }
      return { uploads: newUploads };
    });
  },

  setStatus: (id, status, error) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      const upload = newUploads.get(id);
      if (upload) {
        newUploads.set(id, {
          ...upload,
          status,
          error,
          progress: status === 'complete' ? 100 : upload.progress,
        });
      }

      // Check if any uploads are still in progress
      const isUploading = Array.from(newUploads.values()).some(
        (u) => u.status === 'uploading' || u.status === 'pending' || u.status === 'processing'
      );

      return { uploads: newUploads, isUploading };
    });
  },

  removeUpload: (id) => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      newUploads.delete(id);

      const isUploading = Array.from(newUploads.values()).some(
        (u) => u.status === 'uploading' || u.status === 'pending'
      );

      return { uploads: newUploads, isUploading };
    });
  },

  clearCompleted: () => {
    set((state) => {
      const newUploads = new Map(state.uploads);
      for (const [id, upload] of newUploads) {
        if (upload.status === 'complete' || upload.status === 'error') {
          newUploads.delete(id);
        }
      }
      return { uploads: newUploads };
    });
  },

  getUploadList: () => {
    return Array.from(get().uploads.values());
  },
}));