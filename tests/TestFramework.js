
/**
 * @file TestFramework.js
 * @description إطار اختبارات متقدم مع Mocking و Spying
 */

class TestFramework {
  constructor() {
    this.tests = [];
    this.mocks = new Map();
    this.spies = new Map();
  }

  // إنشاء Mock
  createMock(name, methods = {}) {
    const mock = {};
    
    Object.keys(methods).forEach(method => {
      mock[method] = (...args) => {
        this.recordCall(name, method, args);
        return methods[method](...args);
      };
    });

    this.mocks.set(name, mock);
    return mock;
  }

  // إنشاء Spy
  createSpy(obj, methodName) {
    const originalMethod = obj[methodName];
    const spy = {
      calls: [],
      callCount: 0,
      restore: () => { obj[methodName] = originalMethod; }
    };

    obj[methodName] = (...args) => {
      spy.calls.push(args);
      spy.callCount++;
      return originalMethod.apply(obj, args);
    };

    this.spies.set(`${obj.constructor.name}.${methodName}`, spy);
    return spy;
  }

  recordCall(mockName, method, args) {
    const key = `${mockName}.${method}`;
    if (!this.mocks.get(mockName).calls) {
      this.mocks.get(mockName).calls = {};
    }
    if (!this.mocks.get(mockName).calls[method]) {
      this.mocks.get(mockName).calls[method] = [];
    }
    this.mocks.get(mockName).calls[method].push(args);
  }

  // تشغيل اختبار
  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async runAll() {
    console.log(`🧪 تشغيل ${this.tests.length} اختبار...`);
    
    const results = [];
    for (const test of this.tests) {
      try {
        await test.testFn();
        results.push({ name: test.name, status: 'passed' });
        console.log(`✅ ${test.name}`);
      } catch (error) {
        results.push({ name: test.name, status: 'failed', error: error.message });
        console.log(`❌ ${test.name}: ${error.message}`);
      }
    }

    return results;
  }

  // تنظيف
  cleanup() {
    this.spies.forEach(spy => spy.restore());
    this.mocks.clear();
    this.spies.clear();
  }
}

export default TestFramework;
