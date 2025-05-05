import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DocumentUploader } from '../lib/components/DocumentUploader';
import { ParsedResultsPanel } from '../lib/components/ParsedResultsPanel';
import { FieldStatus } from '../lib/types';

// Mock components that might be more difficult to test
jest.mock('../lib/components/DocumentViewer', () => ({
  DocumentViewer: () => <div data-testid="document-viewer">Document Viewer</div>
}));

describe('DocumentUploader', () => {
  const mockOptions = {
    parseOnUpload: true,
    allowedTypes: ['application/pdf', 'image/jpeg'],
    maxSizeMB: 10,
    confidenceThreshold: 80
  };
  
  const mockOnFileSelect = jest.fn();
  const mockOnError = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders with default props', () => {
    render(
      <DocumentUploader
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        parserOptions={mockOptions}
      />
    );
    
    expect(screen.getByText('Upload Document')).toBeInTheDocument();
    expect(screen.getByText(/Drag & drop or click/i)).toBeInTheDocument();
    expect(screen.getByText(/Accepted formats/i)).toBeInTheDocument();
  });
  
  test('renders with custom label', () => {
    render(
      <DocumentUploader
        onFileSelect={mockOnFileSelect}
        onError={mockOnError}
        parserOptions={mockOptions}
        label="Custom Upload Label"
      />
    );
    
    expect(screen.getByText('Custom Upload Label')).toBeInTheDocument();
  });
  
  // More tests for file selection and validation would be added here
});

describe('ParsedResultsPanel', () => {
  const mockParsedData = {
    fields: [
      {
        id: '1',
        key: 'Invoice Number',
        value: 'INV-12345',
        confidence: 95,
      },
      {
        id: '2',
        key: 'Date',
        value: '2023-05-01',
        confidence: 90,
      }
    ],
    tables: [
      {
        id: 'table-1',
        name: 'Items',
        headers: ['Item', 'Price'],
        rows: [
          ['Widget A', '$10.00'],
          ['Service B', '$15.00'],
        ],
        confidence: 85,
      }
    ],
    confidence: 90
  };
  
  const mockOnFieldEdit = jest.fn();
  const mockOnFieldStatusChange = jest.fn();
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  test('renders fields tab with data', () => {
    render(
      <ParsedResultsPanel
        parsedData={mockParsedData}
        onFieldEdit={mockOnFieldEdit}
        onFieldStatusChange={mockOnFieldStatusChange}
      />
    );
    
    expect(screen.getByText('Invoice Number')).toBeInTheDocument();
    expect(screen.getByText('INV-12345')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('2023-05-01')).toBeInTheDocument();
    expect(screen.getByText(/Overall Confidence/i)).toBeInTheDocument();
  });
  
  test('switches to tables tab', () => {
    render(
      <ParsedResultsPanel
        parsedData={mockParsedData}
        onFieldEdit={mockOnFieldEdit}
        onFieldStatusChange={mockOnFieldStatusChange}
      />
    );
    
    fireEvent.click(screen.getByText(/Tables/i));
    
    expect(screen.getByText('Items')).toBeInTheDocument();
    expect(screen.getByText('Item')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Widget A')).toBeInTheDocument();
  });
  
  test('field editing works', () => {
    render(
      <ParsedResultsPanel
        parsedData={mockParsedData}
        onFieldEdit={mockOnFieldEdit}
        onFieldStatusChange={mockOnFieldStatusChange}
      />
    );
    
    // Click on the field value to edit
    fireEvent.click(screen.getByText('INV-12345'));
    
    // Input should appear
    const input = screen.getByDisplayValue('INV-12345');
    fireEvent.change(input, { target: { value: 'INV-54321' } });
    fireEvent.blur(input);
    
    expect(mockOnFieldEdit).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      'INV-54321'
    );
  });
  
  test('field status change works', () => {
    render(
      <ParsedResultsPanel
        parsedData={mockParsedData}
        onFieldEdit={mockOnFieldEdit}
        onFieldStatusChange={mockOnFieldStatusChange}
      />
    );
    
    const statusDropdown = screen.getAllByRole('combobox')[0];
    fireEvent.change(statusDropdown, { target: { value: FieldStatus.ERROR } });
    
    expect(mockOnFieldStatusChange).toHaveBeenCalledWith(
      expect.objectContaining({ id: '1' }),
      FieldStatus.ERROR
    );
  });
});