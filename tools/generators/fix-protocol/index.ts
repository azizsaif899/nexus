import { Tree, formatFiles, generateFiles, names } from '@nx/devkit';
import * as path from 'path';

interface FixProtocolGeneratorSchema {
  name: string;
  type: 'performance' | 'security' | 'bug' | 'feature';
  project?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export default async function (tree: Tree, options: FixProtocolGeneratorSchema) {
  const normalizedOptions = {
    ...options,
    ...names(options.name),
    timestamp: new Date().toISOString().split('T')[0]
  };

  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    'docs/6_fixing/protocols',
    normalizedOptions
  );

  // إنشاء مهمة في اللوحة المركزية
  const dashboardPath = 'docs/6_fixing/reports/nx_central_dashboard.json';
  if (tree.exists(dashboardPath)) {
    const dashboard = JSON.parse(tree.read(dashboardPath, 'utf-8'));
    dashboard.tasks.pending.push({
      id: `FIX_${normalizedOptions.constantName}`,
      title: normalizedOptions.name,
      type: normalizedOptions.type,
      severity: normalizedOptions.severity,
      project: normalizedOptions.project || 'all',
      createdAt: new Date().toISOString(),
      assignedTo: 'AutoRepairSuite'
    });
    tree.write(dashboardPath, JSON.stringify(dashboard, null, 2));
  }

  await formatFiles(tree);
}

export const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'اسم بروتوكول الإصلاح' },
    type: { 
      type: 'string', 
      enum: ['performance', 'security', 'bug', 'feature'],
      description: 'نوع المشكلة'
    },
    project: { type: 'string', description: 'المشروع المتأثر (اختياري)' },
    severity: {
      type: 'string',
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      description: 'مستوى الخطورة'
    }
  },
  required: ['name', 'type']
};