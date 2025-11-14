'use client';

import { use, useState } from 'react';
import { useProjectStore } from '@/stores/projectStore';
import { ProjectView as ProjectViewType } from '@/types';
import { Layout } from '@/components/layout';
import { TaskList, TaskBoard, TaskModal } from '@/components/tasks';
import { ProjectOverview } from '@/components/projects';
import { Star, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProjectViewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  const currentView = useProjectStore((state) => state.currentView);
  const setCurrentView = useProjectStore((state) => state.setCurrentView);
  const toggleFavorite = useProjectStore((state) => state.toggleFavorite);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  if (!project || !projectId) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <p className="text-dark-400">Project not found</p>
        </div>
      </Layout>
    );
  }

  const views: { id: ProjectViewType; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'list', label: 'List' },
    { id: 'board', label: 'Board' },
    { id: 'files', label: 'Files' },
  ];

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
  };

  return (
    <Layout selectedProjectId={projectId}>
      <div className="flex flex-col h-full">
        {/* Project Header */}
        <div className="bg-dark-800 border-b border-dark-600">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            {/* Project Name and Star */}
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <button className="p-1 hover:bg-dark-700 rounded transition-colors hidden sm:block">
                <ChevronDown className="w-5 h-5 text-dark-300" />
              </button>
              <h1 className="text-lg sm:text-xl font-semibold text-dark-100 truncate flex-1">{project.name}</h1>
              <button
                onClick={() => toggleFavorite(project.id)}
                className="p-1 hover:bg-dark-700 rounded transition-colors flex-shrink-0"
              >
                <Star
                  className={cn(
                    'w-5 h-5',
                    project.isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-dark-400'
                  )}
                />
              </button>
            </div>

            {/* View Tabs - Scrollable on mobile */}
            <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              {views.map((view) => (
                <button
                  key={view.id}
                  onClick={() => setCurrentView(view.id)}
                  className={cn(
                    'px-3 sm:px-4 py-2 rounded-t text-sm font-medium transition-colors whitespace-nowrap flex-shrink-0',
                    currentView === view.id
                      ? 'bg-dark-900 text-dark-100'
                      : 'text-dark-400 hover:text-dark-200 hover:bg-dark-700'
                  )}
                >
                  {view.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Content */}
        <div className="flex-1 overflow-hidden bg-dark-900">
          {currentView === 'overview' && <ProjectOverview projectId={projectId} />}
          {currentView === 'list' && (
            <TaskList projectId={projectId} onTaskClick={handleTaskClick} />
          )}
          {currentView === 'board' && (
            <TaskBoard projectId={projectId} onTaskClick={handleTaskClick} />
          )}
          {currentView === 'files' && (
            <div className="p-6 text-center text-dark-400">Files view coming soon...</div>
          )}
        </div>
      </div>

      {/* Task Modal */}
      <TaskModal
        taskId={selectedTaskId}
        isOpen={selectedTaskId !== null}
        onClose={() => setSelectedTaskId(null)}
      />
    </Layout>
  );
}
