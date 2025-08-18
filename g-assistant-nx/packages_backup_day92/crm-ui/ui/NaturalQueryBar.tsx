import React, { useState } from 'react';

interface NaturalQueryBarProps {
  onQuery: (query: string) => void;
  placeholder?: string;
}

export const NaturalQueryBar: React.FC<NaturalQueryBarProps> = ({
  onQuery,
  placeholder = "اسأل أي شيء عن بياناتك..."
}) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isLoading) return;

    setIsLoading(true);
    try {
      await onQuery(query.trim());
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQueries = [
    "العملاء المحتملين في الرياض الذين لم نتصل بهم منذ أسبوع",
    "الفرص البيعية التي تزيد قيمتها عن 100 ألف ريال",
    "العملاء الذين لم يردوا على آخر 3 رسائل بريد إلكتروني",
    "أفضل 10 عملاء من ناحية القيمة المتوقعة"
  ];

  return (
    <div className="natural-query-bar" style={{ width: '100%' }}>
      {/* شريط البحث الرئيسي */}
      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '12px',
          padding: '4px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = '#2196F3';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(33, 150, 243, 0.2)';
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = '#e0e0e0';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          
          <span style={{ 
            fontSize: '20px', 
            padding: '0 12px',
            color: '#2196F3'
          }}>
            🔍
          </span>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              padding: '12px 8px',
              background: 'transparent',
              color: '#333'
            }}
          />
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            style={{
              background: isLoading ? '#ccc' : '#2196F3',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              minWidth: '80px'
            }}
          >
            {isLoading ? '...' : 'بحث'}
          </button>
        </div>
      </form>

      {/* الاستعلامات المقترحة */}
      <div style={{ marginTop: '16px' }}>
        <p style={{ 
          fontSize: '12px', 
          color: '#666', 
          margin: '0 0 8px 0',
          fontWeight: '500'
        }}>
          💡 استعلامات مقترحة:
        </p>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '8px' 
        }}>
          {suggestedQueries.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                setQuery(suggestion);
                onQuery(suggestion);
              }}
              style={{
                background: '#f5f5f5',
                border: '1px solid #e0e0e0',
                borderRadius: '20px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#666',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#2196F3';
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.borderColor = '#2196F3';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
                e.currentTarget.style.color = '#666';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* مؤشر التحميل */}
      {isLoading && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'white',
          border: '1px solid #e0e0e0',
          borderRadius: '8px',
          padding: '16px',
          marginTop: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #f3f3f3',
              borderTop: '2px solid #2196F3',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              marginRight: '12px'
            }} />
            <span style={{ color: '#666', fontSize: '14px' }}>
              جاري تحليل استعلامك وجلب النتائج...
            </span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};