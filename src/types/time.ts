export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  projectId: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // seconds
  description?: string;
}

export interface TimerState {
  isRunning: boolean;
  selectedTaskId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
}
