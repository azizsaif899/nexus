import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Button } from '../../components/ui/button';
import { GripVertical, RotateCcw } from 'lucide-react';

interface DraggableItemProps {
  id: string;
  title: string;
  description: string;
  status: string;
  onDragStart: (id: string) => void;
}

function DraggableItem({ id, title, description, status, onDragStart }: DraggableItemProps) {
  return (
    <Card
      draggable
      onDragStart={() => onDragStart(id)}
      className="cursor-move hover:shadow-md transition-shadow"
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          <GripVertical className="h-5 w-5 text-muted-foreground mt-1" />
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <h4>{title}</h4>
              <Badge variant="outline">{status}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface DropZoneProps {
  title: string;
  items: Array<{ id: string; title: string; description: string; status: string }>;
  onDrop: (columnId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragStart: (id: string) => void;
  columnId: string;
}

function DropZone({ title, items, onDrop, onDragOver, onDragStart, columnId }: DropZoneProps) {
  return (
    <div
      onDrop={() => onDrop(columnId)}
      onDragOver={onDragOver}
      className="min-h-[400px] p-4 rounded-lg border-2 border-dashed transition-colors"
    >
      <h3 className="mb-4">{title}</h3>
      <div className="space-y-3">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            title={item.title}
            description={item.description}
            status={item.status}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </div>
  );
}

export function DnDTest() {
  const [draggedId, setDraggedId] = React.useState<string | null>(null);
  const [columns, setColumns] = React.useState({
    todo: [
      { id: '1', title: 'مهمة 1', description: 'إنشاء تصميم الصفحة الرئيسية', status: 'جديدة' },
      { id: '2', title: 'مهمة 2', description: 'تطوير API للعملاء', status: 'عالية' },
      { id: '3', title: 'مهمة 3', description: 'مراجعة الكود', status: 'متوسطة' },
    ],
    inProgress: [
      { id: '4', title: 'مهمة 4', description: 'بناء Dashboard', status: 'قيد التنفيذ' },
      { id: '5', title: 'مهمة 5', description: 'اختبار المكونات', status: 'قيد التنفيذ' },
    ],
    done: [
      { id: '6', title: 'مهمة 6', description: 'إعداد المشروع', status: 'مكتملة' },
    ],
  });

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetColumn: string) => {
    if (!draggedId) return;

    setColumns((prev) => {
      const newColumns = { ...prev };
      let sourceColumn: keyof typeof newColumns | null = null;
      let draggedItem = null;

      // Find the item and source column
      for (const [columnKey, items] of Object.entries(newColumns)) {
        const itemIndex = items.findIndex((item) => item.id === draggedId);
        if (itemIndex !== -1) {
          sourceColumn = columnKey as keyof typeof newColumns;
          draggedItem = items[itemIndex];
          newColumns[sourceColumn] = items.filter((item) => item.id !== draggedId);
          break;
        }
      }

      // Add to target column
      if (draggedItem && targetColumn in newColumns) {
        newColumns[targetColumn as keyof typeof newColumns] = [
          ...newColumns[targetColumn as keyof typeof newColumns],
          draggedItem,
        ];
      }

      return newColumns;
    });

    setDraggedId(null);
  };

  const resetColumns = () => {
    setColumns({
      todo: [
        { id: '1', title: 'مهمة 1', description: 'إنشاء تصميم الصفحة الرئيسية', status: 'جديدة' },
        { id: '2', title: 'مهمة 2', description: 'تطوير API للعملاء', status: 'عالية' },
        { id: '3', title: 'مهمة 3', description: 'مراجعة الكود', status: 'متوسطة' },
      ],
      inProgress: [
        { id: '4', title: 'مهمة 4', description: 'بناء Dashboard', status: 'قيد التنفيذ' },
        { id: '5', title: 'مهمة 5', description: 'اختبار المكونات', status: 'قيد التنفيذ' },
      ],
      done: [
        { id: '6', title: 'مهمة 6', description: 'إعداد المشروع', status: 'مكتملة' },
      ],
    });
  };

  return (
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1>اختبار Drag & Drop</h1>
          <p className="text-muted-foreground">نظام سحب وإفلات البطاقات بين الأعمدة</p>
        </div>
        <Button onClick={resetColumns} variant="outline">
          <RotateCcw className="ml-2 h-4 w-4" />
          إعادة تعيين
        </Button>
      </div>

      <Separator />

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>التعليمات</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2">
            <li>اسحب أي بطاقة من أي عمود</li>
            <li>أفلت البطاقة في العمود المطلوب</li>
            <li>ستنتقل البطاقة تلقائياً</li>
            <li>استخدم زر "إعادة تعيين" للرجوع للحالة الأولية</li>
          </ol>
        </CardContent>
      </Card>

      {/* Kanban Board */}
      <div className="grid md:grid-cols-3 gap-6">
        <DropZone
          title="المهام الجديدة"
          items={columns.todo}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          columnId="todo"
        />
        <DropZone
          title="قيد التنفيذ"
          items={columns.inProgress}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          columnId="inProgress"
        />
        <DropZone
          title="مكتملة"
          items={columns.done}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragStart={handleDragStart}
          columnId="done"
        />
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2>{columns.todo.length}</h2>
              <p className="text-muted-foreground">مهام جديدة</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2>{columns.inProgress.length}</h2>
              <p className="text-muted-foreground">قيد التنفيذ</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <h2>{columns.done.length}</h2>
              <p className="text-muted-foreground">مكتملة</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Success */}
      <Card className="border-green-500 bg-green-500/10">
        <CardContent className="pt-6">
          <p className="text-center">
            ✅ نظام Drag & Drop يعمل بشكل ممتاز! جرب سحب البطاقات بين الأعمدة.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
