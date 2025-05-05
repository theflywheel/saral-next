import { Project, SourceConfig, SinkConfig, CaptureConfig } from './types';
import { generateId } from './utils/helpers';
import { storage } from './utils/storage';
import { isValidProjectName } from './utils/validation';

/**
 * Service class for managing projects
 */
export class ProjectService {
  private readonly storageKey: string;
  
  constructor(storageKey = 'projects') {
    this.storageKey = storageKey;
  }

  /**
   * Get all projects
   * @returns Array of projects
   */
  getAllProjects(): Project[] {
    const projects = storage.getItem<Project[]>(this.storageKey, []) || [];
    return projects.map(project => this.deserializeProject(project));
  }

  /**
   * Get project by ID
   * @param id Project ID to find
   * @returns Project or null if not found
   */
  getProjectById(id: string): Project | null {
    const projects = this.getAllProjects();
    return projects.find(project => project.id === id) || null;
  }

  /**
   * Create a new project
   * @param name Project name
   * @param description Project description
   * @returns The created project
   * @throws Error if project name is invalid
   */
  createProject(name: string, description: string): Project {
    if (!isValidProjectName(name)) {
      throw new Error('Invalid project name. Project name must be between 1-100 characters.');
    }
    
    const now = new Date();
    const project: Project = {
      id: generateId(),
      name,
      description,
      createdAt: now,
      updatedAt: now,
      sources: [],
      sinks: [],
      captureConfig: {
        id: generateId(),
        captureType: [],
        documentConfig: {
          allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
          maxSizeMB: 10,
          requireOCR: false
        },
        imageConfig: {
          allowedTypes: ['image/jpeg', 'image/png'],
          maxSizeMB: 5,
          resizeOptions: {
            maxWidth: 1920,
            maxHeight: 1080,
            maintainAspectRatio: true
          }
        }
      }
    };
    
    const projects = this.getAllProjects();
    projects.push(project);
    storage.setItem(this.storageKey, projects);
    
    return project;
  }

  /**
   * Update an existing project
   * @param id Project ID to update
   * @param updates Partial project updates
   * @returns The updated project or null if not found
   */
  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) {
      return null;
    }
    
    // Don't allow updating critical fields directly
    const { id: _, createdAt: __, ...allowedUpdates } = updates;
    
    const updatedProject = {
      ...projects[index],
      ...allowedUpdates,
      updatedAt: new Date()
    };
    
    projects[index] = updatedProject;
    storage.setItem(this.storageKey, projects);
    
    return updatedProject;
  }

  /**
   * Delete a project
   * @param id Project ID to delete
   * @returns True if deleted, false if not found
   */
  deleteProject(id: string): boolean {
    const projects = this.getAllProjects();
    const index = projects.findIndex(project => project.id === id);
    
    if (index === -1) {
      return false;
    }
    
    projects.splice(index, 1);
    storage.setItem(this.storageKey, projects);
    
    return true;
  }

  /**
   * Add a source to a project
   * @param projectId Project ID
   * @param source Source to add
   * @returns The updated project or null if not found
   */
  addSource(projectId: string, source: SourceConfig): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    project.sources.push(source);
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Update a source in a project
   * @param projectId Project ID
   * @param sourceId Source ID to update
   * @param updates Partial source updates
   * @returns The updated project or null if not found
   */
  updateSource(projectId: string, sourceId: string, updates: Partial<SourceConfig>): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    const sourceIndex = project.sources.findIndex(s => s.id === sourceId);
    
    if (sourceIndex === -1) {
      return null;
    }
    
    project.sources[sourceIndex] = {
      ...project.sources[sourceIndex],
      ...updates
    };
    
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Remove a source from a project
   * @param projectId Project ID
   * @param sourceId Source ID to remove
   * @returns The updated project or null if not found
   */
  removeSource(projectId: string, sourceId: string): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    const sourceIndex = project.sources.findIndex(s => s.id === sourceId);
    
    if (sourceIndex === -1) {
      return null;
    }
    
    project.sources.splice(sourceIndex, 1);
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Add a sink to a project
   * @param projectId Project ID
   * @param sink Sink to add
   * @returns The updated project or null if not found
   */
  addSink(projectId: string, sink: SinkConfig): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    project.sinks.push(sink);
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Update a sink in a project
   * @param projectId Project ID
   * @param sinkId Sink ID to update
   * @param updates Partial sink updates
   * @returns The updated project or null if not found
   */
  updateSink(projectId: string, sinkId: string, updates: Partial<SinkConfig>): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    const sinkIndex = project.sinks.findIndex(s => s.id === sinkId);
    
    if (sinkIndex === -1) {
      return null;
    }
    
    project.sinks[sinkIndex] = {
      ...project.sinks[sinkIndex],
      ...updates
    };
    
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Remove a sink from a project
   * @param projectId Project ID
   * @param sinkId Sink ID to remove
   * @returns The updated project or null if not found
   */
  removeSink(projectId: string, sinkId: string): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    const sinkIndex = project.sinks.findIndex(s => s.id === sinkId);
    
    if (sinkIndex === -1) {
      return null;
    }
    
    project.sinks.splice(sinkIndex, 1);
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Update capture configuration for a project
   * @param projectId Project ID
   * @param captureConfig Partial capture config updates
   * @returns The updated project or null if not found
   */
  updateCaptureConfig(projectId: string, captureConfig: Partial<CaptureConfig>): Project | null {
    const project = this.getProjectById(projectId);
    
    if (!project) {
      return null;
    }
    
    project.captureConfig = {
      ...project.captureConfig,
      ...captureConfig
    };
    
    project.updatedAt = new Date();
    
    return this.updateProject(projectId, project);
  }

  /**
   * Helper method to deserialize project dates from JSON
   * @param project The project to deserialize
   * @returns Project with proper Date objects
   */
  private deserializeProject(project: any): Project {
    if (!project) return project;

    // Convert date strings back to Date objects
    return {
      ...project,
      createdAt: project.createdAt instanceof Date ? project.createdAt : new Date(project.createdAt),
      updatedAt: project.updatedAt instanceof Date ? project.updatedAt : new Date(project.updatedAt),
    };
  }
}