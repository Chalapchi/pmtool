import { useState } from 'react';
import { Layout } from '@/components/layout';
import { useTimesheetStore } from '@/store/timesheetStore';
import { useAuthStore } from '@/store/authStore';
import {
  endOfWeek,
  eachDayOfInterval,
  format,
  addWeeks,
  subWeeks,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Clock } from 'lucide-react';
import { Button } from '@/components/ui';
import { TimeEntryModal } from '@/components/time/TimeEntryModal';
import { TeamTimeView } from '@/components/time/TeamTimeView';

export const Timesheet = () => {
  const currentUser = useAuthStore((state) => state.user);
  const {
    currentWeekStart,
    setCurrentWeek,
    selectedView,
    setSelectedView,
    getWeekEntries,
    getDayEntries,
    getTaskTimeSummary,
    getTotalTime,
  } = useTimesheetStore();

  const [isAddTimeModalOpen, setIsAddTimeModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  const weekEntries = getWeekEntries(currentUser?.id);
  const taskSummary = getTaskTimeSummary(currentUser?.id);

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeekStart, 1));
  };

  const handleCurrentWeek = () => {
    setCurrentWeek(new Date());
  };

  const handleAddTime = (date?: Date) => {
    setSelectedDate(date || new Date());
    setIsAddTimeModalOpen(true);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatHours = (seconds: number): string => {
    return (seconds / 3600).toFixed(2);
  };

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-dark-900">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-dark-50 mb-2">Timesheet</h1>
            <p className="text-dark-300">Track and manage your time entries</p>
          </div>

          {/* View Toggle */}
          <div className="mb-6 flex gap-2">
            <Button
              variant={selectedView === 'my-time' ? 'primary' : 'secondary'}
              onClick={() => setSelectedView('my-time')}
              size="sm"
            >
              My Time
            </Button>
            <Button
              variant={selectedView === 'team-time' ? 'primary' : 'secondary'}
              onClick={() => setSelectedView('team-time')}
              size="sm"
            >
              Team Time
            </Button>
          </div>

          {selectedView === 'my-time' ? (
            <>
              {/* Week Navigation */}
              <div className="mb-6 flex items-center justify-between bg-dark-800 rounded-lg p-4 border border-dark-600">
                <Button variant="ghost" size="sm" onClick={handlePreviousWeek}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-medium text-dark-50">
                    {format(currentWeekStart, 'MMM d')} -{' '}
                    {format(weekEnd, 'MMM d, yyyy')}
                  </h2>
                  <Button variant="secondary" size="sm" onClick={handleCurrentWeek}>
                    This Week
                  </Button>
                </div>

                <Button variant="ghost" size="sm" onClick={handleNextWeek}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Weekly Summary */}
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
                  <div className="text-dark-400 text-sm mb-1">Total Hours</div>
                  <div className="text-2xl font-semibold text-dark-50">
                    {formatHours(getTotalTime(weekEntries))}h
                  </div>
                </div>
                <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
                  <div className="text-dark-400 text-sm mb-1">Tasks Worked On</div>
                  <div className="text-2xl font-semibold text-dark-50">
                    {taskSummary.length}
                  </div>
                </div>
                <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
                  <div className="text-dark-400 text-sm mb-1">Time Entries</div>
                  <div className="text-2xl font-semibold text-dark-50">
                    {weekEntries.length}
                  </div>
                </div>
              </div>

              {/* Daily Time Grid */}
              <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden mb-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-dark-600">
                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">
                          Day
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">
                          Date
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-dark-300">
                          Tasks
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-dark-300">
                          Hours
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-dark-300">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {weekDays.map((day) => {
                        const dayEntries = getDayEntries(day, currentUser?.id);
                        const dayTotal = getTotalTime(dayEntries);
                        const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                        return (
                          <tr
                            key={day.toISOString()}
                            className={`border-b border-dark-700 ${
                              isWeekend ? 'bg-dark-850' : ''
                            } ${isToday(day) ? 'bg-dark-750' : ''} hover:bg-dark-750`}
                          >
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-dark-100 font-medium">
                                  {format(day, 'EEE')}
                                </span>
                                {isToday(day) && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary-500/20 text-primary-400">
                                    Today
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-dark-300">
                              {format(day, 'MMM d')}
                            </td>
                            <td className="px-4 py-3">
                              <div className="space-y-1">
                                {dayEntries.length === 0 ? (
                                  <span className="text-dark-500 text-sm">No entries</span>
                                ) : (
                                  dayEntries.slice(0, 3).map((entry) => (
                                    <div
                                      key={entry.id}
                                      className="text-sm text-dark-200 flex items-center gap-2"
                                    >
                                      <Clock className="w-3 h-3 text-dark-500" />
                                      <span className="truncate max-w-[200px]">
                                        {entry.description || 'Time entry'}
                                      </span>
                                      <span className="text-dark-500">
                                        {formatDuration(entry.duration)}
                                      </span>
                                    </div>
                                  ))
                                )}
                                {dayEntries.length > 3 && (
                                  <div className="text-xs text-dark-400">
                                    +{dayEntries.length - 3} more
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-dark-100 font-medium">
                                {formatHours(dayTotal)}h
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleAddTime(day)}
                              >
                                <Plus className="w-4 h-4" />
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-dark-750">
                        <td colSpan={3} className="px-4 py-3 text-right font-medium text-dark-100">
                          Week Total
                        </td>
                        <td className="px-4 py-3 text-right font-semibold text-dark-50 text-lg">
                          {formatHours(getTotalTime(weekEntries))}h
                        </td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Task Summary */}
              <div className="bg-dark-800 rounded-lg border border-dark-600 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-dark-50">Time by Task</h3>
                  <Button variant="secondary" size="sm" onClick={() => handleAddTime()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time
                  </Button>
                </div>

                {taskSummary.length === 0 ? (
                  <div className="text-center py-8 text-dark-400">
                    No time entries for this week
                  </div>
                ) : (
                  <div className="space-y-3">
                    {taskSummary.map((task) => (
                      <div
                        key={task.taskId}
                        className="flex items-center justify-between p-3 bg-dark-750 rounded-lg hover:bg-dark-700 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="text-dark-100 font-medium">{task.taskName}</div>
                          <div className="text-sm text-dark-400">{task.projectName}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-dark-100 font-medium">
                            {formatHours(task.totalDuration)}h
                          </div>
                          <div className="text-xs text-dark-400">
                            {task.entries.length} {task.entries.length === 1 ? 'entry' : 'entries'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <TeamTimeView />
          )}
        </div>
      </div>

      {/* Add Time Entry Modal */}
      <TimeEntryModal
        isOpen={isAddTimeModalOpen}
        onClose={() => {
          setIsAddTimeModalOpen(false);
          setSelectedDate(null);
        }}
        defaultDate={selectedDate || new Date()}
      />
    </Layout>
  );
};
