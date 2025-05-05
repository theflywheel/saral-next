import { useCallback } from 'react';
import { 
  SourceConfig, 
  SinkConfig,
  SourceType,
  SinkType,
  CloudStorageConfig,
  LocalStorageConfig,
  DatabaseConfig,
  ApiEndpointConfig
} from '../types';
import { generateId } from '../utils/helpers';

export interface UseSourceSinkProps {
  sources: SourceConfig[];
  sinks: SinkConfig[];
  onAddSource?: (source: SourceConfig) => void;
  onUpdateSource?: (id: string, source: Partial<SourceConfig>) => void;
  onRemoveSource?: (id: string) => void;
  onAddSink?: (sink: SinkConfig) => void;
  onUpdateSink?: (id: string, sink: Partial<SinkConfig>) => void;
  onRemoveSink?: (id: string) => void;
}

export interface UseSourceSinkReturn {
  sources: SourceConfig[];
  sinks: SinkConfig[];
  createCloudStorageSource: (name: string, config: Omit<CloudStorageConfig, 'id'>) => SourceConfig;
  createLocalStorageSource: (name: string, config: Omit<LocalStorageConfig, 'id'>) => SourceConfig;
  updateSource: (id: string, updates: Partial<SourceConfig>) => void;
  removeSource: (id: string) => void;
  createDatabaseSink: (name: string, config: Omit<DatabaseConfig, 'id'>) => SinkConfig;
  createApiEndpointSink: (name: string, config: Omit<ApiEndpointConfig, 'id'>) => SinkConfig;
  updateSink: (id: string, updates: Partial<SinkConfig>) => void;
  removeSink: (id: string) => void;
}

export function useSourceSink({
  sources = [],
  sinks = [],
  onAddSource,
  onUpdateSource,
  onRemoveSource,
  onAddSink,
  onUpdateSink,
  onRemoveSink
}: UseSourceSinkProps = { sources: [], sinks: [] }): UseSourceSinkReturn {
  
  const createCloudStorageSource = useCallback((
    name: string,
    config: Omit<CloudStorageConfig, 'id'>
  ): SourceConfig => {
    const newSource: SourceConfig = {
      id: generateId(),
      name,
      type: SourceType.CLOUD_STORAGE,
      config: config as CloudStorageConfig
    };

    if (onAddSource) {
      onAddSource(newSource);
    }
    
    return newSource;
  }, [onAddSource]);

  const createLocalStorageSource = useCallback((
    name: string,
    config: Omit<LocalStorageConfig, 'id'>
  ): SourceConfig => {
    const newSource: SourceConfig = {
      id: generateId(),
      name,
      type: SourceType.LOCAL_STORAGE,
      config: config as LocalStorageConfig
    };

    if (onAddSource) {
      onAddSource(newSource);
    }
    
    return newSource;
  }, [onAddSource]);

  const updateSource = useCallback((id: string, updates: Partial<SourceConfig>) => {
    if (onUpdateSource) {
      onUpdateSource(id, updates);
    }
  }, [onUpdateSource]);

  const removeSource = useCallback((id: string) => {
    if (onRemoveSource) {
      onRemoveSource(id);
    }
  }, [onRemoveSource]);

  const createDatabaseSink = useCallback((
    name: string,
    config: Omit<DatabaseConfig, 'id'>
  ): SinkConfig => {
    const newSink: SinkConfig = {
      id: generateId(),
      name,
      type: SinkType.DATABASE,
      config: config as DatabaseConfig
    };

    if (onAddSink) {
      onAddSink(newSink);
    }
    
    return newSink;
  }, [onAddSink]);

  const createApiEndpointSink = useCallback((
    name: string,
    config: Omit<ApiEndpointConfig, 'id'>
  ): SinkConfig => {
    const newSink: SinkConfig = {
      id: generateId(),
      name,
      type: SinkType.API_ENDPOINT,
      config: config as ApiEndpointConfig
    };

    if (onAddSink) {
      onAddSink(newSink);
    }
    
    return newSink;
  }, [onAddSink]);

  const updateSink = useCallback((id: string, updates: Partial<SinkConfig>) => {
    if (onUpdateSink) {
      onUpdateSink(id, updates);
    }
  }, [onUpdateSink]);

  const removeSink = useCallback((id: string) => {
    if (onRemoveSink) {
      onRemoveSink(id);
    }
  }, [onRemoveSink]);

  return {
    sources,
    sinks,
    createCloudStorageSource,
    createLocalStorageSource,
    updateSource,
    removeSource,
    createDatabaseSink,
    createApiEndpointSink,
    updateSink,
    removeSink,
  };
}