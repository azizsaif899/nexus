#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 DeepSeek Simple Scanner v3.0
فحص سريع وبسيط للكود
"""

import os
import re
import json
import time
from datetime import datetime
from pathlib import Path

class SimpleScanner:
    def __init__(self):
        self.reports_dir = os.path.join(os.path.dirname(__file__), "reports")
        os.makedirs(self.reports_dir, exist_ok=True)
        
        # قواعد فحص بسيطة
        self.simple_patterns = {
            'console.log': 'Debug code in production',
            'eval(': 'Dangerous eval usage',
            'innerHTML': 'Potential XSS vulnerability',
            'password': 'Hardcoded password',
            'api_key': 'Exposed API key',
            'TODO': 'Unfinished code',
            'FIXME': 'Code needs fixing',
            'debugger': 'Debug statement'
        }
        
        self.file_extensions = ['.js', '.jsx', '.ts', '.tsx', '.py', '.php', '.java']

    def scan_file(self, file_path):
        """فحص ملف واحد"""
        issues = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = f.readlines()
                
                for line_num, line in enumerate(lines, 1):
                    for pattern, description in self.simple_patterns.items():
                        if pattern.lower() in line.lower():
                            issues.append({
                                'file': file_path,
                                'line': line_num,
                                'pattern': pattern,
                                'description': description,
                                'code': line.strip()
                            })
        except Exception as e:
            print(f"خطأ في فحص {file_path}: {e}")
        
        return issues

    def scan_directory(self, directory):
        """فحص مجلد"""
        print(f"فحص المجلد: {directory}")
        
        all_issues = []
        file_count = 0
        
        for root, dirs, files in os.walk(directory):
            # تجاهل مجلدات معينة
            dirs[:] = [d for d in dirs if d not in ['node_modules', '.git', '.nx', 'dist']]
            
            for file in files:
                if any(file.endswith(ext) for ext in self.file_extensions):
                    file_path = os.path.join(root, file)
                    issues = self.scan_file(file_path)
                    all_issues.extend(issues)
                    file_count += 1
        
        # إنشاء التقرير
        report = {
            'timestamp': datetime.now().isoformat(),
            'directory': directory,
            'files_scanned': file_count,
            'total_issues': len(all_issues),
            'issues': all_issues
        }
        
        return report

    def save_report(self, report):
        """حفظ التقرير"""
        timestamp = int(time.time() * 1000)
        filename = f"simple_scan_{timestamp}.json"
        filepath = os.path.join(self.reports_dir, filename)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"تم حفظ التقرير: {filepath}")
        return filepath

    def print_summary(self, report):
        """طباعة ملخص"""
        print(f"""
ملخص الفحص السريع:
- الملفات المفحوصة: {report['files_scanned']}
- إجمالي المشاكل: {report['total_issues']}

أهم المشاكل:""")
        
        # تجميع المشاكل حسب النوع
        pattern_counts = {}
        for issue in report['issues']:
            pattern = issue['pattern']
            pattern_counts[pattern] = pattern_counts.get(pattern, 0) + 1
        
        for pattern, count in sorted(pattern_counts.items(), key=lambda x: x[1], reverse=True):
            print(f"- {pattern}: {count} مرة")

def main():
    scanner = SimpleScanner()
    
    # تحديد مجلد المشروع
    project_dir = os.path.join(os.path.dirname(__file__), '..', '..', '..', '..')
    project_dir = os.path.abspath(project_dir)
    
    print("بدء الفحص السريع...")
    
    report = scanner.scan_directory(project_dir)
    scanner.save_report(report)
    scanner.print_summary(report)
    
    print("\nاكتمل الفحص السريع!")

if __name__ == "__main__":
    main()