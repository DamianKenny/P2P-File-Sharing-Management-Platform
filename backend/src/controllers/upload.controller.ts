import { Request, Response, NextFunction } from 'express';
import { StorageService } from '../services/storage.services.js';
import { FileService } from '../services/file.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * Upload Controller
 * Handles file upload operations (presigned URLs, multipart upload)
 */
export class UploadController {
  /**
   * POST /upload/init
   * Initialize a multipart upload and get presigned URLs
   */
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

  /**
   * POST /upload/sign-part
   * Get presigned URL for a specific part (fallback if init URLs expire)
   */
  static async signPart(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { uploadId, key, partNumber } = req.body;

      if (!uploadId || !key || !partNumber) {
        throw ApiError.badRequest('uploadId, key, and partNumber are required');
      }

      const url = await StorageService.getPartUploadUrl(
        key,
        uploadId,
        partNumber
      );

      res.json(
        ApiResponse.success({ url }, 'Part URL generated').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /upload/complete
   * Complete a multipart upload and save file metadata
   */
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

  /**
   * POST /upload/abort
   * Abort a multipart upload
   */
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