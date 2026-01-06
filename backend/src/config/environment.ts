import { z } from 'zod';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//load env variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env')});

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.string().default('5000'),
    API_VERSION: z.string().default('v1'),

    MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be atleast 32 characters'),
    JWT_EXPIRES_IN: z.string().default('7d'),
    JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be atleast 32 characters'),
    JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

    SUPABASE_URL: z.string().min(1, 'SUPABASE_URL is required'),
    SUPABASE_ANON_KEY: z.string().min(1, 'SUPABASE_ANON_KEY is required'),
    SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY is required'),
    SUPABASE_S3_ENDPOINT: z.string().min(1, 'SUPABASE_S3_ENDPOINT is required'),
    SUPABASE_S3_ACCESS_KEY: z.string().min(1, 'SUPABASE_S3_ACCESS_KEY is required'),
    SUPABASE_S3_SECRET_KEY: z.string().min(1, 'SUPABASE_S3_SECRET_KEY is required'),
    SUPABASE_BUCKET_NAME: z.string().default('files'),

    CORS_ORIGIN: z.string().default('http://localhost:3000'),

    RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
    RATE_LIMIT_MAX: z.string().default('100'),
});

const parseResult = envSchema.safeParse(process.env);

if (!parseResult.success) {
  console.error('Invalid environment variables:');
  parseResult.error.errors.forEach((err) => {
    console.error(`   ${err.path.join('.')}: ${err.message}`);
  });
  console.error('\n💡 Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

const env = parseResult.data;

//export grouped config object
export const config = {
  server: {
    env: env.NODE_ENV,
    port: parseInt(env.PORT, 10),
    apiVersion: env.API_VERSION,
    isProduction: env.NODE_ENV === 'production',
    isDevelopment: env.NODE_ENV === 'development',
    isTest: env.NODE_ENV === 'test',
  },
  database: {
    uri: env.MONGODB_URI,
  },
  jwt: {
    secret: env.JWT_SECRET,
    expiresIn: env.JWT_EXPIRES_IN,
    refreshSecret: env.JWT_REFRESH_SECRET,
    refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
  },
  supabase: {
    url: env.SUPABASE_URL,
    anonKey: env.SUPABASE_ANON_KEY,
    serviceKey: env.SUPABASE_SERVICE_KEY,
    s3: {
      endpoint: env.SUPABASE_S3_ENDPOINT,
      accessKey: env.SUPABASE_S3_ACCESS_KEY,
      secretKey: env.SUPABASE_S3_SECRET_KEY,
      bucket: env.SUPABASE_BUCKET_NAME,
    },
  },
  cors: {
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
  },
  rateLimit: {
    windowMs: parseInt(env.RATE_LIMIT_WINDOW_MS, 10),
    max: parseInt(env.RATE_LIMIT_MAX, 10),
  },
} as const;

export { env };