/**
 * Validate email format
 * @param email Email to validate
 * @returns True if email is valid, false otherwise
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  
  /**
   * Validate URL format
   * @param url URL to validate
   * @returns True if URL is valid, false otherwise
   */
  export function isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  /**
   * Validate project name (non-empty, within length limits)
   * @param name Project name to validate
   * @returns True if name is valid, false otherwise
   */
  export function isValidProjectName(name: string): boolean {
    return name.trim().length > 0 && name.trim().length <= 100;
  }
  
  /**
   * Validate connection string format
   * @param connectionString Connection string to validate
   * @param type Database type
   * @returns True if connection string is valid, false otherwise
   */
  export function isValidConnectionString(connectionString: string, type: 'mongodb' | 'postgresql' | 'mysql'): boolean {
    if (!connectionString) return false;
    
    // Basic validation based on database type
    switch (type) {
      case 'mongodb':
        return connectionString.startsWith('mongodb://') || connectionString.startsWith('mongodb+srv://');
      case 'postgresql':
        return connectionString.startsWith('postgres://') || connectionString.startsWith('postgresql://');
      case 'mysql':
        return connectionString.includes('mysql');
      default:
        return false;
    }
  }
  
  /**
   * Validates file size against maximum allowed size
   * @param sizeInBytes File size in bytes
   * @param maxSizeMB Maximum allowed size in MB
   * @returns True if file size is valid, false otherwise
   */
  export function isValidFileSize(sizeInBytes: number, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return sizeInBytes <= maxSizeBytes;
  }