'use client';

import { create } from 'zustand';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  login: async (username: string, password: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock user data
    const user: User = {
      id: '1',
      username,
      email: `${username}@logicflow.io`,
      firstName: 'John',
      lastName: 'Doe',
      createdAt: new Date(),
    };

    set({ user, isAuthenticated: true });
  },

  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));
