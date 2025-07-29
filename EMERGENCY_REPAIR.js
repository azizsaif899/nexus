// 🚨 G-Assistant Emergency Repair System - For Apps Script Environment
// Run this directly in Apps Script if system is broken

function emergencyRepair() {
  Logger.log('🚨 EMERGENCY REPAIR SYSTEM ACTIVATED');
  Logger.log('=====================================');
  
  const repairs = [];
  
  try {
    // 1. Ensure basic globals exist
    if (typeof GAssistant === 'undefined') {
      global.GAssistant = {
        System: {},
        Utils: {},
        AI: {},
        Tools: {},
        UI: {},
        Agents: {}
      };
      repairs.push('✅ Created GAssistant namespace');
    }
    
    // 2. Ensure Logger exists
    if (typeof Logger === 'undefined') {
      global.Logger = {
        log: function() { 
          try { 
            console.log.apply(console, arguments); 
          } catch(e) { 
            // Fallback for environments without console
          } 
        },
        warn: function() { 
          try { 
            console.warn.apply(console, arguments); 
          } catch(e) {} 
        },
        error: function() { 
          try { 
            console.error.apply(console, arguments); 
          } catch(e) {} 
        }
      };
      repairs.push('✅ Created Logger system');
    }
    
    // 3. Create emergency Injector
    if (!GAssistant.Utils.Injector) {
      GAssistant.Utils.Injector = {
        _moduleFactories: {},
        _moduleExports: {},
        _isInitialized: false,
        
        registerFactory: function(name, factory) {
          this._moduleFactories[name] = factory;
          Logger.log(`📦 Registered factory: ${name}`);
        },
        
        setExports: function(name, exports) {
          this._moduleExports[name] = exports;
        },
        
        get: function(...dependencyNames) {
          const resolved = {};
          dependencyNames.forEach(name => {
            if (this._moduleExports[name]) {
              resolved[name] = this._moduleExports[name];
            } else {
              resolved[name] = this._createEmergencyFallback(name);
            }
          });
          return resolved;
        },
        
        _createEmergencyFallback: function(name) {
          Logger.log(`⚠️ Creating emergency fallback for: ${name}`);
          return {
            _isFallback: true,
            _emergencyFallback: true,
            log: (msg) => Logger.log(`[${name}] ${msg}`),
            warn: (msg) => Logger.log(`[${name} WARN] ${msg}`),
            error: (msg) => Logger.log(`[${name} ERROR] ${msg}`),
            init: () => {
              Logger.log(`[${name}] Emergency init called`);
              return true;
            },
            isReady: () => ({ status: 'emergency_fallback', name }),
            checkReady: () => false,
            handleRequest: () => ({ type: 'error', text: `${name} in emergency mode` }),
            get: () => null,
            set: () => true,
            ask: () => ({ type: 'error', text: `${name} in emergency mode` }),
            track: () => true,
            process: () => ({ success: false, error: `${name} in emergency mode` })
          };
        },
        
        buildAllModules: function() {
          Logger.log('🔧 Emergency buildAllModules starting...');
          
          // Ensure _moduleExports exists
          if (!this._moduleExports) {
            this._moduleExports = {};
            Logger.log('⚠️ _moduleExports was undefined, created empty object');
          }
          
          const factories = Object.keys(this._moduleFactories);
          Logger.log(`📦 Found ${factories.length} factories to build`);
          
          let built = 0;
          factories.forEach(name => {
            try {
              const factory = this._moduleFactories[name];
              if (typeof factory === 'function') {
                const exports = factory({});
                this.setExports(name, exports);
                built++;
                Logger.log(`✅ Built: ${name}`);
              } else {
                Logger.log(`❌ Invalid factory for ${name}: ${typeof factory}`);
                this.setExports(name, this._createEmergencyFallback(name));
              }
            } catch (e) {
              Logger.log(`❌ Failed to build ${name}: ${e.message}`);
              this.setExports(name, this._createEmergencyFallback(name));
            }
          });
          
          Logger.log(`🎯 Emergency build complete: ${built}/${factories.length} modules built`);
          this._isInitialized = true;
        }
      };
      repairs.push('✅ Created emergency Injector');
    }
    
    // 4. Create defineModule function
    if (typeof defineModule === 'undefined') {
      global.defineModule = function(name, factory) {
        if (GAssistant?.Utils?.Injector) {
          GAssistant.Utils.Injector.registerFactory(name, factory);
        } else {
          Logger.log(`❌ Cannot register ${name}: Injector not available`);
        }
      };
      repairs.push('✅ Created defineModule function');
    }
    
    // 5. Create emergency initialization function
    global.emergencyInitialize = function() {
      Logger.log('🚨 Emergency initialization starting...');
      
      try {
        const injector = GAssistant.Utils.Injector;
        
        // Build all modules
        injector.buildAllModules();
        
        // Initialize modules with init() functions
        let initialized = 0;
        Object.keys(injector._moduleExports || {}).forEach(name => {
          const moduleExports = injector._moduleExports[name];
          if (moduleExports && typeof moduleExports.init === 'function' && !moduleExports._isFallback) {
            try {
              moduleExports.init();
              initialized++;
            } catch (e) {
              Logger.log(`❌ Error initializing ${name}: ${e.message}`);
            }
          }
        });
        
        Logger.log(`🔧 Emergency initialization complete: ${initialized} modules initialized`);
        return true;
        
      } catch (e) {
        Logger.log(`❌ Emergency initialization failed: ${e.message}`);
        return false;
      }
    };
    repairs.push('✅ Created emergency initialization function');
    
    // 6. Create system status checker
    global.checkEmergencyStatus = function() {
      Logger.log('📊 Emergency System Status Check');
      Logger.log('================================');
      
      const status = {
        GAssistant: !!GAssistant,
        Logger: !!Logger,
        Injector: !!GAssistant?.Utils?.Injector,
        defineModule: typeof defineModule === 'function',
        moduleFactories: Object.keys(GAssistant?.Utils?.Injector?._moduleFactories || {}).length,
        moduleExports: Object.keys(GAssistant?.Utils?.Injector?._moduleExports || {}).length
      };
      
      Object.entries(status).forEach(([key, value]) => {
        Logger.log(`${typeof value === 'boolean' ? (value ? '✅' : '❌') : '📊'} ${key}: ${value}`);
      });
      
      return status;
    };
    repairs.push('✅ Created system status checker');
    
    Logger.log('\n🎯 EMERGENCY REPAIR SUMMARY:');
    repairs.forEach(repair => Logger.log(`  ${repair}`));
    
    Logger.log('\n🚀 NEXT STEPS:');
    Logger.log('1. Run: emergencyInitialize()');
    Logger.log('2. Run: checkEmergencyStatus()');
    Logger.log('3. Test basic functionality');
    
    return {
      success: true,
      repairs: repairs.length,
      repairsList: repairs
    };
    
  } catch (e) {
    Logger.log(`❌ EMERGENCY REPAIR FAILED: ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    return {
      success: false,
      error: e.message,
      repairs: repairs.length
    };
  }
}

// Auto-run emergency repair
emergencyRepair();