import React, { useState, useRef, useCallback, useEffect } from 'react';
import { DocumentViewerOptions, BoundingBox, DocumentData } from '../types';

export interface DocumentViewerProps {
  document: DocumentData;
  options?: DocumentViewerOptions;
  highlightedAreas?: BoundingBox[];
  onViewerReady?: () => void;
  onPageChange?: (pageNumber: number) => void;
  className?: string;
}

/**
 * Document viewer component for displaying documents with highlighting
 */
export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  options = {
    showToolbar: true,
    zoomOptions: {
      initialZoom: 1,
      minZoom: 0.5,
      maxZoom: 3,
      zoomStep: 0.1
    },
    allowAnnotations: false,
    highlightParsedFields: true
  },
  highlightedAreas = [],
  onViewerReady,
  onPageChange,
  className = ''
}) => {
  const [zoom, setZoom] = useState(options.zoomOptions?.initialZoom || 1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // This would normally handle document rendering
  // In a real implementation this might use PDF.js or a similar library
  useEffect(() => {
    const loadDocument = async () => {
      setIsLoading(true);
      
      // Simulating document loading
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // In a real implementation, we'd render the document here
      setTotalPages(document.type === 'application/pdf' ? 3 : 1); // Simulated page count
      setIsLoading(false);
      
      if (onViewerReady) {
        onViewerReady();
      }
    };
    
    loadDocument();
  }, [document, onViewerReady]);
  
  const handleZoomIn = useCallback(() => {
    const maxZoom = options.zoomOptions?.maxZoom || 3;
    const zoomStep = options.zoomOptions?.zoomStep || 0.1;
    setZoom(prevZoom => Math.min(prevZoom + zoomStep, maxZoom));
  }, [options.zoomOptions]);
  
  const handleZoomOut = useCallback(() => {
    const minZoom = options.zoomOptions?.minZoom || 0.5;
    const zoomStep = options.zoomOptions?.zoomStep || 0.1;
    setZoom(prevZoom => Math.max(prevZoom - zoomStep, minZoom));
  }, [options.zoomOptions]);
  
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      if (onPageChange) {
        onPageChange(newPage);
      }
    }
  }, [totalPages, onPageChange]);
  
  // Render highlights for parsed fields
  const renderHighlights = () => {
    if (!options.highlightParsedFields || !highlightedAreas) {
      return null;
    }
    
    return highlightedAreas
      .filter(area => area.pageNumber === currentPage)
      .map((area, index) => (
        <div 
          key={`highlight-${index}`}
          className="saral-document-highlight"
          style={{
            position: 'absolute',
            left: `${area.x * 100}%`,
            top: `${area.y * 100}%`,
            width: `${area.width * 100}%`,
            height: `${area.height * 100}%`,
            border: '2px solid rgba(255, 165, 0, 0.7)',
            backgroundColor: 'rgba(255, 165, 0, 0.2)',
            pointerEvents: 'none',
          }}
        />
      ));
  };
  
  return (
    <div className={`saral-document-viewer ${className}`}>
      {options.showToolbar && (
        <div className="saral-document-toolbar">
          <div className="saral-document-pagination">
            <button
              className="saral-document-btn"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              Previous
            </button>
            <span className="saral-document-page-indicator">
              {`${currentPage} / ${totalPages}`}
            </span>
            <button
              className="saral-document-btn"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              Next
            </button>
          </div>
          <div className="saral-document-zoom-controls">
            <button
              className="saral-document-btn"
              onClick={handleZoomOut}
              disabled={zoom <= (options.zoomOptions?.minZoom || 0.5) || isLoading}
            >
              -
            </button>
            <span className="saral-document-zoom-indicator">
              {`${Math.round(zoom * 100)}%`}
            </span>
            <button
              className="saral-document-btn"
              onClick={handleZoomIn}
              disabled={zoom >= (options.zoomOptions?.maxZoom || 3) || isLoading}
            >
              +
            </button>
          </div>
        </div>
      )}
      
      <div className="saral-document-content-wrapper" ref={containerRef}>
        {isLoading ? (
          <div className="saral-document-loading">Loading document...</div>
        ) : (
          <div 
            className="saral-document-content"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: 'top left',
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            {/* This would be replaced with actual document rendering */}
            <div className="saral-document-page">
              <div className="saral-document-page-content">
                {document.content ? (
                  <div className="saral-document-text-content">
                    {document.content}
                  </div>
                ) : (
                  <div className="saral-document-placeholder">
                    {`Document Page ${currentPage}`}
                  </div>
                )}
              </div>
              {renderHighlights()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};