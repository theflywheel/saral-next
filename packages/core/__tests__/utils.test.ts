import { 
    generateId, 
    formatDate, 
    isEmpty, 
    deepClone, 
    capitalize 
  } from '../lib/utils/helpers';
  import { 
    isValidEmail, 
    isValidUrl, 
    isValidProjectName,
    isValidConnectionString,
    isValidFileSize
  } from '../lib/utils/validation';
  import { StorageUtil } from '../lib/utils/storage';
  
  describe('Helpers', () => {
    test('generateId should return a string', () => {
      const id = generateId();
      expect(typeof id).toBe('string');
      expect(id.length).toBeGreaterThan(0);
    });
  
    test('formatDate should return an ISO date string', () => {
      const date = new Date('2023-01-01T12:00:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBe(date.toISOString());
    });
  
    test('isEmpty should correctly identify empty values', () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty('')).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      
      expect(isEmpty('hello')).toBe(false);
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty({ key: 'value' })).toBe(false);
      expect(isEmpty(0)).toBe(false);
      expect(isEmpty(false)).toBe(false);
    });
  
    test('deepClone should create a deep copy of an object', () => {
      const original = { 
        name: 'Test', 
        nested: { value: 42 }, 
        array: [1, 2, { id: 3 }] 
      };
      const clone = deepClone(original);
      
      // Should be equal in value
      expect(clone).toEqual(original);
      
      // But not the same reference
      expect(clone).not.toBe(original);
      expect(clone.nested).not.toBe(original.nested);
      expect(clone.array).not.toBe(original.array);
      
      // Modifying clone should not affect original
      clone.name = 'Modified';
      clone.nested.value = 99;
      if (typeof clone.array[2] === 'object' && clone.array[2] !== null) {
        (clone.array[2] as {id: number}).id = 100;
      }
      
      expect(original.name).toBe('Test');
      expect(original.nested.value).toBe(42);
      if (typeof original.array[2] === 'object' && original.array[2] !== null) {
        expect((original.array[2] as {id: number}).id).toBe(3);
      }
    });
  
    test('capitalize should capitalize the first letter of a string', () => {
      expect(capitalize('hello')).toBe('Hello');
      expect(capitalize('WORLD')).toBe('WORLD');
      expect(capitalize('')).toBe('');
      expect(capitalize('a')).toBe('A');
    });
  });
  
  describe('Validation', () => {
    test('isValidEmail should validate email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name+tag@domain.co.uk')).toBe(true);
      
      expect(isValidEmail('invalid')).toBe(false);
      expect(isValidEmail('invalid@')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  
    test('isValidUrl should validate URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://sub.domain.co.uk/path')).toBe(true);
      
      expect(isValidUrl('invalid')).toBe(false);
      expect(isValidUrl('http://')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  
    test('isValidProjectName should validate project names', () => {
      expect(isValidProjectName('Project 1')).toBe(true);
      expect(isValidProjectName('A')).toBe(true);
      
      expect(isValidProjectName('')).toBe(false);
      expect(isValidProjectName('   ')).toBe(false);
      expect(isValidProjectName('x'.repeat(101))).toBe(false);
    });
  
    test('isValidConnectionString should validate connection strings', () => {
      expect(isValidConnectionString('mongodb://localhost:27017/db', 'mongodb')).toBe(true);
      expect(isValidConnectionString('mongodb+srv://user:pass@cluster0.mongodb.net/db', 'mongodb')).toBe(true);
      expect(isValidConnectionString('postgresql://user:pass@localhost:5432/db', 'postgresql')).toBe(true);
      expect(isValidConnectionString('mysql://user:pass@localhost:3306/db', 'mysql')).toBe(true);
      
      expect(isValidConnectionString('invalid', 'mongodb')).toBe(false);
      expect(isValidConnectionString('', 'mongodb')).toBe(false);
      expect(isValidConnectionString('http://example.com', 'mongodb')).toBe(false);
    });
  
    test('isValidFileSize should validate file sizes', () => {
      const oneMB = 1024 * 1024;
      
      expect(isValidFileSize(oneMB, 2)).toBe(true);
      expect(isValidFileSize(oneMB * 2, 2)).toBe(true);
      expect(isValidFileSize(0, 5)).toBe(true);
      
      expect(isValidFileSize(oneMB * 3, 2)).toBe(false);
      expect(isValidFileSize(oneMB * 10, 5)).toBe(false);
    });
  });
  
  describe('StorageUtil', () => {
    // Reset the localStorage mock before each test
    beforeEach(() => {
      // Reset the storage by clearing it
      if (global.localStorage) {
        global.localStorage.clear();
        // Reset the internal store directly
        if ('store' in global.localStorage) {
          (global.localStorage as any).store = {};
        }
      }
    });
  
    test('should store and retrieve data with prefix', () => {
      const storage = new StorageUtil('test');
      
      storage.setItem('key', { value: 42 });
      expect(global.localStorage.getItem('test:key')).toBe('{"value":42}');
      
      const retrieved = storage.getItem<{ value: number }>('key');
      expect(retrieved).toEqual({ value: 42 });
    });
  
    test('should handle non-existent keys', () => {
      const storage = new StorageUtil('test');
      
      const retrieved = storage.getItem('nonexistent');
      expect(retrieved).toBeNull();
      
      const withDefault = storage.getItem('nonexistent', { default: true });
      expect(withDefault).toEqual({ default: true });
    });
  
    test('should remove item', () => {
      const storage = new StorageUtil('test');
      
      storage.setItem('key', 'value');
      expect(storage.getItem('key')).toBe('value');
      
      storage.removeItem('key');
      expect(storage.getItem('key')).toBeNull();
    });
  
    test('should clear items with prefix', () => {
      const storageA = new StorageUtil('testA');
      const storageB = new StorageUtil('testB');
      
      storageA.setItem('key1', 'valueA1');
      storageA.setItem('key2', 'valueA2');
      storageB.setItem('key1', 'valueB1');
      
      // Add mock key method if not present
      if (!global.localStorage.key) {
        (global.localStorage as any).key = (index: number) => {
          return Object.keys((global.localStorage as any).store)[index] || null;
        };
      }
  
      // Add mock length property if not present
      if (!('length' in global.localStorage)) {
        Object.defineProperty(global.localStorage, 'length', {
          get() {
            return Object.keys((global.localStorage as any).store).length;
          }
        });
      }
      
      storageA.clear();
      
      // Check that the right keys were removed
      expect(storageA.getItem('key1')).toBeNull();
      expect(storageA.getItem('key2')).toBeNull();
      expect(storageB.getItem('key1')).toBe('valueB1');
    });
  });