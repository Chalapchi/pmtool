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
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui';

export const Timesheet = () => {
  const currentUser = useAuthStore((state) => state.user);
  const {
    currentWeekStart,
    setCurrentWeek,
    getWeekEntries,
  } = useTimesheetStore();

  const [activeTab, setActiveTab] = useState<'my' | 'all'>('my');
  const [viewMode, setViewMode] = useState<'timesheet' | 'entries'>('timesheet');
  const [expandedPeople, setExpandedPeople] = useState<Set<string>>(new Set());

  const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeekStart, 1));
  };

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeekStart, 1));
  };

  const togglePersonExpanded = (userId: string) => {
    const newExpanded = new Set(expandedPeople);
    if (newExpanded.has(userId)) {
      newExpanded.delete(userId);
    } else {
      newExpanded.add(userId);
    }
    setExpandedPeople(newExpanded);
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours === 0) return `${minutes}m`;
    if (minutes === 0) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  // Group entries by user and task
  const weekEntries = getWeekEntries();
  const userGroups = new Map<string, { userName: string; tasks: Map<string, any[]> }>();

  weekEntries.forEach((entry) => {
    if (!userGroups.has(entry.userId)) {
      userGroups.set(entry.userId, {
        userName: getUserName(entry.userId),
        tasks: new Map(),
      });
    }
    const userGroup = userGroups.get(entry.userId)!;
    if (!userGroup.tasks.has(entry.taskId)) {
      userGroup.tasks.set(entry.taskId, []);
    }
    userGroup.tasks.get(entry.taskId)!.push(entry);
  });

  function getUserName(userId: string): string {
    const userNames: Record<string, string> = {
      'user-1': 'John Doe',
      'user-2': 'Jane Smith',
      'user-3': 'Bob Johnson',
    };
    return userNames[userId] || 'Unknown User';
  }

  function getTaskName(taskId: string): string {
    const taskNames: Record<string, string> = {
      'task-1': 'Design homepage',
      'task-2': 'Implement authentication',
      'task-3': 'Create timesheet view',
      'task-4': 'Fix navigation bug',
      'task-5': 'Update documentation',
    };
    return taskNames[taskId] || 'Unknown Task';
  }

  // Calculate total for a day
  const getDayTotal = (entries: any[], day: Date) => {
    return entries
      .filter((e) => isSameDay(new Date(e.date), day))
      .reduce((sum, e) => sum + e.duration, 0);
  };

  // Calculate total for all entries
  const getTotal = (entries: any[]) => {
    return entries.reduce((sum, e) => sum + e.duration, 0);
  };

  const filteredUserGroups = activeTab === 'my'
    ? new Map([[currentUser?.id || 'user-1', userGroups.get(currentUser?.id || 'user-1')!]])
    : userGroups;

  return (
    <Layout>
      <div className="flex-1 overflow-auto bg-dark-900">
        {/* Header */}
        <div className="border-b border-dark-700 bg-dark-800 px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold text-dark-50">Timesheet</h1>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-dark-700 rounded transition-colors">
                <Settings className="w-5 h-5 text-dark-300" />
              </button>
              <button className="p-2 hover:bg-dark-700 rounded transition-colors">
                <User className="w-5 h-5 text-dark-300" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('my')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'my'
                  ? 'border-primary-500 text-dark-50'
                  : 'border-transparent text-dark-400 hover:text-dark-200'
              }`}
            >
              My timesheet
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-2 px-1 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'all'
                  ? 'border-primary-500 text-dark-50'
                  : 'border-transparent text-dark-400 hover:text-dark-200'
              }`}
            >
              All timesheets
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Week Navigation */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handlePreviousWeek}
                className="p-1 hover:bg-dark-700 rounded transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-dark-300" />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1 hover:bg-dark-700 rounded transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-dark-300" />
              </button>
              <span className="text-sm font-medium text-dark-100">
                {format(currentWeekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
              </span>
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2 bg-dark-800 rounded-lg p-1 border border-dark-700">
              <button
                onClick={() => setViewMode('timesheet')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'timesheet'
                    ? 'bg-dark-700 text-dark-50'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Timesheet
              </button>
              <button
                onClick={() => setViewMode('entries')}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  viewMode === 'entries'
                    ? 'bg-dark-700 text-dark-50'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                Time entries
              </button>
            </div>
          </div>

          {/* View Content */}
          {viewMode === 'timesheet' ? (
            /* Timesheet Grid View */
            <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider w-64 sticky left-0 bg-dark-800 z-10">
                        {activeTab === 'all' ? 'Person' : 'Task / Location'}
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-dark-400 uppercase tracking-wider w-24">
                        Total
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day.toISOString()}
                          className="px-4 py-3 text-center text-xs font-medium text-dark-400 uppercase tracking-wider w-28"
                        >
                          <div>{format(day, 'EEE, MMM d')}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {Array.from(filteredUserGroups.entries()).map(([userId, userGroup]) => {
                      if (!userGroup) return null;

                      const isExpanded = expandedPeople.has(userId);
                      const allUserEntries = Array.from(userGroup.tasks.values()).flat();
                      const userTotal = getTotal(allUserEntries);

                      return (
                        <>
                          {/* Person Row */}
                          <tr
                            key={userId}
                            className="hover:bg-dark-750 transition-colors cursor-pointer"
                            onClick={() => togglePersonExpanded(userId)}
                          >
                            <td className="px-4 py-3 sticky left-0 bg-dark-800 z-10">
                              <div className="flex items-center gap-3">
                                <ChevronRight
                                  className={`w-4 h-4 text-dark-400 transition-transform ${
                                    isExpanded ? 'rotate-90' : ''
                                  }`}
                                />
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white text-sm font-medium">
                                  {userGroup.userName.split(' ').map((n) => n[0]).join('')}
                                </div>
                                <span className="text-sm font-medium text-dark-100">
                                  {userGroup.userName}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-center text-sm font-medium text-dark-100">
                              {formatTime(userTotal)}
                            </td>
                            {weekDays.map((day) => {
                              const dayTotal = getDayTotal(allUserEntries, day);
                              const intensity = Math.min(dayTotal / 28800, 1); // 8 hours max

                              return (
                                <td key={day.toISOString()} className="px-2 py-2">
                                  {dayTotal > 0 && (
                                    <div
                                      className="h-8 rounded"
                                      style={{
                                        backgroundColor: `rgba(255, 107, 53, ${intensity * 0.8 + 0.2})`,
                                      }}
                                    />
                                  )}
                                </td>
                              );
                            })}
                          </tr>

                          {/* Task Rows (when expanded) */}
                          {isExpanded &&
                            Array.from(userGroup.tasks.entries()).map(([taskId, taskEntries]) => {
                              const taskTotal = getTotal(taskEntries);

                              return (
                                <tr
                                  key={`${userId}-${taskId}`}
                                  className="bg-dark-850 hover:bg-dark-800 transition-colors"
                                >
                                  <td className="px-4 py-3 pl-16 sticky left-0 bg-dark-850 z-10">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 rounded-full bg-primary-500" />
                                      <span className="text-sm text-dark-200">
                                        {getTaskName(taskId)}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center text-sm text-dark-200">
                                    {formatTime(taskTotal)}
                                  </td>
                                  {weekDays.map((day) => {
                                    const dayTotal = getDayTotal(taskEntries, day);

                                    return (
                                      <td
                                        key={day.toISOString()}
                                        className="px-4 py-3 text-center text-sm text-dark-200 hover:bg-dark-700 cursor-pointer transition-colors"
                                      >
                                        {dayTotal > 0 ? formatTime(dayTotal) : '—'}
                                      </td>
                                    );
                                  })}
                                </tr>
                              );
                            })}
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Task Button */}
              <div className="p-4 border-t border-dark-700">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add task
                </Button>
              </div>
            </div>
          ) : (
            /* Time Entries List View */
            <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-dark-700">
                      <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider w-80 sticky left-0 bg-dark-800 z-10">
                        Task / Location
                      </th>
                      {weekDays.map((day) => (
                        <th
                          key={day.toISOString()}
                          className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider"
                        >
                          <div>{format(day, 'EEE, MMM d')}</div>
                          <div className="text-xs text-dark-500 font-normal mt-0.5">0h</div>
                        </th>
                      ))}
                      <th className="px-4 py-3 text-left text-xs font-medium text-dark-400 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-700">
                    {Array.from(userGroups.entries()).flatMap(([userId, userGroup]) => {
                      if (!userGroup) return [];

                      return Array.from(userGroup.tasks.entries()).map(([taskId, taskEntries]) => {
                        const taskTotal = getTotal(taskEntries);

                        return (
                          <tr
                            key={`${userId}-${taskId}`}
                            className="hover:bg-dark-750 transition-colors"
                          >
                            <td className="px-4 py-3 sticky left-0 bg-dark-800 z-10">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                <div>
                                  <div className="text-sm font-medium text-dark-100">
                                    {getTaskName(taskId)}
                                  </div>
                                  <div className="text-xs text-dark-400 mt-0.5">
                                    In Progress • LogicFlow / Project
                                  </div>
                                </div>
                              </div>
                            </td>
                            {weekDays.map((day) => {
                              const dayTotal = getDayTotal(taskEntries, day);

                              return (
                                <td
                                  key={day.toISOString()}
                                  className="px-4 py-3 text-sm text-dark-200"
                                >
                                  {dayTotal > 0 ? formatTime(dayTotal) : '—'}
                                </td>
                              );
                            })}
                            <td className="px-4 py-3 text-sm font-medium text-dark-100">
                              {formatTime(taskTotal)}
                            </td>
                          </tr>
                        );
                      });
                    })}
                  </tbody>
                </table>
              </div>

              {/* Add Task Button */}
              <div className="p-4 border-t border-dark-700">
                <Button variant="primary" size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add task
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};
