export class ConfigCore {
  private config: Map<string, any> = new Map();

  constructor() {
    this.initializeDefaults();
  }

  private initializeDefaults(): void {
    this.config.set('system.language', 'ar');
    this.config.set('system.theme', 'light');
    this.config.set('ai.defaultModel', 'gemini-pro');
    this.config.set('ai.temperature', 0.7);
    this.config.set('database.connectionPool', 20);
    this.config.set('cache.ttl', 3600);
  }

  get(key: string): any {
    return this.config.get(key);
  }

  set(key: string, value: any): void {
    this.config.set(key, value);
    // Removed console.log
  }

  getAll(): Record<string, any> {
    return Object.fromEntries(this.config);
  }

  reset(): void {
    this.config.clear();
    this.initializeDefaults();
    // Removed console.log
  }

  export(): string {
    return JSON.stringify(Object.fromEntries(this.config), null, 2);
  }

  import(configJson: string): void {
    const imported = JSON.parse(configJson);
    for (const [key, value] of Object.entries(imported)) {
      this.config.set(key, value);
    }
    // Removed console.log
  }
}