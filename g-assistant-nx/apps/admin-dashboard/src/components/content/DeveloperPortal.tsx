import React, { useState, useEffect } from 'react';

interface DocumentationItem {
  id: string;
  title: string;
  content: string;
  category: 'api' | 'protocol' | 'guide' | 'reference';
  version: string;
  lastUpdated: string;
  tags: string[];
}

export const DeveloperPortal: React.FC = () => {
  const [docs, setDocs] = useState<DocumentationItem[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentationItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocumentation();
  }, []);

  const fetchDocumentation = async () => {
    try {
      const response = await fetch('/api/content?type=documentation&status=published');
      const data = await response.json();
      setDocs(data.data || []);
    } catch (error) {
      console.error('Error fetching documentation:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = !searchQuery || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      api: 'واجهة برمجة التطبيقات',
      protocol: 'البروتوكولات',
      guide: 'أدلة التطوير',
      reference: 'المراجع'
    };
    return labels[category] || category;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      api: '🔌',
      protocol: '📋',
      guide: '📖',
      reference: '📚'
    };
    return icons[category] || '📄';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">بوابة المطورين</h1>
        <p className="text-gray-600">التوثيق الهندسي والبروتوكولات والأدلة التقنية</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-6">
            <h2 className="text-lg font-semibold mb-4">التصفح</h2>
            
            {/* Search */}
            <div className="mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="البحث في التوثيق..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <button
                onClick={() => setSelectedCategory('')}
                className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
                  !selectedCategory ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                }`}
              >
                📋 جميع الفئات
              </button>
              
              {['api', 'protocol', 'guide', 'reference'].map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-right px-3 py-2 rounded-md transition-colors ${
                    selectedCategory === category ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-100'
                  }`}
                >
                  {getCategoryIcon(category)} {getCategoryLabel(category)}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="mt-8">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">روابط سريعة</h3>
              <div className="space-y-2 text-sm">
                <a href="#" className="block text-blue-600 hover:text-blue-800">🚀 البدء السريع</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">🔑 مفاتيح API</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">📊 حالة الخدمة</a>
                <a href="#" className="block text-blue-600 hover:text-blue-800">💬 دعم المطورين</a>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedDoc ? (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{selectedDoc.title}</h1>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {getCategoryIcon(selectedDoc.category)} {getCategoryLabel(selectedDoc.category)}
                      </span>
                      <span className="text-sm text-gray-500">الإصدار {selectedDoc.version}</span>
                      <span className="text-sm text-gray-500">
                        آخر تحديث: {new Date(selectedDoc.lastUpdated).toLocaleDateString('ar')}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedDoc(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="prose max-w-none">
                  {selectedDoc.content.split('\n').map((paragraph, index) => {
                    if (paragraph.startsWith('#')) {
                      const level = paragraph.match(/^#+/)?.[0].length || 1;
                      const text = paragraph.replace(/^#+\s*/, '');
                      const HeadingTag = `h${Math.min(level, 6)}` as keyof JSX.IntrinsicElements;
                      return (
                        <HeadingTag key={index} className={`font-bold mt-6 mb-3 ${
                          level === 1 ? 'text-2xl' :
                          level === 2 ? 'text-xl' :
                          level === 3 ? 'text-lg' : 'text-base'
                        }`}>
                          {text}
                        </HeadingTag>
                      );
                    } else if (paragraph.startsWith('```')) {
                      return (
                        <pre key={index} className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4">
                          <code>{paragraph.replace(/```\w*\n?/, '').replace(/```$/, '')}</code>
                        </pre>
                      );
                    } else if (paragraph.trim()) {
                      return <p key={index} className="mb-4">{paragraph}</p>;
                    }
                    return null;
                  })}
                </div>
                
                {selectedDoc.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">الوسوم:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDoc.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h2 className="text-xl font-semibold">
                  {selectedCategory ? getCategoryLabel(selectedCategory) : 'جميع التوثيقات'}
                  <span className="text-sm text-gray-500 font-normal mr-2">
                    ({filteredDocs.length} عنصر)
                  </span>
                </h2>
              </div>
              
              <div className="divide-y">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-6 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedDoc(doc)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-lg">{getCategoryIcon(doc.category)}</span>
                          <h3 className="text-lg font-medium text-gray-900">
                            {doc.title}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3">
                          {doc.content.substring(0, 200)}...
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {getCategoryLabel(doc.category)}
                          </span>
                          <span>الإصدار {doc.version}</span>
                          <span>آخر تحديث: {new Date(doc.lastUpdated).toLocaleDateString('ar')}</span>
                        </div>
                      </div>
                      
                      <div className="text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
                
                {filteredDocs.length === 0 && (
                  <div className="p-8 text-center text-gray-500">
                    لم يتم العثور على توثيق مطابق للبحث
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};