// Mock for localStorage in Node.js environment
if (typeof global.localStorage === 'undefined') {
    // Only define if it doesn't exist yet
    const createMockStorage = () => {
      return {
        store: {},
        getItem(key) {
          return this.store[key] || null;
        },
        setItem(key, value) {
          this.store[key] = value.toString();
        },
        removeItem(key) {
          delete this.store[key];
        },
        clear() {
          this.store = {};
        },
        key(index) {
          return Object.keys(this.store)[index] || null;
        },
        get length() {
          return Object.keys(this.store).length;
        }
      };
    };
  
    Object.defineProperty(global, 'localStorage', {
      value: createMockStorage(),
      writable: true,
      configurable: true
    });
  }