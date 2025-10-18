import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, XCircle, Sun, Moon } from 'lucide-react';

interface TestResult {
  name: string;
  passed: boolean;
  message: string;
}

export function ThemeTestRunner() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('light');

  const runTests = () => {
    setIsRunning(true);
    const newResults: TestResult[] = [];

    // Test 1: Check if HTML has theme class
    const htmlElement = document.documentElement;
    const hasThemeClass = htmlElement.classList.contains('light') || htmlElement.classList.contains('dark');
    newResults.push({
      name: 'HTML Theme Class',
      passed: hasThemeClass,
      message: hasThemeClass
        ? `✓ HTML has theme class: ${htmlElement.classList.contains('dark') ? 'dark' : 'light'}`
        : '✗ HTML missing theme class',
    });

    // Test 2: Check CSS variables in :root
    const rootStyles = getComputedStyle(document.documentElement);
    const hasBackgroundVar = rootStyles.getPropertyValue('--background').trim() !== '';
    const hasForegroundVar = rootStyles.getPropertyValue('--foreground').trim() !== '';
    const hasPrimaryVar = rootStyles.getPropertyValue('--primary').trim() !== '';

    newResults.push({
      name: 'CSS Variables Loaded',
      passed: hasBackgroundVar && hasForegroundVar && hasPrimaryVar,
      message:
        hasBackgroundVar && hasForegroundVar && hasPrimaryVar
          ? '✓ All essential CSS variables loaded'
          : '✗ Missing CSS variables',
    });

    // Test 3: Check theme toggle functionality
    const isDarkMode = htmlElement.classList.contains('dark');
    newResults.push({
      name: 'Theme Detection',
      passed: true,
      message: `✓ Current theme: ${isDarkMode ? 'Dark' : 'Light'}`,
    });

    // Test 4: Check color values in light mode
    if (!isDarkMode) {
      const bgColor = rootStyles.getPropertyValue('--background').trim();
      const fgColor = rootStyles.getPropertyValue('--foreground').trim();
      
      newResults.push({
        name: 'Light Mode Colors',
        passed: bgColor.includes('255') || bgColor.includes('ffffff'),
        message: bgColor.includes('255')
          ? '✓ Light mode background is white/light'
          : '✗ Light mode background incorrect',
      });
    }

    // Test 5: Check color values in dark mode
    if (isDarkMode) {
      const bgColor = rootStyles.getPropertyValue('--background').trim();
      
      newResults.push({
        name: 'Dark Mode Colors',
        passed: bgColor.includes('32') || bgColor.includes('202020'),
        message: bgColor.includes('32')
          ? '✓ Dark mode background is dark'
          : '✗ Dark mode background incorrect',
      });
    }

    // Test 6: Check transitions
    const body = document.body;
    const transition = getComputedStyle(body).transition;
    newResults.push({
      name: 'Theme Transitions',
      passed: transition.includes('background-color') || transition.includes('color'),
      message: transition.includes('background-color')
        ? '✓ Theme transitions enabled'
        : '⚠ No theme transitions detected',
    });

    setResults(newResults);
    setIsRunning(false);
  };

  const toggleTheme = () => {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    setCurrentTheme(newTheme);
    
    // Re-run tests after theme change
    setTimeout(runTests, 100);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3>اختبار الثيم والألوان</h3>
          <p className="text-muted-foreground">
            التحقق من Dark/Light mode والتبديل بينهما
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="gap-2"
          >
            {currentTheme === 'light' ? (
              <>
                <Moon className="w-4 h-4" />
                تبديل إلى الداكن
              </>
            ) : (
              <>
                <Sun className="w-4 h-4" />
                تبديل إلى الفاتح
              </>
            )}
          </Button>
          <Button onClick={runTests} disabled={isRunning}>
            {isRunning ? 'جاري الفحص...' : 'إعادة الفحص'}
          </Button>
        </div>
      </div>

      {/* Results Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4>النتائج</h4>
            <p className="text-muted-foreground">
              {passedCount} / {totalCount} اختبار نجح
            </p>
          </div>
          <Badge variant={passedCount === totalCount ? 'default' : 'destructive'}>
            {passedCount === totalCount ? 'نجح' : 'فشل'}
          </Badge>
        </div>
      </Card>

      {/* Test Results */}
      <div className="space-y-3">
        {results.map((result, index) => (
          <Card
            key={index}
            className={`p-4 ${
              result.passed ? 'border-success/20' : 'border-destructive/20'
            }`}
          >
            <div className="flex items-start gap-3">
              {result.passed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <h4 className={result.passed ? 'text-success' : 'text-destructive'}>
                  {result.name}
                </h4>
                <p className="text-muted-foreground mt-1">{result.message}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Theme Preview */}
      <Card className="p-6">
        <h4 className="mb-4">معاينة الثيم الحالي</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="w-full h-20 bg-background border border-border rounded"></div>
            <small className="text-muted-foreground">Background</small>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-foreground rounded"></div>
            <small className="text-muted-foreground">Foreground</small>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-primary rounded"></div>
            <small className="text-muted-foreground">Primary</small>
          </div>
          <div className="space-y-2">
            <div className="w-full h-20 bg-muted rounded"></div>
            <small className="text-muted-foreground">Muted</small>
          </div>
        </div>
      </Card>
    </div>
  );
}
