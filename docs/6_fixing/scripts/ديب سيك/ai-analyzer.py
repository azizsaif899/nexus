#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
🔍 DeepSeek AI Code Analyzer v4.0
نظام فحص الكود المتقدم مع الذكاء الاصطناعي + تكامل DeepSeek المحلي
"""

import os
import re
import json
import time
import hashlib
import subprocess
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import logging

try:
    import requests
except ImportError:
    print("تحذير: مكتبة requests غير متوفرة. سيتم تعطيل ميزات DeepSeek المحلي.")
    requests = None

class LocalDeepSeekIntegration:
    def __init__(self, deepseek_path: str = None):
        self.deepseek_path = deepseek_path or os.path.expanduser("~/deepseek/deepseek-coder")
        self.api_url = "http://localhost:5000/api/v1/analyze"
        
    def is_server_running(self):
        if requests is None:
            return False
        try:
            response = requests.get("http://localhost:5000/health", timeout=2)
            return response.status_code == 200
        except:
            return False
    
    def analyze_code(self, code: str, language: str = "python") -> Dict[str, Any]:
        if requests is None:
            return None
        try:
            payload = {"code": code, "language": language, "analysis_type": "security_and_quality"}
            response = requests.post(self.api_url, json=payload, timeout=30)
            return response.json() if response.status_code == 200 else None
        except Exception as e:
            print(f"خطأ في التحليل المحلي: {e}")
            return None
    
    def get_code_suggestions(self, code: str, issue_type: str) -> str:
        if requests is None:
            return ""
        prompt = f"قم بإصلاح مشكلة {issue_type} في الكود التالي:\n{code}\n\nقدم الكود المصحح مع شرح موجز بالعربية."
        payload = {"prompt": prompt, "max_tokens": 500, "temperature": 0.1}
        try:
            response = requests.post("http://localhost:5000/api/v1/generate", json=payload, timeout=30)
            return response.json().get("response", "") if response.status_code == 200 else ""
        except Exception as e:
            print(f"خطأ في الحصول على الاقتراحات: {e}")
            return ""

class DeepSeekAnalyzer:
    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.reports_dir = os.path.join(os.path.dirname(__file__), "reports")
        self.logs_dir = os.path.join(os.path.dirname(__file__), "logs")
        self.deepseek_integration = LocalDeepSeekIntegration()
        self.setup_directories()
        self.setup_logging()
        
        # قواعد الفحص الأمني المتقدمة
        self.security_patterns = [
            # مخاطر حرجة
            (r'eval\s*\(', 'CRITICAL', 'Code Injection', 'استخدام eval خطير أمنياً'),
            (r'exec\s*\(', 'CRITICAL', 'Code Execution', 'استخدام exec خطير أمنياً'),
            (r'password\s*=\s*["\'][^"\']*["\']', 'CRITICAL', 'Hardcoded Password', 'كلمة مرور مكشوفة في الكود'),
            (r'api_key\s*=\s*["\'][^"\']*["\']', 'CRITICAL', 'Exposed API Key', 'مفتاح API مكشوف'),
            (r'secret\s*=\s*["\'][^"\']*["\']', 'CRITICAL', 'Hardcoded Secret', 'سر مكشوف في الكود'),
            
            # مخاطر عالية
            (r'innerHTML\s*=.*\+', 'HIGH', 'XSS', 'innerHTML مع تسلسل نصوص قد يؤدي لـ XSS'),
            (r'document\.write\s*\(', 'HIGH', 'XSS', 'استخدام document.write خطير'),
            (r'dangerouslySetInnerHTML', 'HIGH', 'XSS', 'استخدام dangerouslySetInnerHTML في React'),
            (r'os\.system\s*\(', 'HIGH', 'Command Injection', 'استخدام os.system خطير'),
            (r'subprocess\.call\s*\(.*shell=True', 'HIGH', 'Command Injection', 'subprocess مع shell=True'),
            
            # مخاطر متوسطة
            (r'TODO|FIXME|HACK', 'MEDIUM', 'Code Quality', 'تعليقات تحتاج مراجعة'),
            (r'console\.error\s*\(', 'MEDIUM', 'Error Handling', 'معالجة أخطاء غير مناسبة'),
            (r'catch\s*\(\s*\)\s*\{', 'MEDIUM', 'Empty Catch', 'catch فارغ قد يخفي أخطاء'),
            
            # مخاطر منخفضة
            (r'console\.log\s*\(', 'LOW', 'Debug Code', 'console.log في كود الإنتاج'),
            (r'debugger\s*;', 'LOW', 'Debug Code', 'debugger في كود الإنتاج'),
            (r'alert\s*\(', 'LOW', 'User Experience', 'استخدام alert قد يضر بتجربة المستخدم'),
        ]
        
        # أنواع الملفات المدعومة
        self.supported_extensions = {
            '.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.php', '.rb', '.go',
            '.cs', '.cpp', '.c', '.h', '.sql', '.html', '.css', '.scss', '.vue',
            '.json', '.xml', '.yaml', '.yml', '.md', '.sh', '.bat', '.ps1'
        }
        
        # مجلدات يجب تجاهلها
        self.ignore_dirs = {
            'node_modules', '.git', '.nx', 'dist', 'build', '__pycache__',
            '.vscode', '.idea', 'coverage', '.nyc_output', 'logs', 'tmp'
        }

    def setup_directories(self):
        """إنشاء المجلدات المطلوبة"""
        os.makedirs(self.reports_dir, exist_ok=True)
        os.makedirs(self.logs_dir, exist_ok=True)

    def setup_logging(self):
        """إعداد نظام السجلات"""
        log_file = os.path.join(self.logs_dir, f"deepseek_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def scan_file(self, file_path: str) -> List[Dict[str, Any]]:
        """فحص ملف واحد مع تكامل DeepSeek المحلي"""
        issues = []
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
                lines = content.split('\n')
                
                # الفحص التقليدي
                for line_num, line in enumerate(lines, 1):
                    for pattern, severity, issue_type, description in self.security_patterns:
                        if re.search(pattern, line, re.IGNORECASE):
                            issue = {
                                'file': file_path,
                                'line': line_num,
                                'severity': severity,
                                'type': issue_type,
                                'description': description,
                                'code': line.strip(),
                                'pattern': pattern
                            }
                            
                            # إضافة اقتراحات DeepSeek إذا كان متاحاً
                            if self.deepseek_integration.is_server_running():
                                suggestion = self.deepseek_integration.get_code_suggestions(line.strip(), issue_type)
                                if suggestion:
                                    issue['ai_suggestion'] = suggestion
                            
                            issues.append(issue)
                
                # تحليل DeepSeek المتقدم للملف كاملاً
                if self.deepseek_integration.is_server_running() and len(content) < 10000:  # تجنب الملفات الكبيرة
                    file_ext = Path(file_path).suffix.lower()
                    language_map = {'.py': 'python', '.js': 'javascript', '.ts': 'typescript', '.java': 'java'}
                    language = language_map.get(file_ext, 'text')
                    
                    ai_analysis = self.deepseek_integration.analyze_code(content, language)
                    if ai_analysis and 'issues' in ai_analysis:
                        for ai_issue in ai_analysis['issues']:
                            issues.append({
                                'file': file_path,
                                'line': ai_issue.get('line', 0),
                                'severity': ai_issue.get('severity', 'MEDIUM'),
                                'type': 'AI Analysis',
                                'description': ai_issue.get('description', 'مشكلة محتملة حددها الذكاء الاصطناعي'),
                                'code': ai_issue.get('code', ''),
                                'ai_suggestion': ai_issue.get('suggestion', '')
                            })
                            
        except Exception as e:
            self.logger.error(f"خطأ في فحص الملف {file_path}: {str(e)}")
        
        return issues

    def scan_directory(self, directory: str = None) -> Dict[str, Any]:
        """فحص مجلد كامل"""
        if directory is None:
            directory = self.project_root
            
        self.logger.info(f"بدء فحص المجلد: {directory}")
        
        all_issues = []
        scanned_files = 0
        start_time = time.time()
        
        for root, dirs, files in os.walk(directory):
            # تجاهل المجلدات غير المرغوبة
            dirs[:] = [d for d in dirs if d not in self.ignore_dirs]
            
            for file in files:
                file_path = os.path.join(root, file)
                file_ext = Path(file).suffix.lower()
                
                if file_ext in self.supported_extensions:
                    issues = self.scan_file(file_path)
                    all_issues.extend(issues)
                    scanned_files += 1
                    
                    if scanned_files % 50 == 0:
                        self.logger.info(f"تم فحص {scanned_files} ملف...")
        
        scan_time = time.time() - start_time
        
        # تجميع الإحصائيات
        severity_counts = {'CRITICAL': 0, 'HIGH': 0, 'MEDIUM': 0, 'LOW': 0}
        for issue in all_issues:
            severity_counts[issue['severity']] += 1
        
        # إنشاء التقرير
        report = {
            'scan_info': {
                'timestamp': datetime.now().isoformat(),
                'directory': directory,
                'scanned_files': scanned_files,
                'scan_duration': round(scan_time, 2),
                'analyzer_version': '4.0',
                'deepseek_integration': self.deepseek_integration.is_server_running()
            },
            'summary': {
                'total_issues': len(all_issues),
                'critical_issues': severity_counts['CRITICAL'],
                'high_issues': severity_counts['HIGH'],
                'medium_issues': severity_counts['MEDIUM'],
                'low_issues': severity_counts['LOW']
            },
            'issues': all_issues,
            'compliance': {
                'score': self.calculate_compliance_score(severity_counts, scanned_files),
                'standards': ['OWASP', 'CWE', 'SANS']
            }
        }
        
        self.logger.info(f"اكتمل الفحص: {len(all_issues)} مشكلة في {scanned_files} ملف")
        return report

    def calculate_compliance_score(self, severity_counts: Dict[str, int], total_files: int) -> int:
        """حساب نقاط الامتثال الأمني"""
        if total_files == 0:
            return 100
            
        # نظام نقاط: كل مشكلة حرجة = -10، عالية = -5، متوسطة = -2، منخفضة = -1
        penalty = (
            severity_counts['CRITICAL'] * 10 +
            severity_counts['HIGH'] * 5 +
            severity_counts['MEDIUM'] * 2 +
            severity_counts['LOW'] * 1
        )
        
        # حساب النقاط من 100
        score = max(0, 100 - (penalty * 100 // (total_files * 5)))
        return min(100, score)

    def save_report(self, report: Dict[str, Any]) -> str:
        """حفظ التقرير"""
        timestamp = int(time.time() * 1000)
        report_file = os.path.join(self.reports_dir, f"scan_report_{timestamp}.json")
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f"تم حفظ التقرير: {report_file}")
        return report_file

    def generate_summary_report(self, report: Dict[str, Any]) -> str:
        """إنشاء تقرير ملخص"""
        ai_status = "✅ متصل" if self.deepseek_integration.is_server_running() else "❌ غير متصل"
        summary = f"""
تقرير فحص الأمان - DeepSeek AI Analyzer v4.0
{'='*60}

حالة DeepSeek المحلي: {ai_status}

معلومات الفحص:
- التاريخ: {report['scan_info']['timestamp']}
- المجلد: {report['scan_info']['directory']}
- الملفات المفحوصة: {report['scan_info']['scanned_files']}
- مدة الفحص: {report['scan_info']['scan_duration']} ثانية

ملخص النتائج:
- إجمالي المشاكل: {report['summary']['total_issues']}
- مشاكل حرجة: {report['summary']['critical_issues']}
- مشاكل عالية: {report['summary']['high_issues']}
- مشاكل متوسطة: {report['summary']['medium_issues']}
- مشاكل منخفضة: {report['summary']['low_issues']}

نقاط الامتثال الأمني: {report['compliance']['score']}/100

{'='*60}
"""
        
        if report['summary']['critical_issues'] > 0:
            summary += "\nتحذير: توجد مشاكل أمنية حرجة تحتاج إصلاح فوري!\n"
        elif report['summary']['high_issues'] > 0:
            summary += "\nتنبيه: توجد مشاكل أمنية عالية الخطورة.\n"
        else:
            summary += "\nالكود يبدو آمناً نسبياً.\n"
        
        return summary

    def run_full_scan(self, directory: str = None) -> str:
        """تشغيل فحص كامل"""
        print("بدء فحص DeepSeek AI...")
        
        report = self.scan_directory(directory)
        report_file = self.save_report(report)
        
        # طباعة الملخص
        summary = self.generate_summary_report(report)
        print(summary)
        
        return report_file

def main():
    """الدالة الرئيسية"""
    import argparse
    
    parser = argparse.ArgumentParser(description='DeepSeek AI Code Analyzer')
    parser.add_argument('--dir', '-d', help='مجلد المشروع للفحص')
    parser.add_argument('--config', '-c', help='ملف الإعدادات')
    
    args = parser.parse_args()
    
    # تحديد مجلد المشروع
    project_dir = args.dir or os.path.join(os.path.dirname(__file__), '..', '..', '..', '..')
    project_dir = os.path.abspath(project_dir)
    
    analyzer = DeepSeekAnalyzer(project_dir)
    report_file = analyzer.run_full_scan()
    
    print(f"\nالتقرير الكامل محفوظ في: {report_file}")
    print("افتح dashboard.html لعرض التقرير التفاعلي")

if __name__ == "__main__":
    main()