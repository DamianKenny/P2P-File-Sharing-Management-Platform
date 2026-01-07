export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'P2P File Platform';
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const FILE_ICONS: Record<string, string> = {
    //Images
    'image/jpeg': '🖼️',
    'image/png': '🖼️',
    'image/gif': '🖼️',
    'image/svg+xml': '🖼️',
    'image/webp': '🖼️',

    //Documents
    'application/pdf': '📄',
    'application/msword': '📝',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '📝',
    'application/vnd.ms-excel': '📊',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '📊',
    'application/vnd.ms-powerpoint': '📈',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': '📈',

    //Text
    'text/plain': '📄',
    'text/csv': '📊',
    'application/json': '📋',

    //Archives
    'application/zip': '🗜️',
    'application/x-rar-compressed': '🗜️',
    'application/x-7z-compressed': '🗜️',

    //Audio
    'audio/mpeg': '🎵',
    'audio/wav': '🎵',

    //Video
    'video/mp4': '🎬',
    'video/webm': '🎬',
    'video/ogg': '🎬',
    
    //Default
    'default': '📁',
};

export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'accessToken',
    REFRESH_TOKEN: 'refreshToken',
    USER: 'user',
};

export const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024; // 5gb
export const CHUNK_SIZE = 5 * 1024 * 1024; // 5mb 