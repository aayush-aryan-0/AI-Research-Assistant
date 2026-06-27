'use client';

import { useState, useEffect } from 'react';
import Project from '@/app/(protected)/lib/type/Project.type';
import ProjectContext from '@/app/(protected)/lib/context/ProjectContext';

const LOCAL_STORAGE_KEY = 'current_project';

const defaultProject: Project = {
  id: '',
  user_id: '',
  title: '',
  timestamp: '',
};

export default function ProjectProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage safely (prevents Next.js hydration errors)
  const [project, setProject] = useState<Project>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultProject;
    }
    return defaultProject;
  });

  // Sync state changes to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(project));
    }
  }, [project]);

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
}
