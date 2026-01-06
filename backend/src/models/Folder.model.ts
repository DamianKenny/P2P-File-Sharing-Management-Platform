import mongoose, { Schema, Model, Types } from 'mongoose';
import { IFolderBase, BaseDocument } from '../types/models.types.js';

export interface IFolder extends IFolderBase, BaseDocument {}

export interface IFolderModel extends Model<IFolder> {
  findByPath(path: string, ownerId: Types.ObjectId): Promise<IFolder | null>;
  findSubfolders(parentPath: string, ownerId: Types.ObjectId): Promise<IFolder[]>;
  findAncestors(path: string, ownerId: Types.ObjectId): Promise<IFolder[]>;
}

const folderSchema = new Schema<IFolder, IFolderModel>(
  {
    name: {
      type: String,
      required: [true, 'Folder name is required'],
      trim: true,
      maxlength: [100, 'Folder name cannot exceed 100 characters'],
      validate: {
        validator: (v: string) => v.length > 0 && !v.includes('/'),
        message: 'Folder name cannot contain forward slashes',
      },
    },
    path: {
      type: String,
      required: [true, 'Path is required'],
      validate: {
        validator: (v: string) => {
          if (v === '/') return true;
          return /^(\/[a-zA-Z0-9_-]+)+$/.test(v);
        },
        message: 'Invalid path format',
      },
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Folder',
      default: null,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner ID is required'],
    },
    depth: {
      type: Number,
      required: true,
      min: 0,
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
folderSchema.index({ path: 1, ownerId: 1 }, { unique: true });
folderSchema.index({ parentId: 1, ownerId: 1 });
folderSchema.index({ path: 1 });

// Calculate depth before saving
folderSchema.pre('save', function (next) {
  if (this.isModified('path')) {
    if (this.path === '/') {
      this.depth = 0;
    } else {
      this.depth = this.path.split('/').filter(Boolean).length;
    }
  }
  next();
});

// Static methods
folderSchema.statics.findByPath = function (path: string, ownerId: Types.ObjectId) {
  return this.findOne({ path, ownerId });
};

folderSchema.statics.findSubfolders = function (parentPath: string, ownerId: Types.ObjectId) {
  if (parentPath === '/') {
    return this.find({ ownerId, depth: 1 }).sort({ name: 1 });
  }
  
  const parentDepth = parentPath.split('/').filter(Boolean).length;
  return this.find({
    ownerId,
    path: new RegExp(`^${parentPath}/[^/]+$`),
    depth: parentDepth + 1,
  }).sort({ name: 1 });
};

folderSchema.statics.findAncestors = function (path: string, ownerId: Types.ObjectId) {
  if (path === '/') return Promise.resolve([]);
  
  const parts = path.split('/').filter(Boolean);
  const ancestorPaths: string[] = [];
  let currentPath = '';
  
  for (let i = 0; i < parts.length - 1; i++) {
    currentPath += '/' + parts[i];
    ancestorPaths.push(currentPath);
  }
  
  if (ancestorPaths.length === 0) return Promise.resolve([]);
  
  return this.find({
    ownerId,
    path: { $in: ancestorPaths },
  }).sort({ depth: 1 });
};

export const Folder = mongoose.model<IFolder, IFolderModel>('Folder', folderSchema);