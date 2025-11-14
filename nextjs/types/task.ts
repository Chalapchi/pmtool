export type TaskStatus = 'todo' | 'in_progress' | 'complete' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignees: string[]; // User IDs
  startDate?: Date;
  dueDate?: Date;
  deadline?: Date;
  timeSpent: number; // minutes
  parentTaskId?: string; // For subtasks
  order: number;
  comments: TaskComment[];
  files: TaskFile[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: Date;
}

export interface TaskFile {
  id: string;
  taskId: string;
  name: string;
  url: string;
  size: number;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface TaskGroup {
  status: TaskStatus;
  label: string;
  tasks: Task[];
  count: number;
}
