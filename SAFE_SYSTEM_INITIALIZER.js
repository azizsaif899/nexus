/**
 * Safe System Initializer - Complete module initialization with dependency management
 */

// Load the comprehensive initializer
if (typeof Initializer === 'undefined') {
    // In Apps Script environment, we need to ensure the initializer is available
    eval(HtmlService.createHtmlOutputFromFile('COMPREHENSIVE_MODULE_INITIALIZER').getContent());
}

/**
 * Initialize all system modules with proper dependency order
 */
function initializeAllModules() {
    const { defineModule, moduleVerifier, _moduleFactories, _moduleExports } = Initializer;
    
    let builtCount = 0;
    let iterationCount = 0;
    const maxIterations = _moduleFactories.size * 2;

    Logger.log(`📦 Found ${_moduleFactories.size} registered factories`);
    Logger.log(`🔧 Building ${_moduleFactories.size} modules...`);

    while (builtCount < _moduleFactories.size && iterationCount < maxIterations) {
        let modulesBuiltThisIteration = 0;
        
        for (const [moduleName] of _moduleFactories) {
            if (Initializer._moduleStatus.get(moduleName) === 'pending') {
                if (Initializer.buildModule(moduleName)) {
                    modulesBuiltThisIteration++;
                    builtCount++;
                }
            }
        }

        if (modulesBuiltThisIteration === 0 && builtCount < _moduleFactories.size) {
            Logger.log(`❌ Could not build all modules. Remaining: ${_moduleFactories.size - builtCount}`);
            for (const [moduleName] of _moduleFactories) {
                if (Initializer._moduleStatus.get(moduleName) === 'pending') {
                    Logger.log(`   - Module '${moduleName}' is still pending. Check its dependencies.`);
                }
            }
            break;
        }
        iterationCount++;
    }

    if (builtCount === _moduleFactories.size) {
        Logger.log(`🎯 Built ${builtCount} modules successfully`);
        return true;
    } else {
        Logger.log(`❌ Safe initialization failed: Only ${builtCount} of ${_moduleFactories.size} modules were built.`);
        return false;
    }
}

/**
 * Define all core system modules
 */
function defineAllSystemModules() {
    const { defineModule } = Initializer;

    // Core modules first
    defineModule('System.Dev.ModuleVerifier', [], () => {
        Logger.log('✅ System.Dev.ModuleVerifier registered successfully');
        return Initializer.moduleVerifier;
    });

    defineModule('System.Config', [], () => {
        Logger.log('✅ Built: System.Config');
        return {
            telemetryEnabled: true,
            logLevel: 'Info'
        };
    });

    defineModule('System.Utils', [], () => {
        return GAssistant.Utils;
    });

    // UI modules
    defineModule('System.UI.Dialogue', ['System.Config'], (Config) => {
        Logger.log('✅ Built: System.UI.Dialogue');
        return {
            show: (message) => Logger.log(`[Dialogue] ${message}`)
        };
    });

    defineModule('System.UI', ['System.Config'], (Config) => {
        Logger.log('✅ Built: System.UI');
        return {};
    });

    // AI modules
    defineModule('System.AI', ['System.Config'], (Config) => {
        Logger.log('✅ Built: System.AI');
        return {};
    });

    // Tools
    defineModule('System.Tools', [], () => {
        Logger.log('✅ Built: System.Tools');
        return {};
    });

    // Agents
    defineModule('System.AgentDeveloper', ['System.Config', 'System.AI', 'System.Tools'], (Config, AI, Tools) => {
        Logger.log('✅ Built: System.AgentDeveloper');
        return { handleRequest: () => {} };
    });

    defineModule('System.AgentCFO', ['System.Config', 'System.AI', 'System.Tools'], (Config, AI, Tools) => {
        Logger.log('✅ Built: System.AgentCFO');
        return { handleRequest: () => {} };
    });

    defineModule('System.AgentGeneral', ['System.AI', 'System.Config'], (AI, Config) => {
        Logger.log('✅ Built: System.AgentGeneral');
        return { handleRequest: () => {} };
    });

    // Complex modules with dependencies
    defineModule('System.Agents.Catalog', ['System.AgentDeveloper', 'System.AgentCFO', 'System.AgentGeneral'], (DevAgent, CFOAgent, GeneralAgent) => {
        Logger.log('✅ Built: System.Agents.Catalog');
        return {
            agents: { DevAgent, CFOAgent, GeneralAgent },
            handleRequest: (agentName, request) => {
                const agent = this.agents[agentName];
                if (agent && typeof agent.handleRequest === 'function') {
                    return agent.handleRequest(request);
                }
                Logger.log(`Agent ${agentName} not found`);
                return null;
            }
        };
    });
}

/**
 * Main safe initialization function
 */
function safeInitializeSystem() {
    try {
        Logger.log('🚀 G-Assistant Safe Comprehensive Initializer starting...');
        
        // Core system integrity check
        Logger.log('🔍 Checking core system integrity...');
        Logger.log(`GAssistant موجود؟ ${typeof GAssistant !== 'undefined'}`);
        Logger.log(`GAssistant.Utils موجود؟ ${typeof GAssistant.Utils !== 'undefined'}`);
        Logger.log(`Initializer موجود؟ ${typeof Initializer !== 'undefined'}`);

        // Define all modules
        defineAllSystemModules();
        
        // Initialize all modules
        const success = initializeAllModules();

        if (success) {
            Logger.log('✅ System initialized successfully.');
            
            // Create emergency system doctor
            if (typeof GAssistant.Dev === 'undefined') {
                GAssistant.Dev = {};
            }
            if (typeof GAssistant.Dev.SystemDoctor === 'undefined') {
                GAssistant.Dev.SystemDoctor = {};
                Logger.log('✅ Emergency Injector created');
                Logger.log('📦 Emergency registered: System.Dev.SystemDoctor');
            }
            
            return true;
        } else {
            Logger.log('❌ Safe initialization failed: Some modules could not be built.');
            return false;
        }

    } catch (error) {
        Logger.log(`❌ Safe initialization failed: ${error.message}`);
        Logger.log(`❌ Stack trace: ${error.stack}`);
        return false;
    }
}

// Auto-run initialization
safeInitializeSystem();