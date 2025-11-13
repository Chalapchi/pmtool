import { useState } from 'react';
import { useTimesheetStore } from '@/store/timesheetStore';
import { useProjectStore } from '@/store/projectStore';
import { Select } from '@/components/ui';
import { Users, Clock } from 'lucide-react';

export const TeamTimeView = () => {
  const projects = useProjectStore((state) => state.projects);
  const getProjectTimeByPerson = useTimesheetStore((state) => state.getProjectTimeByPerson);

  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');

  const projectTimeData = getProjectTimeByPerson(
    selectedProjectId === 'all' ? undefined : selectedProjectId
  );

  const formatHours = (seconds: number): string => {
    return (seconds / 3600).toFixed(2);
  };

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  // Group by project
  const projectGroups = projectTimeData.reduce((acc, item) => {
    if (!acc[item.projectId]) {
      acc[item.projectId] = {
        projectId: item.projectId,
        projectName: item.projectName,
        members: [],
        totalDuration: 0,
      };
    }
    acc[item.projectId].members.push(item);
    acc[item.projectId].totalDuration += item.totalDuration;
    return acc;
  }, {} as Record<string, { projectId: string; projectName: string; members: typeof projectTimeData; totalDuration: number }>);

  const projectOptions = [
    { value: 'all', label: 'All Projects' },
    ...projects.map((project) => ({
      value: project.id,
      label: project.name,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Project Filter */}
      <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
        <label className="block text-sm font-medium text-dark-200 mb-2">
          Filter by Project
        </label>
        <Select
          options={projectOptions}
          value={selectedProjectId}
          onChange={(e) => setSelectedProjectId(e.target.value)}
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <div className="text-dark-400 text-sm mb-1">Total Projects</div>
          <div className="text-2xl font-semibold text-dark-50">
            {Object.keys(projectGroups).length}
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <div className="text-dark-400 text-sm mb-1">Total Team Members</div>
          <div className="text-2xl font-semibold text-dark-50">
            {new Set(projectTimeData.map((item) => item.userId)).size}
          </div>
        </div>
        <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
          <div className="text-dark-400 text-sm mb-1">Total Hours</div>
          <div className="text-2xl font-semibold text-dark-50">
            {formatHours(projectTimeData.reduce((sum, item) => sum + item.totalDuration, 0))}h
          </div>
        </div>
      </div>

      {/* Project Time Breakdown */}
      <div className="space-y-6">
        {Object.keys(projectGroups).length === 0 ? (
          <div className="bg-dark-800 rounded-lg border border-dark-600 p-8 text-center">
            <Clock className="w-12 h-12 text-dark-500 mx-auto mb-3" />
            <p className="text-dark-400">No time entries found for the selected criteria</p>
          </div>
        ) : (
          Object.values(projectGroups).map((group) => (
            <div
              key={group.projectId}
              className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden"
            >
              {/* Project Header */}
              <div className="bg-dark-750 px-6 py-4 border-b border-dark-600">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-dark-50">{group.projectName}</h3>
                    <p className="text-sm text-dark-400 mt-1">
                      {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-semibold text-dark-50">
                      {formatHours(group.totalDuration)}h
                    </div>
                    <div className="text-sm text-dark-400">Total Time</div>
                  </div>
                </div>
              </div>

              {/* Team Members */}
              <div className="p-6">
                <div className="space-y-3">
                  {group.members.map((member) => (
                    <div
                      key={`${member.userId}-${member.projectId}`}
                      className="flex items-center justify-between p-4 bg-dark-750 rounded-lg hover:bg-dark-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-dark-100 font-medium">{member.userName}</div>
                          <div className="text-sm text-dark-400">
                            {member.entries.length} {member.entries.length === 1 ? 'entry' : 'entries'}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-dark-50">
                          {formatHours(member.totalDuration)}h
                        </div>
                        <div className="text-xs text-dark-400">
                          {formatDuration(member.totalDuration)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Detailed Breakdown Table */}
      {projectTimeData.length > 0 && (
        <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
          <div className="px-6 py-4 border-b border-dark-600">
            <h3 className="text-lg font-medium text-dark-50">Detailed Breakdown</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-600 bg-dark-750">
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark-300">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-dark-300">
                    Project
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-dark-300">
                    Entries
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-dark-300">
                    Hours
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-dark-300">
                    Percentage
                  </th>
                </tr>
              </thead>
              <tbody>
                {projectTimeData
                  .sort((a, b) => b.totalDuration - a.totalDuration)
                  .map((item, index) => {
                    const totalTime = projectTimeData.reduce((sum, i) => sum + i.totalDuration, 0);
                    const percentage = totalTime > 0 ? (item.totalDuration / totalTime) * 100 : 0;

                    return (
                      <tr
                        key={`${item.userId}-${item.projectId}-${index}`}
                        className="border-b border-dark-700 hover:bg-dark-750 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-xs text-white font-medium">
                              {item.userName.split(' ').map((n) => n[0]).join('')}
                            </div>
                            <span className="text-dark-100">{item.userName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-dark-200">{item.projectName}</td>
                        <td className="px-6 py-4 text-right text-dark-200">
                          {item.entries.length}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="text-dark-100 font-medium">
                            {formatHours(item.totalDuration)}h
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <div className="w-20 bg-dark-700 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-primary-500 h-full rounded-full"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-dark-300 text-sm min-w-[3rem] text-right">
                              {percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
