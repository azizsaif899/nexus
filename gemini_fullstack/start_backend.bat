@echo off
chcp 65001 >nul
cd /d E:\azizsys5\gemini_fullstack\backend
echo Starting backend server...
py -3.10 -c "
import subprocess
import sys
import os
os.environ['PYTHONIOENCODING'] = 'utf-8'
subprocess.run([sys.executable, '-m', 'langgraph_cli.main', 'dev'], cwd='.')
"