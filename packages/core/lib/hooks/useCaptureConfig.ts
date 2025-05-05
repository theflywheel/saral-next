import { useCallback } from 'react';
import { 
  CaptureConfig, 
  CaptureType,
  DocumentCaptureConfig,
  ImageCaptureConfig
} from '../types';

export interface UseCaptureConfigProps {
  captureConfig?: CaptureConfig;
  onUpdateCaptureConfig?: (updates: Partial<CaptureConfig>) => void;
}

export interface UseCaptureConfigReturn {
  captureConfig?: CaptureConfig;
  updateDocumentConfig: (config: Partial<DocumentCaptureConfig>) => void;
  updateImageConfig: (config: Partial<ImageCaptureConfig>) => void;
  toggleCaptureType: (type: CaptureType, enabled: boolean) => void;
  hasDocumentCapture: boolean;
  hasImageCapture: boolean;
}

export function useCaptureConfig({
  captureConfig,
  onUpdateCaptureConfig
}: UseCaptureConfigProps = {}): UseCaptureConfigReturn {
  
  const updateDocumentConfig = useCallback((config: Partial<DocumentCaptureConfig>) => {
    if (!captureConfig || !onUpdateCaptureConfig) return;
    
    const updatedCaptureTypes = 
      captureConfig.captureType.includes(CaptureType.DOCUMENT) 
        ? captureConfig.captureType 
        : [...captureConfig.captureType, CaptureType.DOCUMENT];
    
    // Create a default document config if none exists
    const defaultDocConfig: DocumentCaptureConfig = {
      allowedTypes: ['application/pdf', 'image/jpeg', 'image/png'],
      maxSizeMB: 10,
      requireOCR: false
    };

    // Use existing config or default, then apply updates
    const updatedDocConfig: DocumentCaptureConfig = {
      ...defaultDocConfig,
      ...(captureConfig.documentConfig || {}),
      ...config
    };
    
    onUpdateCaptureConfig({
      captureType: updatedCaptureTypes,
      documentConfig: updatedDocConfig
    });
  }, [captureConfig, onUpdateCaptureConfig]);

  const updateImageConfig = useCallback((config: Partial<ImageCaptureConfig>) => {
    if (!captureConfig || !onUpdateCaptureConfig) return;
    
    const updatedCaptureTypes = 
      captureConfig.captureType.includes(CaptureType.IMAGE) 
        ? captureConfig.captureType 
        : [...captureConfig.captureType, CaptureType.IMAGE];
    
    // Create a default image config if none exists
    const defaultImageConfig: ImageCaptureConfig = {
      allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
      maxSizeMB: 5,
      resizeOptions: {
        maxWidth: 1920,
        maxHeight: 1080,
        maintainAspectRatio: true
      }
    };

    // Use existing config or default, then apply updates
    const updatedImageConfig: ImageCaptureConfig = {
      ...defaultImageConfig,
      ...(captureConfig.imageConfig || {}),
      ...config
    };
    
    onUpdateCaptureConfig({
      captureType: updatedCaptureTypes,
      imageConfig: updatedImageConfig
    });
  }, [captureConfig, onUpdateCaptureConfig]);

  const toggleCaptureType = useCallback((type: CaptureType, enabled: boolean) => {
    if (!captureConfig || !onUpdateCaptureConfig) return;
    
    let updatedTypes: CaptureType[] = [...captureConfig.captureType];
    
    if (enabled && !updatedTypes.includes(type)) {
      updatedTypes.push(type);
    } else if (!enabled && updatedTypes.includes(type)) {
      updatedTypes = updatedTypes.filter(t => t !== type);
    }
    
    onUpdateCaptureConfig({
      captureType: updatedTypes,
    });
  }, [captureConfig, onUpdateCaptureConfig]);

  return {
    captureConfig,
    updateDocumentConfig,
    updateImageConfig,
    toggleCaptureType,
    hasDocumentCapture: captureConfig?.captureType.includes(CaptureType.DOCUMENT) || false,
    hasImageCapture: captureConfig?.captureType.includes(CaptureType.IMAGE) || false,
  };
}