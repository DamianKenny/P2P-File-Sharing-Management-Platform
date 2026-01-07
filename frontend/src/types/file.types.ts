export interface FileItem {
  id: string;
  _id: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  folderId: string | null;
  ownerId: string;
  isPublic: boolean;
  shareToken?: string;
  shareExpiresAt?: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
  formattedSize?: string;
}

export interface FileUploadProgress {
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'complete' | 'error';
  error?: string;
}

export interface ShareInfo {
  shareToken: string;
  shareUrl: string;
}