import { useState, useEffect } from 'react';
import styles from './app.module.css';

interface WhatsAppMessage {
  id: string;
  from: string;
  to: string;
  text: string;
  timestamp: string;
  type: 'incoming' | 'outgoing';
}

interface WhatsAppStats {
  totalMessages: number;
  activeUsers: number;
  botStatus: 'online' | 'offline';
}

export function WhatsAppManagement() {
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [stats, setStats] = useState<WhatsAppStats>({
    totalMessages: 0,
    activeUsers: 0,
    botStatus: 'offline'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadWhatsAppData();
  }, []);

  const loadWhatsAppData = async () => {
    setIsLoading(true);
    try {
      // محاكاة البيانات
      const mockMessages: WhatsAppMessage[] = [
        {
          id: '1',
          from: '+966501234567',
          to: 'bot',
          text: '/help',
          timestamp: new Date().toISOString(),
          type: 'incoming'
        },
        {
          id: '2',
          from: 'bot',
          to: '+966501234567',
          text: 'الأوامر المتاحة:\n/help - عرض المساعدة\n/status - حالة النظام',
          timestamp: new Date().toISOString(),
          type: 'outgoing'
        }
      ];

      setMessages(mockMessages);
      setStats({
        totalMessages: 156,
        activeUsers: 23,
        botStatus: 'online'
      });
    } catch (error) {
      console.error('Error loading WhatsApp data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className={styles.section}>
        <h2>📱 إدارة WhatsApp</h2>
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <h2>📱 إدارة WhatsApp</h2>
      
      {/* إحصائيات */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي الرسائل</h3>
          <div className={styles.statValue}>{stats.totalMessages}</div>
        </div>
        <div className={styles.statCard}>
          <h3>المستخدمون النشطون</h3>
          <div className={styles.statValue}>{stats.activeUsers}</div>
        </div>
        <div className={styles.statCard}>
          <h3>حالة البوت</h3>
          <div className={`${styles.statValue} ${stats.botStatus === 'online' ? styles.healthy : styles.error}`}>
            {stats.botStatus === 'online' ? 'متصل' : 'غير متصل'}
          </div>
        </div>
      </div>

      {/* الرسائل الأخيرة */}
      <div style={{ marginTop: '2rem' }}>
        <h3>الرسائل الأخيرة</h3>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {messages.map(message => (
            <div 
              key={message.id} 
              style={{
                padding: '0.5rem',
                margin: '0.5rem 0',
                backgroundColor: message.type === 'incoming' ? '#f0f8ff' : '#f0fff0',
                borderRadius: '4px',
                borderLeft: `4px solid ${message.type === 'incoming' ? '#007bff' : '#28a745'}`
              }}
            >
              <div style={{ fontSize: '0.8rem', color: '#666' }}>
                {message.type === 'incoming' ? 'من' : 'إلى'}: {message.from}
              </div>
              <div style={{ margin: '0.25rem 0' }}>{message.text}</div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>
                {new Date(message.timestamp).toLocaleString('ar-SA')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* أزرار التحكم */}
      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
        <button 
          className={styles.loginButton}
          onClick={loadWhatsAppData}
        >
          🔄 تحديث البيانات
        </button>
        <button 
          className={styles.loginButton}
          style={{ backgroundColor: '#dc3545' }}
        >
          🛑 إيقاف البوت
        </button>
      </div>
    </div>
  );
}