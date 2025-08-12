import React, { useState, useEffect } from 'react';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'article' | 'faq' | 'documentation' | 'tutorial';
  status: 'draft' | 'review' | 'published' | 'archived';
  categories: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export const ContentManagement: React.FC = () => {
  const [contents, setContents] = useState<ContentItem[]>([]);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContents();
  }, []);

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/content');
      const data = await response.json();
      setContents(data.data || []);
    } catch (error) {
      console.error('Error fetching contents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: ContentItem) => {
    setSelectedContent(content);
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المحتوى؟')) {
      try {
        await fetch(`/api/content/${id}`, { method: 'DELETE' });
        fetchContents();
      } catch (error) {
        console.error('Error deleting content:', error);
      }
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await fetch(`/api/content/${id}/publish`, { method: 'POST' });
      fetchContents();
    } catch (error) {
      console.error('Error publishing content:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">جارٍ التحميل...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المحتوى</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          إضافة محتوى جديد
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">العنوان</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الحالة</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">تاريخ الإنشاء</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{content.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                    {content.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    content.status === 'published' ? 'bg-green-100 text-green-800' :
                    content.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {content.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(content.createdAt).toLocaleDateString('ar')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                  <button
                    onClick={() => handleEdit(content)}
                    className="text-blue-600 hover:text-blue-900 ml-2"
                  >
                    تعديل
                  </button>
                  {content.status === 'draft' && (
                    <button
                      onClick={() => handlePublish(content.id)}
                      className="text-green-600 hover:text-green-900 ml-2"
                    >
                      نشر
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(content.id)}
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

      {isEditing && (
        <ContentEditor
          content={selectedContent}
          onSave={() => {
            setIsEditing(false);
            setSelectedContent(null);
            fetchContents();
          }}
          onCancel={() => {
            setIsEditing(false);
            setSelectedContent(null);
          }}
        />
      )}
    </div>
  );
};

interface ContentEditorProps {
  content: ContentItem | null;
  onSave: () => void;
  onCancel: () => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({ content, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: content?.title || '',
    content: content?.content || '',
    type: content?.type || 'article',
    categories: content?.categories?.join(', ') || '',
    tags: content?.tags?.join(', ') || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const payload = {
      ...formData,
      categories: formData.categories.split(',').map(c => c.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      authorId: 'current-user'
    };

    try {
      const url = content ? `/api/content/${content.id}` : '/api/content';
      const method = content ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      onSave();
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {content ? 'تعديل المحتوى' : 'إضافة محتوى جديد'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">العنوان</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">النوع</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({...formData, type: e.target.value as any})}
              className="w-full border rounded px-3 py-2"
            >
              <option value="article">مقال</option>
              <option value="faq">سؤال شائع</option>
              <option value="documentation">توثيق</option>
              <option value="tutorial">درس تعليمي</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">المحتوى</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              className="w-full border rounded px-3 py-2 h-40"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">التصنيفات (مفصولة بفواصل)</label>
            <input
              type="text"
              value={formData.categories}
              onChange={(e) => setFormData({...formData, categories: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="تقنية, برمجة, تطوير"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">الوسوم (مفصولة بفواصل)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              className="w-full border rounded px-3 py-2"
              placeholder="javascript, react, api"
            />
          </div>
          
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