import { Types, Document } from 'mongoose';

export interface BaseDocument extends Document {
    _id: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// user types
export interface IUserBase {
    email: string,
    password: string,
    name: string;
    avatar?: string,
    storageUsed: number;
    storageLimit: number;
    isActive: boolean;
}

// file types
export interface IFileBase{
    name: string;
    originalName: string;
    mimeType: string;
    size: number;
    s3Key: string;
    folderId: Types.ObjectId | null;
    ownerId: Types.ObjectId;
    isPublic: boolean;
    shareToken?: string;
    shareExpiresAt?: Date;
    downloadCount: number;
}

// folder types
export interface IFolderBase {
    name: string;
    path: string;
    parentId: Types.ObjectId | null;
    ownerId: Types.ObjectId;
    depth: number;
}

// upload types
export interface PresignedUrlRequest {
    fileName: string;
    fileType: string;
    fileSize: number;
    folderId?: string;
}

export interface PresignedUrlResponse {
    uploadId: string;
    key: string;
    urls: string[];
    partSize: number;
    totalParts: number;
}