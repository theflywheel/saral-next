"use client";

import React, { useState, useCallback, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Define types locally since they're not available in parser-ui
enum FieldStatus {
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  NEEDS_REVIEW = "needs_review"
}

interface Field {
  id: string;
  key: string;
  value: string;
  confidence: number;
  status: FieldStatus;
}

interface Table {
  id: string;
  name: string;
  headers: string[];
  rows: string[][];
  confidence: number;
}

interface ParsedDocument {
  fields: Field[];
  tables: Table[];
  confidence: number;
}

interface DocumentParserOptions {
  parseOnUpload: boolean;
  allowedTypes: string[];
  maxSizeMB: number;
  confidenceThreshold: number;
  extractTables: boolean;
}

// Mock components that would normally come from parser-ui
const DocumentUploader: React.FC<{
  onFileSelect: (file: File) => void;
  onError: (error: Error) => void;
  parserOptions: DocumentParserOptions;
  label: string;
  className?: string;
}> = ({ onFileSelect, label, className }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className={`border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
      <div className="space-y-4">
        <div>
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
            />
          </svg>
        </div>
        <div className="flex text-sm text-gray-600">
          <label
            htmlFor="file-upload"
            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none"
          >
            <span>{label}</span>
            <input
              id="file-upload"
              name="file-upload"
              type="file"
              className="sr-only"
              onChange={handleFileChange}
            />
          </label>
          <p className="pl-1">or drag and drop</p>
        </div>
        <p className="text-xs text-gray-500">
          PDF, PNG, JPG, TIFF, or DOCX up to 10MB
        </p>
      </div>
    </div>
  );
};

const DocumentViewer: React.FC<{
  documentUrl: string;
  documentType: string;
}> = ({ documentUrl, documentType }) => {
  if (documentType.startsWith('image/')) {
    return (
      <div className="h-full flex items-center justify-center p-4">
        <img
          src={documentUrl}
          alt="Document preview"
          className="max-h-full max-w-full object-contain"
        />
      </div>
    );
  }
  
  return (
    <div className="h-full flex items-center justify-center p-4">
      <div className="text-center">
        <p className="text-lg font-medium mb-2">Document Preview</p>
        <p className="text-sm text-gray-500 mb-4">
          {documentType.includes('pdf') ? 'PDF Document' : 
           documentType.includes('word') ? 'Word Document' : 'Document'}
        </p>
        <a
          href={documentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Open document in new tab
        </a>
      </div>
    </div>
  );
};

const ParsedResultsPanel: React.FC<{
  parsedData: ParsedDocument;
  onFieldEdit: (field: Field, newValue: string) => void;
  onFieldStatusChange: (field: Field, newStatus: FieldStatus) => void;
}> = ({ parsedData, onFieldEdit, onFieldStatusChange }) => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditing = (field: Field) => {
    setEditingField(field.id);
    setEditValue(field.value);
  };

  const saveEdit = (field: Field) => {
    onFieldEdit(field, editValue);
    setEditingField(null);
  };

  const handleStatusChange = (field: Field, e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as FieldStatus;
    onFieldStatusChange(field, newStatus);
  };

  const getConfidenceColorClass = (confidence: number) => {
    if (confidence >= 90) return "bg-green-500";
    if (confidence >= 70) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-6">
        <h3 className="text-lg font-medium mb-2">Extracted Fields</h3>
        <p className="text-sm text-gray-500 mb-4">
          Overall confidence: {parsedData.confidence}%
        </p>
        
        <div className="space-y-3">
          {parsedData.fields.map(field => (
            <div key={field.id} className="flex items-center p-3 border rounded-md">
              <div className="w-1/4 font-medium">{field.key}:</div>
              
              <div className="w-1/3">
                {editingField === field.id ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="flex-1 px-2 py-1 border rounded-md"
                      autoFocus
                    />
                    <button
                      onClick={() => saveEdit(field)}
                      className="ml-1 px-2 py-1 bg-primary text-white rounded-md text-xs"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div
                    className="px-2 py-1 rounded-md bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => startEditing(field)}
                  >
                    {field.value}
                  </div>
                )}
              </div>
              
              <div className="w-1/6 px-4">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getConfidenceColorClass(field.confidence)}`}
                    style={{ width: `${field.confidence}%` }}
                  ></div>
                </div>
                <div className="text-xs text-center mt-1">{field.confidence}%</div>
              </div>
              
              <div className="w-1/4 text-right">
                <select
                  value={field.status}
                  onChange={(e) => handleStatusChange(field, e)}
                  className="px-2 py-1 border rounded-md text-sm"
                >
                  <option value={FieldStatus.ACCEPTED}>Accepted</option>
                  <option value={FieldStatus.REJECTED}>Rejected</option>
                  <option value={FieldStatus.NEEDS_REVIEW}>Needs Review</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {parsedData.tables.length > 0 && (
        <div>
          <h3 className="text-lg font-medium mb-2">Extracted Tables</h3>
          
          {parsedData.tables.map(table => (
            <div key={table.id} className="mb-6 border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b flex justify-between items-center">
                <h4 className="font-medium">{table.name}</h4>
                <span className="text-sm text-gray-500">Confidence: {table.confidence}%</span>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      {table.headers.map((header, index) => (
                        <th
                          key={index}
                          className="px-4 py-2 text-left text-sm font-medium text-gray-600"
                        >
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {table.rows.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="px-4 py-2 text-sm">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export function ParserDemoContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedDocument | null>(null);
  const [parsingStatus, setParsingStatus] = useState<'idle' | 'parsing' | 'done' | 'error'>('idle');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'stacked'>('side-by-side');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const parserRef = useRef<HTMLDivElement>(null);

  // Define parser options
  const parserOptions: DocumentParserOptions = {
    parseOnUpload: true,
    allowedTypes: [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/tiff',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    maxSizeMB: 10,
    confidenceThreshold: 70,
    extractTables: true
  };

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setParsingStatus('parsing');
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    
    // Simulate parsing process with a timeout
    setTimeout(() => {
      // Generate mock parsed data
      const mockParsedData: ParsedDocument = {
        fields: [
          {
            id: '1',
            key: 'Invoice Number',
            value: 'INV-2025-05-0001',
            confidence: 95,
            status: FieldStatus.ACCEPTED
          },
          {
            id: '2',
            key: 'Date',
            value: '2025-05-05',
            confidence: 92,
            status: FieldStatus.ACCEPTED
          },
          {
            id: '3',
            key: 'Customer',
            value: 'ACME Corporation',
            confidence: 89,
            status: FieldStatus.ACCEPTED
          },
          {
            id: '4',
            key: 'Total Amount',
            value: '$2,456.78',
            confidence: 98,
            status: FieldStatus.ACCEPTED
          },
          {
            id: '5',
            key: 'Tax ID',
            value: 'TX-98765432',
            confidence: 67,
            status: FieldStatus.NEEDS_REVIEW
          },
          {
            id: '6',
            key: 'Payment Terms',
            value: 'Net 30',
            confidence: 88,
            status: FieldStatus.ACCEPTED
          },
        ],
        tables: [
          {
            id: 'table-1',
            name: 'Line Items',
            headers: ['Item', 'Description', 'Quantity', 'Unit Price', 'Total'],
            rows: [
              ['1', 'Web Development Services', '40 hours', '$75.00', '$3,000.00'],
              ['2', 'UI/UX Design', '20 hours', '$90.00', '$1,800.00'],
              ['3', 'Cloud Hosting (Monthly)', '1', '$150.00', '$150.00'],
            ],
            confidence: 91,
          }
        ],
        confidence: 88
      };

      setParsedData(mockParsedData);
      setParsingStatus('done');
    }, 1500);
    
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, []);

  const handleParseError = useCallback((error: Error) => {
    console.error('Parsing error:', error);
    setParsingStatus('error');
  }, []);

  const handleFieldEdit = useCallback((field: Field, newValue: string) => {
    if (!parsedData) return;
    
    setParsedData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        fields: prev.fields.map(f => 
          f.id === field.id ? { ...f, value: newValue } : f
        )
      };
    });
  }, [parsedData]);

  const handleFieldStatusChange = useCallback((field: Field, newStatus: FieldStatus) => {
    if (!parsedData) return;
    
    setParsedData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        fields: prev.fields.map(f => 
          f.id === field.id ? { ...f, status: newStatus } : f
        )
      };
    });
  }, [parsedData]);

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'side-by-side' ? 'stacked' : 'side-by-side');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Document Parser</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedFile ? (
            <div className="h-[300px] flex items-center justify-center">
              <DocumentUploader
                onFileSelect={handleFileSelect}
                onError={handleParseError}
                parserOptions={parserOptions}
                label="Upload Invoice Document"
                className="w-full h-full"
              />
            </div>
          ) : (
            <div>
              <div className="flex justify-between mb-4">
                <Button 
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                    setParsedData(null);
                    setParsingStatus('idle');
                    if (previewUrl) {
                      URL.revokeObjectURL(previewUrl);
                      setPreviewUrl(null);
                    }
                  }}
                >
                  Upload New Document
                </Button>
                <Button onClick={toggleViewMode}>
                  {viewMode === 'side-by-side' ? 'Stack View' : 'Side-by-Side View'}
                </Button>
              </div>
              
              <div 
                ref={parserRef} 
                className={`flex ${viewMode === 'side-by-side' ? 'flex-row' : 'flex-col'} gap-4`}
              >
                <div className="flex-1 min-h-[500px] border rounded-lg overflow-hidden bg-muted/20">
                  {previewUrl && (
                    <DocumentViewer 
                      documentUrl={previewUrl} 
                      documentType={selectedFile.type}
                    />
                  )}
                </div>
                
                <div className="flex-1 min-h-[500px] border rounded-lg overflow-hidden">
                  {parsingStatus === 'parsing' && (
                    <div className="h-full flex flex-col items-center justify-center">
                      <div className="w-10 h-10 border-4 border-primary/20 border-l-primary rounded-full animate-spin mb-4"></div>
                      <p>Parsing document...</p>
                    </div>
                  )}
                  
                  {parsingStatus === 'error' && (
                    <div className="h-full flex items-center justify-center text-destructive">
                      <p>Error parsing document. Please try again with a different file.</p>
                    </div>
                  )}
                  
                  {parsedData && (
                    <ParsedResultsPanel
                      parsedData={parsedData}
                      onFieldEdit={handleFieldEdit}
                      onFieldStatusChange={handleFieldStatusChange}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ol className="list-decimal pl-5 space-y-2">
            <li>Upload a document using the file uploader.</li>
            <li>The parser will automatically extract structured data.</li>
            <li>Review the extracted fields and tables.</li>
            <li>Edit any field values that need correction.</li>
            <li>Change the status of fields to mark them as accepted or flagged for review.</li>
          </ol>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Supported Document Types</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>PDF Documents (.pdf)</li>
            <li>Images (.jpg, .jpeg, .png)</li>
            <li>Word Documents (.docx)</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-6 mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Automatic field extraction</li>
            <li>Table detection and parsing</li>
            <li>Confidence scoring</li>
            <li>Interactive document preview</li>
            <li>Field editing and validation</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}