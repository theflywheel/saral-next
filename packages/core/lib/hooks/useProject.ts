import { useState, useCallback } from 'react';
import { Project, CaptureType } from '../types';
import { generateId } from '../utils/helpers';

export interface UseProjectReturn {
  projects: Project[];
  currentProject: Project | null;
  createProject: (name: string, description: string) => Project;
  updateProject: (projectId: string, updates: Partial<Project>) => void;
  deleteProject: (projectId: string) => void;
  loadProject: (projectId: string) => Project | null;
  setCurrentProject: (project: Project | null) => void;
}

export function useProject(): UseProjectReturn {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  const createProject = useCallback((name: string, description: string): Project => {
    const newProject: Project = {
      id: generateId(),
      name,
      description,
      createdAt: new Date(),
      updatedAt: new Date(),
      sources: [],
      sinks: [],
      captureConfig: {
        id: generateId(),
        captureType: [CaptureType.DOCUMENT],
        documentConfig: {
          allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSizeMB: 10,
          requireOCR: false,
        },
      },
    };

    setProjects(prev => [...prev, newProject]);
    setCurrentProject(newProject);
    
    return newProject;
  }, []);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => 
      prev.map(project => 
        project.id === projectId 
          ? { ...project, ...updates, updatedAt: new Date() } 
          : project
      )
    );

    if (currentProject?.id === projectId) {
      setCurrentProject(prev => 
        prev ? { ...prev, ...updates, updatedAt: new Date() } : null
      );
    }
  }, [currentProject]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
    
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
    }
  }, [currentProject]);

  const loadProject = useCallback((projectId: string) => {
    const project = projects.find(p => p.id === projectId) || null;
    setCurrentProject(project);
    return project;
  }, [projects]);

  return {
    projects,
    currentProject,
    createProject,
    updateProject,
    deleteProject,
    loadProject,
    setCurrentProject,
  };
}