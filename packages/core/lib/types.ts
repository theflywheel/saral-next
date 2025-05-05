/**
 * Project Configuration Types
 */
export interface Project {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    updatedAt: Date;
    sources: SourceConfig[];
    sinks: SinkConfig[];
    captureConfig: CaptureConfig;
  }
  
  /**
   * Source Configuration Types
   */
  export interface SourceConfig {
    id: string;
    name: string;
    type: SourceType;
    config: CloudStorageConfig | LocalStorageConfig;
  }
  
  export enum SourceType {
    CLOUD_STORAGE = 'cloudStorage',
    LOCAL_STORAGE = 'localStorage',
  }
  
  export interface CloudStorageConfig {
    provider: 'aws' | 'gcp' | 'azure';
    bucketName: string;
    region?: string;
    prefix?: string;
    credentials?: {
      accessKeyId?: string;
      secretAccessKey?: string;
    };
  }
  
  export interface LocalStorageConfig {
    path: string;
    fileTypes: string[];
  }
  
  /**
   * Sink Configuration Types
   */
  export interface SinkConfig {
    id: string;
    name: string;
    type: SinkType;
    config: DatabaseConfig | ApiEndpointConfig;
  }
  
  export enum SinkType {
    DATABASE = 'database',
    API_ENDPOINT = 'apiEndpoint',
  }
  
  export interface DatabaseConfig {
    type: 'mongodb' | 'postgresql' | 'mysql';
    connectionString: string;
    tableName?: string;
    collectionName?: string;
  }
  
  export interface ApiEndpointConfig {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
    authType?: 'none' | 'basic' | 'bearer' | 'apiKey';
    authConfig?: {
      username?: string;
      password?: string;
      token?: string;
      apiKeyName?: string;
      apiKeyValue?: string;
      apiKeyLocation?: 'header' | 'query';
    };
  }
  
  /**
   * Capture Configuration Types
   */
  export interface CaptureConfig {
    id: string;
    captureType: CaptureType[];
    documentConfig?: DocumentCaptureConfig;
    imageConfig?: ImageCaptureConfig;
  }
  
  export enum CaptureType {
    DOCUMENT = 'document',
    IMAGE = 'image',
  }
  
  export interface DocumentCaptureConfig {
    allowedTypes: string[];
    maxSizeMB: number;
    requireOCR: boolean;
    ocrConfig?: {
      language: string;
      enhanceQuality: boolean;
    };
  }
  
  export interface ImageCaptureConfig {
    allowedTypes: string[];
    maxSizeMB: number;
    resizeOptions?: {
      maxWidth: number;
      maxHeight: number;
      maintainAspectRatio: boolean;
    };
  }