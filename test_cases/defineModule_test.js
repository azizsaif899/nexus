
// حالة اختبار: تحويل defineModule
defineModule('System.TestModule', ({ Utils }) => {
  function testFunction() {
    return 'test';
  }
  return { testFunction };
});
