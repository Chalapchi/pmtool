import { useState } from 'react';
import { useTaskStore } from '@/store/taskStore';
import { TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { Plus } from 'lucide-react';
import clsx from 'clsx';

interface TaskBoardProps {
  projectId: string;
  onTaskClick: (taskId: string) => void;
}

const columns: { status: TaskStatus; label: string; color: string }[] = [
  { status: 'todo', label: 'Очікує виконання', color: 'border-dark-500' },
  { status: 'in_progress', label: 'В роботі', color: 'border-green-500' },
  { status: 'complete', label: 'Постійна', color: 'border-blue-500' },
  { status: 'done', label: 'Виконано', color: 'border-blue-400' },
];

export const TaskBoard = ({ projectId, onTaskClick }: TaskBoardProps) => {
  const getTasksByStatus = useTaskStore((state) => state.getTasksByStatus);
  const moveTask = useTaskStore((state) => state.moveTask);

  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  const handleDragStart = (taskId: string) => {
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: TaskStatus) => {
    if (draggedTaskId) {
      moveTask(draggedTaskId, status);
      setDraggedTaskId(null);
    }
  };

  return (
    <div className="p-4 sm:p-6 h-full">
      {/* Horizontal scroll wrapper for mobile */}
      <div className="h-full overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="grid grid-cols-4 gap-3 sm:gap-4 h-full min-w-max md:min-w-0">
          {columns.map(({ status, label, color }) => {
            const tasks = getTasksByStatus(projectId, status);

            return (
              <div
                key={status}
                className={clsx('flex flex-col border-t-2 rounded-t w-64 md:w-auto', color)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(status)}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-3 sm:px-4 py-3 bg-dark-800 border-b border-dark-600">
                  <h3 className="font-medium text-dark-100 text-sm sm:text-base truncate">{label}</h3>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-sm text-dark-400">{tasks.length}</span>
                    <button className="text-dark-400 hover:text-dark-200 transition-colors">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tasks */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-dark-900">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task.id)}
                      className="cursor-move"
                    >
                      <TaskCard task={task} onClick={() => onTaskClick(task.id)} />
                    </div>
                  ))}

                  {/* Add Task Button */}
                  <button className="w-full flex items-center justify-center gap-2 p-2 sm:p-3 border-2 border-dashed border-dark-600 rounded text-dark-400 hover:border-dark-500 hover:text-dark-300 transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="text-xs sm:text-sm">Add task...</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
