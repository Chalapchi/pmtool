import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { ChevronDown, ChevronRight, Plus, Flag, Clock } from 'lucide-react';
import clsx from 'clsx';

interface TaskListProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

const statusGroups: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'To do', color: 'text-dark-300' },
  { status: 'in_progress', label: 'In progress', color: 'text-green-500' },
  { status: 'complete', label: 'Постiйна', color: 'text-blue-500' },
  { status: 'done', label: 'Виконано', color: 'text-blue-400' },
];

export const TaskList = ({ projectId, onTaskClick }: TaskListProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Record<TaskStatus, boolean>>({
    todo: true,
    in_progress: true,
    complete: true,
    done: true,
  });

  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus);

  const toggleGroup = (status: TaskStatus) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  const formatTimeSpent = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-primary';
      case 'low':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const getAssigneeInitials = (assignees: string[]) => {
    // Mock assignees
    const initials = ['F', 'Y', 'A', 'S', 'I'];
    return assignees.slice(0, 2).map((_, i) => initials[i % initials.length]).join(' ');
  };

  return (
    <div className="p-6">
      {/* Column Headers */}
      <div className="grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 mb-4 px-4 text-sm font-medium text-dark-400">
        <div>Name</div>
        <div>Priority</div>
        <div>Assignee</div>
        <div>Time Spent</div>
        <div>Due Date</div>
      </div>

      {/* Task Groups */}
      <div className="space-y-2">
        {statusGroups.map(({ status, label, color }) => {
          const tasks = getTasksByStatus(projectId, status);

          return (
            <div key={status} className="border border-dark-600 rounded-lg overflow-hidden">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(status)}
                className={clsx(
                  'w-full flex items-center justify-between px-4 py-2 bg-dark-800 hover:bg-dark-700 transition-colors',
                  color
                )}
              >
                <div className="flex items-center gap-2">
                  {expandedGroups[status] ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                  <span className="font-medium">{label}</span>
                  <span className="text-dark-400">+</span>
                </div>
                <span className="text-sm text-dark-400">{tasks.length}</span>
              </button>

              {/* Tasks */}
              {expandedGroups[status] && tasks.length > 0 && (
                <div className="divide-y divide-dark-600">
                  {tasks.map((task) => (
                    <button
                      key={task.id}
                      onClick={() => onTaskClick(task.id)}
                      className="w-full grid grid-cols-[2fr,1fr,1fr,1fr,1fr] gap-4 px-4 py-3 hover:bg-dark-700 transition-colors text-left"
                    >
                      {/* Name */}
                      <div className="flex items-center gap-2">
                        <Flag
                          className={clsx('w-4 h-4', getPriorityColor(task.priority))}
                        />
                        <span className="text-dark-100 truncate">{task.title}</span>
                      </div>

                      {/* Priority */}
                      <div className="flex items-center">
                        <Flag
                          className={clsx('w-4 h-4', getPriorityColor(task.priority))}
                        />
                      </div>

                      {/* Assignee */}
                      <div className="text-dark-300 text-sm truncate">
                        {getAssigneeInitials(task.assignees)}
                      </div>

                      {/* Time Spent */}
                      <div className="flex items-center gap-1 text-dark-300 text-sm">
                        {task.timeSpent > 0 && (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>{formatTimeSpent(task.timeSpent)}</span>
                          </>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="text-dark-300 text-sm">
                        {task.deadline
                          ? new Date(task.deadline).toLocaleDateString('en-GB')
                          : ''}
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Add Task Button */}
              {expandedGroups[status] && (
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-dark-400 hover:bg-dark-700 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Add task...</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
