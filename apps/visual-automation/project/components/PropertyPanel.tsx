import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Code, Database, Mail, Webhook, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface Node {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: any;
}

interface PropertyPanelProps {
  selectedNode: Node | null;
  onClose: () => void;
  onUpdateNode: (nodeId: string, data: any) => void;
}

const nodeIcons = {
  'webhook-trigger': Webhook,
  'schedule-trigger': Clock,
  'email-trigger': Mail,
  'http-request': Database,
  'condition': Settings,
  default: Code
};

export function PropertyPanel({ selectedNode, onClose, onUpdateNode }: PropertyPanelProps) {
  const [formData, setFormData] = useState(selectedNode?.data || {});

  if (!selectedNode) return null;

  const Icon = nodeIcons[selectedNode.type as keyof typeof nodeIcons] || nodeIcons.default;

  const handleSave = () => {
    onUpdateNode(selectedNode.id, formData);
    onClose();
  };

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const renderNodeSpecificFields = () => {
    switch (selectedNode.type) {
      case 'webhook-trigger':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="webhook-url" className="text-sm">رابط الـ Webhook</Label>
              <Input
                id="webhook-url"
                value={formData.webhookUrl || ''}
                onChange={(e) => updateFormData('webhookUrl', e.target.value)}
                placeholder="https://example.com/webhook"
                className="h-9 text-sm mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="http-method" className="text-sm">طريقة HTTP</Label>
              <Select value={formData.httpMethod || 'POST'} onValueChange={(value) => updateFormData('httpMethod', value)}>
                <SelectTrigger className="h-9 text-sm mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="GET">GET</SelectItem>
                  <SelectItem value="POST">POST</SelectItem>
                  <SelectItem value="PUT">PUT</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <Switch
                id="authentication"
                checked={formData.requireAuth || false}
                onCheckedChange={(checked) => updateFormData('requireAuth', checked)}
              />
              <Label htmlFor="authentication" className="text-sm">يتطلب المصادقة</Label>
            </div>
          </div>
        );

      case 'schedule-trigger':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="schedule-type" className="text-sm">نوع الجدولة</Label>
              <Select value={formData.scheduleType || 'interval'} onValueChange={(value) => updateFormData('scheduleType', value)}>
                <SelectTrigger className="h-9 text-sm mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="interval">فترة زمنية</SelectItem>
                  <SelectItem value="cron">تعبير Cron</SelectItem>
                  <SelectItem value="once">مرة واحدة</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.scheduleType === 'interval' && (
              <div>
                <Label htmlFor="interval" className="text-sm">الفترة (بالدقائق)</Label>
                <Input
                  id="interval"
                  type="number"
                  value={formData.interval || 5}
                  onChange={(e) => updateFormData('interval', parseInt(e.target.value))}
                  className="h-9 text-sm mt-1.5"
                />
              </div>
            )}
            {formData.scheduleType === 'cron' && (
              <div>
                <Label htmlFor="cron" className="text-sm">تعبير Cron</Label>
                <Input
                  id="cron"
                  value={formData.cronExpression || '0 */5 * * * *'}
                  onChange={(e) => updateFormData('cronExpression', e.target.value)}
                  placeholder="0 */5 * * * *"
                  className="h-9 text-sm mt-1.5"
                />
              </div>
            )}
          </div>
        );

      case 'email-send':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="to-email" className="text-sm">إلى</Label>
              <Input
                id="to-email"
                value={formData.toEmail || ''}
                onChange={(e) => updateFormData('toEmail', e.target.value)}
                placeholder="user@example.com"
                className="h-9 text-sm mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="subject" className="text-sm">الموضوع</Label>
              <Input
                id="subject"
                value={formData.subject || ''}
                onChange={(e) => updateFormData('subject', e.target.value)}
                placeholder="موضوع الرسالة"
                className="h-9 text-sm mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="body" className="text-sm">المحتوى</Label>
              <Textarea
                id="body"
                value={formData.body || ''}
                onChange={(e) => updateFormData('body', e.target.value)}
                placeholder="محتوى الرسالة..."
                rows={3}
                className="text-sm mt-1.5 resize-none"
              />
            </div>
          </div>
        );

      case 'condition':
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="condition-field" className="text-sm">الحقل</Label>
              <Input
                id="condition-field"
                value={formData.field || ''}
                onChange={(e) => updateFormData('field', e.target.value)}
                placeholder="اسم الحقل"
                className="h-9 text-sm mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="condition-operator" className="text-sm">المشغل</Label>
              <Select value={formData.operator || 'equals'} onValueChange={(value) => updateFormData('operator', value)}>
                <SelectTrigger className="h-9 text-sm mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="equals">يساوي</SelectItem>
                  <SelectItem value="not_equals">لا يساوي</SelectItem>
                  <SelectItem value="greater_than">أكبر من</SelectItem>
                  <SelectItem value="less_than">أصغر من</SelectItem>
                  <SelectItem value="contains">يحتوي على</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="condition-value" className="text-sm">القيمة</Label>
              <Input
                id="condition-value"
                value={formData.value || ''}
                onChange={(e) => updateFormData('value', e.target.value)}
                placeholder="القيمة المطلوب مقارنتها"
                className="h-9 text-sm mt-1.5"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-3">
            <div>
              <Label htmlFor="custom-config" className="text-sm">إعدادات مخصصة</Label>
              <Textarea
                id="custom-config"
                value={formData.customConfig || ''}
                onChange={(e) => updateFormData('customConfig', e.target.value)}
                placeholder="إعدادات JSON..."
                rows={4}
                className="text-sm mt-1.5 resize-none"
              />
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={!!selectedNode} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md max-h-[85vh] p-0 gap-0 glass-intense border-2 border-border/50">
        <DialogHeader className="p-4 border-b border-border glass-medium backdrop-blur-xl space-y-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground shadow-lg">
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <DialogTitle className="text-base text-foreground">إعدادات العقدة</DialogTitle>
              <DialogDescription className="sr-only">
                تخصيص إعدادات وخصائص العقدة المحددة
              </DialogDescription>
              <Badge variant="outline" className="text-xs mt-1 border-primary/30 text-primary">
                {selectedNode.type}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <ScrollArea className="max-h-[calc(85vh-140px)]">
          <div className="p-4">
              <Tabs defaultValue="settings" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-muted/50 h-9">
                  <TabsTrigger value="settings" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">الإعدادات</TabsTrigger>
                  <TabsTrigger value="advanced" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-sm">متقدم</TabsTrigger>
                </TabsList>
                
                <TabsContent value="settings" className="space-y-4 mt-4">
                  {/* Basic Settings */}
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="node-name" className="text-foreground text-sm">اسم العقدة</Label>
                      <Input
                        id="node-name"
                        value={formData.label || ''}
                        onChange={(e) => updateFormData('label', e.target.value)}
                        placeholder="اسم العقدة"
                        className="bg-input-background border-border text-foreground placeholder:text-muted-foreground h-9 text-sm mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="node-description" className="text-foreground text-sm">الوصف</Label>
                      <Textarea
                        id="node-description"
                        value={formData.description || ''}
                        onChange={(e) => updateFormData('description', e.target.value)}
                        placeholder="وصف ما تقوم به هذه العقدة..."
                        rows={2}
                        className="bg-input-background border-border text-foreground placeholder:text-muted-foreground text-sm mt-1.5 resize-none"
                      />
                    </div>
                  </div>

                  {/* Node-specific settings */}
                  <div>
                    <h4 className="mb-3 text-foreground-secondary font-medium text-sm">إعدادات خاصة</h4>
                    {renderNodeSpecificFields()}
                  </div>
                </TabsContent>
                
                <TabsContent value="advanced" className="space-y-4 mt-4">
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="enabled"
                        checked={formData.enabled !== false}
                        onCheckedChange={(checked) => updateFormData('enabled', checked)}
                      />
                      <Label htmlFor="enabled" className="text-foreground text-sm">مفعل</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <Switch
                        id="retry-on-fail"
                        checked={formData.retryOnFail || false}
                        onCheckedChange={(checked) => updateFormData('retryOnFail', checked)}
                      />
                      <Label htmlFor="retry-on-fail" className="text-foreground text-sm">إعادة المحاولة عند الفشل</Label>
                    </div>
                    
                    {formData.retryOnFail && (
                      <div>
                        <Label htmlFor="retry-count" className="text-foreground text-sm">عدد المحاولات</Label>
                        <Input
                          id="retry-count"
                          type="number"
                          value={formData.retryCount || 3}
                          onChange={(e) => updateFormData('retryCount', parseInt(e.target.value))}
                          min="1"
                          max="10"
                          className="bg-input-background border-border text-foreground h-9 text-sm mt-1.5"
                        />
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="timeout" className="text-foreground text-sm">انتهاء المهلة (ثانية)</Label>
                      <Input
                        id="timeout"
                        type="number"
                        value={formData.timeout || 30}
                        onChange={(e) => updateFormData('timeout', parseInt(e.target.value))}
                        min="1"
                        className="bg-input-background border-border text-foreground h-9 text-sm mt-1.5"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="flex gap-2 p-4 border-t border-border glass-medium backdrop-blur-xl">
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground text-sm">
              حفظ التغييرات
            </Button>
            <Button variant="outline" onClick={onClose} className="border-border text-foreground hover:bg-muted text-sm">
              إلغاء
            </Button>
          </div>
      </DialogContent>
    </Dialog>
  );
}