"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Helper function to format dates
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Mock types and data for demonstration
type Project = {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
};

type Source = {
  id: string;
  name: string;
  type: number; // 0: Cloud Storage, 1: Local Storage
  projectId: string;
};

type Sink = {
  id: string;
  name: string;
  type: number; // 0: Database, 1: API Endpoint
  projectId: string;
};

export function CoreDemoContent() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [sources, setSources] = useState<Source[]>([]);
  const [sinks, setSinks] = useState<Sink[]>([]);
  const [newSourceName, setNewSourceName] = useState('');
  const [newSourceType, setNewSourceType] = useState<number>(0);
  const [newSinkName, setNewSinkName] = useState('');
  const [newSinkType, setNewSinkType] = useState<number>(0);

  // Load mock data on component mount
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: '1',
        name: 'Invoice Processing',
        description: 'Automated invoice data extraction and processing',
        createdAt: new Date('2025-01-15')
      },
      {
        id: '2',
        name: 'Customer Onboarding',
        description: 'Document verification for new customer onboarding',
        createdAt: new Date('2025-03-20')
      }
    ];
    setProjects(mockProjects);

    // Set initial project if available
    if (mockProjects.length > 0) {
      setCurrentProject(mockProjects[0]);
    }
  }, []);

  // Load sources and sinks when a project is selected
  useEffect(() => {
    if (currentProject) {
      // Mock sources for the selected project
      const mockSources: Source[] = [
        {
          id: 's1',
          name: 'AWS S3 Invoice Bucket',
          type: 0, // Cloud Storage
          projectId: currentProject.id
        },
        {
          id: 's2',
          name: 'Local Invoice Directory',
          type: 1, // Local Storage
          projectId: currentProject.id
        }
      ];

      // Mock sinks for the selected project
      const mockSinks: Sink[] = [
        {
          id: 'sink1',
          name: 'Invoice Database',
          type: 0, // Database
          projectId: currentProject.id
        },
        {
          id: 'sink2',
          name: 'Accounting API',
          type: 1, // API Endpoint
          projectId: currentProject.id
        }
      ];

      setSources(mockSources);
      setSinks(mockSinks);
    } else {
      setSources([]);
      setSinks([]);
    }
  }, [currentProject]);

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: `p${projects.length + 1}`,
      name: newProjectName,
      description: newProjectDesc,
      createdAt: new Date()
    };
    setProjects([...projects, newProject]);
    setNewProjectName('');
    setNewProjectDesc('');
    // Select the newly created project
    setCurrentProject(newProject);
  };

  const deleteProject = (id: string) => {
    const updatedProjects = projects.filter(project => project.id !== id);
    setProjects(updatedProjects);
    if (currentProject?.id === id) {
      setCurrentProject(updatedProjects.length > 0 ? updatedProjects[0] : null);
    }
  };

  const handleCreateSource = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const newSource: Source = {
      id: `s${sources.length + 1}`,
      name: newSourceName,
      type: newSourceType,
      projectId: currentProject.id
    };
    setSources([...sources, newSource]);
    setNewSourceName('');
  };

  const deleteSource = (id: string) => {
    setSources(sources.filter(source => source.id !== id));
  };

  const handleCreateSink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProject) return;

    const newSink: Sink = {
      id: `sink${sinks.length + 1}`,
      name: newSinkName,
      type: newSinkType,
      projectId: currentProject.id
    };
    setSinks([...sinks, newSink]);
    setNewSinkName('');
  };

  const deleteSink = (id: string) => {
    setSinks(sinks.filter(sink => sink.id !== id));
  };

  // Helper functions to get type names
  const getSourceTypeName = (type: number): string => {
    return type === 0 ? "Cloud Storage" : "Local Storage";
  };

  const getSinkTypeName = (type: number): string => {
    return type === 0 ? "Database" : "API Endpoint";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="projectName">New Project Name</Label>
              <Input
                id="projectName"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="projectDesc">Description</Label>
              <Textarea
                id="projectDesc"
                value={newProjectDesc}
                onChange={(e) => setNewProjectDesc(e.target.value)}
                placeholder="Enter project description"
                rows={3}
              />
            </div>
            <Button type="submit">Create Project</Button>
          </form>
          
          <h3 className="text-lg font-medium mt-6 mb-4">Your Projects</h3>
          {projects.length === 0 ? (
            <p className="text-muted-foreground">No projects yet. Create one to get started.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map(project => (
                <div
                  key={project.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all hover:border-primary/50 hover:shadow ${
                    currentProject?.id === project.id ? 'border-primary bg-primary/10' : ''
                  }`}
                  onClick={() => setCurrentProject(project)}
                >
                  <h4 className="font-medium">{project.name}</h4>
                  <p className="text-sm text-muted-foreground">{project.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Created: {formatDate(project.createdAt)}
                  </p>
                  <div className="flex justify-end mt-4">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteProject(project.id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {currentProject && (
        <Card>
          <CardHeader>
            <CardTitle>Project Configuration: {currentProject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="sources" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="sources">Data Sources</TabsTrigger>
                <TabsTrigger value="sinks">Data Sinks</TabsTrigger>
              </TabsList>
              <TabsContent value="sources" className="space-y-4">
                <form onSubmit={handleCreateSource} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sourceName">Source Name</Label>
                      <Input
                        id="sourceName"
                        value={newSourceName}
                        onChange={(e) => setNewSourceName(e.target.value)}
                        placeholder="Enter source name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sourceType">Source Type</Label>
                      <select
                        id="sourceType"
                        value={newSourceType}
                        onChange={(e) => setNewSourceType(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value={0}>Cloud Storage</option>
                        <option value={1}>Local Storage</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit">Add Source</Button>
                </form>

                <h3 className="text-lg font-medium mt-6 mb-4">Configured Sources</h3>
                {sources.length === 0 ? (
                  <p className="text-muted-foreground">No sources configured yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {sources.map(source => (
                      <li
                        key={source.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{source.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Type: {getSourceTypeName(source.type)}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSource(source.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>

              <TabsContent value="sinks" className="space-y-4">
                <form onSubmit={handleCreateSink} className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="sinkName">Sink Name</Label>
                      <Input
                        id="sinkName"
                        value={newSinkName}
                        onChange={(e) => setNewSinkName(e.target.value)}
                        placeholder="Enter sink name"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="sinkType">Sink Type</Label>
                      <select
                        id="sinkType"
                        value={newSinkType}
                        onChange={(e) => setNewSinkType(Number(e.target.value))}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      >
                        <option value={0}>Database</option>
                        <option value={1}>API Endpoint</option>
                      </select>
                    </div>
                  </div>
                  <Button type="submit">Add Sink</Button>
                </form>

                <h3 className="text-lg font-medium mt-6 mb-4">Configured Sinks</h3>
                {sinks.length === 0 ? (
                  <p className="text-muted-foreground">No sinks configured yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {sinks.map(sink => (
                      <li
                        key={sink.id}
                        className="flex justify-between items-center p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{sink.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Type: {getSinkTypeName(sink.type)}
                          </p>
                        </div>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteSink(sink.id)}
                        >
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}