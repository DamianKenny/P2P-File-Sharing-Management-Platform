import { Request, Response, NextFunction } from 'express';
import { FolderService } from '../services/folder.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//folder controller
export class FolderController {
   //POST /folders
  static async createFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { name, parentId } = req.body;

      const folder = await FolderService.createFolder({
        name,
        parentId: parentId || null,
        ownerId: userId,
      });

      res.status(201).json(
        ApiResponse.created(folder, 'Folder created').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /folders (tree)
  static async getFolders(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { tree } = req.query;

      let folders;
      if (tree === 'true') {
        folders = await FolderService.getFolderTree(userId);
      } else {
        folders = await FolderService.getRootFolders(userId);
      }

      res.json(
        ApiResponse.success(folders).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /folders/:folderId
  static async getFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;

      const folder = await FolderService.getFolderById(folderId, userId);

      res.json(
        ApiResponse.success(folder).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /folders/:folderId/contents
  static async getFolderContents(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;

      // Use null for root folder
      const id = folderId === 'root' ? null : folderId;
      const contents = await FolderService.getFolderContents(id, userId);

      res.json(
        ApiResponse.success(contents).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /folders/:folderId/breadcrumb
  static async getBreadcrumb(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;

      const breadcrumb = await FolderService.getBreadcrumb(folderId, userId);

      res.json(
        ApiResponse.success(breadcrumb).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //PATCH /folders/:folderId
  static async updateFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;
      const { name } = req.body;

      const folder = await FolderService.updateFolder(folderId, userId, name);

      res.json(
        ApiResponse.success(folder, 'Folder renamed').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //DELETE /folders/:folderId
  static async deleteFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;

      await FolderService.deleteFolder(folderId, userId);

      res.json(
        ApiResponse.success(null, 'Folder deleted').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //POST /folders/:folderId/move
  static async moveFolder(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId } = req.params;
      const { newParentId } = req.body;

      const folder = await FolderService.moveFolder(
        folderId,
        userId,
        newParentId || null
      );

      res.json(
        ApiResponse.success(folder, 'Folder moved').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }
}