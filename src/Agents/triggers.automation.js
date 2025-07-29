// Global automation trigger handlers
// معالجات الأتمتة العامة للاستجابة لتغييرات الخلايا

function onAutomationEdit(e) {
  try {
    if (!e || !e.range) return;
    
    const sheet = e.range.getSheet();
    const sheetName = sheet.getName();
    
    // مراقبة ورقة أوامر الأتمتة
    if (sheetName === 'AutomationCommands') {
      const row = e.range.getRow();
      const col = e.range.getColumn();
      
      // العمود الأول: الأمر، الثاني: المعاملات، الثالث: الحالة
      if (col === 1 && row > 1) { // تم إدخال أمر جديد
        const command = e.value;
        const parameters = sheet.getRange(row, 2).getValue();
        
        if (command && command !== 'PROCESSED') {
          // معالجة الأمر
          const result = GAssistant?.AI?.AutomationEngine?.processAutomationCommand(
            command, 
            typeof parameters === 'string' ? JSON.parse(parameters || '{}') : parameters
          );
          
          // تحديث الحالة
          sheet.getRange(row, 3).setValue(result?.type || 'processed');
          sheet.getRange(row, 1).setValue('PROCESSED');
        }
      }
    }
    
    // مراقبة خلايا محددة للأتمتة المباشرة
    if (sheetName === 'Main' || sheetName === 'البيانات') {
      const cellValue = e.value;
      
      // تشغيل أتمتة عند كتابة أوامر محددة
      if (typeof cellValue === 'string') {
        if (cellValue.startsWith('=AUTOMATE(')) {
          _processInlinAutomation(e.range, cellValue);
        } else if (cellValue.includes('#TRIGGER_EMAIL')) {
          _triggerEmailNotification(e.range);
        } else if (cellValue.includes('#ANALYZE_NOW')) {
          _triggerDataAnalysis(e.range);
        }
      }
    }
    
  } catch (error) {
    Logger.log('onAutomationEdit error: ' + error.message);
  }
}

function _processInlinAutomation(range, formula) {
  try {
    // استخراج المعاملات من الصيغة
    const match = formula.match(/=AUTOMATE\((.*)\)/);
    if (!match) return;
    
    const params = match[1].split(',').map(p => p.trim().replace(/"/g, ''));
    const command = params[0];
    const parameters = params.slice(1);
    
    // تنفيذ الأمر
    if (GAssistant?.AI?.AutomationEngine?.processAutomationCommand) {
      const result = GAssistant.AI.AutomationEngine.processAutomationCommand(command, {
        parameters,
        sourceRange: range.getA1Notation(),
        sourceSheet: range.getSheet().getName()
      });
      
      // تحديث الخلية بالنتيجة
      range.setValue(result.text || 'تم التنفيذ');
    }
  } catch (e) {
    range.setValue(`خطأ: ${e.message}`);
  }
}

function _triggerEmailNotification(range) {
  try {
    const sheet = range.getSheet();
    const row = range.getRow();
    
    // البحث عن بيانات البريد في الصف
    const rowData = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0];
    const email = rowData.find(cell => typeof cell === 'string' && cell.includes('@'));
    
    if (email && GAssistant?.AI?.AutomationEngine?.processAutomationCommand) {
      GAssistant.AI.AutomationEngine.processAutomationCommand('SEND_EMAIL', {
        to: email,
        subject: 'إشعار تلقائي من G-Assistant',
        body: `تم تحديث البيانات في ${range.getA1Notation()}`
      });
    }
  } catch (e) {
    Logger.log('Email trigger error: ' + e.message);
  }
}

function _triggerDataAnalysis(range) {
  try {
    const sheet = range.getSheet();
    const dataRange = sheet.getDataRange().getA1Notation();
    
    if (GAssistant?.AI?.AutomationEngine?.processAutomationCommand) {
      GAssistant.AI.AutomationEngine.processAutomationCommand('ANALYZE_DATA', {
        range: dataRange,
        sourceCell: range.getA1Notation()
      });
    }
  } catch (e) {
    Logger.log('Analysis trigger error: ' + e.message);
  }
}

// مؤقت زمني للمهام المجدولة
function onScheduledAutomation() {
  try {
    // تنفيذ المهام المجدولة يومياً
    const tasks = [
      { command: 'ANALYZE_DATA', params: { range: 'A:Z' } },
      { command: 'WEBHOOK_CALL', params: { url: 'https://api.example.com/daily-sync' } }
    ];
    
    tasks.forEach(task => {
      if (GAssistant?.AI?.AutomationEngine?.processAutomationCommand) {
        GAssistant.AI.AutomationEngine.processAutomationCommand(task.command, task.params);
      }
    });
    
  } catch (e) {
    Logger.log('Scheduled automation error: ' + e.message);
  }
}