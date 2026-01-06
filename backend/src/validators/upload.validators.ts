import { z } from 'zod';

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain', 'text/csv', 'application/json',
  'application/zip', 'application/x-rar-compressed',
  'audio/mpeg', 'audio/wav',
  'video/mp4', 'video/webm',
];

const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5GB

export const initUploadSchema = z.object({
  fileName: z
    .string()
    .min(1, 'File name is required')
    .max(255, 'File name too long'),
  fileType: z
    .string()
    .refine((type) => ALLOWED_MIME_TYPES.includes(type), 'File type not allowed'),
  fileSize: z
    .number()
    .positive('File size must be positive')
    .max(MAX_FILE_SIZE, 'File size exceeds 5GB limit'),
  folderId: z
    .string()
    .regex(/^[a-f\d]{24}$/i, 'Invalid folder ID')
    .optional()
    .nullable(),
});

export const completeUploadSchema = z.object({
  uploadId: z.string().min(1, 'Upload ID is required'),
  key: z.string().min(1, 'Key is required'),
  parts: z.array(z.object({
    ETag: z.string(),
    PartNumber: z.number().int().positive(),
  })),
  fileName: z.string().min(1),
  fileType: z.string(),
  fileSize: z.number().positive(),
  folderId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
});

export type InitUploadInput = z.infer<typeof initUploadSchema>;
export type CompleteUploadInput = z.infer<typeof completeUploadSchema>;