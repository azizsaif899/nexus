import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3002/api';

function App() {
  const [query, setQuery] = useState('');
  const [spreadsheetId, setSpreadsheetId] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query || !spreadsheetId) return;
    
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE}/sheets/${spreadsheetId}/query`, {
        query,
        range: 'A1:Z1000'
      });
      setResults(response.data);
    } catch (error) {
      setResults({ error: 'فشل في تنفيذ البحث' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          AzizSys - واجهة التحكم الذكية
        </h1>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              value={spreadsheetId}
              onChange={(e) => setSpreadsheetId(e.target.value)}
              placeholder="معرف Google Sheet"
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white"
            />
            <select className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white">
              <option>بحث ذكي شامل</option>
              <option>تحليل البيانات</option>
            </select>
          </div>
          
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="استفسارك هنا..."
            rows={3}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white mb-4"
          />

          <button
            onClick={handleSearch}
            disabled={loading || !query || !spreadsheetId}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 px-4 py-2 rounded-md font-medium"
          >
            {loading ? 'جاري البحث...' : 'بحث ذكي'}
          </button>
        </div>

        {results && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">النتائج</h2>
            {results.error ? (
              <p className="text-red-400">{results.error}</p>
            ) : (
              <div>
                <p><strong>الاستفسار:</strong> {results.query}</p>
                <p><strong>الإجابة:</strong> {results.message}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;