import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Download, 
  Star, 
  Clock, 
  Tag,
  CheckCircle2,
  AlertCircle,
  Zap,
  Info
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { WorkflowTemplate } from '../../data/templates';

interface TemplatePreviewProps {
  template: WorkflowTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onInstall: (template: WorkflowTemplate) => void;
}

export function TemplatePreview({ template, isOpen, onClose, onInstall }: TemplatePreviewProps) {
  if (!template) return null;

  const getCategoryColor = (category: string) => {
    const colors = {
      business: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      marketing: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
      development: 'bg-green-500/10 text-green-600 border-green-500/20',
      automation: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      integration: 'bg-pink-500/10 text-pink-600 border-pink-500/20',
      data: 'bg-cyan-500/10 text-cyan-600 border-cyan-500/20'
    };
    return colors[category as keyof typeof colors] || colors.automation;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: 'bg-success/10 text-success border-success/20',
      intermediate: 'bg-warning/10 text-warning border-warning/20',
      advanced: 'bg-destructive/10 text-destructive border-destructive/20'
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getDifficultyLabel = (difficulty: string) => {
    const labels = {
      beginner: 'مبتدئ',
      intermediate: 'متوسط',
      advanced: 'متقدم'
    };
    return labels[difficulty as keyof typeof labels];
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9997] bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-8 z-[9998] glass-intense rounded-2xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-h2 font-semibold text-foreground">
                    {template.nameAr}
                  </h2>
                  <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-lg">
                    <Star className="w-4 h-4 text-warning fill-warning" />
                    <span className="text-sm font-semibold text-warning">{template.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-foreground-muted">
                  {template.descriptionAr}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => {
                    onInstall(template);
                    onClose();
                  }}
                  className="gap-2"
                >
                  <Zap className="w-4 h-4" />
                  تثبيت القالب
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-5xl mx-auto space-y-6">
                {/* Tags & Metadata */}
                <div className="flex flex-wrap gap-3">
                  <Badge className={getCategoryColor(template.category)}>
                    <Tag className="w-3 h-3 ml-1" />
                    {template.category}
                  </Badge>
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {getDifficultyLabel(template.difficulty)}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="w-3 h-3 ml-1" />
                    {template.estimatedTime}
                  </Badge>
                  <Badge variant="outline">
                    <Download className="w-3 h-3 ml-1" />
                    {template.usageCount.toLocaleString()} تثبيت
                  </Badge>
                </div>

                {/* Features */}
                <Card className="p-6 glass-subtle">
                  <h3 className="text-h3 font-semibold text-foreground mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success" />
                    المميزات الرئيسية
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {template.features.map((feature, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 rounded-lg bg-background/50"
                      >
                        <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0" />
                        <span className="text-sm text-foreground-secondary">{feature}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Requirements */}
                {template.requirements && template.requirements.length > 0 && (
                  <Card className="p-6 glass-subtle bg-warning/5">
                    <h3 className="text-h3 font-semibold text-foreground mb-4 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-warning" />
                      المتطلبات
                    </h3>
                    <div className="space-y-2">
                      {template.requirements.map((req, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-sm text-foreground-secondary"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-warning mt-2 flex-shrink-0" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Workflow Structure */}
                <Card className="p-6 glass-subtle">
                  <h3 className="text-h3 font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5 text-primary" />
                    بنية سير العمل
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <span className="text-sm text-foreground-muted">عدد العقد</span>
                      <span className="text-sm font-semibold text-foreground">{template.nodes.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <span className="text-sm text-foreground-muted">عدد الاتصالات</span>
                      <span className="text-sm font-semibold text-foreground">{template.connections.length}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                      <span className="text-sm text-foreground-muted">الوقت المتوقع للإعداد</span>
                      <span className="text-sm font-semibold text-foreground">{template.estimatedTime}</span>
                    </div>
                  </div>
                </Card>

                {/* Nodes Preview */}
                <Card className="p-6 glass-subtle">
                  <h3 className="text-h3 font-semibold text-foreground mb-4">
                    العقد المتضمنة
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {template.nodes.map((node, idx) => (
                      <div
                        key={node.id}
                        className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border"
                      >
                        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                          {idx + 1}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">
                            {node.data?.label || node.type}
                          </p>
                          <p className="text-xs text-foreground-muted">{node.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Author & Metadata */}
                <Card className="p-4 glass-subtle">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-foreground-muted">
                      <span>بواسطة:</span>
                      <span className="font-medium text-foreground">{template.author}</span>
                    </div>
                    <div className="flex items-center gap-4 text-foreground-muted">
                      <span>آخر تحديث: {new Date(template.updatedAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-6 border-t border-border bg-background-muted/50">
              <div className="text-sm text-foreground-muted">
                {template.tags.map((tag, idx) => (
                  <span key={idx} className="inline-block ml-2">
                    #{tag}
                  </span>
                ))}
              </div>
              <Button
                onClick={() => {
                  onInstall(template);
                  onClose();
                }}
                className="gap-2"
              >
                <Zap className="w-4 h-4" />
                تثبيت القالب
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
