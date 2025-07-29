// Test script to verify the initialization fix
function testInitializationFix() {
  Logger.log('🧪 Testing initialization fix...');
  
  try {
    // Test 1: Check if GAssistant exists
    if (!GAssistant) {
      Logger.log('❌ GAssistant not found');
      return false;
    }
    
    // Test 2: Check if Injector exists
    if (!GAssistant.Utils || !GAssistant.Utils.Injector) {
      Logger.log('❌ Injector not found');
      return false;
    }
    
    const injector = GAssistant.Utils.Injector;
    
    // Test 3: Check if _moduleExports is initialized
    if (typeof injector._moduleExports === 'undefined') {
      Logger.log('❌ _moduleExports is still undefined');
      return false;
    }
    
    // Test 4: Try to call buildAllModules safely
    try {
      injector.buildAllModules();
      Logger.log('✅ buildAllModules executed without error');
    } catch (e) {
      Logger.log(`❌ buildAllModules failed: ${e.message}`);
      return false;
    }
    
    // Test 5: Check module counts
    const factoryCount = Object.keys(injector._moduleFactories || {}).length;
    const exportCount = Object.keys(injector._moduleExports || {}).length;
    
    Logger.log(`📊 Factories: ${factoryCount}, Exports: ${exportCount}`);
    
    // Test 6: Try initialization
    try {
      if (typeof initializeGAssistantSystem === 'function') {
        const result = initializeGAssistantSystem();
        Logger.log(`✅ Initialization result: ${result}`);
      } else {
        Logger.log('⚠️ initializeGAssistantSystem function not found');
      }
    } catch (e) {
      Logger.log(`❌ Initialization failed: ${e.message}`);
      return false;
    }
    
    Logger.log('✅ All tests passed!');
    return true;
    
  } catch (e) {
    Logger.log(`❌ Test failed with error: ${e.message}`);
    Logger.log(`Stack: ${e.stack}`);
    return false;
  }
}

// Run the test
testInitializationFix();