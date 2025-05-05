import React, { useState } from 'react';
import { ParsedData, ParsedField, ParsedTable, FieldStatus } from '../types';
import { formatPercentage } from '../utils/helpers';

export interface ParsedResultsPanelProps {
  parsedData: ParsedData;
  onFieldEdit?: (field: ParsedField, newValue: string) => void;
  onFieldStatusChange?: (field: ParsedField, status: FieldStatus) => void;
  className?: string;
  showConfidence?: boolean;
}

/**
 * Component to display and interact with parsed data results
 */
export const ParsedResultsPanel: React.FC<ParsedResultsPanelProps> = ({
  parsedData,
  onFieldEdit,
  onFieldStatusChange,
  className = '',
  showConfidence = true
}) => {
  const [activeTab, setActiveTab] = useState<'fields' | 'tables'>('fields');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [fieldStatuses, setFieldStatuses] = useState<Record<string, FieldStatus>>({});

  const handleFieldEdit = (field: ParsedField, newValue: string) => {
    if (onFieldEdit) {
      onFieldEdit(field, newValue);
    }
    setEditingFieldId(null);
  };

  const handleFieldStatusChange = (field: ParsedField, status: FieldStatus) => {
    setFieldStatuses(prev => ({
      ...prev,
      [field.id]: status
    }));
    
    if (onFieldStatusChange) {
      onFieldStatusChange(field, status);
    }
  };

  const renderConfidenceIndicator = (confidence: number) => {
    if (!showConfidence) return null;
    
    let className = 'saral-confidence-indicator';
    if (confidence >= 90) {
      className += ' high';
    } else if (confidence >= 70) {
      className += ' medium';
    } else {
      className += ' low';
    }
    
    return (
      <div className={className} title={`Confidence: ${formatPercentage(confidence)}%`}>
        <div 
          className="saral-confidence-bar" 
          style={{ width: `${formatPercentage(confidence)}%` }}
        />
        <span className="saral-confidence-text">{`${Math.round(confidence)}%`}</span>
      </div>
    );
  };

  return (
    <div className={`saral-parsed-results ${className}`}>
      <div className="saral-parsed-results-header">
        <div className="saral-tabs">
          <button 
            className={`saral-tab ${activeTab === 'fields' ? 'active' : ''}`}
            onClick={() => setActiveTab('fields')}
          >
            Fields ({parsedData.fields.length})
          </button>
          <button 
            className={`saral-tab ${activeTab === 'tables' ? 'active' : ''}`}
            onClick={() => setActiveTab('tables')}
            disabled={!parsedData.tables || parsedData.tables.length === 0}
          >
            Tables ({parsedData.tables?.length || 0})
          </button>
        </div>
        {showConfidence && (
          <div className="saral-overall-confidence">
            Overall Confidence: {Math.round(parsedData.confidence)}%
          </div>
        )}
      </div>
      
      <div className="saral-parsed-results-content">
        {activeTab === 'fields' ? (
          <div className="saral-parsed-fields">
            {parsedData.fields.length === 0 ? (
              <div className="saral-no-results">No fields detected</div>
            ) : (
              <ul className="saral-field-list">
                {parsedData.fields.map(field => (
                  <li 
                    key={field.id} 
                    className={`saral-field-item ${fieldStatuses[field.id] || ''}`}
                  >
                    <div className="saral-field-key">{field.key}</div>
                    <div className="saral-field-value">
                      {editingFieldId === field.id ? (
                        <input 
                          type="text"
                          defaultValue={field.value}
                          onBlur={e => handleFieldEdit(field, e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              handleFieldEdit(field, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <div 
                          className="saral-field-value-display"
                          onClick={() => onFieldEdit && setEditingFieldId(field.id)}
                        >
                          {field.value}
                          {onFieldEdit && (
                            <span className="saral-edit-icon">✎</span>
                          )}
                        </div>
                      )}
                    </div>
                    {renderConfidenceIndicator(field.confidence)}
                    
                    {onFieldStatusChange && (
                      <div className="saral-field-actions">
                        <select
                          value={fieldStatuses[field.id] || FieldStatus.PENDING}
                          onChange={e => handleFieldStatusChange(field, e.target.value as FieldStatus)}
                          className="saral-status-dropdown"
                        >
                          <option value={FieldStatus.VALID}>Valid</option>
                          <option value={FieldStatus.WARNING}>Warning</option>
                          <option value={FieldStatus.ERROR}>Error</option>
                          <option value={FieldStatus.PENDING}>Pending</option>
                        </select>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="saral-parsed-tables">
            {!parsedData.tables || parsedData.tables.length === 0 ? (
              <div className="saral-no-results">No tables detected</div>
            ) : (
              parsedData.tables.map((table, tableIndex) => (
                <div key={table.id} className="saral-table-item">
                  <div className="saral-table-header">
                    <h4 className="saral-table-title">
                      {table.name || `Table ${tableIndex + 1}`}
                    </h4>
                    {renderConfidenceIndicator(table.confidence)}
                  </div>
                  <div className="saral-table-content">
                    <table className="saral-data-table">
                      <thead>
                        <tr>
                          {table.headers.map((header, index) => (
                            <th key={`header-${index}`}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {table.rows.map((row, rowIndex) => (
                          <tr key={`row-${rowIndex}`}>
                            {row.map((cell, cellIndex) => (
                              <td key={`cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};