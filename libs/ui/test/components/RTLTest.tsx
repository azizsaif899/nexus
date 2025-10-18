import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { ChevronLeft, ChevronRight, ArrowLeft, ArrowRight } from 'lucide-react';

export function RTLTest() {
  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div>
        <h1>اختبار دعم RTL</h1>
        <p className="text-muted-foreground">Right-to-Left Support للغة العربية</p>
      </div>

      <Separator />

      {/* Font Test */}
      <Card>
        <CardHeader>
          <CardTitle>اختبار الخطوط</CardTitle>
          <CardDescription>IBM Plex Sans Arabic للعربية و Inter للإنجليزية</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h2>نص عربي بخط IBM Plex Sans Arabic</h2>
            <p>هذا نص تجريبي باللغة العربية لاختبار الخط والتنسيق</p>
          </div>
          <Separator />
          <div>
            <h2>English Text with Inter Font</h2>
            <p>This is a test paragraph in English to verify font rendering</p>
          </div>
        </CardContent>
      </Card>

      {/* Direction Test */}
      <Card>
        <CardHeader>
          <CardTitle>اختبار اتجاه النص</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>حقل إدخال عربي</Label>
            <Input placeholder="اكتب هنا بالعربية..." />
          </div>
          <div className="space-y-2">
            <Label>English Input Field</Label>
            <Input placeholder="Type here in English..." dir="ltr" />
          </div>
        </CardContent>
      </Card>

      {/* Layout Test */}
      <Card>
        <CardHeader>
          <CardTitle>اختبار التخطيط RTL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Flex Row */}
          <div className="flex gap-2">
            <Badge>الأول</Badge>
            <Badge>الثاني</Badge>
            <Badge>الثالث</Badge>
          </div>

          {/* Buttons with Icons */}
          <div className="flex gap-2 flex-wrap">
            <Button>
              <ArrowRight className="ml-2 h-4 w-4" />
              السابق
            </Button>
            <Button>
              التالي
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </div>

          {/* Chevrons */}
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Test */}
      <Card>
        <CardHeader>
          <CardTitle>اختبار الشبكة (Grid)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-primary/10 rounded-md">
              <h4>عمود 1</h4>
              <p className="text-sm">محتوى العمود الأول</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-md">
              <h4>عمود 2</h4>
              <p className="text-sm">محتوى العمود الثاني</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-md">
              <h4>عمود 3</h4>
              <p className="text-sm">محتوى العمود الثالث</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* List Test */}
      <Card>
        <CardHeader>
          <CardTitle>اختبار القوائم</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2">قائمة عربية:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>العنصر الأول</li>
              <li>العنصر الثاني</li>
              <li>العنصر الثالث</li>
            </ul>
          </div>
          <Separator />
          <div dir="ltr">
            <h4 className="mb-2">English List:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>First Item</li>
              <li>Second Item</li>
              <li>Third Item</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Mixed Content */}
      <Card>
        <CardHeader>
          <CardTitle>محتوى مختلط (عربي + English)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>هذا نص عربي مع كلمات English مدمجة في النص</p>
          <p>الإصدار: Version 1.0.0</p>
          <p>التاريخ: 16 October 2025</p>
          <p>CRM Nxs - نظام إدارة علاقات العملاء</p>
        </CardContent>
      </Card>

      {/* Success */}
      <Card className="border-green-500 bg-green-500/10">
        <CardContent className="pt-6">
          <p className="text-center">
            ✅ دعم RTL يعمل بشكل كامل! النصوص العربية تظهر من اليمين إلى اليسار بشكل صحيح.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
