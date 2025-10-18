import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { CheckCircle2, XCircle, Home, User, Settings, Bell, Search, Heart } from 'lucide-react';

export function FontsIconsTestRunner() {
  const [fontTests, setFontTests] = useState<{ name: string; loaded: boolean }[]>([]);

  useEffect(() => {
    const checkFonts = async () => {
      const fonts = [
        { name: 'Inter', family: 'Inter' },
        { name: 'IBM Plex Sans Arabic', family: 'IBM Plex Sans Arabic' },
      ];

      const results = await Promise.all(
        fonts.map(async (font) => {
          try {
            await document.fonts.load(`16px "${font.family}"`);
            const loaded = document.fonts.check(`16px "${font.family}"`);
            return { name: font.name, loaded };
          } catch {
            return { name: font.name, loaded: false };
          }
        })
      );

      setFontTests(results);
    };

    checkFonts();
  }, []);

  const icons = [
    { name: 'Home', component: Home },
    { name: 'User', component: User },
    { name: 'Settings', component: Settings },
    { name: 'Bell', component: Bell },
    { name: 'Search', component: Search },
    { name: 'Heart', component: Heart },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3>اختبار الخطوط والأيقونات</h3>
        <p className="text-muted-foreground">
          تحميل خطوط Inter و IBM Plex Arabic وأيقونات Lucide
        </p>
      </div>

      {/* Fonts Test */}
      <Card className="p-6">
        <h4 className="mb-4">حالة تحميل الخطوط</h4>
        <div className="space-y-3">
          {fontTests.map((font) => (
            <div
              key={font.name}
              className={`flex items-center justify-between p-3 rounded border ${
                font.loaded ? 'border-success/20' : 'border-destructive/20'
              }`}
            >
              <div className="flex items-center gap-3">
                {font.loaded ? (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                ) : (
                  <XCircle className="w-5 h-5 text-destructive" />
                )}
                <span className="font-medium">{font.name}</span>
              </div>
              <Badge variant={font.loaded ? 'default' : 'destructive'}>
                {font.loaded ? 'محمل' : 'غير محمل'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Font Preview - English */}
      <Card className="p-6">
        <h4 className="mb-4">معاينة خط Inter (English)</h4>
        <div className="space-y-2" style={{ fontFamily: 'Inter' }}>
          <p className="text-2xl">The quick brown fox jumps over the lazy dog</p>
          <p>ABCDEFGHIJKLMNOPQRSTUVWXYZ</p>
          <p>abcdefghijklmnopqrstuvwxyz</p>
          <p>0123456789</p>
        </div>
      </Card>

      {/* Font Preview - Arabic */}
      <Card className="p-6">
        <h4 className="mb-4">معاينة خط IBM Plex Sans Arabic (عربي)</h4>
        <div className="space-y-2" dir="rtl" style={{ fontFamily: 'IBM Plex Sans Arabic' }}>
          <p className="text-2xl">الحروف العربية الكاملة</p>
          <p>أ ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي</p>
          <p>٠ ١ ٢ ٣ ٤ ٥ ٦ ٧ ٨ ٩</p>
          <p>نص تجريبي بالعربية لاختبار الخط</p>
        </div>
      </Card>

      {/* Font Weights Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار أوزان الخطوط</h4>
        <div className="space-y-2">
          <p style={{ fontWeight: 300 }}>Light (300) - نصوص خفيفة</p>
          <p style={{ fontWeight: 400 }}>Normal (400) - النص العادي</p>
          <p style={{ fontWeight: 500 }}>Medium (500) - أزرار، labels</p>
          <p style={{ fontWeight: 600 }}>Semibold (600) - عناوين h1-h6</p>
          <p style={{ fontWeight: 700 }}>Bold (700) - تأكيد قوي</p>
        </div>
      </Card>

      {/* Icons Test */}
      <Card className="p-6">
        <h4 className="mb-4">اختبار أيقونات Lucide React</h4>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {icons.map((icon) => {
            const IconComponent = icon.component;
            return (
              <div
                key={icon.name}
                className="flex flex-col items-center gap-2 p-4 border rounded hover:bg-muted transition-colors"
              >
                <IconComponent className="w-6 h-6" />
                <small className="text-muted-foreground">{icon.name}</small>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Icon Sizes Test */}
      <Card className="p-6">
        <h4 className="mb-4">أحجام الأيقونات</h4>
        <div className="flex items-end gap-4">
          <Home className="w-4 h-4" />
          <Home className="w-5 h-5" />
          <Home className="w-6 h-6" />
          <Home className="w-8 h-8" />
          <Home className="w-12 h-12" />
          <Home className="w-16 h-16" />
        </div>
        <div className="flex gap-2 mt-4">
          <small>16px</small>
          <small>20px</small>
          <small>24px</small>
          <small>32px</small>
          <small>48px</small>
          <small>64px</small>
        </div>
      </Card>
    </div>
  );
}
