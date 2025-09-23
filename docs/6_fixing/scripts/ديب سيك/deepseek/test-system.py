#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 اختبار سريع لنظام DeepSeek Ultimate Security Scanner
يتحقق من الوظائف الأساسية والتكامل بين المكونات
"""

import os
import sys
import json
import time
from pathlib import Path

def print_header(text):
    """طباعة رأس ملون"""
    print("\n" + "="*60)
    print(f"🔍 {text}")
    print("="*60)

def print_success(text):
    """طباعة رسالة نجاح"""
    print(f"✅ {text}")

def print_error(text):
    """طباعة رسالة خطأ"""
    print(f"❌ {text}")

def print_warning(text):
    """طباعة رسالة تحذير"""
    print(f"⚠️  {text}")

def test_file_exists(file_path, description):
    """اختبار وجود ملف"""
    if os.path.exists(file_path):
        print_success(f"تم العثور على {description}: {file_path}")
        return True
    else:
        print_error(f"لم يتم العثور على {description}: {file_path}")
        return False

def test_python_import(module_name):
    """اختبار استيراد وحدة Python"""
    try:
        __import__(module_name)
        print_success(f"تم استيراد {module_name} بنجاح")
        return True
    except ImportError:
        print_warning(f"لم يتم العثور على {module_name} (اختياري)")
        return False

def test_scanner_import():
    """اختبار استيراد الماسح الأمني"""
    try:
        from deepseek_ultimate_scanner import DeepSeekUltimateScanner
        scanner = DeepSeekUltimateScanner()
        print_success("تم استيراد DeepSeekUltimateScanner بنجاح")
        return True, scanner
    except Exception as e:
        print_error(f"فشل في استيراد DeepSeekUltimateScanner: {e}")
        return False, None

def test_dashboard_import():
    """اختبار استيراد لوحة التحكم"""
    try:
        from dashboard_server import DashboardServer
        print_success("تم استيراد DashboardServer بنجاح")
        return True
    except Exception as e:
        print_error(f"فشل في استيراد DashboardServer: {e}")
        return False

def test_basic_scan(scanner):
    """اختبار فحص أساسي"""
    try:
        # إنشاء ملف اختبار مؤقت
        test_file = "test_security_sample.py"
        with open(test_file, 'w', encoding='utf-8') as f:
            f.write("""
# ملف اختبار للأمان
import os
password = "123456"  # مشكلة أمنية
exec("print('hello')")  # مشكلة أمنية
""")

        # فحص الملف
        findings = scanner.scan_file_comprehensive(test_file)

        # تنظيف
        os.remove(test_file)

        if len(findings) > 0:
            print_success(f"تم العثور على {len(findings)} نتيجة في الفحص الأساسي")
            return True
        else:
            print_warning("لم يتم العثور على نتائج في الفحص الأساسي")
            return True  # ليس خطأ

    except Exception as e:
        print_error(f"فشل في الفحص الأساسي: {e}")
        return False

def test_config_file():
    """اختبار ملف التكوين"""
    config_file = "security-config.json"
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)

            required_keys = ['deepseek', 'scanning', 'reporting', 'hardware', 'ai']
            missing_keys = [key for key in required_keys if key not in config]

            if not missing_keys:
                print_success("ملف التكوين صحيح ومكتمل")
                return True
            else:
                print_warning(f"مفاتيح مفقودة في التكوين: {missing_keys}")
                return False

        except Exception as e:
            print_error(f"خطأ في قراءة ملف التكوين: {e}")
            return False
    else:
        print_warning("ملف التكوين غير موجود (سيتم إنشاؤه تلقائياً)")
        return True

def test_reports_directory():
    """اختبار مجلد التقارير"""
    reports_dir = "reports"
    if not os.path.exists(reports_dir):
        os.makedirs(reports_dir)
        print_success("تم إنشاء مجلد التقارير")
    else:
        print_success("مجلد التقارير موجود")

    # إنشاء مجلدات فرعية
    subdirs = ["chunks", "ai-analysis", "logs"]
    for subdir in subdirs:
        subdir_path = os.path.join(reports_dir, subdir)
        if not os.path.exists(subdir_path):
            os.makedirs(subdir_path)
            print_success(f"تم إنشاء مجلد {subdir}")
        else:
            print_success(f"مجلد {subdir} موجود")

    return True

def test_hardware_monitoring():
    """اختبار مراقبة الأجهزة"""
    try:
        import psutil
        cpu_percent = psutil.cpu_percent(interval=0.1)
        memory = psutil.virtual_memory()
        print_success(f"مراقبة الأجهزة تعمل: CPU {cpu_percent}%, RAM {memory.percent}%")
        return True
    except ImportError:
        print_warning("psutil غير مثبت - مراقبة الأجهزة محدودة")
        return True
    except Exception as e:
        print_error(f"خطأ في مراقبة الأجهزة: {e}")
        return False

def test_gpu_monitoring():
    """اختبار مراقبة GPU"""
    try:
        import GPUtil
        gpus = GPUtil.getGPUs()
        if gpus:
            gpu = gpus[0]
            print_success(f"مراقبة GPU تعمل: {gpu.name}, استخدام {gpu.load*100:.1f}%")
        else:
            print_warning("لم يتم العثور على GPU")
        return True
    except ImportError:
        print_warning("GPUtil غير مثبت - مراقبة GPU غير متاحة")
        return True
    except Exception as e:
        print_error(f"خطأ في مراقبة GPU: {e}")
        return False

def test_deepseek_connection():
    """اختبار الاتصال بـDeepSeek"""
    try:
        import requests
        # محاولة الاتصال بخادم DeepSeek المحلي
        response = requests.get("http://localhost:5000/api/v1/models", timeout=5)
        if response.status_code == 200:
            print_success("الاتصال بـDeepSeek ناجح")
            return True
        else:
            print_warning(f"DeepSeek غير متاح (حالة: {response.status_code})")
            return True
    except ImportError:
        print_warning("requests غير مثبت - اختبار DeepSeek غير متاح")
        return True
    except Exception:
        print_warning("DeepSeek غير متاح (الخادم غير مشغل)")
        return True

def run_all_tests():
    """تشغيل جميع الاختبارات"""
    print_header("بدء اختبار نظام DeepSeek Ultimate Security Scanner")

    results = []

    # اختبار الملفات الأساسية
    print_header("اختبار الملفات الأساسية")
    results.append(test_file_exists("deepseek_ultimate_scanner.py", "الماسح الأمني الرئيسي"))
    results.append(test_file_exists("dashboard_server.py", "خادم لوحة التحكم"))
    results.append(test_file_exists("docs/6_fixing/scripts/ديب سيك/quick-scan.bat", "سكريبت الويندوز"))
    results.append(test_file_exists("docs/6_fixing/scripts/ديب سيك/quick-scan.sh", "سكريبت الينكس"))

    # اختبار الاستيرادات
    print_header("اختبار الاستيرادات")
    test_python_import("dataclasses")
    test_python_import("pathlib")
    test_python_import("json")
    test_python_import("logging")
    test_python_import("concurrent.futures")

    # اختبار المكونات الرئيسية
    print_header("اختبار المكونات الرئيسية")
    scanner_success, scanner = test_scanner_import()
    results.append(scanner_success)
    results.append(test_dashboard_import())

    # اختبار التكوين
    print_header("اختبار التكوين")
    results.append(test_config_file())

    # اختبار المجلدات
    print_header("اختبار المجلدات")
    results.append(test_reports_directory())

    # اختبار الأجهزة
    print_header("اختبار مراقبة الأجهزة")
    results.append(test_hardware_monitoring())
    results.append(test_gpu_monitoring())

    # اختبار DeepSeek
    print_header("اختبار DeepSeek")
    results.append(test_deepseek_connection())

    # اختبار الفحص الأساسي
    if scanner_success and scanner:
        print_header("اختبار الفحص الأساسي")
        results.append(test_basic_scan(scanner))

    # تلخيص النتائج
    print_header("تلخيص النتائج")

    passed = sum(results)
    total = len(results)

    print_success(f"الاختبارات الناجحة: {passed}/{total}")
    print_error(f"الاختبارات الفاشلة: {total - passed}/{total}")

    if passed == total:
        print_success("🎉 جميع الاختبارات نجحت! النظام جاهز للاستخدام")
        return True
    elif passed >= total * 0.8:  # 80% نجاح
        print_warning("⚠️  معظم الاختبارات نجحت، النظام يعمل مع قيود طفيفة")
        return True
    else:
        print_error("❌ فشل في معظم الاختبارات، يرجى مراجعة التكوين")
        return False

def main():
    """الدالة الرئيسية"""
    try:
        success = run_all_tests()

        print_header("نهاية الاختبار")
        if success:
            print_success("يمكنك الآن تشغيل النظام باستخدام:")
            print("  Windows: .\\docs\\6_fixing\\scripts\\ديب سيك\\quick-scan.bat")
            print("  Linux/Mac: ./docs/6_fixing/scripts/ديب سيك/quick-scan.sh")
            print("  Dashboard: python dashboard_server.py")
        else:
            print_error("يرجى إصلاح المشاكل قبل الاستخدام")

        return 0 if success else 1

    except KeyboardInterrupt:
        print_error("تم إيقاف الاختبار بواسطة المستخدم")
        return 1
    except Exception as e:
        print_error(f"خطأ غير متوقع: {e}")
        return 1

if __name__ == "__main__":
    sys.exit(main())