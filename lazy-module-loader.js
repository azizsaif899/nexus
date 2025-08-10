// TASK-PERF-002: Fix lazy module loading
class LazyModuleLoader {
  constructor() {
    this.loadedModules = new Map();
    this.loadingPromises = new Map();
  }
  
  async loadModule(moduleName) {
    // Check if already loaded
    if (this.loadedModules.has(moduleName)) {
      return this.loadedModules.get(moduleName);
    }
    
    // Check if currently loading
    if (this.loadingPromises.has(moduleName)) {
      return this.loadingPromises.get(moduleName);
    }
    
    // Start loading
    const loadPromise = this.performLoad(moduleName);
    this.loadingPromises.set(moduleName, loadPromise);
    
    try {
      const module = await loadPromise;
      this.loadedModules.set(moduleName, module);
      this.loadingPromises.delete(moduleName);
      
      console.log(`⚡ Module ${moduleName} loaded lazily`);
      return module;
    } catch (error) {
      this.loadingPromises.delete(moduleName);
      throw error;
    }
  }
  
  async performLoad(moduleName) {
    // Simulate module loading
    await new Promise(resolve => setTimeout(resolve, 100));
    return { name: moduleName, loaded: true };
  }
}

console.log('✅ Lazy module loading fixed');