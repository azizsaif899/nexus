const path = require('path');
const fs = require('fs').promises;

// Mock fs.promises to prevent actual file system operations during tests
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    appendFile: jest.fn(),
    access: jest.fn(), // Added access mock
  },
}));

describe('Executor Service', () => {
  let run;
  let amazonPlugin;
  const MOCK_REPORT_PATH = './mock_report.json';
  const MOCK_FIXES_LOG_PATH = path.join(__dirname, '../../../fixes_log.md'); // Corrected path

  beforeAll(() => {
    // Mock the amazon plugin before requiring the executor service
    jest.doMock(path.resolve(process.cwd(), 'packages/executor-service/plugins/amazon'), () => ({
      run: jest.fn().mockResolvedValue({ mock: 'response' }),
    }));
    amazonPlugin = require(path.resolve(process.cwd(), 'packages/executor-service/plugins/amazon'));

    // Require the executor service after its dependencies are mocked
    const executorModule = require(path.resolve(process.cwd(), 'packages/executor-service'));
    run = executorModule.run;
  });

  beforeEach(() => {
    // Reset mocks before each test
    fs.readFile.mockReset();
    fs.writeFile.mockReset();
    fs.appendFile.mockReset();
    amazonPlugin.run.mockClear(); // Clear mock calls for amazon plugin
  });

  it('should execute a text-replace task and log the fix', async () => {
    const mockReportContent = JSON.stringify({
      id: 'test_fix_1',
      description: 'Test text replace',
      task: {
        type: 'text-replace',
        payload: {
          filePath: 'test_file.txt',
          oldText: 'old content',
          newText: 'new content',
        },
      },
    });
    const mockFileContent = 'This is old content.';

    fs.readFile.mockResolvedValueOnce(mockReportContent); // For reading the report
    fs.readFile.mockResolvedValueOnce(mockFileContent); // For reading the target file
    fs.writeFile.mockResolvedValueOnce();
    fs.appendFile.mockResolvedValueOnce();

    await run(MOCK_REPORT_PATH);

    // Verify report was read
    expect(fs.readFile).toHaveBeenCalledWith(MOCK_REPORT_PATH, 'utf8');
    
    // Verify target file was read and written
    expect(fs.readFile).toHaveBeenCalledWith(expect.stringContaining('test_file.txt'), 'utf8');
    expect(fs.writeFile).toHaveBeenCalledWith(expect.stringContaining('test_file.txt'), expect.stringContaining('new content'), 'utf8');

    // Verify fix was logged
    expect(fs.appendFile).toHaveBeenCalledWith(MOCK_FIXES_LOG_PATH, expect.stringContaining('Fix ID: test_fix_1'), );
  });

  it('should execute an amazon task and log the fix', async () => {
    const mockReportContent = JSON.stringify({
      id: 'test_amazon_task_1',
      description: 'Test Amazon API call',
      task: {
        type: 'amazon',
        payload: {
          endpoint: 'https://api.amazon.com/test',
          params: { key: 'value' },
        },
      },
    });

    fs.readFile.mockResolvedValueOnce(mockReportContent); // For reading the report
    fs.appendFile.mockResolvedValueOnce();

    await run(MOCK_REPORT_PATH);

    // Verify report was read
    expect(fs.readFile).toHaveBeenCalledWith(MOCK_REPORT_PATH, 'utf8');
    
    // Verify amazon plugin was called
    expect(amazonPlugin.run).toHaveBeenCalledWith({
      endpoint: 'https://api.amazon.com/test',
      params: { key: 'value' },
    });

    // Verify fix was logged
    expect(fs.appendFile).toHaveBeenCalledWith(MOCK_FIXES_LOG_PATH, expect.stringContaining('Fix ID: test_amazon_task_1'), );
  });

  it('should handle unknown task types', async () => {
    const mockReportContent = JSON.stringify({
      id: 'test_unknown_task',
      description: 'Unknown task type',
      task: {
        type: 'unknown',
        payload: {},
      },
    });

    fs.readFile.mockResolvedValueOnce(mockReportContent);
    fs.appendFile.mockResolvedValueOnce();

    await run(MOCK_REPORT_PATH);

    // Verify error was logged to console (or thrown, depending on implementation)
    // For now, we'll check that appendFile was NOT called, indicating an error before logging
    expect(fs.appendFile).not.toHaveBeenCalled();
  });
});