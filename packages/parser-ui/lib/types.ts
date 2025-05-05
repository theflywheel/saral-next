/**
 * Document parser types
 */
export interface DocumentData {
    id: string;
    name: string;
    type: string;
    content: string;
    parsedData?: ParsedData;
    createdAt: Date;
    updatedAt: Date;
  }
  
  /**
   * Parsed data from a document
   */
  export interface ParsedData {
    fields: ParsedField[];
    tables?: ParsedTable[];
    confidence: number;
  }
  
  /**
   * Parsed field from a document
   */
  export interface ParsedField {
    id: string;
    key: string;
    value: string;
    confidence: number;
    boundingBox?: BoundingBox;
  }
  
  /**
   * Parsed table from a document
   */
  export interface ParsedTable {
    id: string;
    name: string;
    headers: string[];
    rows: string[][];
    confidence: number;
    boundingBox?: BoundingBox;
  }
  
  /**
   * Bounding box for positions in the document
   */
  export interface BoundingBox {
    x: number;
    y: number;
    width: number;
    height: number;
    pageNumber: number;
  }
  
  /**
   * Document viewer options
   */
  export interface DocumentViewerOptions {
    showToolbar?: boolean;
    zoomOptions?: {
      initialZoom: number;
      minZoom: number;
      maxZoom: number;
      zoomStep: number;
    };
    allowAnnotations?: boolean;
    highlightParsedFields?: boolean;
  }
  
  /**
   * Document parser options
   */
  export interface DocumentParserOptions {
    parseOnUpload?: boolean;
    allowedTypes: string[];
    maxSizeMB: number;
    extractFields?: string[];
    extractTables?: boolean;
    confidenceThreshold: number;
  }
  
  /**
   * Theme options for UI components
   */
  export enum ThemeVariant {
    LIGHT = 'light',
    DARK = 'dark',
    SYSTEM = 'system'
  }
  
  /**
   * Field validation status
   */
  export enum FieldStatus {
    VALID = 'valid',
    WARNING = 'warning',
    ERROR = 'error',
    PENDING = 'pending'
  }


  