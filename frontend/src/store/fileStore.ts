import { create } from 'zustand';
import api, { apiHelpers } from '@/lib/api';
import type { FileItem, Folder, FolderContents } from '@/types';

interface FileState {
  files: FileItem[];
  folders: Folder[];
  currentFolder: Folder | null;
  breadcrumb: Folder[];
  isLoading: boolean;
  error: string | null;
  selectedFiles: Set<string>;
  viewMode: 'grid' | 'list';

  // Actions
  fetchFolderContents: (folderId: string | null) => Promise<void>;
  fetchBreadcrumb: (folderId: string) => Promise<void>;
  createFolder: (name: string, parentId: string | null) => Promise<Folder>;
  deleteFolder: (folderId: string) => Promise<void>;
  renameFolder: (folderId: string, newName: string) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  renameFile: (fileId: string, newName: string) => Promise<void>;
  moveFile: (fileId: string, folderId: string | null) => Promise<void>;
  shareFile: (fileId: string, expiresIn?: number) => Promise<{ shareToken: string; shareUrl: string }>;
  unshareFile: (fileId: string) => Promise<void>;
  getDownloadUrl: (fileId: string) => Promise<string>;
  toggleFileSelection: (fileId: string) => void;
  selectAllFiles: () => void;
  clearSelection: () => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  addFile: (file: FileItem) => void;
  setError: (error: string | null) => void;
}

export const useFileStore = create<FileState>((set, get) => ({
  files: [],
  folders: [],
  currentFolder: null,
  breadcrumb: [],
  isLoading: false,
  error: null,
  selectedFiles: new Set(),
  viewMode: 'grid',

  fetchFolderContents: async (folderId) => {
    set({ isLoading: true, error: null });
    try {
      const folderParam = folderId || 'root';
      const response = await api.get(`/folders/${folderParam}/contents`);
      const { folders, files } = response.data.data as FolderContents;

      // If we have a folderId, fetch the folder details
      let currentFolder = null;
      if (folderId) {
        const folderResponse = await api.get(`/folders/${folderId}`);
        currentFolder = folderResponse.data.data;
      }

      set({
        files,
        folders,
        currentFolder,
        isLoading: false,
      });

      // Fetch breadcrumb if in a folder
      if (folderId) {
        get().fetchBreadcrumb(folderId);
      } else {
        set({ breadcrumb: [] });
      }
    } catch (error) {
      set({
        error: apiHelpers.getErrorMessage(error),
        isLoading: false,
      });
    }
  },

  fetchBreadcrumb: async (folderId) => {
    try {
      const response = await api.get(`/folders/${folderId}/breadcrumb`);
      set({ breadcrumb: response.data.data });
    } catch (error) {
      console.error('Failed to fetch breadcrumb:', error);
    }
  },

  createFolder: async (name, parentId) => {
    const response = await api.post('/folders', { name, parentId });
    const newFolder = response.data.data;

    set((state) => ({
      folders: [...state.folders, newFolder],
    }));

    return newFolder;
  },

  deleteFolder: async (folderId) => {
    await api.delete(`/folders/${folderId}`);
    set((state) => ({
      folders: state.folders.filter((f) => f._id !== folderId),
    }));
  },

  renameFolder: async (folderId, newName) => {
    const response = await api.patch(`/folders/${folderId}`, { name: newName });
    const updatedFolder = response.data.data;

    set((state) => ({
      folders: state.folders.map((f) =>
        f._id === folderId ? updatedFolder : f
      ),
    }));
  },

  deleteFile: async (fileId) => {
    await api.delete(`/files/${fileId}`);
    set((state) => ({
      files: state.files.filter((f) => f._id !== fileId),
      selectedFiles: new Set(
        Array.from(state.selectedFiles).filter((id) => id !== fileId)
      ),
    }));
  },

  renameFile: async (fileId, newName) => {
    const response = await api.patch(`/files/${fileId}`, { name: newName });
    const updatedFile = response.data.data;

    set((state) => ({
      files: state.files.map((f) =>
        f._id === fileId ? updatedFile : f
      ),
    }));
  },

  moveFile: async (fileId, folderId) => {
    const response = await api.patch(`/files/${fileId}`, { folderId });
    const updatedFile = response.data.data;

    // If moving to a different folder, remove from current view
    const currentFolderId = get().currentFolder?._id || null;
    if (folderId !== currentFolderId) {
      set((state) => ({
        files: state.files.filter((f) => f._id !== fileId),
      }));
    } else {
      set((state) => ({
        files: state.files.map((f) =>
          f._id === fileId ? updatedFile : f
        ),
      }));
    }
  },

  shareFile: async (fileId, expiresIn) => {
    const response = await api.post(`/files/${fileId}/share`, { expiresIn });
    const { shareToken, shareUrl } = response.data.data;

    set((state) => ({
      files: state.files.map((f) =>
        f._id === fileId
          ? { ...f, isPublic: true, shareToken }
          : f
      ),
    }));

    return { shareToken, shareUrl };
  },

  unshareFile: async (fileId) => {
    await api.delete(`/files/${fileId}/share`);

    set((state) => ({
      files: state.files.map((f) =>
        f._id === fileId
          ? { ...f, isPublic: false, shareToken: undefined }
          : f
      ),
    }));
  },

  getDownloadUrl: async (fileId) => {
    const response = await api.get(`/files/${fileId}/download`);
    return response.data.data.downloadUrl;
  },

  toggleFileSelection: (fileId) => {
    set((state) => {
      const newSelection = new Set(state.selectedFiles);
      if (newSelection.has(fileId)) {
        newSelection.delete(fileId);
      } else {
        newSelection.add(fileId);
      }
      return { selectedFiles: newSelection };
    });
  },

  selectAllFiles: () => {
    set((state) => ({
      selectedFiles: new Set(state.files.map((f) => f._id)),
    }));
  },

  clearSelection: () => {
    set({ selectedFiles: new Set() });
  },

  setViewMode: (mode) => {
    set({ viewMode: mode });
  },

  addFile: (file) => {
    set((state) => ({
      files: [file, ...state.files],
    }));
  },

  setError: (error) => {
    set({ error });
  },
}));