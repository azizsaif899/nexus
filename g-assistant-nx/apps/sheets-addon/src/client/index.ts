/**
 * Client-side entry point for Google Sheets Add-on
 * Handles all frontend interactions
 */

import { SidebarManager } from './sidebar-manager';
import { UIComponents } from './ui-components';
import { EventHandler } from './event-handler';

// Initialize client-side components
class SheetsAddonClient {
  private sidebarManager: SidebarManager;
  private uiComponents: UIComponents;
  private eventHandler: EventHandler;

  constructor() {
    this.sidebarManager = new SidebarManager();
    this.uiComponents = new UIComponents();
    this.eventHandler = new EventHandler();
    
    this.initialize();
  }

  private initialize(): void {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupUI());
    } else {
      this.setupUI();
    }
  }

  private setupUI(): void {
    this.uiComponents.createMainInterface();
    this.eventHandler.setupEventListeners();
    this.sidebarManager.initialize();
    
    console.log('🚀 AzizSys Sheets Add-on Client initialized');
  }
}

// Auto-initialize when script loads
new SheetsAddonClient();