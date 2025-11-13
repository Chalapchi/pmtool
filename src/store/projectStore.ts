import { create } from 'zustand';
import { Project, ProjectView } from '@/types';

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  currentView: ProjectView;
  setCurrentProject: (project: Project | null) => void;
  setCurrentView: (view: ProjectView) => void;
  toggleFavorite: (projectId: string) => void;
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
}

// Mock data
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Трiумф',
    description: '',
    isFavorite: true,
    members: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Сайт Адвоката',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    name: 'SolasMind',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    name: 'Seasmatch',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    name: 'Внутрiшнє',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    name: 'Alidade',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    name: 'LogicFlow',
    description: '',
    isFavorite: false,
    members: [],
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-07'),
  },
];

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,
  currentProject: null,
  currentView: 'list',

  setCurrentProject: (project) => set({ currentProject: project }),

  setCurrentView: (view) => set({ currentView: view }),

  toggleFavorite: (projectId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, isFavorite: !p.isFavorite } : p
      ),
    })),

  addProject: (projectData) =>
    set((state) => ({
      projects: [
        ...state.projects,
        {
          ...projectData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId ? { ...p, ...updates, updatedAt: new Date() } : p
      ),
      currentProject:
        state.currentProject?.id === projectId
          ? { ...state.currentProject, ...updates, updatedAt: new Date() }
          : state.currentProject,
    })),
}));
