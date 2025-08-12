import React, { useState, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
  color: string;
  usageCount: number;
  createdAt: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  parentId?: string;
  contentCount: number;
  createdAt: string;
}

export const TagsManager: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<'tags' | 'categories'>('tags');
  const [isCreating, setIsCreating] = useState(false);
  const [editingItem, setEditingItem] = useState<Tag | Category | null>(null);

  useEffect(() => {
    fetchTags();
    fetchCategories();
  }, []);

  const fetchTags = async () => {
    // Mock data - في التطبيق الحقيقي، سيتم جلب البيانات من API
    const mockTags: Tag[] = [
      { id: '1', name: 'JavaScript', color: '#f7df1e', usageCount: 15, createdAt: '2024-01-01' },
      { id: '2', name: 'React', color: '#61dafb', usageCount: 12, createdAt: '2024-01-02' },
      { id: '3', name: 'API', color: '#4caf50', usageCount: 8, createdAt: '2024-01-03' },
      { id: '4', name: 'TypeScript', color: '#3178c6', usageCount: 10, createdAt: '2024-01-04' },
    ];
    setTags(mockTags);
  };

  const fetchCategories = async () => {
    // Mock data
    const mockCategories: Category[] = [
      { id: '1', name: 'البرمجة', description: 'مقالات متعلقة بالبرمجة والتطوير', contentCount: 25, createdAt: '2024-01-01' },
      { id: '2', name: 'التصميم', description: 'مقالات حول تصميم واجهات المستخدم', contentCount: 18, createdAt: '2024-01-02' },
      { id: '3', name: 'الأمان', description: 'مقالات حول أمان التطبيقات والبيانات', contentCount: 12, createdAt: '2024-01-03' },
      { id: '4', name: 'DevOps', description: 'مقالات حول النشر والعمليات', contentCount: 8, createdAt: '2024-01-04' },
    ];
    setCategories(mockCategories);
  };

  const handleCreateTag = async (tagData: Partial<Tag>) => {
    const newTag: Tag = {
      id: Date.now().toString(),
      name: tagData.name || '',
      color: tagData.color || '#6b7280',
      usageCount: 0,
      createdAt: new Date().toISOString()
    };
    setTags([...tags, newTag]);
    setIsCreating(false);
  };

  const handleCreateCategory = async (categoryData: Partial<Category>) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: categoryData.name || '',
      description: categoryData.description || '',
      parentId: categoryData.parentId,
      contentCount: 0,
      createdAt: new Date().toISOString()
    };
    setCategories([...categories, newCategory]);
    setIsCreating(false);
  };

  const handleDeleteTag = async (tagId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الوسم؟')) {
      setTags(tags.filter(tag => tag.id !== tagId));
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا التصنيف؟')) {
      setCategories(categories.filter(category => category.id !== categoryId));
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">إدارة الوسوم والتصنيفات</h1>
        <p className="text-gray-600">تنظيم المحتوى باستخدام الوسوم والتصنيفات</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('tags')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tags'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            الوسوم ({tags.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            التصنيفات ({categories.length})
          </button>
        </nav>
      </div>

      {/* Tags Tab */}
      {activeTab === 'tags' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">الوسوم</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              إضافة وسم جديد
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوسم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">اللون</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاستخدام</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tags.map((tag) => (
                  <tr key={tag.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className="inline-block w-3 h-3 rounded-full ml-2"
                          style={{ backgroundColor: tag.color }}
                        ></span>
                        <span className="text-sm font-medium text-gray-900">{tag.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-500">{tag.color}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {tag.usageCount} مقال
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(tag.createdAt).toLocaleDateString('ar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingItem(tag)}
                        className="text-blue-600 hover:text-blue-900 ml-2"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">التصنيفات</h2>
            <button
              onClick={() => setIsCreating(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              إضافة تصنيف جديد
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الاسم</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الوصف</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المحتوى</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإنشاء</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{category.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">{category.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {category.contentCount} مقال
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(category.createdAt).toLocaleDateString('ar')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => setEditingItem(category)}
                        className="text-blue-600 hover:text-blue-900 ml-2"
                      >
                        تعديل
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreating || editingItem) && (
        <CreateEditModal
          type={activeTab}
          item={editingItem}
          onSave={activeTab === 'tags' ? handleCreateTag : handleCreateCategory}
          onCancel={() => {
            setIsCreating(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

interface CreateEditModalProps {
  type: 'tags' | 'categories';
  item: Tag | Category | null;
  onSave: (data: any) => void;
  onCancel: () => void;
}

const CreateEditModal: React.FC<CreateEditModalProps> = ({ type, item, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: item?.name || '',
    color: (item as Tag)?.color || '#6b7280',
    description: (item as Category)?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {item ? 'تعديل' : 'إضافة'} {type === 'tags' ? 'وسم' : 'تصنيف'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">الاسم</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          {type === 'tags' && (
            <div>
              <label className="block text-sm font-medium mb-1">اللون</label>
              <input
                type="color"
                value={formData.color}
                onChange={(e) => setFormData({...formData, color: e.target.value})}
                className="w-full border rounded px-3 py-2 h-10"
              />
            </div>
          )}
          
          {type === 'categories' && (
            <div>
              <label className="block text-sm font-medium mb-1">الوصف</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full border rounded px-3 py-2 h-20"
                placeholder="وصف مختصر للتصنيف..."
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded hover:bg-gray-50 ml-2"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              حفظ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};