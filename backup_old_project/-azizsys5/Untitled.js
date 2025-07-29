// 20_ai/tests/allTests.gs

// 1) تحميل إطار GasTap
const t = GasTap();

// 2) Mock API لGeminiAdapter
const fakeResponse = { type:'text_response', text:'hello world' };
AI.GeminiAdapter = {
  callGeminiApi: (opts)=> fakeResponse
};

// 3) وحدة Memory
t.test('Memory: add/get/clear session', async () => {
  const sid = 'testSession';
  System.AI.Memory.clearSessionContext({ sessionId: sid });
  System.AI.Memory.addMessageToHistory({ sessionId: sid, message:{ role:'user', parts:[{text:'foo'}] } });
  let hist = System.AI.Memory.getSessionHistory({ sessionId: sid });
  t.equal(hist.length,1,'should have one message');
  t.equal(hist[0].parts[0].text,'foo');
  System.AI.Memory.clearSessionContext({ sessionId: sid });
  hist = System.AI.Memory.getSessionHistory({ sessionId: sid });
  t.equal(hist.length,0,'cleared');
});

// 4) وحدة Dispatcher
t.test('Dispatcher: text vs tool_call', () => {
  const textRes = { type:'text_response', text:'hi' };
  t.deepEqual(System.AI.Dispatcher.processApiResponse({ apiResponse:textRes }).type,'text_response');
  const toolRes = { type:'tool_call', data:{ functionCalls:[{name:'myFn', args:{}}] } };
  t.deepEqual(System.AI.Dispatcher.processApiResponse({ apiResponse:toolRes }).type,'tool_call');
});

// 5) وحدة Context
t.test('Context: combined context', () => {
  const sid='ctx1';
  System.AI.Memory.clearSessionContext({ sessionId: sid });
  System.AI.Memory.addMessageToHistory({ sessionId: sid, message:{role:'user',parts:[{text:'a'}]} });
  const ctx = System.AI.Memory.getCombinedContext({ sessionId:sid, userQuery:'x' });
  t.ok(Array.isArray(ctx.sessionHistory),'has sessionHistory');
  t.ok(Array.isArray(ctx.longTermContext),'has longTermContext');
});

// 6) وحدة Adapter
t.test('Adapter: callGeminiApi mock', () => {
  const r = AI.GeminiAdapter.callGeminiApi({model:'m',payload:{}});
  t.equal(r.type,'text_response');
});

// 7) وحدة Core
t.test('Core: ask builds payload and returns UiResponse', () => {
  const resp = System.AI.Core.ask('hello', {});
  t.equal(resp.type,'text_response');
  t.equal(resp.text,'hello world');
});

// 8) IntentAnalyzer
t.test('IntentAnalyzer: map action to tool', () => {
  // Action contains كلمة "راجع" يوجه reviewCode
  const out = System.AI.IntentAnalyzer.processUserRequest({ action:'راجع الكود', code:'1+1' });
  t.ok(out.type==='tool_result' || out.type==='error');
});

// 9) ToolExecutor
t.test('ToolExecutor: execute known function', () => {
  // Mock أضف دالة للكتالوج
  Tools.Catalog = { getFunction: name=> args=> ({ok:true,name,args}) };
  const r = System.AI.ToolExecutor.executeFunctionCall('any', {x:1});
  t.equal(r.type,'tool_result');
  t.equal(r.data.ok,true);
});

// 10) UI Sidebar (مدمج)
t.test('UI: handleDeveloperRequest routes to IntentAnalyzer', () => {
  // Mock IntentAnalyzer
  System.AI.IntentAnalyzer = { processUserRequest: req=> ({type:'info',text:req.action}) };
  const out = System.UI.DeveloperSidebar.handleDeveloperRequest({action:'اختبار'});
  t.equal(out.text,'اختبار');
});

// 11) ملخص
t.summary();
