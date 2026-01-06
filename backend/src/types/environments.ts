declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            API_VERSION : string;
            MONGODB_URI: string;
            JWT_SECRET: string;
            JWT_EXPIRES_IN: string;
            JWT_REFRESH_SECRET: string;
            JWT_REFRESH_EXPIRES_IN: string;
            SUPABASE_URL: string;
            SUPABASE_ANON_KEY: string;
            SUPABASE_SERVICE_KEY: string;
            SUPABASE_S3_ENDPOINT: string;
            SUPABASE_BUCKET_NAME: string;
            CORS_ORIGIN: string;
            RATE_LIMIT_WINDOW_MS: string;
            RATE_LIMIT_MAX: string;
        }
    }
}

export {};