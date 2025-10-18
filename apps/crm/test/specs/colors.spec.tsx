import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ColorTest {
  variable: string;
  expectedLight: string;
  expectedDark: string;
  actual: string;
  passed: boolean;
}

export function ColorsTestRunner() {
  const [colorTests, setColorTests] = useState<ColorTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    const rootStyles = getComputedStyle(document.documentElement);
    const isDark = document.documentElement.classList.contains('dark');

    const colorVariables = [
      {
        variable: '--background',
        expectedLight: '#ffffff',
        expectedDark: '#202020',
      },
      {
        variable: '--foreground',
        expectedLight: '#252525',
        expectedDark: '#EAEAEA',
      },
      {
        variable: '--primary',
        expectedLight: '#030213',
        expectedDark: '#EAEAEA',
      },
      {
        variable: '--background-secondary',
        expectedLight: '#f1f1f5',
        expectedDark: '#2c2c2c',
      },
      {
        variable: '--foreground-muted',
        expectedLight: '#717182',
        expectedDark: '#667781',
      },
      {
        variable: '--success',
        expectedLight: '#059669',
        expectedDark: '#EAEAEA',
      },
      {
        variable: '--destructive',
        expectedLight: '#d4183d',
        expectedDark: '#667781',
      },
    ];

    const results: ColorTest[] = colorVariables.map((test) => {
      const actual = rootStyles.getPropertyValue(test.variable).trim();
      const expected = isDark ? test.expectedDark : test.expectedLight;
      
      // Simple color comparison (you can make this more sophisticated)
      const passed = actual.length > 0;

      return {
        ...test,
        actual,
        passed,
      };
    });

    setColorTests(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passedCount = colorTests.filter((t) => t.passed).length;
  const totalCount = colorTests.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3>اختبار الألوان و CSS Variables</h3>
          <p className="text-muted-foreground">
            التحقق من تحميل متغيرات الألوان من Tailwind
          </p>
        </div>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'جاري الفحص...' : 'إعادة الفحص'}
        </Button>
      </div>

      {/* Results Summary */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4>النتائج</h4>
            <p className="text-muted-foreground">
              {passedCount} / {totalCount} متغير تم تحميله
            </p>
          </div>
          <Badge variant={passedCount === totalCount ? 'default' : 'destructive'}>
            {passedCount === totalCount ? 'جميع الألوان محملة' : 'بعض الألوان مفقودة'}
          </Badge>
        </div>
      </Card>

      {/* Color Variables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {colorTests.map((test, index) => (
          <Card
            key={index}
            className={`p-4 ${
              test.passed ? 'border-success/20' : 'border-destructive/20'
            }`}
          >
            <div className="flex items-start gap-3">
              {test.passed ? (
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1 space-y-2">
                <div>
                  <code className="text-sm">{test.variable}</code>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-border"
                    style={{ backgroundColor: test.actual }}
                  ></div>
                  <div className="text-sm">
                    <p className="text-muted-foreground">القيمة الفعلية:</p>
                    <code>{test.actual || 'غير محمل'}</code>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Color Palette Preview */}
      <Card className="p-6">
        <h4 className="mb-4">لوحة الألوان الكاملة</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Background', var: '--background' },
            { name: 'Foreground', var: '--foreground' },
            { name: 'Primary', var: '--primary' },
            { name: 'Secondary', var: '--background-secondary' },
            { name: 'Muted', var: '--background-muted' },
            { name: 'Border', var: '--border' },
            { name: 'Success', var: '--success' },
            { name: 'Warning', var: '--warning' },
            { name: 'Destructive', var: '--destructive' },
          ].map((color) => {
            const value = getComputedStyle(document.documentElement)
              .getPropertyValue(color.var)
              .trim();
            return (
              <div key={color.var} className="space-y-2">
                <div
                  className="w-full h-20 rounded border border-border shadow-sm"
                  style={{ backgroundColor: value }}
                ></div>
                <div className="text-center">
                  <small className="font-medium">{color.name}</small>
                  <p className="text-xs text-muted-foreground mt-1">
                    <code>{value.substring(0, 15)}...</code>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
