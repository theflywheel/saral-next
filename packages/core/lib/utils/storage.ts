/**
 * Utility for browser storage operations
 */
export class StorageUtil {
    private readonly prefix: string;
  
    constructor(prefix = 'saral') {
      this.prefix = prefix;
    }
  
    /**
     * Generate a prefixed key
     * @param key The original key
     * @returns The prefixed key
     */
    private getKey(key: string): string {
      return `${this.prefix}:${key}`;
    }
  
    /**
     * Check if a key starts with this storage's prefix
     * @param key The key to check
     * @returns True if the key has this storage's prefix
     */
    private hasPrefix(key: string): boolean {
      return key.startsWith(`${this.prefix}:`);
    }
  
    /**
     * Store data in localStorage
     * @param key The storage key
     * @param data The data to store
     */
    setItem<T>(key: string, data: T): void {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem(this.getKey(key), JSON.stringify(data));
        }
      } catch (error) {
        console.error(`Error storing data for key ${key}:`, error);
      }
    }
  
    /**
     * Retrieve data from localStorage
     * @param key The storage key
     * @returns The stored data or null if not found
     */
    getItem<T>(key: string, defaultValue: T | null = null): T | null {
      try {
        if (typeof localStorage !== 'undefined') {
          const item = localStorage.getItem(this.getKey(key));
          return item ? JSON.parse(item) : defaultValue;
        }
        return defaultValue;
      } catch (error) {
        console.error(`Error retrieving data for key ${key}:`, error);
        return defaultValue;
      }
    }
  
    /**
     * Remove data from localStorage
     * @param key The storage key
     */
    removeItem(key: string): void {
      try {
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem(this.getKey(key));
        }
      } catch (error) {
        console.error(`Error removing data for key ${key}:`, error);
      }
    }
  
    /**
     * Clear all data with the current prefix
     */
    clear(): void {
      try {
        if (typeof localStorage === 'undefined') return;
        
        // Method 1: If key and length are available (normal browser env)
        if (typeof localStorage.key === 'function' && 'length' in localStorage) {
          const keysToRemove: string[] = [];
          
          // First, collect all keys with our prefix
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && this.hasPrefix(key)) {
              keysToRemove.push(key);
            }
          }
          
          // Then remove them
          keysToRemove.forEach(key => {
            localStorage.removeItem(key);
          });
        } 
        // Method 2: If we have access to the store object (for testing)
        else if ('store' in localStorage) {
          const store = (localStorage as any).store;
          Object.keys(store).forEach(key => {
            if (this.hasPrefix(key)) {
              localStorage.removeItem(key);
            }
          });
        }
      } catch (error) {
        console.error('Error clearing storage:', error);
      }
    }
  }
  
  // Create a default instance
  export const storage = new StorageUtil();