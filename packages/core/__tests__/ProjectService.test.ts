import { ProjectService } from '../lib/ProjectService';
import { Project, SourceType, SinkType } from '../lib/types';

// Create a completely isolated mock for each test instance
const createMockStorage = () => {
  const storageData: Record<string, any> = {};
  
  return {
    getItem: jest.fn((key: string, defaultValue?: any) => 
      storageData[key] !== undefined ? JSON.parse(JSON.stringify(storageData[key])) : defaultValue),
    setItem: jest.fn((key: string, value: any) => { 
      storageData[key] = JSON.parse(JSON.stringify(value)); 
    }),
    removeItem: jest.fn((key: string) => { 
      delete storageData[key]; 
    }),
    clear: jest.fn(() => { 
      Object.keys(storageData).forEach(key => delete storageData[key]); 
    }),
    _getData: () => storageData, // Helper for debugging
  };
};

describe('ProjectService', () => {
  // Before all tests, mock the storage module
  beforeAll(() => {
    jest.mock('../lib/utils/storage', () => ({
      storage: createMockStorage(),
      StorageUtil: jest.fn().mockImplementation(() => createMockStorage()),
    }), { virtual: true });
  });
  
  // Create a fresh storage mock and service for each test
  let projectService: ProjectService;
  let mockStorage: ReturnType<typeof createMockStorage>;
  
  beforeEach(() => {
    // Reset modules to get fresh instances
    jest.resetModules();
    
    // Create a new mock
    mockStorage = createMockStorage();
    
    // Override the imported storage module with our fresh mock
    jest.doMock('../lib/utils/storage', () => ({
      storage: mockStorage,
      StorageUtil: jest.fn().mockImplementation(() => createMockStorage()),
    }));
    
    // Re-import ProjectService to use our fresh mock
    const ProjectServiceModule = require('../lib/ProjectService');
    projectService = new ProjectServiceModule.ProjectService('test_projects');
  });
  
  test('should create a project', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    expect(project.id).toBeDefined();
    expect(project.name).toBe('Test Project');
    expect(project.description).toBe('A test project');
    expect(project.sources).toEqual([]);
    expect(project.sinks).toEqual([]);
    expect(project.captureConfig).toBeDefined();
    
    expect(mockStorage.setItem).toHaveBeenCalledWith('test_projects', expect.any(Array));
    
    const projects = projectService.getAllProjects();
    expect(projects).toHaveLength(1);
    expect(projects[0].id).toBe(project.id);
  });
  
  test('should throw error for invalid project name', () => {
    expect(() => projectService.createProject('', 'Empty name')).toThrow();
  });
  
  test('should get project by ID', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    const retrieved = projectService.getProjectById(project.id);
    
    // Compare properties
    expect(retrieved?.id).toBe(project.id);
    expect(retrieved?.name).toBe(project.name);
    expect(retrieved?.description).toBe(project.description);
    
    const nonExistent = projectService.getProjectById('non-existent');
    expect(nonExistent).toBeNull();
  });
  
  test('should update a project', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    const updated = projectService.updateProject(project.id, { 
      name: 'Updated Project',
      description: 'Updated description'
    });
    
    expect(updated).not.toBeNull();
    expect(updated!.name).toBe('Updated Project');
    expect(updated!.description).toBe('Updated description');
    expect(updated!.id).toBe(project.id);
    
    // Shouldn't update non-existent project
    const nonExistent = projectService.updateProject('non-existent', { name: 'Test' });
    expect(nonExistent).toBeNull();
  });
  
  test('should delete a project', () => {
    // Create a project
    const project = projectService.createProject('Test Project', 'A test project');
    
    // Verify project was created
    expect(projectService.getAllProjects()).toHaveLength(1);
    
    // Delete the project
    const result = projectService.deleteProject(project.id);
    expect(result).toBe(true);
    
    // Verify project was deleted
    const projects = projectService.getAllProjects();
    expect(projects).toHaveLength(0);
    
    // Shouldn't delete non-existent project
    const nonExistent = projectService.deleteProject('non-existent');
    expect(nonExistent).toBe(false);
  });
  
  test('should manage sources', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    // Add source
    const source = {
      id: 'source-1',
      name: 'Test Source',
      type: SourceType.CLOUD_STORAGE,
      config: {
        provider: 'aws' as const,
        bucketName: 'test-bucket'
      }
    };
    
    const withSource = projectService.addSource(project.id, source);
    expect(withSource!.sources).toHaveLength(1);
    expect(withSource!.sources[0].id).toBe('source-1');
    
    // Update source
    const updatedSource = projectService.updateSource(project.id, 'source-1', {
      name: 'Updated Source'
    });
    expect(updatedSource!.sources[0].name).toBe('Updated Source');
    
    // Remove source
    const withoutSource = projectService.removeSource(project.id, 'source-1');
    expect(withoutSource!.sources).toHaveLength(0);
  });
  
  test('should manage sinks', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    // Add sink
    const sink = {
      id: 'sink-1',
      name: 'Test Sink',
      type: SinkType.DATABASE,
      config: {
        type: 'mongodb' as const,
        connectionString: 'mongodb://localhost:27017/test'
      }
    };
    
    const withSink = projectService.addSink(project.id, sink);
    expect(withSink!.sinks).toHaveLength(1);
    expect(withSink!.sinks[0].id).toBe('sink-1');
    
    // Update sink
    const updatedSink = projectService.updateSink(project.id, 'sink-1', {
      name: 'Updated Sink'
    });
    expect(updatedSink!.sinks[0].name).toBe('Updated Sink');
    
    // Remove sink
    const withoutSink = projectService.removeSink(project.id, 'sink-1');
    expect(withoutSink!.sinks).toHaveLength(0);
  });
  
  test('should update capture config', () => {
    const project = projectService.createProject('Test Project', 'A test project');
    
    const updatedProject = projectService.updateCaptureConfig(project.id, {
      documentConfig: {
        allowedTypes: ['application/pdf'],
        maxSizeMB: 20,
        requireOCR: true
      }
    });
    
    expect(updatedProject!.captureConfig.documentConfig?.allowedTypes).toEqual(['application/pdf']);
    expect(updatedProject!.captureConfig.documentConfig?.maxSizeMB).toBe(20);
    expect(updatedProject!.captureConfig.documentConfig?.requireOCR).toBe(true);
  });
});