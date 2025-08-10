#!/usr/bin/env node

import { AutoFixSystem } from './core';
import { ConfigManager } from './core/config';

async function main() {
  try {
    // Validate configuration
    const config = ConfigManager.getInstance();
    if (!config.validate()) {
      console.error('❌ Configuration validation failed. Please check your .env file.');
      process.exit(1);
    }

    // Initialize and start the system
    const system = new AutoFixSystem();
    
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Received SIGINT, shutting down gracefully...');
      await system.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
      await system.stop();
      process.exit(0);
    });

    // Start the system
    await system.start();

    // Keep the process running
    console.log('🔄 System is running. Press Ctrl+C to stop.');
    
  } catch (error) {
    console.error('💥 Failed to start Auto-Fix System:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}

export { AutoFixSystem } from './core';