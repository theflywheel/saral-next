Features
Project configuration management
Data source/sink configuration
Document and image capture configuration
Storage utilities
Validation utilities
Usage
Project Management
JavaScript
import { ProjectService } from 'core-saral';

// Create a project service
const projectService = new ProjectService();

// Create a new project
const project = projectService.createProject('My Project', 'A sample project');

// Add a data source
projectService.addSource(project.id, {
  id: 'source-1',
  name: 'AWS S3 Bucket',
  type: 'cloudStorage',
  config: {
    provider: 'aws',
    bucketName: 'my-bucket'
  }
});

// Get all projects
const allProjects = projectService.getAllProjects();
Using React Hooks
jsx
import { useProject, useSourceSink } from 'core-saral';

function MyProjectManager() {
  const { projects, createProject } = useProject();
  
  const handleCreateProject = () => {
    createProject('New Project', 'Description');
  };
  
  return (
    <div>
      <button onClick={handleCreateProject}>Create Project</button>
      <ul>
        {projects.map(project => (
          <li key={project.id}>{project.name}</li>
        ))}
      </ul>
    </div>
  );
}
API Reference
Types
Project - Project configuration
SourceConfig - Data source configuration
SinkConfig - Data destination configuration
CaptureConfig - Document and image capture configuration
Services
ProjectService - Service for managing projects
Hooks
useProject - Hook for project management
useSourceSink - Hook for source/sink management
useCaptureConfig - Hook for capture configuration
Utilities
storage - Local storage utility
Various validation helpers (isValidEmail, isValidUrl, etc.)