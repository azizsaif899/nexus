#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🧪 اختبار سريع لواجهة الداشبورد التفاعلية
"""

import urllib.request
import urllib.error
import json
import time

def test_dashboard_api():
    """اختبار API الخادم التفاعلي"""
    base_url = "http://localhost:8080"

    print("🔍 اختبار الخادم التفاعلي...")
    print("=" * 50)

    # اختبار الصفحة الرئيسية
    try:
        response = urllib.request.urlopen(base_url, timeout=5)
        if response.getcode() == 200:
            print("✅ الصفحة الرئيسية تعمل")
        else:
            print(f"❌ مشكلة في الصفحة الرئيسية: {response.getcode()}")
    except Exception as e:
        print(f"❌ فشل الاتصال بالصفحة الرئيسية: {e}")
        return False

    # اختبار API الحالة
    try:
        response = urllib.request.urlopen(f"{base_url}/api/status", timeout=5)
        if response.getcode() == 200:
            data = response.read().decode('utf-8')
            status = json.loads(data)
            print("✅ API الحالة يعمل")
            print(f"   📊 الحالة: {status.get('status', 'غير معروف')}")
            print(f"   🕐 الوقت: {status.get('time', 'غير معروف')}")
        else:
            print(f"❌ مشكلة في API الحالة: {response.getcode()}")
    except Exception as e:
        print(f"❌ فشل الاتصال بـAPI الحالة: {e}")

    # اختبار تشغيل سكريبت
    print("\\n🚀 اختبار تشغيل سكريبت...")
    try:
        data = json.dumps({'script': 'test-system'}).encode('utf-8')
        req = urllib.request.Request(f"{base_url}/api/run-script",
                                   data=data,
                                   headers={'Content-Type': 'application/json'},
                                   method='POST')

        response = urllib.request.urlopen(req, timeout=60)

        if response.getcode() == 200:
            result_data = response.read().decode('utf-8')
            result = json.loads(result_data)
            if result.get('success'):
                print("✅ تم تشغيل السكريبت بنجاح")
                print("📋 أول 200 حرف من الإخراج:")
                output = result.get('output', '')[:200]
                print(f"   {output}...")
            else:
                print(f"❌ فشل تشغيل السكريبت: {result.get('error', 'خطأ غير معروف')}")
        else:
            print(f"❌ مشكلة في API تشغيل السكريبت: {response.getcode()}")

    except Exception as e:
        print(f"❌ فشل تشغيل السكريبت: {e}")

    print("\\n" + "=" * 50)
    print("🎉 انتهى الاختبار!")
    return True

if __name__ == "__main__":
    try:
        test_dashboard_api()
    except KeyboardInterrupt:
        print("\\n🛑 تم إيقاف الاختبار")
    except Exception as e:
        print(f"❌ خطأ غير متوقع: {e}")