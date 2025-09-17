import React, { useState } from 'react';

interface SearchFilters {
  dateRange: { start: Date | null; end: Date | null };
  messageType: 'all' | 'user' | 'ai';
  sortBy: 'date' | 'relevance';
  sortOrder: 'asc' | 'desc';
}

interface AdvancedSearchProps {
  onSearch: (query: string, filters: SearchFilters) => void;
}

export const AdvancedSearch: React.FC<AdvancedSearchProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    dateRange: { start: null, end: null },
    messageType: 'all',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const handleSearch = () => {
    onSearch(query, filters);
  };

  return (
    <div className="advanced-search">
      <div className="search-input-container">
        <input
          type="text"
          placeholder="ابحث في المحادثات..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>
        <button onClick={() => setShowFilters(!showFilters)}>⚙️</button>
      </div>

      {showFilters && (
        <div className="search-filters">
          <div className="filter-group">
            <label>نوع الرسالة:</label>
            <select
              value={filters.messageType}
              onChange={(e) => setFilters({...filters, messageType: e.target.value as any})}
            >
              <option value="all">الكل</option>
              <option value="user">رسائل المستخدم</option>
              <option value="ai">رسائل الذكاء الاصطناعي</option>
            </select>
          </div>

          <div className="filter-group">
            <label>ترتيب حسب:</label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({...filters, sortBy: e.target.value as any})}
            >
              <option value="date">التاريخ</option>
              <option value="relevance">الصلة</option>
            </select>
          </div>

          <div className="filter-group">
            <label>اتجاه الترتيب:</label>
            <select
              value={filters.sortOrder}
              onChange={(e) => setFilters({...filters, sortOrder: e.target.value as any})}
            >
              <option value="desc">تنازلي</option>
              <option value="asc">تصاعدي</option>
            </select>
          </div>
        </div>
      )}

      <style>{`
        .advanced-search {
          margin: 16px 0;
        }
        
        .search-input-container {
          display: flex;
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .search-input-container input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        .search-input-container button {
          padding: 8px 12px;
          border: none;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .search-filters {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          padding: 16px;
          background: #f8f9fa;
          border-radius: 4px;
        }
        
        .filter-group label {
          display: block;
          margin-bottom: 4px;
          font-weight: bold;
        }
        
        .filter-group select {
          width: 100%;
          padding: 4px 8px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
};