import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { ChevronDown, ChevronRight, Star, Folder } from 'lucide-react';
import clsx from 'clsx';

interface SidebarProps {
  onProjectSelect: (projectId: string) => void;
  selectedProjectId?: string;
}

export const Sidebar = ({ onProjectSelect, selectedProjectId }: SidebarProps) => {
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);

  const projects = useProjectStore((state) => state.projects);
  const toggleFavorite = useProjectStore((state) => state.toggleFavorite);

  const favoriteProjects = projects.filter((p) => p.isFavorite);
  const regularProjects = projects.filter((p) => !p.isFavorite);

  return (
    <aside className="w-56 bg-dark-800 border-r border-dark-600 flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-dark-600">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold text-dark-100">Logicflow</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar p-2">
        {/* Favorites */}
        <div className="mb-4">
          <button
            onClick={() => setFavoritesOpen(!favoritesOpen)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-dark-200 hover:bg-dark-700 rounded transition-colors"
          >
            {favoritesOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Star className="w-4 h-4" />
            <span>Favorites</span>
          </button>

          {favoritesOpen && favoriteProjects.length > 0 && (
            <div className="mt-1 ml-6 space-y-0.5">
              {favoriteProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectSelect(project.id)}
                  className={clsx(
                    'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors',
                    selectedProjectId === project.id
                      ? 'bg-dark-700 text-dark-100'
                      : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                  )}
                >
                  <Folder className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{project.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Projects */}
        <div>
          <button
            onClick={() => setProjectsOpen(!projectsOpen)}
            className="flex items-center gap-2 w-full px-2 py-1.5 text-sm text-dark-200 hover:bg-dark-700 rounded transition-colors"
          >
            {projectsOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
            <Folder className="w-4 h-4" />
            <span>Projects</span>
          </button>

          {projectsOpen && (
            <div className="mt-1 space-y-0.5">
              {/* Folderless section */}
              <div className="ml-6 space-y-0.5">
                <div className="flex items-center gap-2 px-2 py-1 text-xs text-dark-400">
                  {projectsOpen ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                  <Folder className="w-3 h-3" />
                  <span>Folderless</span>
                </div>

                <div className="ml-5 space-y-0.5">
                  {regularProjects.map((project) => (
                    <button
                      key={project.id}
                      onClick={() => onProjectSelect(project.id)}
                      className={clsx(
                        'flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded transition-colors',
                        selectedProjectId === project.id
                          ? 'bg-dark-700 text-dark-100'
                          : 'text-dark-300 hover:bg-dark-700 hover:text-dark-100'
                      )}
                    >
                      <Folder className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{project.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Bottom section - could add user profile or settings */}
      <div className="p-2 border-t border-dark-600">
        <div className="text-xs text-dark-400 px-2">Keyboard Shortcuts</div>
      </div>
    </aside>
  );
};
