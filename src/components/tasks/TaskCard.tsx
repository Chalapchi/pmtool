import { Task } from '@/types';
import { Flag, Clock } from 'lucide-react';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

export const TaskCard = ({ task, onClick }: TaskCardProps) => {
  const formatTimeSpent = (minutes: number) => {
    if (minutes < 60) return `${minutes}min`;

    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours >= 24) {
      const days = Math.floor(hours / 24);
      const remainingHours = hours % 24;
      return `${days}d ${remainingHours}h`;
    }

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

  const getAssigneeInitials = (index: number) => {
    // Mock assignees - in real app would get from user store
    const assignees = ['F', 'Y', 'A', 'S', 'I'];
    return assignees[index % assignees.length];
  };

  return (
    <button
      onClick={onClick}
      className="w-full text-left p-3 bg-dark-800 hover:bg-dark-700 rounded border border-dark-600 transition-colors group"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-sm text-dark-100 flex-1 line-clamp-2">{task.title}</h4>
        <Flag className={clsx('w-4 h-4 flex-shrink-0', getPriorityColor(task.priority))} />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {task.assignees.slice(0, 3).map((_, index) => (
            <div
              key={index}
              className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-xs text-dark-200"
            >
              {getAssigneeInitials(index)}
            </div>
          ))}
          {task.assignees.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-dark-600 flex items-center justify-center text-xs text-dark-200">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>

        {task.timeSpent > 0 && (
          <div className="flex items-center gap-1 text-xs text-dark-400">
            <Clock className="w-3 h-3" />
            <span>{formatTimeSpent(task.timeSpent)}</span>
          </div>
        )}
      </div>

      {task.deadline && (
        <div className="mt-2 text-xs text-dark-400">
          Due: {new Date(task.deadline).toLocaleDateString()}
        </div>
      )}
    </button>
  );
};
