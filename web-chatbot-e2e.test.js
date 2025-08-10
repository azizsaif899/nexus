// TASK-TEST-007: E2E test for web-chatbot
describe('Web Chatbot E2E', () => {
  let page;
  
  beforeAll(async () => {
    page = await browser.newPage();
    await page.goto('http://localhost:3000/chatbot');
  });
  
  test('should complete user journey', async () => {
    // Step 1: Page loads
    await page.waitForSelector('.chat-container');
    expect(await page.title()).toBe('AI Chatbot');
    
    // Step 2: User types message
    await page.type('.message-input', 'Hello AI');
    await page.click('.send-button');
    
    // Step 3: AI responds
    await page.waitForSelector('.ai-message', { timeout: 5000 });
    const response = await page.$eval('.ai-message', el => el.textContent);
    expect(response).toBeTruthy();
    
    // Step 4: Conversation continues
    await page.type('.message-input', 'How are you?');
    await page.click('.send-button');
    
    await page.waitForSelector('.ai-message:nth-child(4)');
    const messages = await page.$$('.message');
    expect(messages.length).toBeGreaterThan(2);
  });
  
  test('should handle empty messages', async () => {
    await page.click('.send-button');
    const errorMsg = await page.$('.error-message');
    expect(errorMsg).toBeTruthy();
  });
});

console.log('✅ Web chatbot E2E test created');