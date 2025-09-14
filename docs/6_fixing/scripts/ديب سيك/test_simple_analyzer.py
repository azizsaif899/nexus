#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 اختبار بسيط للمحلل - بدون DeepSeek
"""

import os
import re
import json
import time
from datetime import datetime
from pathlib import Path
import logging

class SimpleTestAnalyzer:
    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.reports_dir = "reports"
        self.logs_dir = "logs"
        
        os.makedirs(self.reports_dir, exist_ok=True)
        os.makedirs(self.logs_dir, exist_ok=True)
        
        self.setup_logging()
        
        # قواعد فحص بسيطة
        self.security_patterns = [
            (r'eval\s*\(', 'CRITICAL', 'Code Injection', 'استخدام eval خطير'),
            (r'exec\s*\(', 'CRITICAL', 'Code Execution', 'استخدام exec خطير'),
            (r'password\s*=\s*["\'][^"\']*["\']', 'HIGH', 'Hardcoded Password', 'كلمة مرور في الكود'),
            (r'console\.log\s*\(', 'LOW', 'Debug Code', 'console.log في الإنتاج'),
        ]
        
        self.supported_extensions = {'.py', '.js', '.html', '.css'}
        self.ignore_dirs = {'node_modules', '.git', '__pycache__'}

    def setup_logging(self):
        """إعداد السجلات"""
        log_file = os.path.join(self.logs_dir, f"test_scan_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(message)s',
            handlers=[logging.FileHandler(log_file, encoding='utf-8'), logging.StreamHandler()]
        )
        self.logger = logging.getLogger(__name__)

    def scan_file(self, file_path: str):
        """فحص ملف واحد"""
        issues = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
                
                for line_num, line in enumerate(lines, 1):
                    for pattern, severity, issue_type, description in self.security_patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            issues.append({
                                'file': file_path,
                                'line': line_num,
                                'severity': severity,
                                'type': issue_type,
                                'description': description,
                                'code': line.strip()[:100]  # أول 100 حرف فقط
                            })
        except Exception as e:
            self.logger.error(f"خطأ في {file_path}: {e}")
        
        return issues

    def scan_directory(self, directory: str = None):
        """فحص مجلد"""
        if directory is None:
            directory = self.project_root
            
        print(f"يفحص: {directory}")
        
        all_issues = []
        scanned_files = 0
        
        for root, dirs, files in os.walk(directory):
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs]
            
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()
                
                if file_ext in self.supported_extensions:
                    issues = self.scan_file(file_path)
                    all_issues.extend(issues)
                    scanned_files += 1
                    
                    if scanned_files % 5 == 0:
                        print(f"تم فحص {scanned_files} ملف...")
        
        return {
            'scanned_files': scanned_files,
            'total_issues': len(all_issues),
            'issues': all_issues
        }

    def run_scan(self):
        """تشغيل الفحص"""
        print("بدء الفحص البسيط...")
        report = self.scan_directory()
        
        # حفظ النتائج
        timestamp = int(time.time())
        report_file = os.path.join(self.reports_dir, f"simple_report_{timestamp}.json")
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        print(f"تم الفحص! الملفات: {report['scanned_files']}, المشاكل: {report['total_issues']}")
        print(f"التقرير: {report_file}")
        
        return report_file

# تشغيل مباشر
if __name__ == "__main__":
    analyzer = SimpleTestAnalyzer()
    analyzer.run_scan()