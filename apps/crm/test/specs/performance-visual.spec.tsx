import React, { useState, useEffect, useRef } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Zap, Activity } from 'lucide-react';

export function PerformanceTestRunner() {
  const [fps, setFps] = useState<number>(0);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [renderCount, setRenderCount] = useState(0);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    memory: 0,
    dom: 0,
    styles: 0,
  });
  
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(performance.now());
  const framesRef = useRef<number>(0);

  useEffect(() => {
    const measureFPS = () => {
      const now = performance.now();
      framesRef.current++;

      if (now >= lastTimeRef.current + 1000) {
        setFps(Math.round((framesRef.current * 1000) / (now - lastTimeRef.current)));
        framesRef.current = 0;
        lastTimeRef.current = now;
      }

      if (isMonitoring) {
        animationRef.current = requestAnimationFrame(measureFPS);
      }
    };

    if (isMonitoring) {
      animationRef.current = requestAnimationFrame(measureFPS);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isMonitoring]);

  useEffect(() => {
    const updateMetrics = () => {
      // Memory (if available)
      const memory = (performance as any).memory;
      if (memory) {
        setPerformanceMetrics((prev) => ({
          ...prev,
          memory: Math.round(memory.usedJSHeapSize / 1048576), // MB
        }));
      }

      // DOM nodes
      const domNodes = document.querySelectorAll('*').length;
      setPerformanceMetrics((prev) => ({
        ...prev,
        dom: domNodes,
      }));

      // Stylesheets
      const stylesheets = document.styleSheets.length;
      setPerformanceMetrics((prev) => ({
        ...prev,
        styles: stylesheets,
      }));
    };

    const interval = setInterval(updateMetrics, 1000);
    updateMetrics();

    return () => clearInterval(interval);
  }, []);

  const triggerRerender = () => {
    setRenderCount((prev) => prev + 1);
  };

  const getFPSColor = (fps: number) => {
    if (fps >= 55) return 'text-success';
    if (fps >= 30) return 'text-warning';
    return 'text-destructive';
  };

  const getFPSStatus = (fps: number) => {
    if (fps >= 55) return 'ممتاز';
    if (fps >= 30) return 'جيد';
    return 'ضعيف';
  };

  return (
    <div className="space-y-6">
      <div>
        <h3>اختبار الأداء البصري</h3>
        <p className="text-muted-foreground">
          قياس FPS وتأثير التصميم على الأداء
        </p>
      </div>

      {/* FPS Monitor */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4>مراقب FPS</h4>
            <p className="text-muted-foreground">
              Frames Per Second
            </p>
          </div>
          <Button
            onClick={() => setIsMonitoring(!isMonitoring)}
            variant={isMonitoring ? 'destructive' : 'default'}
          >
            {isMonitoring ? 'إيقاف' : 'بدء'} المراقبة
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className={`text-6xl font-bold ${getFPSColor(fps)}`}>
              {fps}
            </div>
            <Badge variant="outline" className="mt-2">
              {getFPSStatus(fps)}
            </Badge>
          </div>
          <div className="flex-1">
            <Progress value={(fps / 60) * 100} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
              الهدف: 60 FPS
            </p>
          </div>
        </div>
      </Card>

      {/* Performance Metrics */}
      <Card className="p-6">
        <h4 className="mb-4">مقاييس الأداء</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Memory Usage</p>
            </div>
            <p className="text-2xl font-bold">{performanceMetrics.memory} MB</p>
          </div>
          <div className="p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">DOM Nodes</p>
            </div>
            <p className="text-2xl font-bold">{performanceMetrics.dom}</p>
          </div>
          <div className="p-4 border rounded">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">Stylesheets</p>
            </div>
            <p className="text-2xl font-bold">{performanceMetrics.styles}</p>
          </div>
        </div>
      </Card>

      {/* Glassmorphism Performance Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار أداء Glassmorphism</h4>
        <p className="text-sm text-muted-foreground mb-4">
          قياس تأثير Backdrop Filter على الأداء
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="glass-light p-6 rounded-xl">
            <h5>Light Glass</h5>
            <p className="text-muted-foreground">blur(12px)</p>
          </div>
          <div className="glass-medium p-6 rounded-xl">
            <h5>Medium Glass</h5>
            <p className="text-muted-foreground">blur(16px)</p>
          </div>
          <div className="glass-intense p-6 rounded-xl">
            <h5>Intense Glass</h5>
            <p className="text-muted-foreground">blur(20px)</p>
          </div>
        </div>
      </Card>

      {/* Re-render Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار Re-render</h4>
        <div className="flex items-center gap-4 mb-4">
          <Button onClick={triggerRerender}>
            إعادة Render
          </Button>
          <p className="text-muted-foreground">
            عدد المرات: <strong>{renderCount}</strong>
          </p>
        </div>
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-4">
              <p>Component {i + 1} - Render count: {renderCount}</p>
            </Card>
          ))}
        </div>
      </Card>

      {/* Animation Performance Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار أداء الرسوم المتحركة</h4>
        <div className="flex gap-4">
          <div className="glass-light p-6 rounded-xl animate-pulse">
            <Zap className="w-8 h-8 mb-2" />
            <p>Pulse Animation</p>
          </div>
          <div className="glass-medium p-6 rounded-xl animate-fade-in">
            <Activity className="w-8 h-8 mb-2" />
            <p>Fade In Animation</p>
          </div>
        </div>
      </Card>

      {/* Paint Performance */}
      <Card className="p-6">
        <h4 className="mb-4">نصائح الأداء</h4>
        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
          <li>استخدم will-change للعناصر المتحركة</li>
          <li>قلل استخدام backdrop-filter في العناصر الكثيرة</li>
          <li>استخدم transform بدلاً من top/left للتحريك</li>
          <li>استخدم React.memo للمكونات التي لا تتغير</li>
          <li>قلل عدد re-renders غير الضرورية</li>
        </ul>
      </Card>
    </div>
  );
}
