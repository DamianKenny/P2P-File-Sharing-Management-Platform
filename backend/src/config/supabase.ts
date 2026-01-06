import { S3Client } from '@aws-sdk/client-s3';
import { config } from './environment.js';
import { logger } from '../utils/logger.js';

//supabase s3 client
export const s3Client = new S3Client({
  region: 'auto',
  endpoint: config.supabase.s3.endpoint,
  credentials: {
    accessKeyId: config.supabase.s3.accessKey,
    secretAccessKey: config.supabase.s3.secretKey,
  },
  forcePathStyle: true,
});

export const BUCKET_NAME = config.supabase.s3.bucket;

logger.info('Supabase S3 client initialized');