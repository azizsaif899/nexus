import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Smartphone, Tablet, Monitor } from 'lucide-react';

export function ResponsiveTestRunner() {
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const updateViewport = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setViewport({ width, height });

      if (width < 640) {
        setDeviceType('Mobile');
      } else if (width < 1024) {
        setDeviceType('Tablet');
      } else {
        setDeviceType('Desktop');
      }
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  const breakpoints = [
    { name: 'sm', min: 640, icon: <Smartphone className="w-4 h-4" /> },
    { name: 'md', min: 768, icon: <Tablet className="w-4 h-4" /> },
    { name: 'lg', min: 1024, icon: <Monitor className="w-4 h-4" /> },
    { name: 'xl', min: 1280, icon: <Monitor className="w-4 h-4" /> },
    { name: '2xl', min: 1536, icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3>اختبار الاستجابة (Responsive)</h3>
        <p className="text-muted-foreground">
          التصميم على أحجام مختلفة ودعم RTL
        </p>
      </div>

      {/* Current Viewport */}
      <Card className="p-6">
        <h4 className="mb-4">Viewport الحالي</h4>
        <div className="flex items-center gap-4">
          <div>
            <p className="text-2xl font-semibold">
              {viewport.width} × {viewport.height}
            </p>
            <p className="text-muted-foreground">Pixels</p>
          </div>
          <Badge variant="outline" className="gap-2">
            {deviceType === 'Mobile' && <Smartphone className="w-4 h-4" />}
            {deviceType === 'Tablet' && <Tablet className="w-4 h-4" />}
            {deviceType === 'Desktop' && <Monitor className="w-4 h-4" />}
            {deviceType}
          </Badge>
        </div>
      </Card>

      {/* Breakpoints */}
      <Card className="p-6">
        <h4 className="mb-4">Tailwind Breakpoints</h4>
        <div className="space-y-3">
          {breakpoints.map((bp) => (
            <div
              key={bp.name}
              className={`flex items-center justify-between p-3 rounded border ${
                viewport.width >= bp.min ? 'border-success bg-success/10' : 'border-border'
              }`}
            >
              <div className="flex items-center gap-3">
                {bp.icon}
                <div>
                  <code className="font-medium">{bp.name}</code>
                  <p className="text-sm text-muted-foreground">
                    {bp.min}px+
                  </p>
                </div>
              </div>
              {viewport.width >= bp.min && (
                <Badge variant="default">Active</Badge>
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Responsive Grid Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار Grid الاستجابي</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted p-4 rounded text-center">
              <p>Item {i}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-4">
          1 عمود على Mobile، 2 على Tablet، 3 على Desktop، 4 على شاشات كبيرة
        </p>
      </Card>

      {/* RTL Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار RTL</h4>
        <div dir="rtl" className="space-y-4">
          <div className="flex gap-2">
            <Button>زر عربي</Button>
            <Button variant="outline">زر ثانوي</Button>
          </div>
          <Card className="p-4">
            <h5>بطاقة باللغة العربية</h5>
            <p className="text-muted-foreground">
              هذا نص تجريبي باللغة العربية للتحقق من دعم RTL
            </p>
          </Card>
        </div>
      </Card>

      {/* Typography Responsiveness */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار Typography الاستجابي</h4>
        <div className="space-y-2">
          <h1>عنوان H1 (24px ثابت)</h1>
          <h2>عنوان H2 (20px ثابت)</h2>
          <h3>عنوان H3 (18px ثابت)</h3>
          <p>فقرة عادية (16px ثابت)</p>
          <small>نص صغير (14px ثابت)</small>
        </div>
      </Card>
    </div>
  );
}
