export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  projectId: string;
  date: Date; // The date this time entry is for
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  description?: string;
  isManual: boolean; // Whether this was manually entered or tracked
  createdAt: Date;
  updatedAt: Date;
}

export interface TimerState {
  isRunning: boolean;
  selectedTaskId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
}

export interface WeekTimesheet {
  weekStart: Date;
  weekEnd: Date;
  entries: TimeEntry[];
  totalDuration: number; // Total seconds for the week
}

export interface DayTimesheet {
  date: Date;
  entries: TimeEntry[];
  totalDuration: number; // Total seconds for the day
}

export interface ProjectTimeAggregate {
  projectId: string;
  projectName: string;
  userId: string;
  userName: string;
  totalDuration: number; // seconds
  entries: TimeEntry[];
}

export interface TaskTimeAggregate {
  taskId: string;
  taskName: string;
  projectId: string;
  projectName: string;
  totalDuration: number; // seconds
  entries: TimeEntry[];
}
