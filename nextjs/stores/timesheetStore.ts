'use client';

import { create } from 'zustand';
import { TimeEntry, ProjectTimeAggregate, TaskTimeAggregate } from '@/types/time';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';

interface TimesheetState {
  timeEntries: TimeEntry[];
  currentWeekStart: Date;
  selectedView: 'my-time' | 'team-time';

  // Actions
  setCurrentWeek: (date: Date) => void;
  setSelectedView: (view: 'my-time' | 'team-time') => void;
  addTimeEntry: (entry: Omit<TimeEntry, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTimeEntry: (id: string, entry: Partial<TimeEntry>) => void;
  deleteTimeEntry: (id: string) => void;
  getWeekEntries: (userId?: string) => TimeEntry[];
  getDayEntries: (date: Date, userId?: string) => TimeEntry[];
  getProjectTimeByPerson: (projectId?: string) => ProjectTimeAggregate[];
  getTaskTimeSummary: (userId?: string) => TaskTimeAggregate[];
  getTotalTime: (entries: TimeEntry[]) => number;
}

export const useTimesheetStore = create<TimesheetState>((set, get) => ({
  timeEntries: generateMockTimeEntries(), // Mock data for development
  currentWeekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday
  selectedView: 'my-time',

  setCurrentWeek: (date) => {
    set({ currentWeekStart: startOfWeek(date, { weekStartsOn: 1 }) });
  },

  setSelectedView: (view) => {
    set({ selectedView: view });
  },

  addTimeEntry: (entry) => {
    const newEntry: TimeEntry = {
      ...entry,
      id: `time-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      timeEntries: [...state.timeEntries, newEntry],
    }));
  },

  updateTimeEntry: (id, updates) => {
    set((state) => ({
      timeEntries: state.timeEntries.map((entry) =>
        entry.id === id
          ? { ...entry, ...updates, updatedAt: new Date() }
          : entry
      ),
    }));
  },

  deleteTimeEntry: (id) => {
    set((state) => ({
      timeEntries: state.timeEntries.filter((entry) => entry.id !== id),
    }));
  },

  getWeekEntries: (userId) => {
    const { timeEntries, currentWeekStart } = get();
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    return timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesWeek = entryDate >= currentWeekStart && entryDate <= weekEnd;
      const matchesUser = userId ? entry.userId === userId : true;
      return matchesWeek && matchesUser;
    });
  },

  getDayEntries: (date, userId) => {
    const { timeEntries } = get();
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    return timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesDay = entryDate >= dayStart && entryDate <= dayEnd;
      const matchesUser = userId ? entry.userId === userId : true;
      return matchesDay && matchesUser;
    });
  },

  getProjectTimeByPerson: (projectId) => {
    const { timeEntries, currentWeekStart } = get();
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    // Filter entries for the current week and optionally by project
    const weekEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesWeek = entryDate >= currentWeekStart && entryDate <= weekEnd;
      const matchesProject = projectId ? entry.projectId === projectId : true;
      return matchesWeek && matchesProject;
    });

    // Group by user and project
    const aggregates = new Map<string, ProjectTimeAggregate>();

    weekEntries.forEach((entry) => {
      const key = `${entry.userId}-${entry.projectId}`;

      if (!aggregates.has(key)) {
        aggregates.set(key, {
          projectId: entry.projectId,
          projectName: getProjectName(entry.projectId), // This would come from project store
          userId: entry.userId,
          userName: getUserName(entry.userId), // This would come from user store
          totalDuration: 0,
          entries: [],
        });
      }

      const aggregate = aggregates.get(key)!;
      aggregate.totalDuration += entry.duration;
      aggregate.entries.push(entry);
    });

    return Array.from(aggregates.values());
  },

  getTaskTimeSummary: (userId) => {
    const { timeEntries, currentWeekStart } = get();
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });

    // Filter entries for the current week and optionally by user
    const weekEntries = timeEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      const matchesWeek = entryDate >= currentWeekStart && entryDate <= weekEnd;
      const matchesUser = userId ? entry.userId === userId : true;
      return matchesWeek && matchesUser;
    });

    // Group by task
    const aggregates = new Map<string, TaskTimeAggregate>();

    weekEntries.forEach((entry) => {
      if (!aggregates.has(entry.taskId)) {
        aggregates.set(entry.taskId, {
          taskId: entry.taskId,
          taskName: getTaskName(entry.taskId), // This would come from task store
          projectId: entry.projectId,
          projectName: getProjectName(entry.projectId),
          totalDuration: 0,
          entries: [],
        });
      }

      const aggregate = aggregates.get(entry.taskId)!;
      aggregate.totalDuration += entry.duration;
      aggregate.entries.push(entry);
    });

    return Array.from(aggregates.values());
  },

  getTotalTime: (entries) => {
    return entries.reduce((sum, entry) => sum + entry.duration, 0);
  },
}));

// Helper functions (these would ideally come from the respective stores)
function getProjectName(projectId: string): string {
  const projectNames: Record<string, string> = {
    'project-1': 'LogicFlow Rebuild',
    'project-2': 'Mobile App',
    'project-3': 'API Integration',
  };
  return projectNames[projectId] || 'Unknown Project';
}

function getTaskName(taskId: string): string {
  const taskNames: Record<string, string> = {
    'task-1': 'Design homepage',
    'task-2': 'Implement authentication',
    'task-3': 'Create timesheet view',
    'task-4': 'Fix navigation bug',
    'task-5': 'Update documentation',
  };
  return taskNames[taskId] || 'Unknown Task';
}

function getUserName(userId: string): string {
  const userNames: Record<string, string> = {
    'user-1': 'John Doe',
    'user-2': 'Jane Smith',
    'user-3': 'Bob Johnson',
  };
  return userNames[userId] || 'Unknown User';
}

// Generate mock time entries for development
function generateMockTimeEntries(): TimeEntry[] {
  const entries: TimeEntry[] = [];
  const currentDate = new Date();
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({
    start: weekStart,
    end: endOfWeek(weekStart, { weekStartsOn: 1 }),
  });

  const tasks = ['task-1', 'task-2', 'task-3', 'task-4', 'task-5'];
  const projects = ['project-1', 'project-2', 'project-3'];
  const users = ['user-1', 'user-2', 'user-3'];

  weekDays.forEach((day) => {
    // Skip weekends
    if (day.getDay() === 0 || day.getDay() === 6) return;

    // Generate 2-4 entries per day
    const entriesPerDay = Math.floor(Math.random() * 3) + 2;

    for (let i = 0; i < entriesPerDay; i++) {
      const taskId = tasks[Math.floor(Math.random() * tasks.length)];
      const projectId = projects[Math.floor(Math.random() * projects.length)];
      const userId = users[Math.floor(Math.random() * users.length)];

      const startHour = 9 + Math.floor(Math.random() * 6);
      const startTime = new Date(day);
      startTime.setHours(startHour, 0, 0, 0);

      const duration = (Math.floor(Math.random() * 4) + 1) * 1800; // 0.5 to 2 hours in seconds
      const endTime = new Date(startTime.getTime() + duration * 1000);

      entries.push({
        id: `time-${day.getTime()}-${i}`,
        taskId,
        userId,
        projectId,
        date: day,
        startTime,
        endTime,
        duration,
        description: `Work on ${getTaskName(taskId)}`,
        isManual: Math.random() > 0.5,
        createdAt: day,
        updatedAt: day,
      });
    }
  });

  return entries;
}
