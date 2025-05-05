// Main export file

// Export types
export * from './types';

// Export hooks
export * from './hooks/useProject';
export * from './hooks/useSourceSink';
export * from './hooks/useCaptureConfig';

// Export utils
export * from './utils/helpers';
export * from './utils/storage';
export * from './utils/validation';

// Export services
export * from './ProjectService';

// Export legacy function for backward compatibility
export function isOdd(n: number): boolean {
  return n % 2 === 1;
}