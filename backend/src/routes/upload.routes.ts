import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { checkStorageQuota, authorizeFolder } from '../middleware/authorize.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import {
  initUploadSchema,
  completeUploadSchema,
} from '../validators/upload.validators.js';

const router = Router();

// All upload routes require authentication
router.use(authenticate);

/**
 * @route   POST /api/v1/upload/init
 * @desc    Initialize multipart upload and get presigned URLs
 * @access  Private
 */
router.post(
  '/init',
  uploadLimiter,
  validateRequest({ body: initUploadSchema }),
  authorizeFolder('folderId'),
  checkStorageQuota('fileSize'),
  UploadController.initializeUpload
);

/**
 * @route   POST /api/v1/upload/complete
 * @desc    Complete multipart upload
 * @access  Private
 */
router.post(
  '/complete',
  validateRequest({ body: completeUploadSchema }),
  UploadController.completeUpload
);

/**
 * @route   POST /api/v1/upload/abort
 * @desc    Abort multipart upload
 * @access  Private
 */
router.post(
  '/abort',
  UploadController.abortUpload
);

export default router;