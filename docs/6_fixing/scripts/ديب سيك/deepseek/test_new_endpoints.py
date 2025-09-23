#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
اختبار API endpoints الجديدة للداشبورد التفاعلي
"""

import urllib.request
import json
import time

def test_api_endpoint(url, method='GET', data=None):
    """اختبار endpoint محدد"""
    try:
        if method == 'POST' and data:
            data = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
        else:
            req = urllib.request.Request(url)

        with urllib.request.urlopen(req) as response:
            result = json.loads(response.read().decode('utf-8'))
            print(f"✅ {url}: نجح")
            return result
    except Exception as e:
        print(f"❌ {url}: فشل - {e}")
        return None

def main():
    base_url = "http://localhost:8080"

    print("🔍 اختبار API endpoints الجديدة...")
    print("=" * 50)

    # اختبار endpoint الحالة
    print("\n📊 اختبار /api/status:")
    status = test_api_endpoint(f"{base_url}/api/status")
    if status:
        print(f"   حالة: {status.get('status')}")
        print(f"   الوقت: {status.get('time')}")
        print(f"   المنفذ: {status.get('port')}")

    # اختبار endpoint الإخراج
    print("\n📋 اختبار /api/output:")
    output = test_api_endpoint(f"{base_url}/api/output")
    if output:
        print(f"   الإخراج: {output.get('output', '')[:100]}...")

    # اختبار فحص سكريبت
    print("\n🔍 اختبار /api/check-script:")
    check = test_api_endpoint(f"{base_url}/api/check-script?script=test-system")
    if check:
        print(f"   يعمل: {check.get('running')}")

    # اختبار مراقبة التقارير
    print("\n📊 اختبار /api/monitoring (reports):")
    reports = test_api_endpoint(f"{base_url}/api/monitoring?type=reports")
    if reports and reports.get('items'):
        print(f"   عدد التقارير: {len(reports['items'])}")
        for item in reports['items'][:2]:  # أول تقريرين
            print(f"   - {item.get('time')}: {item.get('content', '')[:50]}...")

    # اختبار مراقبة الأخطاء
    print("\n❌ اختبار /api/monitoring (errors):")
    errors = test_api_endpoint(f"{base_url}/api/monitoring?type=errors")
    if errors and errors.get('items'):
        print(f"   عدد الأخطاء: {len(errors['items'])}")

    # اختبار مراقبة السجلات
    print("\n📝 اختبار /api/monitoring (logs):")
    logs = test_api_endpoint(f"{base_url}/api/monitoring?type=logs")
    if logs and logs.get('items'):
        print(f"   عدد السجلات: {len(logs['items'])}")

    print("\n✅ انتهى الاختبار!")

if __name__ == "__main__":
    main()