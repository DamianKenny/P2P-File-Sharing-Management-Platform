import { v4 as uuidv4 } from 'uuid';

// unique file key for s3 storage
export function generateS3Key(userId: string, originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = uuidv4();
  const sanitizedName = sanitizeFileName(originalName);
  
  return `${userId}/${year}/${month}/${uuid}-${sanitizedName}`;
}

export function sanitizeFileName(fileName: string): string {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .substring(0, 100);
}

export function calculatePartSize(fileSize: number): {
  partSize: number;
  totalParts: number;
} {
  const MIN_PART_SIZE = 5 * 1024 * 1024; // 5MB
  const MAX_PARTS = 10000;

  let partSize = MIN_PART_SIZE;
  let totalParts = Math.ceil(fileSize / partSize);

  while (totalParts > MAX_PARTS) {
    partSize *= 2;
    totalParts = Math.ceil(fileSize / partSize);
  }

  return { partSize, totalParts };
}


export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

//generate secure share token
export function generateShareToken(): string {
  return uuidv4().replace(/-/g, '') + uuidv4().replace(/-/g, '');
}

//validate materialized path format
export function isValidPath(path: string): boolean {
  if (path === '/') return true;
  return /^(\/[a-zA-Z0-9_-]+)+$/.test(path);
}

export function getParentPath(path: string): string {
  if (path === '/' || !path.includes('/')) return '/';
  return path.substring(0, path.lastIndexOf('/')) || '/';
}

export function calculateDepth(path: string): number {
  if (path === '/') return 0;
  return path.split('/').filter(Boolean).length;
}