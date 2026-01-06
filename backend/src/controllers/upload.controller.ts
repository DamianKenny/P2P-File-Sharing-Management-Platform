import { Request, Response, NextFunction } from 'express';
import { StorageService } from '../services/storage.services.js';
import { FileService } from '../services/file.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//upload controller
export class UploadController {
  //POST upload/init
  static async initializeUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileName, fileType, fileSize } = req.body;

      const result = await StorageService.initializeMultipartUpload(
        userId,
        fileName,
        fileSize,
        fileType
      );

      res.json(
        ApiResponse.success(result, 'Upload initialized').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //POST /upload/complete
  static async completeUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { uploadId, key, parts, fileName, fileType, fileSize, folderId } = req.body;

      // Complete the multipart upload in S3
      await StorageService.completeMultipartUpload(key, uploadId, parts);

      // Save file metadata to database
      const file = await FileService.createFile({
        name: fileName,
        originalName: fileName,
        mimeType: fileType,
        size: fileSize,
        s3Key: key,
        ownerId: userId,
        folderId: folderId || null,
      });

      res.status(201).json(
        ApiResponse.created(file, 'Upload completed').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  // POST /upload/abort
  static async abortUpload(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uploadId, key } = req.body;

      await StorageService.abortMultipartUpload(key, uploadId);

      res.json(
        ApiResponse.success(null, 'Upload aborted').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }
}