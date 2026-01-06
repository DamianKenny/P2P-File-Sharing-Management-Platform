import { Types } from 'mongoose';
import { Folder, IFolder } from '../models/Folder.model.js';
import { File } from '../models/File.model.js';
import { StorageService } from './storage.services.js';
import { User } from '../models/User.model.js';
import { ApiError } from '../utils/ApiError.js';
import { logger } from '../utils/logger.js';

interface CreateFolderData {
  name: string;
  parentId?: string | null;
  ownerId: string;
}

/**
 * Folder Service
 * Handles folder operations using Materialized Path pattern
 */
export class FolderService {
  /**
   * Create a new folder
   */
  static async createFolder(data: CreateFolderData): Promise<IFolder> {
    const { name, parentId, ownerId } = data;
    let path: string;
    let parentFolder: IFolder | null = null;

    if (parentId) {
      // Get parent folder
      parentFolder = await Folder.findOne({
        _id: new Types.ObjectId(parentId),
        ownerId: new Types.ObjectId(ownerId),
      });

      if (!parentFolder) {
        throw ApiError.notFound('Parent folder not found');
      }

      // Build path from parent
      path = `${parentFolder.path}/${name}`;
    } else {
      // Root level folder
      path = `/${name}`;
    }

    // Check if folder already exists
    const existingFolder = await Folder.findOne({
      path,
      ownerId: new Types.ObjectId(ownerId),
    });

    if (existingFolder) {
      throw ApiError.conflict('Folder already exists');
    }

    // Create folder
    const folder = await Folder.create({
      name,
      path,
      parentId: parentId ? new Types.ObjectId(parentId) : null,
      ownerId: new Types.ObjectId(ownerId),
      depth: path.split('/').filter(Boolean).length,
    });

    logger.info(`Folder created: ${path} (${folder._id})`);
    return folder;
  }

  //get folder by id
  static async getFolderById(folderId: string, userId: string): Promise<IFolder> {
    const folder = await Folder.findOne({
      _id: new Types.ObjectId(folderId),
      ownerId: new Types.ObjectId(userId),
    });

    if (!folder) {
      throw ApiError.notFound('Folder not found');
    }

    return folder;
  }

  //get root level folder for users
  static async getRootFolders(userId: string): Promise<IFolder[]> {
    return Folder.find({
      ownerId: new Types.ObjectId(userId),
      depth: 1,
    }).sort({ name: 1 });
  }

  //get subfolders
  static async getSubfolders(folderId: string, userId: string): Promise<IFolder[]> {
    const parentFolder = await this.getFolderById(folderId, userId);
    return Folder.findSubfolders(parentFolder.path, new Types.ObjectId(userId));
  }

  //get folder contents
  static async getFolderContents(
    folderId: string | null,
    userId: string
  ): Promise<{ folders: IFolder[]; files: any[] }> {
    const userObjectId = new Types.ObjectId(userId);

    let folders: IFolder[];
    let files: any[];

    if (folderId === null) {
      // Root folder
      folders = await this.getRootFolders(userId);
      files = await File.find({
        ownerId: userObjectId,
        folderId: null,
      }).sort({ createdAt: -1 });
    } else {
      // Specific folder
      folders = await this.getSubfolders(folderId, userId);
      files = await File.find({
        ownerId: userObjectId,
        folderId: new Types.ObjectId(folderId),
      }).sort({ createdAt: -1 });
    }

    return { folders, files };
  }

  //set breadcrumbs for folder
  static async getBreadcrumb(
    folderId: string,
    userId: string
  ): Promise<IFolder[]> {
    const folder = await this.getFolderById(folderId, userId);
    const ancestors = await Folder.findAncestors(
      folder.path,
      new Types.ObjectId(userId)
    );
    return [...ancestors, folder];
  }

  // Update folder name
  static async updateFolder(
    folderId: string,
    userId: string,
    newName: string
  ): Promise<IFolder> {
    const folder = await this.getFolderById(folderId, userId);
    const oldPath = folder.path;
    
    // Build new path
    const pathParts = oldPath.split('/');
    pathParts[pathParts.length - 1] = newName;
    const newPath = pathParts.join('/');

    // Check if new path already exists
    const existingFolder = await Folder.findOne({
      path: newPath,
      ownerId: new Types.ObjectId(userId),
    });

    if (existingFolder && existingFolder._id.toString() !== folderId) {
      throw ApiError.conflict('A folder with this name already exists');
    }

    //update this folder
    folder.name = newName;
    folder.path = newPath;
    await folder.save();

    // Update all descendant folder paths
    const descendants = await Folder.find({
      ownerId: new Types.ObjectId(userId),
      path: { $regex: `^${oldPath}/` },
    });

    for (const descendant of descendants) {
      descendant.path = descendant.path.replace(oldPath, newPath);
      await descendant.save();
    }

    logger.info(`Folder renamed: ${oldPath} -> ${newPath}`);
    return folder;
  }

  //delete folder
  static async deleteFolder(folderId: string, userId: string): Promise<void> {
    const folder = await this.getFolderById(folderId, userId);
    const userObjectId = new Types.ObjectId(userId);

    // Find all files in this folder and subfolders
    const allFolderIds = [folder._id];
    const descendants = await Folder.find({
      ownerId: userObjectId,
      path: { $regex: `^${folder.path}/` },
    });
    
    descendants.forEach((f) => allFolderIds.push(f._id));

    // Get all files to delete
    const files = await File.find({
      ownerId: userObjectId,
      folderId: { $in: allFolderIds },
    });

    // Delete files from storage and calculate total size
    let totalSize = 0;
    for (const file of files) {
      await StorageService.deleteFile(file.s3Key);
      totalSize += file.size;
    }

    // Delete file metadata
    await File.deleteMany({
      ownerId: userObjectId,
      folderId: { $in: allFolderIds },
    });

    // Delete all folders
    await Folder.deleteMany({
      ownerId: userObjectId,
      $or: [
        { _id: folder._id },
        { path: { $regex: `^${folder.path}/` } },
      ],
    });

    // Update user's storage
    if (totalSize > 0) {
      await User.findByIdAndUpdate(userId, {
        $inc: { storageUsed: -totalSize },
      });
    }

    logger.info(`Folder deleted: ${folder.path} (${files.length} files, ${descendants.length + 1} folders)`);
  }

  //move folder
  static async moveFolder(
    folderId: string,
    userId: string,
    newParentId: string | null
  ): Promise<IFolder> {
    const folder = await this.getFolderById(folderId, userId);
    const oldPath = folder.path;
    let newPath: string;

    if (newParentId) {
      const newParent = await this.getFolderById(newParentId, userId);
      
      // Prevent moving folder into itself or its descendants
      if (newParent.path.startsWith(folder.path)) {
        throw ApiError.badRequest('Cannot move folder into itself or its subfolder');
      }

      newPath = `${newParent.path}/${folder.name}`;
      folder.parentId = new Types.ObjectId(newParentId);
    } else {
      newPath = `/${folder.name}`;
      folder.parentId = null;
    }

    // Check if destination path already exists
    const existingFolder = await Folder.findOne({
      path: newPath,
      ownerId: new Types.ObjectId(userId),
    });

    if (existingFolder) {
      throw ApiError.conflict('A folder with this name already exists at the destination');
    }

    // Update this folder
    folder.path = newPath;
    folder.depth = newPath.split('/').filter(Boolean).length;
    await folder.save();

    // Update all descendant paths
    const descendants = await Folder.find({
      ownerId: new Types.ObjectId(userId),
      path: { $regex: `^${oldPath}/` },
    });

    for (const descendant of descendants) {
      descendant.path = descendant.path.replace(oldPath, newPath);
      descendant.depth = descendant.path.split('/').filter(Boolean).length;
      await descendant.save();
    }

    logger.info(`Folder moved: ${oldPath} -> ${newPath}`);
    return folder;
  }

  //get folder tree
  static async getFolderTree(userId: string): Promise<IFolder[]> {
    return Folder.find({
      ownerId: new Types.ObjectId(userId),
    }).sort({ path: 1 });
  }
}