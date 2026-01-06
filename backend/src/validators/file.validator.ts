import { z } from 'zod';

export const fileIdSchema = z.object({
  fileId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid file ID'),
});

export const updateFileSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  folderId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
});

export const shareFileSchema = z.object({
  expiresIn: z.number().int().positive().optional(), // hours
});

export const listFilesSchema = z.object({
  folderId: z.string().regex(/^[a-f\d]{24}$/i).optional().nullable(),
  page: z.string().transform(Number).default('1'),
  limit: z.string().transform(Number).default('20'),
});