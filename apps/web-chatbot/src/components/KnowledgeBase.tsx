import React, { useState, useEffect } from 'react';

interface KnowledgeItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'faq' | 'documentation' | 'tutorial';
  categories: string[];
  tags: string[];
  createdAt: string;
}

export const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<KnowledgeItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKnowledgeItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items, searchQuery, selectedCategory, selectedType]);

  const fetchKnowledgeItems = async () => {
    try {
      const response = await fetch('/api/content?status=published');
      const data = await response.json();
      setItems(data.data || []);
    } catch (error) {
      console.error('Error fetching knowledge items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = items;

    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(item =>
        item.categories.includes(selectedCategory)
      );
    }

    if (selectedType) {
      filtered = filtered.filter(item => item.type === selectedType);
    }

    setFilteredItems(filtered);
  };

  const getUniqueCategories = () => {
    const categories = new Set<string>();
    items.forEach(item => {
      item.categories.forEach(category => categories.add(category));
    });
    return Array.from(categories);
  };

  const getTypeLabel = (type: string) => {
    const labels = {
      article: 'مقال',
      faq: 'سؤال شائع',
      documentation: 'توثيق',
      tutorial: 'درس تعليمي'
    };
    return (labels as any)[type] || type;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">قاعدة المعرفة</h1>
        <p className="text-gray-600">ابحث في مجموعة شاملة من المقالات والأسئلة الشائعة والتوثيق</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">البحث</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث في المحتوى..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">التصنيف</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع التصنيفات</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">النوع</label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">جميع الأنواع</option>
              <option value="article">مقال</option>
              <option value="faq">سؤال شائع</option>
              <option value="documentation">توثيق</option>
              <option value="tutorial">درس تعليمي</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">
                النتائج ({filteredItems.length})
              </h2>
            </div>
            
            <div className="divide-y">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {item.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center space-x-4">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                          {getTypeLabel(item.type)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString('ar')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                  لم يتم العثور على نتائج مطابقة لبحثك
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {selectedItem ? (
            <div className="bg-white rounded-lg shadow p-6 sticky top-6">
              <div className="mb-4">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                  {getTypeLabel(selectedItem.type)}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {selectedItem.title}
              </h2>
              
              <div className="text-gray-700 mb-6">
                {selectedItem.content.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-3">{paragraph}</p>
                ))}
              </div>
              
              {selectedItem.categories.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">التصنيفات:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.categories.map(category => (
                      <span key={category} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {selectedItem.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">الوسوم:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
              اختر عنصراً من القائمة لعرض التفاصيل
            </div>
          )}
        </div>
      </div>
    </div>
  );
};