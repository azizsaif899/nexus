import React from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Camera, AlertCircle } from 'lucide-react';

export function VisualRegressionTestRunner() {
  return (
    <div className="space-y-6">
      <div>
        <h3>اختبار التصميم البصري (Visual Regression)</h3>
        <p className="text-muted-foreground">
          مقارنة لقطات الشاشة للتحقق من عدم تغيير التصميم
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Visual Regression Testing يتطلب أدوات خارجية مثل Percy أو Chromatic.
          هذا عرض توضيحي للمفهوم.
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <h4 className="mb-4">الأدوات الموصى بها:</h4>
        <ul className="space-y-2 list-disc list-inside text-muted-foreground">
          <li>Chromatic - للتكامل مع Storybook</li>
          <li>Percy - للتكامل مع CI/CD</li>
          <li>Playwright Visual Comparisons - للاختبارات المخصصة</li>
          <li>BackstopJS - أداة مفتوحة المصدر</li>
        </ul>
      </Card>

      <Card className="p-6">
        <h4 className="mb-4">مكونات للمقارنة البصرية:</h4>
        <div className="grid gap-4">
          <div className="p-4 border rounded-lg">
            <h5>Button Component</h5>
            <div className="flex gap-2 mt-2">
              <Button>Primary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h5>Card Component</h5>
            <Card className="p-4 mt-2">
              <h6>Card Title</h6>
              <p className="text-muted-foreground">Card content goes here</p>
            </Card>
          </div>

          <div className="p-4 border rounded-lg">
            <h5>Glassmorphism Effect</h5>
            <div className="glass-light p-6 mt-2 rounded-xl">
              <p>هذا مثال على Glass Effect</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2">
        <Button className="gap-2">
          <Camera className="w-4 h-4" />
          التقاط لقطة شاشة مرجعية
        </Button>
        <Button variant="outline" className="gap-2">
          <Camera className="w-4 h-4" />
          مقارنة مع المرجع
        </Button>
      </div>
    </div>
  );
}
