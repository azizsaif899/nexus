#!/bin/bash

# ====================================================================
# CRM Nxs - تثبيت وإعداد تلقائي كامل
# ====================================================================
# هذا السكريبت يقوم بإعداد المشروع بالكامل بشكل تلقائي
# ====================================================================

echo ""
echo "====================================================================="
echo "     CRM Nxs - الإعداد التلقائي الكامل"
echo "====================================================================="
echo ""

# التحقق من Node.js و npm
echo "🔍 التحقق من البيئة..."
echo ""

if ! command -v node &> /dev/null; then
    echo "❌ Node.js غير مثبت!"
    echo "   قم بتثبيت Node.js 18+ من: https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node --version)
echo "✅ Node.js: $NODE_VERSION"

if ! command -v npm &> /dev/null; then
    echo "❌ npm غير متوفر!"
    exit 1
fi

NPM_VERSION=$(npm --version)
echo "✅ npm: v$NPM_VERSION"

echo ""
echo "====================================================================="
echo ""

# تثبيت التبعيات
echo "📦 تثبيت التبعيات..."
echo ""

npm install

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ فشل تثبيت التبعيات!"
    echo "   جرب: npm cache clean --force ثم npm install"
    exit 1
fi

echo ""
echo "✅ تم تثبيت التبعيات بنجاح!"
echo ""
echo "====================================================================="
echo ""

# فحص TypeScript
echo "🔍 فحص TypeScript..."
echo ""

npm run type-check

if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  يوجد أخطاء TypeScript"
    echo "   يمكنك المتابعة لكن يُفضل إصلاحها"
else
    echo ""
    echo "✅ لا توجد أخطاء TypeScript!"
fi

echo ""
echo "====================================================================="
echo ""

# الإعداد مكتمل
echo "🎉 اكتمل الإعداد بنجاح!"
echo ""
echo "📝 الخطوات التالية:"
echo ""
echo "   1. للتشغيل مباشرة:"
echo "      ./scripts/start-dev.sh"
echo ""
echo "   2. للتشخيص الشامل:"
echo "      ./scripts/diagnose.sh"
echo ""
echo "   3. للبناء للإنتاج:"
echo "      ./scripts/build.sh"
echo ""
echo "====================================================================="
echo ""
echo "📚 للمزيد من المعلومات:"
echo "   • اقرأ: README.md"
echo "   • اقرأ: QUICK_START.md"
echo "   • اقرأ: START_HERE.md"
echo ""
echo "====================================================================="
echo ""
echo "💡 نصيحة: شغّل start-dev.sh الآن للبدء!"
echo ""
