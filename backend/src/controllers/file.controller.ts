import { Request, Response, NextFunction } from 'express';
import { FileService } from '../services/file.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

//file controller
export class FileController {
  //GET files
  static async getFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { folderId, page = '1', limit = '20' } = req.query;

      const options = {
        folderId: folderId === 'null' ? null : folderId as string | undefined,
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
      };

      const { files, total } = await FileService.getFiles(userId, options);

      res.json(
        ApiResponse.paginated(files, options.page, options.limit, total).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //GET Files/FileID
  static async getFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;

      const file = await FileService.getFileById(fileId, userId);

      res.json(
        ApiResponse.success(file).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //PATCH file/fileId
  static async updateFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;
      const updates = req.body;

      const file = await FileService.updateFile(fileId, userId, updates);

      res.json(
        ApiResponse.success(file, 'File updated').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //DELETE /files/:fileId
  static async deleteFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;

      await FileService.deleteFile(fileId, userId);

      res.json(
        ApiResponse.success(null, 'File deleted').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /files/:fileId/download
  static async getDownloadUrl(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;

      const downloadUrl = await FileService.getDownloadUrl(fileId, userId);

      res.json(
        ApiResponse.success({ downloadUrl }).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

  //POST /files/:fileId/share
  static async shareFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;
      const { expiresIn } = req.body;

      const result = await FileService.shareFile(fileId, userId, expiresIn);

      res.json(
        ApiResponse.success(result, 'File shared').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

//DELETE /files/:fileId/share
  static async unshareFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { fileId } = req.params;

      await FileService.unshareFile(fileId, userId);

      res.json(
        ApiResponse.success(null, 'File sharing disabled').toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /shared/:shareToken
  static async getSharedFile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { shareToken } = req.params;

      const result = await FileService.getSharedFile(shareToken);

      res.json(
        ApiResponse.success(result).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /files/recent
  static async getRecentFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const files = await FileService.getRecentFiles(userId, limit);

      res.json(
        ApiResponse.success(files).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }

   //GET /files/search
  static async searchFiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!._id.toString();
      const { q, limit = '20' } = req.query;

      if (!q || typeof q !== 'string') {
        res.json(ApiResponse.success([]).toJSON());
        return;
      }

      const files = await FileService.searchFiles(
        userId,
        q,
        parseInt(limit as string, 10)
      );

      res.json(
        ApiResponse.success(files).toJSON()
      );
    } catch (error) {
      next(error);
    }
  }
}