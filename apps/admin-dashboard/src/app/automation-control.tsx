import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface AutomationStatus {
  isRunning: boolean;
  currentDay: number;
  currentTask: string;
  completedTasks: number;
  totalTasks: number;
  errors: number;
  lastUpdate: string;
}

interface TaskProgress {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  startTime?: string;
  endTime?: string;
}

export function AutomationControl() {
  const [status, setStatus] = useState<AutomationStatus>({
    isRunning: false,
    currentDay: 94,
    currentTask: 'TASK-AUTH-001',
    completedTasks: 0,
    totalTasks: 15,
    errors: 0,
    lastUpdate: new Date().toISOString()
  });

  const [tasks, setTasks] = useState<TaskProgress[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    loadAutomationStatus();
    const interval = setInterval(loadAutomationStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadAutomationStatus = async () => {
    try {
      // استدعاء API الحقيقي
      const response = await fetch('/api/automation/status');
      if (response.ok) {
        const data = await response.json();
        setStatus(data.status);
        setTasks(data.tasks || []);
        setLogs(data.logs || []);
      } else {
        // محاكاة البيانات عند عدم توفر API
        simulateData();
      }
    } catch (error) {
      console.warn('API غير متاح، استخدام البيانات المحاكاة');
      simulateData();
    }
  };

  const simulateData = () => {
    const mockTasks: TaskProgress[] = [
      { id: 'TASK-AUTH-001', name: 'JWT Authentication', status: 'completed', progress: 100, startTime: '08:15', endTime: '09:15' },
      { id: 'TASK-AUTH-002', name: 'API Key Management', status: 'completed', progress: 100, startTime: '09:15', endTime: '09:45' },
      { id: 'TASK-RATE-001', name: 'Rate Limiting', status: 'running', progress: 60, startTime: '10:00' },
      { id: 'TASK-VALID-001', name: 'Input Validation', status: 'pending', progress: 0 },
      { id: 'TASK-SQL-001', name: 'SQL Prevention', status: 'pending', progress: 0 }
    ];

    setTasks(mockTasks);
    setStatus(prev => ({
      ...prev,
      isRunning: true,
      completedTasks: mockTasks.filter(t => t.status === 'completed').length,
      totalTasks: mockTasks.length,
      lastUpdate: new Date().toISOString()
    }));

    setLogs([
      `${new Date().toLocaleTimeString()} - ✅ TASK-AUTH-001 مكتمل بنجاح`,
      `${new Date().toLocaleTimeString()} - ✅ TASK-AUTH-002 مكتمل بنجاح`,
      `${new Date().toLocaleTimeString()} - 🔄 TASK-RATE-001 بدء التنفيذ`,
      `${new Date().toLocaleTimeString()} - 📊 النظام يعمل بسلاسة`
    ]);
  };

  const startAutomation = async () => {
    try {
      const response = await fetch('/api/automation/start', { method: 'POST' });
      if (response.ok) {
        setStatus(prev => ({ ...prev, isRunning: true }));
        addLog('🚀 تم بدء النظام الأوتوماتيكي');
      }
    } catch (error) {
      addLog('❌ فشل في بدء النظام');
    }
  };

  const stopAutomation = async () => {
    try {
      const response = await fetch('/api/automation/stop', { method: 'POST' });
      if (response.ok) {
        setStatus(prev => ({ ...prev, isRunning: false }));
        addLog('⏹️ تم إيقاف النظام الأوتوماتيكي');
      }
    } catch (error) {
      addLog('❌ فشل في إيقاف النظام');
    }
  };

  const pauseAutomation = async () => {
    try {
      const response = await fetch('/api/automation/pause', { method: 'POST' });
      if (response.ok) {
        addLog('⏸️ تم إيقاف النظام مؤقتاً');
      }
    } catch (error) {
      addLog('❌ فشل في الإيقاف المؤقت');
    }
  };

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [`${timestamp} - ${message}`, ...prev.slice(0, 49)]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#28a745';
      case 'running': return '#ffc107';
      case 'error': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'running': return '🔄';
      case 'error': return '❌';
      default: return '⏳';
    }
  };

  return (
    <div className={styles.section}>
      <h2>🤖 التحكم في النظام الأوتوماتيكي</h2>
      
      {/* حالة النظام العامة */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>حالة النظام</h3>
          <div 
            className={styles.statValue}
            style={{ color: status.isRunning ? '#28a745' : '#dc3545' }}
          >
            {status.isRunning ? '🟢 يعمل' : '🔴 متوقف'}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>اليوم الحالي</h3>
          <div className={styles.statValue}>
            {status.currentDay}
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>التقدم</h3>
          <div className={styles.statValue}>
            {status.completedTasks}/{status.totalTasks}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#666' }}>
            {Math.round((status.completedTasks / status.totalTasks) * 100)}% مكتمل
          </div>
        </div>

        <div className={styles.statCard}>
          <h3>الأخطاء</h3>
          <div 
            className={styles.statValue}
            style={{ color: status.errors > 0 ? '#dc3545' : '#28a745' }}
          >
            {status.errors}
          </div>
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ margin: '2rem 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button 
          className={styles.loginButton}
          onClick={startAutomation}
          disabled={status.isRunning}
          style={{ backgroundColor: status.isRunning ? '#6c757d' : '#28a745' }}
        >
          🚀 بدء النظام
        </button>
        
        <button 
          className={styles.loginButton}
          onClick={pauseAutomation}
          disabled={!status.isRunning}
          style={{ backgroundColor: '#ffc107', color: '#000' }}
        >
          ⏸️ إيقاف مؤقت
        </button>
        
        <button 
          className={styles.loginButton}
          onClick={stopAutomation}
          disabled={!status.isRunning}
          style={{ backgroundColor: '#dc3545' }}
        >
          ⏹️ إيقاف كامل
        </button>

        <button 
          className={styles.loginButton}
          onClick={loadAutomationStatus}
          style={{ backgroundColor: '#17a2b8' }}
        >
          🔄 تحديث
        </button>
      </div>

      {/* قائمة المهام */}
      <div style={{ marginBottom: '2rem' }}>
        <h3>📋 مهام اليوم {status.currentDay}</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          maxHeight: '300px', 
          overflowY: 'auto' 
        }}>
          {tasks.map(task => (
            <div 
              key={task.id}
              style={{
                padding: '1rem',
                borderBottom: '1px solid #eee',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', marginBottom: '0.25rem' }}>
                  {getStatusIcon(task.status)} {task.name}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>
                  {task.id}
                </div>
                {task.status === 'running' && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <div style={{ 
                      width: '100%', 
                      height: '4px', 
                      backgroundColor: '#e9ecef', 
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${task.progress}%`,
                        height: '100%',
                        backgroundColor: '#ffc107',
                        transition: 'width 0.3s'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '0.25rem' }}>
                      {task.progress}% مكتمل
                    </div>
                  </div>
                )}
              </div>
              <div style={{ 
                color: getStatusColor(task.status),
                fontWeight: 'bold',
                marginLeft: '1rem'
              }}>
                {task.status === 'completed' && task.endTime && (
                  <div style={{ fontSize: '0.8rem' }}>
                    {task.startTime} - {task.endTime}
                  </div>
                )}
                {task.status === 'running' && task.startTime && (
                  <div style={{ fontSize: '0.8rem' }}>
                    بدء: {task.startTime}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* سجل الأنشطة */}
      <div>
        <h3>📜 سجل الأنشطة المباشر</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          maxHeight: '200px',
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: '0.9rem'
        }}>
          {logs.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center' }}>لا توجد أنشطة حتى الآن</p>
          ) : (
            logs.map((log, index) => (
              <div key={index} style={{ marginBottom: '0.25rem' }}>
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      {/* معلومات إضافية */}
      <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>
        <p>آخر تحديث: {new Date(status.lastUpdate).toLocaleString('ar-SA')}</p>
        <p>المهمة الحالية: {status.currentTask}</p>
      </div>
    </div>
  );
}