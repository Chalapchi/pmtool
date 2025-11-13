import { useState, useEffect } from 'react';
import { Modal, Button, Input, Select } from '@/components/ui';
import { useTimesheetStore } from '@/store/timesheetStore';
import { useTaskStore } from '@/store/taskStore';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { format } from 'date-fns';
import { Clock } from 'lucide-react';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: Date;
}

export const TimeEntryModal = ({
  isOpen,
  onClose,
  defaultDate = new Date(),
}: TimeEntryModalProps) => {
  const currentUser = useAuthStore((state) => state.user);
  const addTimeEntry = useTimesheetStore((state) => state.addTimeEntry);
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);

  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [date, setDate] = useState(format(defaultDate, 'yyyy-MM-dd'));
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setDate(format(defaultDate, 'yyyy-MM-dd'));
      setSelectedTaskId('');
      setSelectedProjectId('');
      setHours('');
      setMinutes('');
      setDescription('');
      setErrors({});
    }
  }, [isOpen, defaultDate]);

  // When task is selected, auto-select its project
  useEffect(() => {
    if (selectedTaskId) {
      const task = tasks.find((t) => t.id === selectedTaskId);
      if (task) {
        setSelectedProjectId(task.projectId);
      }
    }
  }, [selectedTaskId, tasks]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!selectedTaskId && !selectedProjectId) {
      newErrors.task = 'Please select a task or project';
    }

    if (!date) {
      newErrors.date = 'Please select a date';
    }

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;

    if (h === 0 && m === 0) {
      newErrors.time = 'Please enter time (hours and/or minutes)';
    }

    if (h < 0 || h > 24) {
      newErrors.hours = 'Hours must be between 0 and 24';
    }

    if (m < 0 || m > 59) {
      newErrors.minutes = 'Minutes must be between 0 and 59';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm() || !currentUser) return;

    const h = parseInt(hours) || 0;
    const m = parseInt(minutes) || 0;
    const totalSeconds = h * 3600 + m * 60;

    const entryDate = new Date(date);
    const startTime = new Date(date);
    startTime.setHours(9, 0, 0, 0); // Default start time 9 AM

    const endTime = new Date(startTime.getTime() + totalSeconds * 1000);

    // If no task selected, we need to handle project-only entries
    // For now, we'll create a default task entry
    const taskId = selectedTaskId || `task-default-${Date.now()}`;
    const projectId = selectedProjectId || tasks.find((t) => t.id === selectedTaskId)?.projectId || 'project-1';

    addTimeEntry({
      taskId,
      userId: currentUser.id,
      projectId,
      date: entryDate,
      startTime,
      endTime,
      duration: totalSeconds,
      description: description || undefined,
      isManual: true,
    });

    onClose();
  };

  const taskOptions = [
    { value: '', label: 'Select a task...' },
    ...tasks.map((task) => ({
      value: task.id,
      label: task.title,
    })),
  ];

  const projectOptions = [
    { value: '', label: 'Select a project...' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Entry">
      <div className="space-y-4">
        {/* Task Selection */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Task
          </label>
          <Select
            options={taskOptions}
            value={selectedTaskId}
            onChange={(e) => setSelectedTaskId(e.target.value)}
          />
          {errors.task && (
            <p className="mt-1 text-sm text-red-400">{errors.task}</p>
          )}
        </div>

        {/* Project Selection (if no task selected) */}
        {!selectedTaskId && (
          <div>
            <label className="block text-sm font-medium text-dark-200 mb-2">
              Project
            </label>
            <Select
              options={projectOptions}
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
            />
          </div>
        )}

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Date
          </label>
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          {errors.date && (
            <p className="mt-1 text-sm text-red-400">{errors.date}</p>
          )}
        </div>

        {/* Time Duration */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Time Spent
          </label>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="24"
                  placeholder="0"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                  className="text-center"
                />
                <span className="text-dark-300 text-sm">hours</span>
              </div>
              {errors.hours && (
                <p className="mt-1 text-sm text-red-400">{errors.hours}</p>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="59"
                  placeholder="0"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  className="text-center"
                />
                <span className="text-dark-300 text-sm">minutes</span>
              </div>
              {errors.minutes && (
                <p className="mt-1 text-sm text-red-400">{errors.minutes}</p>
              )}
            </div>
          </div>
          {errors.time && (
            <p className="mt-1 text-sm text-red-400">{errors.time}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-dark-200 mb-2">
            Description (optional)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you work on?"
            rows={3}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-dark-100 placeholder-dark-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-dark-600">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            <Clock className="w-4 h-4 mr-2" />
            Add Time
          </Button>
        </div>
      </div>
    </Modal>
  );
};
