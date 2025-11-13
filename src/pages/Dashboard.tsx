import { useNavigate } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { Layout } from '@/components/layout';
import { Folder, Star } from 'lucide-react';

export const Dashboard = () => {
  const projects = useProjectStore((state) => state.projects);
  const navigate = useNavigate();

  const favoriteProjects = projects.filter((p) => p.isFavorite);
  const recentProjects = projects.slice(0, 6);

  return (
    <Layout>
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-dark-100 mb-2">
            Welcome to LogicFlow
          </h1>
          <p className="text-sm sm:text-base text-dark-400">
            Manage your projects and tasks efficiently
          </p>
        </div>

        {/* Favorites */}
        {favoriteProjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 text-yellow-500" />
              <h2 className="text-lg sm:text-xl font-semibold text-dark-100">Favorite Projects</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {favoriteProjects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/project/${project.id}`)}
                  className="p-4 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors text-left"
                >
                  <div className="flex items-start justify-between mb-2">
                    <Folder className="w-6 h-6 text-primary" />
                    <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                  </div>
                  <h3 className="font-medium text-dark-100 mb-1">{project.name}</h3>
                  <p className="text-sm text-dark-400">
                    {project.members.length} members
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent Projects */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-dark-100 mb-4">Recent Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {recentProjects.map((project) => (
              <button
                key={project.id}
                onClick={() => navigate(`/project/${project.id}`)}
                className="p-4 bg-dark-800 hover:bg-dark-700 border border-dark-600 rounded-lg transition-colors text-left"
              >
                <div className="flex items-start justify-between mb-2">
                  <Folder className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-medium text-dark-100 mb-1">{project.name}</h3>
                <p className="text-sm text-dark-400">
                  Updated {new Date(project.updatedAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};
