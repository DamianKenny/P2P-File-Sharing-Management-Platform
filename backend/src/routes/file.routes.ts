import { Router } from 'express';
import { FileController } from '../controllers/file.controller.js';
import { authenticate, optionalAuthenticate } from '../middleware/authenticate.js';
import { authorizeFile } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { fileIdSchema, updateFileSchema } from '../validators/file.validator.js';

const router = Router();

/**
 * @route   GET /api/v1/files/recent
 * @desc    Get recent files
 * @access  Private
 */
router.get(
  '/recent',
  authenticate,
  FileController.getRecentFiles
);

/**
 * @route   GET /api/v1/files/search
 * @desc    Search files
 * @access  Private
 */
router.get(
  '/search',
  authenticate,
  FileController.searchFiles
);

/**
 * @route   GET /api/v1/files
 * @desc    Get files (optionally by folder)
 * @access  Private
 */
router.get(
  '/',
  authenticate,
  FileController.getFiles
);

/**
 * @route   GET /api/v1/files/:fileId
 * @desc    Get file details
 * @access  Private
 */
router.get(
  '/:fileId',
  authenticate,
  validateRequest({ params: fileIdSchema }),
  authorizeFile('fileId'),
  FileController.getFile
);

/**
 * @route   PATCH /api/v1/files/:fileId
 * @desc    Update file
 * @access  Private
 */
router.patch(
  '/:fileId',
  authenticate,
  validateRequest({ params: fileIdSchema, body: updateFileSchema }),
  authorizeFile('fileId'),
  FileController.updateFile
);

/**
 * @route   DELETE /api/v1/files/:fileId
 * @desc    Delete file
 * @access  Private
 */
router.delete(
  '/:fileId',
  authenticate,
  validateRequest({ params: fileIdSchema }),
  authorizeFile('fileId'),
  FileController.deleteFile
);

/**
 * @route   GET /api/v1/files/:fileId/download
 * @desc    Get download URL
 * @access  Private
 */
router.get(
  '/:fileId/download',
  authenticate,
  validateRequest({ params: fileIdSchema }),
  authorizeFile('fileId'),
  FileController.getDownloadUrl
);

/**
 * @route   POST /api/v1/files/:fileId/share
 * @desc    Share file
 * @access  Private
 */
router.post(
  '/:fileId/share',
  authenticate,
  validateRequest({ params: fileIdSchema }),
  authorizeFile('fileId'),
  FileController.shareFile
);

/**
 * @route   DELETE /api/v1/files/:fileId/share
 * @desc    Unshare file
 * @access  Private
 */
router.delete(
  '/:fileId/share',
  authenticate,
  validateRequest({ params: fileIdSchema }),
  authorizeFile('fileId'),
  FileController.unshareFile
);

/**
 * @route   GET /api/v1/shared/:shareToken
 * @desc    Get shared file (public)
 * @access  Public
 */
router.get(
  '/shared/:shareToken',
  FileController.getSharedFile
);

export default router;