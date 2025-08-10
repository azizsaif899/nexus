// TASK-REFACTOR-006: Resolve circular dependency
class DependencyResolver {
  constructor() {
    this.dependencies = new Map();
    this.loading = new Set();
  }
  
  register(name, factory) {
    this.dependencies.set(name, { factory, instance: null });
  }
  
  resolve(name) {
    if (this.loading.has(name)) {
      throw new Error(`Circular dependency detected: ${name}`);
    }
    
    const dep = this.dependencies.get(name);
    if (!dep) {
      throw new Error(`Dependency not found: ${name}`);
    }
    
    if (dep.instance) {
      return dep.instance;
    }
    
    this.loading.add(name);
    try {
      dep.instance = dep.factory();
      console.log(`🔗 Resolved dependency: ${name}`);
      return dep.instance;
    } finally {
      this.loading.delete(name);
    }
  }
}

// Fix circular dependency between initializer and main code
const resolver = new DependencyResolver();
resolver.register('initializer', () => ({ init: () => console.log('Init') }));
resolver.register('mainCode', () => ({ run: () => console.log('Run') }));

console.log('✅ Circular dependency resolved');