import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { Modal, Input, Select, RichTextEditor } from '@/components/ui';
import { Task, TaskStatus, TaskPriority } from '@/types';
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

  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'todo');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'medium');

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

  const statusOptions = [
    { value: 'todo', label: 'To do' },
    { value: 'in_progress', label: 'In progress' },
    { value: 'complete', label: 'Complete' },
    { value: 'done', label: 'Done' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
  ];

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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Title */}
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full text-2xl font-semibold bg-transparent text-dark-100 border-none focus:outline-none mb-4"
          placeholder="Task title"
        />

        <div className="grid grid-cols-[1fr,400px] gap-6">
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
                <Flag className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-2 text-sm font-medium text-dark-200">
                <span>Description</span>
              </div>
              <RichTextEditor
                content={description}
                onChange={setDescription}
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
              <Select
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-200 mb-1.5">
                Priority
              </label>
              <Select
                options={priorityOptions}
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              />
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
    </Modal>
  );
};
