/**
 * Enhanced Semantic Search Component - مكون بحث دلالي محسن
 * يوفر تجربة مستخدم سلسة مع معالجة الأخطاء والتحميل التدريجي
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { debounce } from 'lodash';

const SemanticSearchComponent = () => {
  // حالات المكون
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    threshold: 0.5,
    maxResults: 10,
    type: '',
    dateFrom: '',
    dateTo: ''
  });
  const [searchHistory, setSearchHistory] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  // إعدادات قابلة للتكوين
  const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT || '/api/v1/semantic-search';
  const DEBOUNCE_DELAY = 500;
  const MIN_QUERY_LENGTH = 2;

  // البحث المؤجل لتجنب الاستدعاءات المتكررة
  const debouncedSearch = useCallback(
    debounce(async (searchQuery, searchFilters) => {
      if (searchQuery.length < MIN_QUERY_LENGTH) {
        setResults([]);
        return;
      }

      await executeSearch(searchQuery, searchFilters);
    }, DEBOUNCE_DELAY),
    []
  );

  // تنفيذ البحث الفعلي
  const executeSearch = async (searchQuery, searchFilters) => {
    setLoading(true);
    setError(null);

    try {
      console.log(`🔍 البحث عن: "${searchQuery}"`);

      const requestBody = {
        query: searchQuery,
        threshold: searchFilters.threshold,
        maxResults: searchFilters.maxResults,
        includeContent: true,
        filters: {
          type: searchFilters.type || undefined,
          dateFrom: searchFilters.dateFrom || undefined,
          dateTo: searchFilters.dateTo || undefined
        }
      };

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'فشل في البحث');
      }

      const data = await response.json();

      if (data.success) {
        setResults(data.data.results || []);
        
        // إضافة إلى تاريخ البحث
        addToSearchHistory(searchQuery);
        
        console.log(`✅ تم العثور على ${data.data.totalResults} نتيجة`);
      } else {
        throw new Error(data.error?.message || 'خطأ غير معروف');
      }

    } catch (err) {
      console.error('❌ خطأ في البحث:', err);
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // تأثير البحث التلقائي عند تغيير الاستعلام
  useEffect(() => {
    if (query.trim()) {
      debouncedSearch(query.trim(), filters);
    } else {
      setResults([]);
    }

    return () => {
      debouncedSearch.cancel();
    };
  }, [query, filters, debouncedSearch]);

  // تحديث الاقتراحات بناءً على تاريخ البحث
  const filteredSuggestions = useMemo(() => {
    if (!query.trim() || query.length < 2) return [];
    
    return searchHistory
      .filter(item => 
        item.toLowerCase().includes(query.toLowerCase()) && 
        item !== query
      )
      .slice(0, 5);
  }, [query, searchHistory]);

  // إضافة إلى تاريخ البحث
  const addToSearchHistory = (searchQuery) => {
    setSearchHistory(prev => {
      const updated = [searchQuery, ...prev.filter(item => item !== searchQuery)];
      return updated.slice(0, 20); // الاحتفاظ بآخر 20 بحث
    });
  };

  // الحصول على رمز المصادقة
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || sessionStorage.getItem('authToken') || '';
  };

  // معالجة تغيير المرشحات
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  // معالجة اختيار اقتراح
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    setSuggestions([]);
  };

  // مسح النتائج
  const clearResults = () => {
    setQuery('');
    setResults([]);
    setError(null);
  };

  // تصدير النتائج
  const exportResults = () => {
    if (results.length === 0) return;

    const exportData = {
      query,
      timestamp: new Date().toISOString(),
      totalResults: results.length,
      results: results.map(r => ({
        id: r.id,
        similarity: r.similarity,
        title: r.title,
        preview: r.preview
      }))
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="semantic-search-container" dir="rtl">
      {/* شريط البحث */}
      <div className="search-header">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في المحتوى المالي..."
            className="search-input"
            disabled={loading}
            autoComplete="off"
          />
          
          {loading && (
            <div className="search-spinner">
              <div className="spinner"></div>
            </div>
          )}
          
          {query && (
            <button 
              onClick={clearResults}
              className="clear-button"
              title="مسح البحث"
            >
              ✕
            </button>
          )}
        </div>

        {/* الاقتراحات */}
        {filteredSuggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {filteredSuggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                🔍 {suggestion}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* المرشحات */}
      <div className="search-filters">
        <div className="filter-group">
          <label>عتبة التشابه:</label>
          <input
            type="range"
            min="0.1"
            max="1"
            step="0.1"
            value={filters.threshold}
            onChange={(e) => handleFilterChange('threshold', parseFloat(e.target.value))}
          />
          <span>{filters.threshold}</span>
        </div>

        <div className="filter-group">
          <label>عدد النتائج:</label>
          <select
            value={filters.maxResults}
            onChange={(e) => handleFilterChange('maxResults', parseInt(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div className="filter-group">
          <label>نوع التقرير:</label>
          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">جميع الأنواع</option>
            <option value="Financial_Reports">التقارير المالية</option>
            <option value="Monthly_Analysis">التحليل الشهري</option>
            <option value="Budget_Reports">تقارير الميزانية</option>
          </select>
        </div>
      </div>

      {/* رسائل الخطأ */}
      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="error-close"
          >
            ✕
          </button>
        </div>
      )}

      {/* النتائج */}
      <div className="search-results">
        {results.length > 0 && (
          <div className="results-header">
            <span>تم العثور على {results.length} نتيجة</span>
            <button onClick={exportResults} className="export-button">
              📥 تصدير النتائج
            </button>
          </div>
        )}

        {results.map((result, index) => (
          <div key={result.id} className="result-item">
            <div className="result-header">
              <h3 className="result-title">{result.title || result.id}</h3>
              <div className="result-similarity">
                <span className="similarity-score">
                  {Math.round(result.similarity * 100)}%
                </span>
                <div 
                  className="similarity-bar"
                  style={{ width: `${result.similarity * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="result-content">
              <p className="result-preview">{result.preview}</p>
              
              {result.metadata && (
                <div className="result-metadata">
                  <span className="metadata-item">
                    📅 {result.metadata.date}
                  </span>
                  <span className="metadata-item">
                    📁 {result.metadata.type}
                  </span>
                </div>
              )}
            </div>
            
            <div className="result-actions">
              <button 
                className="action-button view-button"
                onClick={() => viewFullContent(result.id)}
              >
                👁️ عرض كامل
              </button>
              <button 
                className="action-button similar-button"
                onClick={() => findSimilarContent(result.id)}
              >
                🔗 محتوى مشابه
              </button>
            </div>
          </div>
        ))}

        {query.length >= MIN_QUERY_LENGTH && results.length === 0 && !loading && !error && (
          <div className="no-results">
            <div className="no-results-icon">🔍</div>
            <h3>لم يتم العثور على نتائج</h3>
            <p>جرب تقليل عتبة التشابه أو استخدم كلمات مختلفة</p>
          </div>
        )}
      </div>

      {/* تحميل إضافي */}
      {loading && results.length > 0 && (
        <div className="loading-more">
          <div className="spinner"></div>
          <span>جاري تحديث النتائج...</span>
        </div>
      )}
    </div>
  );

  // دوال مساعدة
  function viewFullContent(resultId) {
    // فتح المحتوى الكامل في نافذة جديدة أو modal
    console.log('عرض المحتوى الكامل لـ:', resultId);
    // يمكن تنفيذ هذا حسب احتياجات التطبيق
  }

  function findSimilarContent(resultId) {
    // البحث عن محتوى مشابه لهذه النتيجة
    console.log('البحث عن محتوى مشابه لـ:', resultId);
    // يمكن تنفيذ هذا عبر استدعاء API إضافي
  }
};

// الأنماط CSS (يمكن نقلها لملف منفصل)
const styles = `
.semantic-search-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.search-input-container {
  position: relative;
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 15px 50px 15px 20px;
  border: 2px solid #e1e5e9;
  border-radius: 25px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
}

.search-input:focus {
  border-color: #007bff;
}

.search-spinner {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.clear-button {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  z-index: 1000;
}

.suggestion-item {
  padding: 10px 15px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;
}

.suggestion-item:hover {
  background-color: #f8f9fa;
}

.search-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.filter-group label {
  font-weight: 500;
  color: #495057;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 10px;
  margin-bottom: 20px;
}

.error-close {
  margin-right: auto;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: #721c24;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e1e5e9;
}

.export-button {
  padding: 8px 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.result-item {
  border: 1px solid #e1e5e9;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 15px;
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.result-title {
  margin: 0;
  color: #007bff;
  font-size: 18px;
}

.similarity-score {
  font-weight: bold;
  color: #28a745;
}

.similarity-bar {
  height: 4px;
  background: #28a745;
  border-radius: 2px;
  margin-top: 5px;
}

.result-preview {
  color: #6c757d;
  line-height: 1.6;
  margin: 10px 0;
}

.result-metadata {
  display: flex;
  gap: 15px;
  margin: 10px 0;
}

.metadata-item {
  font-size: 14px;
  color: #6c757d;
}

.result-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.action-button {
  padding: 8px 12px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 5px;
  cursor: pointer;
  font-size: 14px;
}

.action-button:hover {
  background: #007bff;
  color: white;
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  color: #6c757d;
}
`;

// إضافة الأنماط إلى الصفحة
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default SemanticSearchComponent;