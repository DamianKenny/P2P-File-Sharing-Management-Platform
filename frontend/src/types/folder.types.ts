import { FileItem} from './file.types';

export interface Folder {
  id: string;
  _id: string;
  name: string;
  path: string;
  parentId: string | null;
  ownerId: string;
  depth: number;
  createdAt: string;
  updatedAt: string;
}

export interface FolderContents {
  folders: Folder[];
  files: FileItem[];
}

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}