import { Router } from 'express';
import authRoutes from './auth.routes.js';
import uploadRoutes from './upload.routes.js';
import fileRoutes from './file.routes.js';
import folderRoutes from './folder.routes.js';

const router = Router();

//health check
router.get('/health', (_req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
  });
});

//mount routes
router.use('/auth', authRoutes);
router.use('/upload', uploadRoutes);
router.use('/files', fileRoutes);
router.use('/folders', folderRoutes);

export default router;