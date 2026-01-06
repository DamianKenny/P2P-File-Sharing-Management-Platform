import { z } from 'zod';

export const createFolderSchema = z.object({
  name: z
    .string()
    .min(1, 'Folder name is required')
    .max(100, 'Folder name too long')
    .refine((name) => !name.includes('/'), 'Folder name cannot contain /'),
  parentId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid parent ID').optional().nullable(),
});

export const folderIdSchema = z.object({
  folderId: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid folder ID'),
});

export const updateFolderSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(100)
    .refine((name) => !name.includes('/'), 'Folder name cannot contain /')
    .optional(),
});

export type CreateFolderInput = z.infer<typeof createFolderSchema>;