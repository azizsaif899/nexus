// Performance test script for nexus-ai-main

import lighthouse from 'lighthouse';
import chromeLauncher from 'chrome-launcher';
import fs from 'fs';

async function runPerformanceTest() {
  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless', '--no-sandbox', '--disable-dev-shm-usage']
  });

  const options = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance'],
    port: chrome.port,
  };

  try {
    const runnerResult = await lighthouse('http://localhost:3002', options);
    
    // Extract performance metrics
    const report = runnerResult.lhr;
    const performanceScore = report.categories.performance.score * 100;
    
    const metrics = {
      performanceScore: performanceScore,
      firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
      largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
      speedIndex: report.audits['speed-index'].numericValue,
      cumulativeLayoutShift: report.audits['cumulative-layout-shift'].numericValue,
      timeToFirstByte: report.audits['server-response-time'].numericValue,
      totalBlockingTime: report.audits['total-blocking-time'].numericValue
    };

    console.log('Performance Test Results:');
    console.log('========================');
    console.log(`Performance Score: ${performanceScore}%`);
    console.log(`First Contentful Paint: ${metrics.firstContentfulPaint}ms`);
    console.log(`Largest Contentful Paint: ${metrics.largestContentfulPaint}ms`);
    console.log(`Speed Index: ${metrics.speedIndex}ms`);
    console.log(`Cumulative Layout Shift: ${metrics.cumulativeLayoutShift}`);
    console.log(`Time to First Byte: ${metrics.timeToFirstByte}ms`);
    console.log(`Total Blocking Time: ${metrics.totalBlockingTime}ms`);

    // Save detailed report
    fs.writeFileSync('./lighthouse-report.json', JSON.stringify(report, null, 2));
    
    return metrics;
  } catch (error) {
    console.error('Performance test failed:', error);
  } finally {
    await chrome.kill();
  }
}

runPerformanceTest().catch(console.error);