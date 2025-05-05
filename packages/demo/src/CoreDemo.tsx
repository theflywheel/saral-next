import React, { useState, useEffect } from 'react';
import { 
  Project, 
  CaptureType, 
  SourceType, 
  SinkType,
  CloudStorageConfig,
  DatabaseConfig,
  useProject, 
  useSourceSink, 
  useCaptureConfig 
} from 'core-saral';

const CoreDemo: React.FC = () => {
  // Use core-saral hooks
  const { 
    projects, 
    currentProject, 
    createProject, 
    updateProject, 
    deleteProject, 
    setCurrentProject 
  } = useProject();
  
  // Local state for form inputs
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [editMode, setEditMode] = useState(false);
  
  // Source and sink state management
  const [newSourceName, setNewSourceName] = useState('');
  const [newSinkName, setNewSinkName] = useState('');
  
  // Handle source and sinks when a project is selected
  const { 
    sources = [], 
    sinks = [], 
    createCloudStorageSource, 
    createDatabaseSink,
    removeSource,
    removeSink
  } = useSourceSink({
    sources: currentProject?.sources || [],
    sinks: currentProject?.sinks || [],
    onAddSource: (source) => {
      if (currentProject) {
        updateProject(currentProject.id, {
          sources: [...(currentProject.sources || []), source]
        });
      }
    },
    onRemoveSource: (sourceId) => {
      if (currentProject) {
        updateProject(currentProject.id, {
          sources: currentProject.sources.filter(s => s.id !== sourceId)
        });
      }
    },
    onAddSink: (sink) => {
      if (currentProject) {
        updateProject(currentProject.id, {
          sinks: [...(currentProject.sinks || []), sink]
        });
      }
    },
    onRemoveSink: (sinkId) => {
      if (currentProject) {
        updateProject(currentProject.id, {
          sinks: currentProject.sinks.filter(s => s.id !== sinkId)
        });
      }
    }
  });
  
  // Capture configuration
  const { 
    captureConfig,
    updateDocumentConfig,
    updateImageConfig,
    toggleCaptureType,
    hasDocumentCapture,
    hasImageCapture
  } = useCaptureConfig({
    captureConfig: currentProject?.captureConfig,
    onUpdateCaptureConfig: (updates) => {
      if (currentProject) {
        updateProject(currentProject.id, {
          captureConfig: { ...currentProject.captureConfig, ...updates }
        });
      }
    }
  });
  
  // Handle creating a new project
  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      createProject(newProjectName, newProjectDesc);
      setNewProjectName('');
      setNewProjectDesc('');
    }
  };
  
  // Handle updating the current project
  const handleUpdateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProject && newProjectName.trim()) {
      updateProject(currentProject.id, {
        name: newProjectName,
        description: newProjectDesc
      });
      setEditMode(false);
    }
  };
  
  // Start editing current project
  const startEditing = () => {
    if (currentProject) {
      setNewProjectName(currentProject.name);
      setNewProjectDesc(currentProject.description);
      setEditMode(true);
    }
  };
  
  // Add a new source to the current project
  const handleAddSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSourceName.trim() && currentProject) {
      createCloudStorageSource(newSourceName, {
        provider: 'aws',
        bucketName: `${newSourceName.toLowerCase().replace(/\s+/g, '-')}-bucket`
      });
      setNewSourceName('');
    }
  };
  
  // Add a new sink to the current project
  const handleAddSink = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSinkName.trim() && currentProject) {
      createDatabaseSink(newSinkName, {
        type: 'mongodb',
        connectionString: `mongodb://localhost:27017/${newSinkName.toLowerCase().replace(/\s+/g, '_')}`
      });
      setNewSinkName('');
    }
  };
  
  // Format date for display
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="core-demo">
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Projects</h2>
        </div>
        
        {/* Project Creation Form */}
        <form onSubmit={handleCreateProject}>
          <div className="form-group">
            <label className="form-label">New Project Name</label>
            <input
              type="text"
              className="form-control"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              placeholder="Enter project name"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              placeholder="Enter project description"
              rows={3}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Create Project
          </button>
        </form>
        
        {/* Project List */}
        <h3>Your Projects</h3>
        {projects.length === 0 ? (
          <p>No projects yet. Create one to get started.</p>
        ) : (
          <ul className="project-list">
            {projects.map(project => (
              <li
                key={project.id}
                className={`project-item ${currentProject?.id === project.id ? 'active' : ''}`}
                onClick={() => setCurrentProject(project)}
              >
                <h4>{project.name}</h4>
                <p>{project.description}</p>
                <small>Created: {formatDate(project.createdAt)}</small>
                <div className="project-actions">
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      {/* Project Details */}
      {currentProject && (
        <>
          <div className="card">
            <div className="card-header">
              <h2 className="card-title">
                Project: {currentProject.name}
                {!editMode && (
                  <button 
                    className="btn btn-secondary btn-sm"
                    onClick={startEditing}
                  >
                    Edit
                  </button>
                )}
              </h2>
            </div>
            
            {/* Edit Project Form */}
            {editMode ? (
              <form onSubmit={handleUpdateProject}>
                <div className="form-group">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={newProjectDesc}
                    onChange={(e) => setNewProjectDesc(e.target.value)}
                    rows={3}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditMode(false)}
                  style={{ marginLeft: '10px' }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div>
                <p><strong>Description:</strong> {currentProject.description}</p>
                <p><strong>Created:</strong> {formatDate(currentProject.createdAt)}</p>
                <p><strong>Last Updated:</strong> {formatDate(currentProject.updatedAt)}</p>
              </div>
            )}
          </div>
          
          {/* Sources and Sinks */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Data Sources</h3>
            </div>
            
            <form onSubmit={handleAddSource}>
              <div className="form-group">
                <label className="form-label">New Source Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSourceName}
                  onChange={(e) => setNewSourceName(e.target.value)}
                  placeholder="Enter source name"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Cloud Storage Source
              </button>
            </form>
            
            {sources.length === 0 ? (
              <p>No sources configured yet.</p>
            ) : (
              <ul className="source-sink-list">
                {sources.map(source => (
                  <li key={source.id} className="source-sink-item">
                    <div>
                      <h4>{source.name}</h4>
                      <p>Type: {source.type === SourceType.CLOUD_STORAGE ? 'Cloud Storage' : 'Local Storage'}</p>
{source.type === SourceType.CLOUD_STORAGE && (
  <p>Bucket: {(source.config as CloudStorageConfig).bucketName}</p>
)}
                    </div>
                    <div className="source-sink-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSource(source.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Data Sinks</h3>
            </div>
            
            <form onSubmit={handleAddSink}>
              <div className="form-group">
                <label className="form-label">New Sink Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={newSinkName}
                  onChange={(e) => setNewSinkName(e.target.value)}
                  placeholder="Enter sink name"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Add Database Sink
              </button>
            </form>
            
            {sinks.length === 0 ? (
              <p>No sinks configured yet.</p>
            ) : (
              <ul className="source-sink-list">
                {sinks.map(sink => (
                  <li key={sink.id} className="source-sink-item">
                    <div>
                      <h4>{sink.name}</h4>
                      <p>Type: {sink.type}</p>
                      {sink.type === SinkType.DATABASE && (
                        <p>Connection: {(sink.config as DatabaseConfig).connectionString}</p>
                      )}
                    </div>
                    <div className="source-sink-actions">
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeSink(sink.id)}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Capture Configuration */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Capture Configuration</h3>
            </div>
            
            <div className="capture-config">
              <div className="capture-type-toggle">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="documentCapture"
                    checked={hasDocumentCapture}
                    onChange={(e) => toggleCaptureType(CaptureType.DOCUMENT, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="documentCapture">
                    Document Capture
                  </label>
                </div>
                
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="imageCapture"
                    checked={hasImageCapture}
                    onChange={(e) => toggleCaptureType(CaptureType.IMAGE, e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="imageCapture">
                    Image Capture
                  </label>
                </div>
              </div>
              
              {hasDocumentCapture && captureConfig?.documentConfig && (
                <div className="document-config">
                  <h4>Document Configuration</h4>
                  <div className="form-group">
                    <label className="form-label">Max Size (MB)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={captureConfig.documentConfig.maxSizeMB}
                      onChange={(e) => updateDocumentConfig({
                        maxSizeMB: Number(e.target.value)
                      })}
                      min="1"
                    />
                  </div>
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="requireOCR"
                      checked={captureConfig.documentConfig.requireOCR || false}
                      onChange={(e) => updateDocumentConfig({
                        requireOCR: e.target.checked
                      })}
                    />
                    <label className="form-check-label" htmlFor="requireOCR">
                      Require OCR
                    </label>
                  </div>
                </div>
              )}
              
              {hasImageCapture && captureConfig?.imageConfig && (
  <div className="image-config">
    <h4>Image Configuration</h4>
    <div className="form-group">
      <label className="form-label">Max Size (MB)</label>
      <input
        type="number"
        className="form-control"
        value={captureConfig.imageConfig.maxSizeMB}
        onChange={(e) => updateImageConfig({
          maxSizeMB: Number(e.target.value)
        })}
        min="1"
      />
    </div>
    
    {captureConfig.imageConfig.resizeOptions && (
      <div className="resize-options">
        <h5>Resize Options</h5>
        <div className="form-group">
          <label className="form-label">Max Width</label>
          <input
            type="number"
            className="form-control"
            value={captureConfig.imageConfig.resizeOptions.maxWidth}
            onChange={(e) => {
              const currentResizeOptions = captureConfig.imageConfig?.resizeOptions || {
                maxWidth: 1920,
                maxHeight: 1080,
                maintainAspectRatio: true
              };
              
              updateImageConfig({
                resizeOptions: {
                  ...currentResizeOptions,
                  maxWidth: Number(e.target.value)
                }
              });
            }}
            min="100"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Max Height</label>
          <input
            type="number"
            className="form-control"
            value={captureConfig.imageConfig.resizeOptions.maxHeight}
            onChange={(e) => {
              const currentResizeOptions = captureConfig.imageConfig?.resizeOptions || {
                maxWidth: 1920,
                maxHeight: 1080,
                maintainAspectRatio: true
              };
              
              updateImageConfig({
                resizeOptions: {
                  ...currentResizeOptions,
                  maxHeight: Number(e.target.value)
                }
              });
            }}
            min="100"
          />
        </div>
      </div>
    )}
  </div>
)}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CoreDemo;