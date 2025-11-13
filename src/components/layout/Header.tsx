import { useEffect } from 'react';
import { useTimerStore } from '@/store/timerStore';
import { useTaskStore } from '@/store/taskStore';
import { Select, Button } from '@/components/ui';
import { Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const {
    isRunning,
    selectedTaskId,
    elapsedSeconds,
    startTimer,
    stopTimer,
    tick,
    selectTask,
  } = useTimerStore();

  const tasks = useTaskStore((state) => state.tasks);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, tick]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartStop = () => {
    if (isRunning) {
      stopTimer();
    } else {
      if (selectedTaskId) {
        startTimer(selectedTaskId);
      }
    }
  };

  const taskOptions = [
    { value: '', label: 'Select task...' },
    ...tasks.map((task) => ({
      value: task.id,
      label: task.title,
    })),
  ];

  return (
    <header className="h-14 bg-dark-800 border-b border-dark-600 flex items-center justify-between px-4">
      {/* Left side - Menu toggle for mobile */}
      <button
        onClick={onToggleSidebar}
        className="p-2 hover:bg-dark-700 rounded transition-colors lg:hidden"
      >
        <Menu className="w-5 h-5 text-dark-200" />
      </button>

      {/* Center/Right - Time Tracker */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="min-w-[200px]">
          <Select
            options={taskOptions}
            value={selectedTaskId || ''}
            onChange={(e) => selectTask(e.target.value || null)}
            disabled={isRunning}
            className="text-sm"
          />
        </div>

        <div className="font-mono text-lg text-dark-100 min-w-[100px] text-center">
          {formatTime(elapsedSeconds)}
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleStartStop}
          disabled={!selectedTaskId && !isRunning}
          className="min-w-[70px]"
        >
          {isRunning ? 'Stop' : 'Start'}
        </Button>
      </div>
    </header>
  );
};
