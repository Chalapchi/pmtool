'use client';

import { create } from 'zustand';

interface TimerState {
  isRunning: boolean;
  selectedTaskId: string | null;
  startTime: Date | null;
  elapsedSeconds: number;
  startTimer: (taskId: string) => void;
  stopTimer: () => void;
  tick: () => void;
  selectTask: (taskId: string | null) => void;
}

export const useTimerStore = create<TimerState>((set, get) => ({
  isRunning: false,
  selectedTaskId: null,
  startTime: null,
  elapsedSeconds: 0,

  startTimer: (taskId) => {
    set({
      isRunning: true,
      selectedTaskId: taskId,
      startTime: new Date(),
      elapsedSeconds: 0,
    });
  },

  stopTimer: () => {
    const { elapsedSeconds, selectedTaskId } = get();

    // Here you would save the time entry to the backend
    // and update the task's timeSpent
    console.log(`Stopped timer for task ${selectedTaskId}: ${elapsedSeconds} seconds`);

    set({
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
    });
  },

  tick: () => {
    const { isRunning } = get();
    if (isRunning) {
      set((state) => ({
        elapsedSeconds: state.elapsedSeconds + 1,
      }));
    }
  },

  selectTask: (taskId) => {
    set({ selectedTaskId: taskId });
  },
}));
