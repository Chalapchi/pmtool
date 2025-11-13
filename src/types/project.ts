export type ProjectView = 'overview' | 'list' | 'board' | 'files';

export interface Project {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  folderId?: string;
  members: ProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  userId: string;
  role: string;
  addedAt: Date;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  name: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Folder {
  id: string;
  name: string;
  projects: Project[];
}
