'use client';

import { create } from 'zustand';
import { Task, TaskStatus } from '@/types';

interface TaskState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'comments' | 'files'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  getTasksByProject: (projectId: string) => Task[];
  getTasksByStatus: (projectId: string, status: TaskStatus) => Task[];
  moveTask: (taskId: string, newStatus: TaskStatus) => void;
}

// Mock tasks based on screenshots
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'AlidateV2',
    description: '',
    projectId: '6',
    status: 'todo',
    priority: 'medium',
    assignees: ['user1', 'user2'],
    timeSpent: 87723, // 1462h 43min in minutes
    order: 1,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    id: '2',
    title: 'Iндивiдуальний reporting',
    description: '',
    projectId: '6',
    status: 'todo',
    priority: 'medium',
    assignees: ['user1', 'user2'],
    timeSpent: 3370, // 56h 10min
    order: 2,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-02'),
    updatedAt: new Date('2024-11-02'),
  },
  {
    id: '3',
    title: 'Alidade: дзвінки та переписка з клієнтом',
    description: '',
    projectId: '6',
    status: 'todo',
    priority: 'medium',
    assignees: ['user1'],
    timeSpent: 1035, // 17h 15min
    order: 3,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-03'),
    updatedAt: new Date('2024-11-03'),
  },
  {
    id: '4',
    title: 'Alidade MNGMT',
    description: '',
    projectId: '6',
    status: 'in_progress',
    priority: 'high',
    assignees: ['user1'],
    timeSpent: 19256, // 320h 56min
    deadline: new Date('2024-12-31'),
    order: 1,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-04'),
    updatedAt: new Date('2024-11-04'),
  },
  {
    id: '5',
    title: 'Alidade: тестування',
    description: '',
    projectId: '6',
    status: 'in_progress',
    priority: 'medium',
    assignees: ['user1'],
    timeSpent: 3240, // 54h
    order: 2,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-05'),
  },
  {
    id: '6',
    title: 'Обговорення',
    description: '',
    projectId: '6',
    status: 'complete',
    priority: 'medium',
    assignees: ['user1', 'user2', 'user3'],
    timeSpent: 768, // 12h 48min
    order: 1,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-06'),
    updatedAt: new Date('2024-11-06'),
  },
  {
    id: '7',
    title: 'Налаштування БД',
    description: '',
    projectId: '6',
    status: 'done',
    priority: 'high',
    assignees: ['user1', 'user2'],
    timeSpent: 10, // 0h 10min
    order: 1,
    comments: [],
    files: [],
    createdAt: new Date('2024-11-07'),
    updatedAt: new Date('2024-11-07'),
  },
];

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: mockTasks,

  addTask: (taskData) =>
    set((state) => ({
      tasks: [
        ...state.tasks,
        {
          ...taskData,
          id: Date.now().toString(),
          comments: [],
          files: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, updatedAt: new Date() } : t
      ),
    })),

  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== taskId),
    })),

  getTasksByProject: (projectId) => {
    return get().tasks.filter((t) => t.projectId === projectId);
  },

  getTasksByStatus: (projectId, status) => {
    return get()
      .tasks.filter((t) => t.projectId === projectId && t.status === status)
      .sort((a, b) => a.order - b.order);
  },

  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date() } : t
      ),
    })),
}));
