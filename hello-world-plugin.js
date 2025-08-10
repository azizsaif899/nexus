// TASK-PLUGIN-001: Hello World plugin demo
class HelloWorldPlugin {
  constructor() {
    this.name = 'HelloWorld';
    this.version = '1.0.0';
  }
  
  init() {
    console.log('🔌 Hello World Plugin initialized');
  }
  
  execute(params) {
    return `Hello, ${params.name || 'World'}!`;
  }
  
  getInfo() {
    return {
      name: this.name,
      version: this.version,
      description: 'Demo plugin for PluginManager'
    };
  }
}

// Plugin Manager demo
const plugin = new HelloWorldPlugin();
plugin.init();
console.log(plugin.execute({ name: 'Developer' }));