import { Router } from 'express';
import { FolderController } from '../controllers/folder.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorizeFolder } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import {
  createFolderSchema,
  folderIdSchema,
  updateFolderSchema,
} from '../validators/folder.validator.js';

const router = Router();

// All folder routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/folders
 * @desc    Create folder
 * @access  Private
 */
router.post(
  '/',
  validateRequest({ body: createFolderSchema }),
  authorizeFolder('parentId'),
  FolderController.createFolder
);

/**
 * @route   GET /api/v1/folders
 * @desc    Get folders (root or tree)
 * @access  Private
 */
router.get(
  '/',
  FolderController.getFolders
);

/**
 * @route   GET /api/v1/folders/:folderId
 * @desc    Get folder details
 * @access  Private
 */
router.get(
  '/:folderId',
  validateRequest({ params: folderIdSchema }),
  authorizeFolder('folderId'),
  FolderController.getFolder
);

/**
 * @route   GET /api/v1/folders/:folderId/contents
 * @desc    Get folder contents (files and subfolders)
 * @access  Private
 * @note    Use 'root' as folderId for root folder
 */
router.get(
  '/:folderId/contents',
  FolderController.getFolderContents
);

/**
 * @route   GET /api/v1/folders/:folderId/breadcrumb
 * @desc    Get folder breadcrumb path
 * @access  Private
 */
router.get(
  '/:folderId/breadcrumb',
  validateRequest({ params: folderIdSchema }),
  authorizeFolder('folderId'),
  FolderController.getBreadcrumb
);

/**
 * @route   PATCH /api/v1/folders/:folderId
 * @desc    Rename folder
 * @access  Private
 */
router.patch(
  '/:folderId',
  validateRequest({ params: folderIdSchema, body: updateFolderSchema }),
  authorizeFolder('folderId'),
  FolderController.updateFolder
);

/**
 * @route   DELETE /api/v1/folders/:folderId
 * @desc    Delete folder and contents
 * @access  Private
 */
router.delete(
  '/:folderId',
  validateRequest({ params: folderIdSchema }),
  authorizeFolder('folderId'),
  FolderController.deleteFolder
);

/**
 * @route   POST /api/v1/folders/:folderId/move
 * @desc    Move folder to new parent
 * @access  Private
 */
router.post(
  '/:folderId/move',
  validateRequest({ params: folderIdSchema }),
  authorizeFolder('folderId'),
  FolderController.moveFolder
);

export default router;