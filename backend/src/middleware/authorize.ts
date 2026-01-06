import { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import { Folder } from '../models/Folder.model.js';
import { File } from '../models/File.model.js';
import { ApiError } from '../utils/ApiError.js';
import { formatBytes } from '../utils/helpers.js';

/**
 * Check if user owns the folder
 */
export function authorizeFolder(paramName = 'folderId') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const folderId = req.params[paramName] || req.body[paramName];
      
      if (!folderId) {
        return next();
      }

      if (!Types.ObjectId.isValid(folderId)) {
        throw ApiError.badRequest('Invalid folder ID format');
      }

      const folder = await Folder.findById(folderId);

      if (!folder) {
        throw ApiError.notFound('Folder not found');
      }

      if (folder.ownerId.toString() !== req.user!._id.toString()) {
        throw ApiError.forbidden('You do not have access to this folder');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function authorizeFile(paramName = 'fileId') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const fileId = req.params[paramName] || req.body[paramName];

      if (!fileId) {
        throw ApiError.badRequest('File ID is required');
      }

      if (!Types.ObjectId.isValid(fileId)) {
        throw ApiError.badRequest('Invalid file ID format');
      }

      const file = await File.findById(fileId);

      if (!file) {
        throw ApiError.notFound('File not found');
      }

      if (file.ownerId.toString() !== req.user!._id.toString()) {
        throw ApiError.forbidden('You do not have access to this file');
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function checkStorageQuota(sizeParam = 'fileSize') {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    try {
      const fileSize = req.body[sizeParam];

      if (!fileSize || typeof fileSize !== 'number') {
        throw ApiError.badRequest('File size is required');
      }

      const user = req.user!;
      const newTotal = user.storageUsed + fileSize;

      if (newTotal > user.storageLimit) {
        const remaining = user.storageLimit - user.storageUsed;
        throw ApiError.forbidden(
          `Storage quota exceeded. You have ${formatBytes(remaining)} remaining.`
        );
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}