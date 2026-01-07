import {
  CreateMultipartUploadCommand,
  UploadPartCommand,
  CompleteMultipartUploadCommand,
  AbortMultipartUploadCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client, BUCKET_NAME } from '../config/supabase.js';
import { generateS3Key, calculatePartSize } from '../utils/helpers.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

interface InitUploadResult {
  uploadId: string;
  key: string;
  urls: string[];
  partSize: number;
  totalParts: number;
}

interface CompletedPart {
  ETag: string;
  PartNumber: number;
}

/**
 * Storage Service
 * Handles all S3/Supabase storage operations
 */
export class StorageService {
  /**
   * Initialize a multipart upload
   * Returns presigned URLs for each part
   */
  static async initializeMultipartUpload(
    userId: string,
    fileName: string,
    fileSize: number,
    mimeType: string
  ): Promise<InitUploadResult> {
    const key = generateS3Key(userId, fileName);
    const { partSize, totalParts } = calculatePartSize(fileSize);

    logger.info(`Initializing multipart upload: ${key}, ${totalParts} parts`);

    try {
      const createCommand = new CreateMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        ContentType: mimeType,
      });

      const { UploadId } = await s3Client.send(createCommand);

      if (!UploadId) {
        throw ApiError.internal('Failed to initialize upload');
      }

      // Generate presigned URLs for each part
      const urls: string[] = [];
      
      for (let partNumber = 1; partNumber <= totalParts; partNumber++) {
        const uploadPartCommand = new UploadPartCommand({
          Bucket: BUCKET_NAME,
          Key: key,
          UploadId,
          PartNumber: partNumber,
        });

        const presignedUrl = await getSignedUrl(s3Client, uploadPartCommand, {
          expiresIn: 3600, // 1 hour
        });

        urls.push(presignedUrl);
      }

      logger.info(`Multipart upload initialized: ${UploadId}`);

      return {
        uploadId: UploadId,
        key,
        urls,
        partSize,
        totalParts,
      };
    } catch (error) {
      logger.error('Failed to initialize multipart upload:', error);
      throw ApiError.internal('Failed to initialize upload');
    }
  }

  /**
   * Get presigned URL for a specific part (fallback)
   */
  static async getPartUploadUrl(
    key: string,
    uploadId: string,
    partNumber: number
  ): Promise<string> {
    try {
      const uploadPartCommand = new UploadPartCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const presignedUrl = await getSignedUrl(s3Client, uploadPartCommand, {
        expiresIn: 3600,
      });

      return presignedUrl;
    } catch (error) {
      logger.error('Failed to get part upload URL:', error);
      throw ApiError.internal('Failed to get upload URL');
    }
  }

  /**
   * Complete a multipart upload
   */
  static async completeMultipartUpload(
    key: string,
    uploadId: string,
    parts: CompletedPart[]
  ): Promise<void> {
    try {
      const sortedParts = parts.sort((a, b) => a.PartNumber - b.PartNumber);

      const completeCommand = new CompleteMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
        MultipartUpload: {
          Parts: sortedParts,
        },
      });

      await s3Client.send(completeCommand);
      logger.info(`Multipart upload completed: ${key}`);
    } catch (error) {
      logger.error('Failed to complete multipart upload:', error);
      await this.abortMultipartUpload(key, uploadId).catch(() => {});
      throw ApiError.internal('Failed to complete upload');
    }
  }

  /**
   * Abort a multipart upload
   */
  static async abortMultipartUpload(
    key: string,
    uploadId: string
  ): Promise<void> {
    try {
      const abortCommand = new AbortMultipartUploadCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        UploadId: uploadId,
      });

      await s3Client.send(abortCommand);
      logger.info(`Multipart upload aborted: ${key}`);
    } catch (error) {
      logger.error('Failed to abort multipart upload:', error);
    }
  }

  /**
   * Delete a file from storage
   */
  static async deleteFile(key: string): Promise<void> {
    try {
      const deleteCommand = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(deleteCommand);
      logger.info(`File deleted from storage: ${key}`);
    } catch (error) {
      logger.error('Failed to delete file:', error);
      throw ApiError.internal('Failed to delete file');
    }
  }

  /**
   * Get a presigned URL for downloading a file
   */
  static async getDownloadUrl(
    key: string,
    expiresIn = 3600
  ): Promise<string> {
    try {
      const getCommand = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const url = await getSignedUrl(s3Client, getCommand, { expiresIn });
      return url;
    } catch (error) {
      logger.error('Failed to generate download URL:', error);
      throw ApiError.internal('Failed to generate download URL');
    }
  }

  /**
   * Check if a file exists in storage
   */
  static async fileExists(key: string): Promise<boolean> {
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      await s3Client.send(headCommand);
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Get file metadata from storage
   */
  static async getFileMetadata(key: string): Promise<{
    size: number;
    contentType: string;
    lastModified: Date;
  } | null> {
    try {
      const headCommand = new HeadObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
      });

      const response = await s3Client.send(headCommand);
      
      return {
        size: response.ContentLength || 0,
        contentType: response.ContentType || 'application/octet-stream',
        lastModified: response.LastModified || new Date(),
      };
    } catch (error) {
      return null;
    }
  }
}