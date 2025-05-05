import { v4 as uuidv4 } from 'uuid';
import { DocumentData, ParsedData, DocumentParserOptions } from '../types';

/**
 * Service for parsing documents
 */
export class ParserService {
  /**
   * Parse a document file
   * @param file File to parse
   * @param options Parser options
   * @returns Promise resolving to document data with parsed results
   */
  async parseDocument(file: File, options: DocumentParserOptions): Promise<DocumentData> {
    // In a real implementation, this would send the file to a server or use a local parsing library
    // For this mock, we'll create some sample data
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create document data
    const now = new Date();
    const documentData: DocumentData = {
      id: uuidv4(),
      name: file.name,
      type: file.type,
      content: await this.readFileContent(file),
      createdAt: now,
      updatedAt: now,
    };
    
    // Generate mock parsed data
    documentData.parsedData = await this.generateMockParsedData(documentData, options);
    
    return documentData;
  }
  
  /**
   * Read file content as text
   * @param file File to read
   * @returns Promise resolving to file content
   */
  private async readFileContent(file: File): Promise<string> {
    if (file.type.startsWith('text/') || file.type === 'application/json') {
      return await file.text();
    }
    
    // For binary files (PDF, images, etc.), we'd normally process differently
    // Here we just return a placeholder
    return `[Content of ${file.name} (${file.type})]`;
  }
  
  /**
   * Generate mock parsed data for demonstration purposes
   * @param documentData Document data
   * @param options Parser options
   * @returns Promise resolving to mock parsed data
   */
  private async generateMockParsedData(
    documentData: DocumentData,
    options: DocumentParserOptions
  ): Promise<ParsedData> {
    // Generate mock fields based on document type
    const fields = [];
    
    // Generate different mock fields based on document type
    if (documentData.type === 'application/pdf' || documentData.type.startsWith('image/')) {
      fields.push(
        {
          id: uuidv4(),
          key: 'Invoice Number',
          value: `INV-${Math.floor(10000 + Math.random() * 90000)}`,
          confidence: 95 + Math.random() * 5,
          boundingBox: { x: 0.1, y: 0.2, width: 0.2, height: 0.03, pageNumber: 1 },
        },
        {
          id: uuidv4(),
          key: 'Date',
          value: new Date().toLocaleDateString(),
          confidence: 90 + Math.random() * 5,
          boundingBox: { x: 0.7, y: 0.2, width: 0.2, height: 0.03, pageNumber: 1 },
        },
        {
          id: uuidv4(),
          key: 'Total Amount',
          value: `$${(1000 + Math.random() * 9000).toFixed(2)}`,
          confidence: 85 + Math.random() * 10,
          boundingBox: { x: 0.7, y: 0.7, width: 0.2, height: 0.03, pageNumber: 1 },
        },
        {
          id: uuidv4(),
          key: 'Company Name',
          value: 'ACME Corporation',
          confidence: 88 + Math.random() * 12,
          boundingBox: { x: 0.1, y: 0.1, width: 0.4, height: 0.04, pageNumber: 1 },
        }
      );
    } else {
      fields.push(
        {
          id: uuidv4(),
          key: 'Title',
          value: documentData.name.split('.')[0],
          confidence: 90,
          boundingBox: { x: 0.1, y: 0.1, width: 0.8, height: 0.05, pageNumber: 1 },
        },
        {
          id: uuidv4(),
          key: 'Type',
          value: documentData.type,
          confidence: 100,
          boundingBox: { x: 0.1, y: 0.15, width: 0.3, height: 0.03, pageNumber: 1 },
        }
      );
    }
    
    // Generate mock tables if option is enabled
    const tables = options.extractTables ? [
      {
        id: uuidv4(),
        name: 'Items',
        headers: ['Item', 'Quantity', 'Price', 'Total'],
        rows: [
          ['Widget A', '2', '$10.00', '$20.00'],
          ['Service B', '1', '$15.00', '$15.00'],
          ['Product C', '3', '$5.00', '$15.00'],
        ],
        confidence: 85 + Math.random() * 10,
        boundingBox: { x: 0.1, y: 0.4, width: 0.8, height: 0.3, pageNumber: 1 },
      }
    ] : [];
    
    // Calculate overall confidence
    const totalConfidence = fields.reduce((sum, field) => sum + field.confidence, 0) / fields.length;
    
    return {
      fields,
      tables,
      confidence: totalConfidence,
    };
  }
}

// Create a default instance
export const parserService = new ParserService();