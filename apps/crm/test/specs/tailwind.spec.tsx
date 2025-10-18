import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface TailwindTest {
  className: string;
  property: string;
  passed: boolean;
  actualValue: string;
}

export function TailwindTestRunner() {
  const [tests, setTests] = useState<TailwindTest[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = () => {
    setIsRunning(true);
    
    const testElement = document.createElement('div');
    document.body.appendChild(testElement);

    const classTests = [
      { className: 'bg-primary', property: 'backgroundColor' },
      { className: 'text-foreground', property: 'color' },
      { className: 'p-4', property: 'padding' },
      { className: 'rounded-lg', property: 'borderRadius' },
      { className: 'flex', property: 'display' },
      { className: 'gap-4', property: 'gap' },
      { className: 'shadow-lg', property: 'boxShadow' },
      { className: 'border', property: 'borderWidth' },
    ];

    const results: TailwindTest[] = classTests.map((test) => {
      testElement.className = test.className;
      const styles = getComputedStyle(testElement);
      const actualValue = styles.getPropertyValue(
        test.property.replace(/([A-Z])/g, '-$1').toLowerCase()
      );
      
      return {
        ...test,
        actualValue,
        passed: actualValue.trim() !== '' && actualValue !== '0px',
      };
    });

    document.body.removeChild(testElement);
    setTests(results);
    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const passedCount = tests.filter((t) => t.passed).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3>اختبار Tailwind CSS Classes</h3>
          <p className="text-muted-foreground">
            التحقق من تطبيق Tailwind classes بشكل صحيح
          </p>
        </div>
        <Button onClick={runTests} disabled={isRunning}>
          {isRunning ? 'جاري الفحص...' : 'إعادة الفحص'}
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4>النتائج</h4>
            <p className="text-muted-foreground">
              {passedCount} / {tests.length} class يعمل بشكل صحيح
            </p>
          </div>
          <Badge variant={passedCount === tests.length ? 'default' : 'destructive'}>
            {passedCount === tests.length ? 'Tailwind يعمل' : 'مشاكل في Tailwind'}
          </Badge>
        </div>
      </Card>

      <div className="space-y-3">
        {tests.map((test, index) => (
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
              <div className="flex-1">
                <code className="text-sm font-medium">.{test.className}</code>
                <p className="text-muted-foreground mt-1">
                  {test.property}: <code className="text-xs">{test.actualValue}</code>
                </p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Visual Examples */}
      <Card className="p-6">
        <h4 className="mb-4">أمثلة مرئية</h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="bg-primary text-primary-foreground p-4 rounded-lg">
              bg-primary
            </div>
            <div className="bg-secondary text-secondary-foreground p-4 rounded-lg">
              bg-secondary
            </div>
            <div className="bg-muted text-muted-foreground p-4 rounded-lg">
              bg-muted
            </div>
          </div>
          <div className="flex gap-4">
            <div className="shadow-sm border p-4 rounded">shadow-sm</div>
            <div className="shadow-md border p-4 rounded">shadow-md</div>
            <div className="shadow-lg border p-4 rounded">shadow-lg</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
