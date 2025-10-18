import React from 'react';
import { motion } from 'motion/react';
import { 
  Star, 
  Download, 
  Clock, 
  Tag,
  TrendingUp,
  CheckCircle2,
  Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { WorkflowTemplate } from '../../data/templates';

interface TemplateCardProps {
  template: WorkflowTemplate;
  onPreview: (template: WorkflowTemplate) => void;
  onInstall: (template: WorkflowTemplate) => void;
}

export function TemplateCard({ template, onPreview, onInstall }: TemplateCardProps) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="p-6 glass-subtle hover:glass-medium transition-all cursor-pointer group">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-h3 font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
              {template.nameAr}
            </h3>
            <p className="text-sm text-foreground-muted line-clamp-2">
              {template.descriptionAr}
            </p>
          </div>
          
          {/* Rating */}
          <div className="flex items-center gap-1 bg-warning/10 px-2 py-1 rounded-lg">
            <Star className="w-3 h-3 text-warning fill-warning" />
            <span className="text-sm font-semibold text-warning">{template.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getCategoryColor(template.category)}>
            {template.category}
          </Badge>
          <Badge className={getDifficultyColor(template.difficulty)}>
            {getDifficultyLabel(template.difficulty)}
          </Badge>
        </div>

        {/* Features */}
        <div className="space-y-2 mb-4">
          {template.features.slice(0, 3).map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm text-foreground-secondary">
              <CheckCircle2 className="w-3 h-3 text-success flex-shrink-0" />
              <span className="line-clamp-1">{feature}</span>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-border">
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Clock className="w-3 h-3" />
            <span>{template.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Download className="w-3 h-3" />
            <span>{template.usageCount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-foreground-muted">
            <Tag className="w-3 h-3" />
            <span>{template.nodes.length} عقدة</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onPreview(template);
            }}
            className="flex-1"
          >
            معاينة
          </Button>
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onInstall(template);
            }}
            className="flex-1 gap-2"
          >
            <Zap className="w-3 h-3" />
            تثبيت
          </Button>
        </div>

        {/* Popular Badge */}
        {template.usageCount > 1000 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-2 -right-2"
          >
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full flex items-center gap-1 text-xs font-semibold shadow-lg">
              <TrendingUp className="w-3 h-3" />
              شائع
            </div>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
}
