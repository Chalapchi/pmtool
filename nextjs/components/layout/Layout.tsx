'use client';

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
  selectedProjectId?: string;
}

export const Layout = ({ children, selectedProjectId }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default closed on mobile
  const router = useRouter();

  const handleProjectSelect = (projectId: string) => {
    router.push(`/project/${projectId}`);
    setSidebarOpen(false); // Close sidebar after selection on mobile
  };

  return (
    <div className="flex h-screen bg-dark-900">
      {/* Sidebar - hidden on mobile by default */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:static lg:translate-x-0 inset-y-0 left-0 z-30 transition-transform duration-300`}
      >
        <Sidebar
          onProjectSelect={handleProjectSelect}
          selectedProjectId={selectedProjectId}
        />
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 overflow-auto custom-scrollbar">{children}</main>
      </div>
    </div>
  );
};
