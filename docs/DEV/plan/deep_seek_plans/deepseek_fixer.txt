#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DeepSeek AI Code Fixer v3.0
نظام إصلاح الكود الذكي مع الذكاء الاصطناعي
"""

import os
import re
import json
import time
import shutil
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any, Tuple
import logging

class DeepSeekFixer:
    def __init__(self, project_root: str = None):
        self.project_root = project_root or os.getcwd()
        self.reports_dir = os.path.join(os.path.dirname(__file__), "reports")
        self.fix_reports_dir = os.path.join(os.path.dirname(__file__), "fix_reports")
        self.backups_dir = os.path.join(os.path.dirname(__file__), "backups")
        self.plans_dir = os.path.join(os.path.dirname(__file__), "plans")
        self.logs_dir = os.path.join(os.path.dirname(__file__), "logs")
        
        self.setup_directories()
        self.setup_logging()
        
        # قواعد الإصلاح التلقائي
        self.auto_fixes = {
            'console.log': {
                'pattern': r'console\.log\s*\([^)]*\)\s*;?',
                'replacement': '// Removed console.log',
                'description': 'إزالة console.log من كود الإنتاج'
            },
            'debugger': {
                'pattern': r'debugger\s*;',
                'replacement': '// Removed debugger',
                'description': 'إزالة debugger من كود الإنتاج'
            },
            'alert': {
                'pattern': r'alert\s*\([^)]*\)\s*;?',
                'replacement': '// TODO: Replace alert with proper notification',
                'description': 'استبدال alert بنظام إشعارات مناسب'
            }
        }

    def setup_directories(self):
        """إنشاء المجلدات المطلوبة"""
        for directory in [self.reports_dir, self.fix_reports_dir, self.backups_dir, self.plans_dir, self.logs_dir]:
            os.makedirs(directory, exist_ok=True)

    def setup_logging(self):
        """إعداد نظام السجلات"""
        log_file = os.path.join(self.logs_dir, f"deepseek_fixer_{datetime.now().strftime('%Y%m%d_%H%M%S')}.log")
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler(log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def load_scan_report(self, report_file: str = None) -> Dict[str, Any]:
        """تحميل تقرير الفحص"""
        if report_file is None:
            report_files = [f for f in os.listdir(self.reports_dir) if f.startswith('scan_report_')]
            if not report_files:
                raise FileNotFoundError("لم يتم العثور على تقارير فحص")
            report_file = os.path.join(self.reports_dir, sorted(report_files)[-1])
        
        with open(report_file, 'r', encoding='utf-8') as f:
            return json.load(f)

    def create_backup(self, file_path: str) -> str:
        """إنشاء نسخة احتياطية من الملف"""
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_name = f"{os.path.basename(file_path)}.backup.{timestamp}"
        backup_path = os.path.join(self.backups_dir, backup_name)
        
        shutil.copy2(file_path, backup_path)
        self.logger.info(f"تم إنشاء نسخة احتياطية: {backup_path}")
        return backup_path

    def apply_auto_fix(self, file_path: str, issue: Dict[str, Any]) -> bool:
        """تطبيق إصلاح تلقائي"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            original_content = content
            fixed = False
            
            for fix_name, fix_config in self.auto_fixes.items():
                if re.search(fix_config['pattern'], content, re.IGNORECASE | re.MULTILINE):
                    content = re.sub(fix_config['pattern'], fix_config['replacement'], content, flags=re.IGNORECASE | re.MULTILINE)
                    fixed = True
                    self.logger.info(f"تم تطبيق إصلاح {fix_name} في {file_path}")
            
            if fixed and content != original_content:
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)
                return True
            
        except Exception as e:
            self.logger.error(f"خطأ في إصلاح الملف {file_path}: {str(e)}")
        
        return False

    def generate_fix_plan(self, report: Dict[str, Any]) -> Dict[str, Any]:
        """إنشاء خطة إصلاح مفصلة"""
        issues = report.get('issues', [])
        
        files_issues = {}
        for issue in issues:
            file_path = issue['file']
            if file_path not in files_issues:
                files_issues[file_path] = []
            files_issues[file_path].append(issue)
        
        fix_plan = {
            'plan_info': {
                'timestamp': datetime.now().isoformat(),
                'source_report': report['scan_info']['timestamp'],
                'total_files': len(files_issues),
                'total_issues': len(issues)
            },
            'priority_order': [],
            'files': {}
        }
        
        for file_path, file_issues in files_issues.items():
            critical_count = sum(1 for issue in file_issues if issue['severity'] == 'CRITICAL')
            high_count = sum(1 for issue in file_issues if issue['severity'] == 'HIGH')
            
            priority_score = critical_count * 10 + high_count * 5
            
            fix_plan['files'][file_path] = {
                'issues': file_issues,
                'priority_score': priority_score,
                'auto_fixable': self.count_auto_fixable_issues(file_issues),
                'manual_review_needed': self.count_manual_issues(file_issues)
            }
            
            fix_plan['priority_order'].append({
                'file': file_path,
                'priority_score': priority_score,
                'issues_count': len(file_issues)
            })
        
        fix_plan['priority_order'].sort(key=lambda x: x['priority_score'], reverse=True)
        return fix_plan

    def count_auto_fixable_issues(self, issues: List[Dict[str, Any]]) -> int:
        """عد المشاكل القابلة للإصلاح التلقائي"""
        auto_fixable_types = ['Debug Code', 'Code Quality']
        return sum(1 for issue in issues if issue.get('type') in auto_fixable_types)

    def count_manual_issues(self, issues: List[Dict[str, Any]]) -> int:
        """عد المشاكل التي تحتاج مراجعة يدوية"""
        manual_types = ['Code Injection', 'XSS', 'Hardcoded Password', 'Exposed API Key']
        return sum(1 for issue in issues if issue.get('type') in manual_types)

    def save_fix_plan(self, fix_plan: Dict[str, Any]) -> str:
        """حفظ خطة الإصلاح"""
        timestamp = int(time.time() * 1000)
        plan_file = os.path.join(self.plans_dir, f"fix_plan_{timestamp}.json")
        
        with open(plan_file, 'w', encoding='utf-8') as f:
            json.dump(fix_plan, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f"تم حفظ خطة الإصلاح: {plan_file}")
        return plan_file

    def execute_fixes(self, fix_plan: Dict[str, Any]) -> Dict[str, Any]:
        """تنفيذ الإصلاحات"""
        self.logger.info("بدء تنفيذ الإصلاحات...")
        
        results = {
            'execution_info': {
                'timestamp': datetime.now().isoformat(),
                'plan_source': fix_plan['plan_info']['timestamp']
            },
            'summary': {
                'files_processed': 0,
                'files_fixed': 0,
                'issues_fixed': 0,
                'backups_created': 0
            },
            'details': []
        }
        
        for file_info in fix_plan['priority_order']:
            file_path = file_info['file']
            file_data = fix_plan['files'][file_path]
            
            if not os.path.exists(file_path):
                self.logger.warning(f"الملف غير موجود: {file_path}")
                continue
            
            results['summary']['files_processed'] += 1
            
            backup_path = self.create_backup(file_path)
            results['summary']['backups_created'] += 1
            
            fixed_issues = 0
            for issue in file_data['issues']:
                if issue.get('type') in ['Debug Code', 'Code Quality']:
                    if self.apply_auto_fix(file_path, issue):
                        fixed_issues += 1
            
            if fixed_issues > 0:
                results['summary']['files_fixed'] += 1
                results['summary']['issues_fixed'] += fixed_issues
            
            results['details'].append({
                'file': file_path,
                'backup': backup_path,
                'issues_fixed': fixed_issues,
                'manual_review_needed': file_data['manual_review_needed']
            })
        
        return results

    def save_fix_report(self, results: Dict[str, Any]) -> str:
        """حفظ تقرير الإصلاح"""
        timestamp = int(time.time() * 1000)
        report_file = os.path.join(self.fix_reports_dir, f"fix_report_{timestamp}.json")
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        
        self.logger.info(f"تم حفظ تقرير الإصلاح: {report_file}")
        return report_file

    def generate_fix_summary(self, results: Dict[str, Any]) -> str:
        """إنشاء ملخص الإصلاح"""
        summary = f"""
تقرير إصلاح الكود - DeepSeek AI Fixer v3.0
{'='*60}

معلومات التنفيذ:
- التاريخ: {results['execution_info']['timestamp']}
- الملفات المعالجة: {results['summary']['files_processed']}
- الملفات المُصلحة: {results['summary']['files_fixed']}
- المشاكل المُصلحة: {results['summary']['issues_fixed']}
- النسخ الاحتياطية: {results['summary']['backups_created']}

النتائج:
"""
        
        for detail in results['details']:
            if detail['issues_fixed'] > 0:
                summary += f"{detail['file']}: {detail['issues_fixed']} مشكلة مُصلحة\n"
            if detail['manual_review_needed'] > 0:
                summary += f"{detail['file']}: {detail['manual_review_needed']} مشكلة تحتاج مراجعة يدوية\n"
        
        summary += f"\n{'='*60}\n"
        
        if results['summary']['issues_fixed'] > 0:
            summary += f"تم إصلاح {results['summary']['issues_fixed']} مشكلة تلقائياً!\n"
        
        return summary

    def run_full_fix(self, report_file: str = None) -> str:
        """تشغيل عملية إصلاح كاملة"""
        print("بدء عملية الإصلاح الذكي...")
        
        report = self.load_scan_report(report_file)
        fix_plan = self.generate_fix_plan(report)
        plan_file = self.save_fix_plan(fix_plan)
        
        print(f"تم إنشاء خطة الإصلاح: {plan_file}")
        
        results = self.execute_fixes(fix_plan)
        report_file = self.save_fix_report(results)
        
        summary = self.generate_fix_summary(results)
        print(summary)
        
        return report_file

def main():
    """الدالة الرئيسية"""
    import argparse
    
    parser = argparse.ArgumentParser(description='DeepSeek AI Code Fixer')
    parser.add_argument('--report', '-r', help='ملف تقرير الفحص')
    parser.add_argument('--dir', '-d', help='مجلد المشروع')
    
    args = parser.parse_args()
    
    project_dir = args.dir or os.path.join(os.path.dirname(__file__), '..', '..', '..', '..')
    project_dir = os.path.abspath(project_dir)
    
    fixer = DeepSeekFixer(project_dir)
    report_file = fixer.run_full_fix(args.report)
    
    print(f"\nتقرير الإصلاح محفوظ في: {report_file}")
    print("افتح dashboard.html لعرض النتائج التفاعلية")

if __name__ == "__main__":
    main()