import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { useTheme } from '../../components/ThemeProvider';
import { Moon, Sun, Monitor } from 'lucide-react';

export function ThemeTest() {
  const { theme, setTheme } = useTheme();

  const colors = [
    { name: 'Background', class: 'bg-background' },
    { name: 'Foreground', class: 'bg-foreground' },
    { name: 'Card', class: 'bg-card' },
    { name: 'Muted', class: 'bg-muted' },
    { name: 'Primary', class: 'bg-primary' },
    { name: 'Secondary', class: 'bg-secondary' },
    { name: 'Accent', class: 'bg-accent' },
    { name: 'Destructive', class: 'bg-destructive' },
    { name: 'Border', class: 'bg-border' },
    { name: 'Input', class: 'bg-input' },
    { name: 'Ring', class: 'bg-ring' },
  ];

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1>اختبار الثيمات</h1>
        <p className="text-muted-foreground">Dark Mode / Light Mode و نظام الألوان</p>
      </div>

      <Separator />

      {/* Theme Controls */}
      <Card>
        <CardHeader>
          <CardTitle>تبديل الثيم</CardTitle>
          <CardDescription>الثيم الحالي: <Badge>{theme}</Badge></CardDescription>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => setTheme('light')}
          >
            <Sun className="ml-2 h-4 w-4" />
            فاتح
          </Button>
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => setTheme('dark')}
          >
            <Moon className="ml-2 h-4 w-4" />
            مظلم
          </Button>
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => setTheme('system')}
          >
            <Monitor className="ml-2 h-4 w-4" />
            النظام
          </Button>
        </CardContent>
      </Card>

      {/* Color Palette */}
      <Card>
        <CardHeader>
          <CardTitle>نظام الألوان Gray Scale</CardTitle>
          <CardDescription>جميع ألوان CSS Variables</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {colors.map((color) => (
              <div key={color.name} className="space-y-2">
                <div className={`${color.class} h-20 rounded-md border`} />
                <p className="text-sm">{color.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Text Colors */}
      <Card>
        <CardHeader>
          <CardTitle>ألوان النصوص</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-foreground">النص الأساسي - Foreground</p>
          <p className="text-muted-foreground">النص الثانوي - Muted Foreground</p>
          <p className="text-primary">النص الرئيسي - Primary</p>
          <p className="text-secondary-foreground">النص الثانوي - Secondary</p>
          <p className="text-destructive">النص التدميري - Destructive</p>
        </CardContent>
      </Card>

      {/* Cards Showcase */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>بطاقة عادية</CardTitle>
            <CardDescription>وصف البطاقة</CardDescription>
          </CardHeader>
          <CardContent>
            <p>محتوى البطاقة هنا</p>
          </CardContent>
        </Card>

        <Card className="bg-muted">
          <CardHeader>
            <CardTitle>بطاقة Muted</CardTitle>
            <CardDescription>وصف البطاقة</CardDescription>
          </CardHeader>
          <CardContent>
            <p>محتوى البطاقة هنا</p>
          </CardContent>
        </Card>

        <Card className="bg-accent">
          <CardHeader>
            <CardTitle>بطاقة Accent</CardTitle>
            <CardDescription>وصف البطاقة</CardDescription>
          </CardHeader>
          <CardContent>
            <p>محتوى البطاقة هنا</p>
          </CardContent>
        </Card>
      </div>

      {/* Borders & Shadows */}
      <Card>
        <CardHeader>
          <CardTitle>الحدود والظلال</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border rounded-md">
            <p>عنصر مع حدود Border</p>
          </div>
          <div className="p-4 border rounded-md shadow-sm">
            <p>عنصر مع ظل خفيف Shadow-sm</p>
          </div>
          <div className="p-4 border rounded-md shadow-md">
            <p>عنصر مع ظل متوسط Shadow-md</p>
          </div>
          <div className="p-4 border rounded-md shadow-lg">
            <p>عنصر مع ظل كبير Shadow-lg</p>
          </div>
        </CardContent>
      </Card>

      {/* Success */}
      <Card className="border-green-500 bg-green-500/10">
        <CardContent className="pt-6">
          <p className="text-center">
            ✅ نظام الثيمات يعمل بشكل صحيح! جرب التبديل بين الفاتح والمظلم.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
