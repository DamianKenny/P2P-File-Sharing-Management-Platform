import mongoose, { Schema, Model, Types } from 'mongoose';
import { IFileBase, BaseDocument } from '../types/models.types.js';

export interface IFile extends IFileBase, BaseDocument {}

export interface IFileModel extends Model<IFile> {
  findByOwner(ownerId: Types.ObjectId, folderId?: Types.ObjectId | null): Promise<IFile[]>;
  findPublicByToken(shareToken: string): Promise<IFile | null>;
}

const fileSchema = new Schema<IFile, IFileModel>(
  {
    name: {
      type: String,
      required: [true, 'File name is required'],
      trim: true,
      maxlength: [255, 'File name cannot exceed 255 characters'],
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    mimeType: {
      type: String,
      required: [true, 'MIME type is required'],
    },
    size: {
      type: Number,
      required: [true, 'File size is required'],
      min: [0, 'File size cannot be negative'],
    },
    s3Key: {
      type: String,
      required: [true, 'S3 key is required'],
      unique: true,
    },
    folderId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    shareToken: {
      type: String,
      default: null,
      index: true,
      sparse: true,
    },
    shareExpiresAt: {
      type: Date,
      default: null,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret: Record<string, any>) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
fileSchema.index({ ownerId: 1, folderId: 1 });
fileSchema.index({ ownerId: 1, createdAt: -1 });
fileSchema.index({ shareToken: 1, shareExpiresAt: 1 });

// Static methods
fileSchema.statics.findByOwner = function (
  ownerId: Types.ObjectId,
  folderId?: Types.ObjectId | null
) {
  const query: Record<string, unknown> = { ownerId };
  if (folderId !== undefined) {
    query.folderId = folderId;
  }
  return this.find(query).sort({ createdAt: -1 });
};

fileSchema.statics.findPublicByToken = function (shareToken: string) {
  return this.findOne({
    shareToken,
    isPublic: true,
    $or: [
      { shareExpiresAt: null },
      { shareExpiresAt: { $gt: new Date() } },
    ],
  });
};

// Virtuals
fileSchema.virtual('formattedSize').get(function (this: IFile) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (this.size === 0) return '0 Bytes';
  const i = Math.floor(Math.log(this.size) / Math.log(1024));
  return parseFloat((this.size / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
});

fileSchema.virtual('isShareExpired').get(function (this: IFile) {
  if (!this.shareExpiresAt) return false;
  return new Date() > this.shareExpiresAt;
});

export const File = mongoose.model<IFile, IFileModel>('File', fileSchema);