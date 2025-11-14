'use client';

import { useState, useEffect } from 'react';
import { useTaskStore } from '@/stores/taskStore';
import {
  Dialog,
  DialogContent,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui';
import { TaskStatus, TaskPriority } from '@/types';
import { Flag, Calendar, Clock, Users, Plus } from 'lucide-react';

interface TaskModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskModal = ({ taskId, isOpen, onClose }: TaskModalProps) => {
  const tasks = useTaskStore((state) => state.tasks);
  const updateTask = useTaskStore((state) => state.updateTask);

  const task = tasks.find((t) => t.id === taskId);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status);
      setPriority(task.priority);
    }
  }, [task]);

  if (!task) return null;

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days * 24 + remainingHours}h ${mins}min`;
    }

    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const handleSave = () => {
    if (taskId) {
      updateTask(taskId, {
        title,
        description,
        status,
        priority,
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-2">
          {/* Title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl font-semibold bg-transparent text-dark-100 border-none focus:outline-none mb-4"
            placeholder="Task title"
          />

          <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
            {/* Left Column - Main Content */}
            <div className="space-y-6">
              {/* Time Spent */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                  <Clock className="w-4 h-4" />
                  <span>Time Spent</span>
                </div>
                <div className="text-dark-100 font-mono text-lg">
                  {formatTimeSpent(task.timeSpent)}
                </div>
              </div>

              {/* Status */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                  <span>Status</span>
                </div>
                <div className="text-dark-300">{task.status}</div>
              </div>

              {/* Assignee */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                  <Users className="w-4 h-4" />
                  <span>Assignee</span>
                </div>
                <div className="flex items-center gap-2">
                  {task.assignees.map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-dark-600 flex items-center justify-center text-sm text-dark-200"
                    >
                      {['F', 'Y', 'A'][i % 3]}
                    </div>
                  ))}
                </div>
              </div>

              {/* Priority */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                  <Flag className="w-4 h-4" />
                  <span>Priority</span>
                </div>
                <div className="flex items-center gap-2">
                  <Flag className="w-4 h-4 text-primary-500" />
                </div>
              </div>

              {/* Description */}
              <div>
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                  <span>Description</span>
                </div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-dark-100 focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[120px]"
                  placeholder="Enter a description..."
                />
              </div>

              {/* Add Task Button at bottom */}
              <button className="flex items-center gap-2 text-dark-400 hover:text-dark-200 transition-colors">
                <Plus className="w-4 h-4" />
                <span className="text-sm">Add task...</span>
              </button>
            </div>

            {/* Right Column - Metadata */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">
                  Status
                </label>
                <Select value={status} onValueChange={(value) => setStatus(value as TaskStatus)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To do</SelectItem>
                    <SelectItem value="in_progress">In progress</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5">
                  Priority
                </label>
                <Select value={priority} onValueChange={(value) => setPriority(value as TaskPriority)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <Input
                  type="date"
                  value={
                    task.startDate
                      ? new Date(task.startDate).toISOString().split('T')[0]
                      : ''
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <Input
                  type="date"
                  value={
                    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-200 mb-1.5 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Deadline
                </label>
                <Input
                  type="date"
                  value={
                    task.deadline ? new Date(task.deadline).toISOString().split('T')[0] : ''
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
