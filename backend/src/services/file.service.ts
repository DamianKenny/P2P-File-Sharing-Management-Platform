import { Types } from 'mongoose';
import { File, IFile } from '../models/File.model.js';
import { User } from '../models/User.model.js';
import { StorageService } from './storage.services.js';
import { ApiError } from '../utils/ApiError.js';
import { generateShareToken } from '../utils/helpers.js';
import { logger } from '../utils/logger.js';

interface CreateFileData {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  s3Key: string;
  ownerId: string;
  folderId?: string | null;
}

interface FileListOptions {
  folderId?: string | null;
  page: number;
  limit: number;
}

//file service
export class FileService {
  //create file
  static async createFile(data: CreateFileData): Promise<IFile> {
    const file = await File.create({
      name: data.name,
      originalName: data.originalName,
      mimeType: data.mimeType,
      size: data.size,
      s3Key: data.s3Key,
      ownerId: new Types.ObjectId(data.ownerId),
      folderId: data.folderId ? new Types.ObjectId(data.folderId) : null,
    });

    // Update user's storage used
    await User.findByIdAndUpdate(data.ownerId, {
      $inc: { storageUsed: data.size },
    });

    logger.info(`File created: ${file.name} (${file._id})`);
    return file;
  }

  static async getFiles(
    userId: string,
    options: FileListOptions
  ): Promise<{ files: IFile[]; total: number }> {
    const query: Record<string, unknown> = {
      ownerId: new Types.ObjectId(userId),
    };

    // If folderId is explicitly null get root files
    // If folderId is provided get files in that folder
    // If folderId is undefined get all files
    if (options.folderId === null) {
      query.folderId = null;
    } else if (options.folderId) {
      query.folderId = new Types.ObjectId(options.folderId);
    }

    const skip = (options.page - 1) * options.limit;

    const [files, total] = await Promise.all([
      File.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit),
      File.countDocuments(query),
    ]);

    return { files, total };
  }

  //get file by ID
  static async getFileById(fileId: string, userId: string): Promise<IFile> {
    const file = await File.findOne({
      _id: new Types.ObjectId(fileId),
      ownerId: new Types.ObjectId(userId),
    });

    if (!file) {
      throw ApiError.notFound('File not found');
    }

    return file;
  }

  //update file metadata
  static async updateFile(
    fileId: string,
    userId: string,
    updates: { name?: string; folderId?: string | null }
  ): Promise<IFile> {
    const updateData: Record<string, unknown> = {};

    if (updates.name) {
      updateData.name = updates.name;
    }

    if (updates.folderId !== undefined) {
      updateData.folderId = updates.folderId
        ? new Types.ObjectId(updates.folderId)
        : null;
    }

    const file = await File.findOneAndUpdate(
      {
        _id: new Types.ObjectId(fileId),
        ownerId: new Types.ObjectId(userId),
      },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!file) {
      throw ApiError.notFound('File not found');
    }

    logger.info(`File updated: ${file.name} (${file._id})`);
    return file;
  }

  /**
   * Delete a file
   */
  static async deleteFile(fileId: string, userId: string): Promise<void> {
    const file = await File.findOne({
      _id: new Types.ObjectId(fileId),
      ownerId: new Types.ObjectId(userId),
    });

    if (!file) {
      throw ApiError.notFound('File not found');
    }

    // Delete from storage
    await StorageService.deleteFile(file.s3Key);

    // Delete metadata
    await File.deleteOne({ _id: file._id });

    // Update user's storage used
    await User.findByIdAndUpdate(userId, {
      $inc: { storageUsed: -file.size },
    });

    logger.info(`File deleted: ${file.name} (${file._id})`);
  }

  /**
   * Generate download URL for a file
   */
  static async getDownloadUrl(fileId: string, userId: string): Promise<string> {
    const file = await this.getFileById(fileId, userId);
    return StorageService.getDownloadUrl(file.s3Key);
  }

  /**
   * Share a file (generate share link)
   */
  static async shareFile(
    fileId: string,
    userId: string,
    expiresInHours?: number
  ): Promise<{ shareToken: string; shareUrl: string }> {
    const file = await File.findOne({
      _id: new Types.ObjectId(fileId),
      ownerId: new Types.ObjectId(userId),
    });

    if (!file) {
      throw ApiError.notFound('File not found');
    }

    const shareToken = generateShareToken();
    const shareExpiresAt = expiresInHours
      ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000)
      : null;

    file.isPublic = true;
    file.shareToken = shareToken;
    file.shareExpiresAt = shareExpiresAt;
    await file.save();

    logger.info(`File shared: ${file.name} (${file._id})`);

    return {
      shareToken,
      shareUrl: `/shared/${shareToken}`,
    };
  }

  //unshare file
  static async unshareFile(fileId: string, userId: string): Promise<void> {
    const file = await File.findOneAndUpdate(
      {
        _id: new Types.ObjectId(fileId),
        ownerId: new Types.ObjectId(userId),
      },
      {
        $set: {
          isPublic: false,
          shareToken: null,
          shareExpiresAt: null,
        },
      }
    );

    if (!file) {
      throw ApiError.notFound('File not found');
    }

    logger.info(`File unshared: ${file.name} (${file._id})`);
  }

  //shared file token
  static async getSharedFile(shareToken: string): Promise<{
    file: IFile;
    downloadUrl: string;
  }> {
    const file = await File.findPublicByToken(shareToken);

    if (!file) {
      throw ApiError.notFound('Shared file not found or link expired');
    }

    // Increment download count
    await File.updateOne(
      { _id: file._id },
      { $inc: { downloadCount: 1 } }
    );

    const downloadUrl = await StorageService.getDownloadUrl(file.s3Key);

    return { file, downloadUrl };
  }

  //get recent files of user
  static async getRecentFiles(userId: string, limit = 10): Promise<IFile[]> {
    return File.find({ ownerId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  //search files
  static async searchFiles(
    userId: string,
    searchTerm: string,
    limit = 20
  ): Promise<IFile[]> {
    return File.find({
      ownerId: new Types.ObjectId(userId),
      name: { $regex: searchTerm, $options: 'i' },
    })
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}