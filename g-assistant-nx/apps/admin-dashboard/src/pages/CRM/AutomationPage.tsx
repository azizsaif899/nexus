import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  IconButton,
  Paper
} from '@mui/material';
import {
  Add,
  AutoAwesome,
  PlayArrow,
  Pause,
  Edit,
  Delete,
  Visibility
} from '@mui/icons-material';
import { WorkflowBuilder } from '../../components/CRM/WorkflowBuilder';

const AutomationPage: React.FC = () => {
  const [workflowBuilderOpen, setWorkflowBuilderOpen] = useState(false);

  const automations = [
    {
      id: 1,
      name: 'ترحيب العملاء الجدد من Meta',
      description: 'إرسال رسالة ترحيب تلقائية عبر WhatsApp للعملاء الجدد من إعلانات Meta',
      status: 'نشط',
      triggers: 2,
      actions: 3,
      executions: 145,
      lastRun: '2024-01-15 14:30'
    },
    {
      id: 2,
      name: 'حفظ رسائل البريد في Sheets',
      description: 'حفظ جميع رسائل البريد الواردة في جدول Google Sheets تلقائياً',
      status: 'نشط',
      triggers: 1,
      actions: 2,
      executions: 89,
      lastRun: '2024-01-15 13:45'
    },
    {
      id: 3,
      name: 'إشعار تغيير حالة العميل',
      description: 'إرسال إشعار Slack عند تغيير حالة العميل إلى "مهتم"',
      status: 'متوقف',
      triggers: 1,
      actions: 1,
      executions: 23,
      lastRun: '2024-01-14 16:20'
    }
  ];

  const templates = [
    {
      name: 'Meta Lead → WhatsApp',
      description: 'إرسال رسالة ترحيب تلقائية للعملاء الجدد من Meta',
      category: 'تسويق'
    },
    {
      name: 'Email → Google Sheets',
      description: 'حفظ رسائل البريد الواردة في جدول بيانات',
      category: 'إدارة البيانات'
    },
    {
      name: 'Lead Status → Slack',
      description: 'إشعار الفريق عند تغيير حالة العميل',
      category: 'إشعارات'
    },
    {
      name: 'Scheduled Report',
      description: 'إرسال تقرير أسبوعي بالبريد الإلكتروني',
      category: 'تقارير'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'success';
      case 'متوقف': return 'error';
      case 'مجدول': return 'info';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          الأتمتة المرئية
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
          onClick={() => setWorkflowBuilderOpen(true)}
        >
          أتمتة جديدة
        </Button>
      </Box>

      {/* الأتمتة الموجودة */}
      <Typography variant="h6" gutterBottom>
        الأتمتة النشطة
      </Typography>
      <Grid container spacing={3} mb={4}>
        {automations.map((automation) => (
          <Grid item xs={12} md={6} lg={4} key={automation.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <AutoAwesome sx={{ color: 'primary.main' }} />
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    {automation.status === 'نشط' ? (
                      <IconButton size="small" color="error">
                        <Pause />
                      </IconButton>
                    ) : (
                      <IconButton size="small" color="success">
                        <PlayArrow />
                      </IconButton>
                    )}
                    <IconButton size="small" color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>

                <Typography variant="h6" gutterBottom>
                  {automation.name}
                </Typography>
                
                <Typography variant="body2" color="textSecondary" mb={2}>
                  {automation.description}
                </Typography>

                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={automation.status}
                    color={getStatusColor(automation.status) as any}
                    size="small"
                  />
                  <Chip 
                    label={`${automation.triggers} مشغل`}
                    variant="outlined"
                    size="small"
                  />
                  <Chip 
                    label={`${automation.actions} إجراء`}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    تم التنفيذ: {automation.executions} مرة
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    آخر تشغيل: {automation.lastRun}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* القوالب الجاهزة */}
      <Typography variant="h6" gutterBottom>
        قوالب جاهزة للاستخدام
      </Typography>
      <Grid container spacing={3}>
        {templates.map((template, index) => (
          <Grid item xs={12} md={6} lg={3} key={index}>
            <Paper
              sx={{
                p: 2,
                cursor: 'pointer',
                '&:hover': { backgroundColor: 'action.hover' },
                border: '1px solid',
                borderColor: 'divider'
              }}
              onClick={() => setWorkflowBuilderOpen(true)}
            >
              <Box display="flex" alignItems="center" mb={1}>
                <AutoAwesome sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="subtitle1" fontWeight="bold">
                  {template.name}
                </Typography>
              </Box>
              
              <Typography variant="body2" color="textSecondary" mb={2}>
                {template.description}
              </Typography>
              
              <Chip 
                label={template.category}
                size="small"
                variant="outlined"
              />
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* محرر الأتمتة المرئية */}
      <WorkflowBuilder
        open={workflowBuilderOpen}
        onClose={() => setWorkflowBuilderOpen(false)}
      />
    </Box>
  );
};

export default AutomationPage;