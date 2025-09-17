import React from 'react';
import { MessageCircle, Bot, Users, Clock } from 'lucide-react';

export const ChatbotModule: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">المساعد الذكي</h1>
          <p className="text-muted-foreground">
            إدارة المحادثات الذكية وخدمة العملاء الآلية
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90">
          <Bot className="h-4 w-4" />
          محادثة جديدة
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">المحادثات النشطة</h3>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">محادثة جارية</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">المستخدمين اليوم</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground">مستخدم اليوم</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">وقت الاستجابة</h3>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">1.2s</div>
            <p className="text-xs text-muted-foreground">متوسط الاستجابة</p>
          </div>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
          <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
            <h3 className="text-sm font-medium">رضا العملاء</h3>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="p-6 pt-0">
            <div className="text-2xl font-bold">94%</div>
            <p className="text-xs text-muted-foreground">معدل الرضا</p>
          </div>
        </div>
      </div>

      <div className="text-center py-12">
        <Bot className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
        <p className="text-muted-foreground">
          نعمل على تطوير مساعد ذكي متقدم مع قدرات الذكاء الاصطناعي
        </p>
      </div>
    </div>
  );
};