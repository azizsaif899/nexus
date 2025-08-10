import { useState, useEffect } from 'react';
import styles from './app.module.css';
import { WhatsAppManagement } from './whatsapp-management';
import { MonitoringDashboard } from './monitoring-dashboard';
import { SecurityDashboard } from './security-dashboard';
import { AIDashboard } from './ai-dashboard';
import { TestingDashboard } from './testing-dashboard';

interface User {
  id: number;
  username: string;
  role: string;
}

export function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('userData');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsLoggedIn(true);
      } catch (error) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3333/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userData', JSON.stringify(data.user));
        
        setUser(data.user);
        setIsLoggedIn(true);
        setUsername('');
        setPassword('');
      } else {
        setError(data.message || 'بيانات الدخول غير صحيحة');
      }
    } catch (error) {
      setError('عذراً، لا يمكن الاتصال بالخادم. يرجى المحاولة لاحقاً.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        await fetch('http://localhost:3333/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
      setUser(null);
      setIsLoggedIn(false);
      setActiveSection('dashboard');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>🔐 لوحة الإدارة</h1>
          <p>AzizSys AI Assistant</p>
          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <input
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="كلمة المرور"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" className={styles.loginButton} disabled={isLoading}>
              {isLoading ? 'جاري الدخول...' : 'دخول'}
            </button>
          </form>
          <div className={styles.hint}>
            <small>المستخدم: admin | كلمة المرور: azizsys2025</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.app}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>🤖 AzizSys</h2>
          <p>لوحة الإدارة</p>
        </div>
        <nav className={styles.nav}>
          <button 
            className={activeSection === 'dashboard' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 الرئيسية
          </button>
          <button 
            className={activeSection === 'tasks' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('tasks')}
          >
            📋 المهام
          </button>
          <button 
            className={activeSection === 'reports' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('reports')}
          >
            📈 التقارير
          </button>
          <button 
            className={activeSection === 'testing' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('testing')}
          >
            🧪 الاختبارات
          </button>
          <button 
            className={activeSection === 'ai' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('ai')}
          >
            🤖 الذكاء الاصطناعي
          </button>
          <button 
            className={activeSection === 'security' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('security')}
          >
            🛡️ الأمان
          </button>
          <button 
            className={activeSection === 'monitoring' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('monitoring')}
          >
            📈 المراقبة
          </button>
          <button 
            className={activeSection === 'whatsapp' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('whatsapp')}
          >
            💬 WhatsApp
          </button>
          <button 
            className={activeSection === 'settings' ? styles.navItemActive : styles.navItem}
            onClick={() => setActiveSection('settings')}
          >
            ⚙️ الإعدادات
          </button>
        </nav>
        <div className={styles.sidebarFooter}>
          <button 
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            🚪 خروج
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.header}>
          <h1>مرحباً بك في لوحة الإدارة</h1>
          <p>إدارة شاملة لنظام AzizSys AI Assistant</p>
        </header>

        <div className={styles.content}>
          {activeSection === 'dashboard' && (
            <div className={styles.section}>
              <h2>📊 لوحة المعلومات الرئيسية</h2>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <h3>المهام النشطة</h3>
                  <div className={styles.statValue}>12</div>
                </div>
                <div className={styles.statCard}>
                  <h3>المهام المكتملة</h3>
                  <div className={styles.statValue}>45</div>
                </div>
                <div className={styles.statCard}>
                  <h3>حالة النظام</h3>
                  <div className={styles.statValue + ' ' + styles.healthy}>سليم</div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'tasks' && (
            <div className={styles.section}>
              <h2>📋 إدارة المهام</h2>
              <p>عرض وإدارة جميع المهام في النظام</p>
            </div>
          )}

          {activeSection === 'reports' && (
            <div className={styles.section}>
              <h2>📈 التقارير والإحصائيات</h2>
              <p>تقارير مفصلة عن أداء النظام</p>
            </div>
          )}

          {activeSection === 'testing' && (
            <TestingDashboard />
          )}

          {activeSection === 'ai' && (
            <AIDashboard />
          )}

          {activeSection === 'security' && (
            <SecurityDashboard />
          )}

          {activeSection === 'monitoring' && (
            <MonitoringDashboard />
          )}

          {activeSection === 'whatsapp' && (
            <WhatsAppManagement />
          )}

          {activeSection === 'settings' && (
            <div className={styles.section}>
              <h2>⚙️ إعدادات النظام</h2>
              <p>تكوين وإعدادات النظام</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;