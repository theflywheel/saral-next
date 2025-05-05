import React, { useState, useCallback } from 'react';
import { DocumentUploader } from './DocumentUploader';
import { DocumentViewer } from './DocumentViewer';
import { parserService } from '../services/ParserService';
import { DocumentData, DocumentParserOptions, ParsedField, FieldStatus } from '../types';
import { isEven } from '../utils/helpers';
import { ParsedResultsPanel } from './ParsedResultsPanel';

export interface DocumentParserProps {
  parserOptions: DocumentParserOptions;
  onDocumentParsed?: (document: DocumentData) => void;
  onError?: (error: Error) => void;
  className?: string;
}

/**
 * Main document parser component that combines uploader, viewer, and results
 */
export const DocumentParser: React.FC<DocumentParserProps> = ({
  parserOptions,
  onDocumentParsed,
  onError = console.error,
  className = ''
}) => {
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleFileSelect = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const parsedDocument = await parserService.parseDocument(file, parserOptions);
      setDocument(parsedDocument);
      
      if (onDocumentParsed) {
        onDocumentParsed(parsedDocument);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to parse document';
      setError(errorMessage);
      onError(err instanceof Error ? err : new Error(errorMessage));
    } finally {
      setIsLoading(false);
    }
  }, [parserOptions, onDocumentParsed, onError]);
  
  const handleFieldEdit = useCallback((field: ParsedField, newValue: string) => {
    if (!document || !document.parsedData) return;
    
    const updatedFields = document.parsedData.fields.map(f => 
      f.id === field.id ? { ...f, value: newValue } : f
    );
    
    setDocument({
      ...document,
      parsedData: {
        ...document.parsedData,
        fields: updatedFields
      },
      updatedAt: new Date()
    });
  }, [document]);
  
  const handleFieldStatusChange = useCallback((field: ParsedField, status: FieldStatus) => {
    // In a real app, you might want to track status changes or perform validations
    console.log(`Field ${field.key} status changed to ${status}`);
  }, []);
  
  const getHighlightedAreas = () => {
    if (!document || !document.parsedData) return [];
    
    const fieldBoxes = document.parsedData.fields
      .filter(field => field.boundingBox)
      .map(field => field.boundingBox!);
      
    const tableBoxes = document.parsedData.tables
      ? document.parsedData.tables
          .filter(table => table.boundingBox)
          .map(table => table.boundingBox!)
      : [];
      
    return [...fieldBoxes, ...tableBoxes];
  };
  
  // An example of using the isEven utility
  const rowCount = document?.parsedData?.tables?.[0]?.rows.length || 0;
  const hasEvenRows = isEven(rowCount);
  
  return (
    <div className={`saral-document-parser ${className}`}>
      {isLoading && (
        <div className="saral-loading-overlay">
          <div className="saral-loading-spinner"></div>
          <div className="saral-loading-text">Parsing document...</div>
        </div>
      )}
      
      {error && (
        <div className="saral-error-message">
          {error}
        </div>
      )}
      
      {!document ? (
        <DocumentUploader
          onFileSelect={handleFileSelect}
          onError={onError}
          parserOptions={parserOptions}
          disabled={isLoading}
        />
      ) : (
        <div className="saral-parsed-document">
          <div className="saral-document-container">
            <DocumentViewer
              document={document}
              highlightedAreas={getHighlightedAreas()}
            />
          </div>
          <div className="saral-results-container">
            <ParsedResultsPanel
              parsedData={document.parsedData!}
              onFieldEdit={handleFieldEdit}
              onFieldStatusChange={handleFieldStatusChange}
              showConfidence={true}
            />
          </div>
          
          <div className="saral-parser-actions">
            <button
              className="saral-parser-btn saral-primary-btn"
              onClick={() => setDocument(null)}
            >
              Parse New Document
            </button>
          </div>
        </div>
      )}
    </div>
  );
};