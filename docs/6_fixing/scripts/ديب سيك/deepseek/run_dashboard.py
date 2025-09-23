#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
===============================================================================
🔍 DEEP SEEK DASHBOARD LAUNCHER v2.0
===============================================================================

سكريبت تشغيل سريع لخادم الداش بورد التفاعلي

المؤلف: GitHub Copilot & Nexus Security Team
التاريخ: 22 سبتمبر 2025
===============================================================================
"""

import sys
import os
from pathlib import Path

# إضافة المجلد الحالي إلى مسار Python
current_dir = Path(__file__).parent
sys.path.insert(0, str(current_dir))

try:
    # استيراد المكونات مع معالجة الأخطاء
    try:
        from deepseek_ultimate_scanner import DeepSeekUltimateScanner
        scanner_available = True
    except ImportError as e:
        print(f"⚠️  تحذير: الماسح الأمني غير متوفر: {e}")
        scanner_available = False

    from dashboard_server import DashboardServer

    def main():
        """تشغيل خادم الداش بورد"""
        print("🔍 DeepSeek Ultimate Security Dashboard v2.0")
        print("🚀 تشغيل الخادم على http://localhost:8080")
        print("=" * 60)

        try:
            # إنشاء الماسح الأمني أو كائن بديل
            if scanner_available:
                print("📊 إنشاء الماسح الأمني...")
                scanner = DeepSeekUltimateScanner()
            else:
                print("📊 إنشاء كائن ماسح بديل...")
                scanner = MockScanner()

            # إنشاء خادم الداش بورد
            print("🌐 إنشاء خادم الداش بورد...")
            server = DashboardServer(scanner)

            # تشغيل الخادم
            print("✅ بدء تشغيل الخادم...")
            server.run()

        except KeyboardInterrupt:
            print("\n🛑 تم إيقاف الخادم بواسطة المستخدم")
        except Exception as e:
            print(f"❌ خطأ في تشغيل الخادم: {e}")
            print("تأكد من تثبيت المكتبات المطلوبة:")
            print("pip install psutil GPUtil requests torch transformers")
            return 1

        return 0

    class MockScanner:
        """كائن بديل للماسح عندما لا يكون متوفراً"""

        def __init__(self):
            self.directories = {
                "reports": Path("./reports"),
                "logs": Path("./logs")
            }
            for dir_path in self.directories.values():
                dir_path.mkdir(exist_ok=True)

        def deepseek(self):
            return None

    if __name__ == "__main__":
        sys.exit(main())

except ImportError as e:
    print(f"❌ خطأ في استيراد المكونات: {e}")
    print("تأكد من وجود الملفات التالية:")
    print("- deepseek_ultimate_scanner.py")
    print("- dashboard_server.py")
    sys.exit(1)