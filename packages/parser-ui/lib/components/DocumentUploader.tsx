import React, { useState, useCallback, useRef } from 'react';
import { DocumentParserOptions } from '../types';

export interface DocumentUploaderProps {
  onFileSelect: (file: File) => void;
  onError: (error: Error) => void;
  parserOptions: DocumentParserOptions;
  multiple?: boolean;
  className?: string;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  label?: string;
  disabled?: boolean;
}

/**
 * Component for uploading document files for parsing
 */
export const DocumentUploader: React.FC<DocumentUploaderProps> = ({
  onFileSelect,
  onError,
  parserOptions,
  multiple = false,
  className = '',
  acceptedFileTypes,
  maxFileSizeMB,
  label = 'Upload Document',
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const derivedAcceptedTypes = acceptedFileTypes || 
    parserOptions.allowedTypes.join(',');
    
  const derivedMaxFileSize = maxFileSizeMB || 
    parserOptions.maxSizeMB;

  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    const fileType = file.type;
    const isValidType = parserOptions.allowedTypes.some(
      type => fileType === type || (type.includes('*') && fileType.startsWith(type.split('*')[0]))
    );
    
    if (!isValidType) {
      onError(new Error(`Invalid file type. Accepted types: ${parserOptions.allowedTypes.join(', ')}`));
      return false;
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > derivedMaxFileSize) {
      onError(new Error(`File size exceeds maximum allowed size (${derivedMaxFileSize}MB)`));
      return false;
    }
    
    return true;
  }, [parserOptions.allowedTypes, derivedMaxFileSize, onError]);

  const handleFileSelect = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // For multiple files
    if (multiple) {
      Array.from(files).forEach(file => {
        if (validateFile(file)) {
          onFileSelect(file);
        }
      });
    } 
    // For single file
    else if (files.length > 0 && validateFile(files[0])) {
      onFileSelect(files[0]);
    }
  }, [multiple, validateFile, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [handleFileSelect]);

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    handleFileSelect(files);
    
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`saral-document-uploader ${isDragging ? 'dragging' : ''} ${className}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={disabled ? undefined : handleBrowseClick}
      aria-disabled={disabled}
    >
      <div className="saral-document-uploader-content">
        <div className="saral-document-uploader-icon">
          {/* File upload icon */}
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V16M12 4L8 8M12 4L16 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L2.621 19.485C2.72915 19.9177 2.97882 20.3018 3.33033 20.5763C3.68184 20.8508 4.11501 20.9999 4.561 21H19.439C19.885 20.9999 20.3182 20.8508 20.6697 20.5763C21.0212 20.3018 21.2708 19.9177 21.379 19.485L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div className="saral-document-uploader-label">
          {label}
        </div>
        <div className="saral-document-uploader-info">
          Drag & drop or click to browse
        </div>
        <div className="saral-document-uploader-formats">
          Accepted formats: {parserOptions.allowedTypes.join(', ')}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept={derivedAcceptedTypes}
        multiple={multiple}
        onChange={handleFileInputChange}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
};