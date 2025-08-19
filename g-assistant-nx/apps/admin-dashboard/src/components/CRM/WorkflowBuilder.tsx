import React, { useState, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Fab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Paper,
  Grid
} from '@mui/material';
import {
  Close,
  PlayArrow,
  Save,
  Share,
  Add,
  AutoAwesome,
  ExpandMore,
  Email,
  WhatsApp,
  Schedule,
  Notifications,
  Transform,
  FilterList,
  TableChart,
  CloudUpload
} from '@mui/icons-material';

interface WorkflowBuilderProps {
  open: boolean;
  onClose: () => void;
  customerId?: string;
}

export const WorkflowBuilder: React.FC<WorkflowBuilderProps> = ({
  open,
  onClose,
  customerId
}) => {
  const [workflow, setWorkflow] = useState({
    id: Date.now().toString(),
    name: 'أتمتة جديدة',
    nodes: [],
    connections: []
  });

  const nodeCategories = [
    {
      title: 'المشغلات (Triggers)',
      nodes: [
        { id: 'email-received', name: 'وصول بريد إلكتروني', icon: <Email />, color: '#1976d2' },
        { id: 'whatsapp-message', name: 'رسالة واتساب', icon: <WhatsApp />, color: '#25d366' },
        { id: 'schedule', name: 'جدولة زمنية', icon: <Schedule />, color: '#ff9800' },
        { id: 'lead-status-change', name: 'تغيير حالة العميل', icon: <Notifications />, color: '#9c27b0' }
      ]
    },
    {
      title: 'الإجراءات (Actions)',
      nodes: [
        { id: 'send-email', name: 'إرسال بريد إلكتروني', icon: <Email />, color: '#d32f2f' },
        { id: 'send-whatsapp', name: 'إرسال واتساب', icon: <WhatsApp />, color: '#25d366' },
        { id: 'create-sheet-row', name: 'إضافة صف Google Sheets', icon: <TableChart />, color: '#0f9d58' },
        { id: 'upload-drive', name: 'رفع ملف Google Drive', icon: <CloudUpload />, color: '#4285f4' }
      ]
    }
  ];

  const quickTemplates = [
    {
      name: 'Meta Lead → WhatsApp',
      description: 'إرسال رسالة ترحيب تلقائية للعملاء الجدد من Meta',
      nodes: ['meta-lead', 'send-whatsapp']
    },
    {
      name: 'Email → Google Sheets',
      description: 'حفظ رسائل البريد الواردة في جدول بيانات',
      nodes: ['email-received', 'create-sheet-row']
    },
    {
      name: 'Lead Status → Slack',
      description: 'إشعار الفريق عند تغيير حالة العميل',
      nodes: ['lead-status-change', 'slack-notification']
    }
  ];

  const handleSaveWorkflow = useCallback(() => {
    console.log('حفظ الأتمتة:', workflow);
  }, [workflow]);

  const handleRunWorkflow = useCallback(() => {
    console.log('تشغيل الأتمتة:', workflow);
  }, [workflow]);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: '90vw', maxWidth: 1200 }
      }}
    >
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <AutoAwesome sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            محرر الأتمتة المرئية
          </Typography>
          
          <Button
            startIcon={<PlayArrow />}
            variant="contained"
            color="success"
            onClick={handleRunWorkflow}
            sx={{ mr: 1 }}
          >
            تشغيل
          </Button>
          
          <Button
            startIcon={<Save />}
            variant="contained"
            onClick={handleSaveWorkflow}
            sx={{ mr: 1 }}
          >
            حفظ
          </Button>
          
          <Button
            startIcon={<Share />}
            variant="outlined"
            sx={{ mr: 2 }}
          >
            مشاركة
          </Button>
          
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ display: 'flex', height: 'calc(100vh - 64px)' }}>
        {/* لوحة العقد */}
        <Box sx={{ width: 280, borderRight: 1, borderColor: 'divider', p: 2, overflow: 'auto' }}>
          <Typography variant="h6" gutterBottom>
            عناصر الأتمتة
          </Typography>
          
          {nodeCategories.map((category, index) => (
            <Accordion key={index} defaultExpanded>
              <AccordionSummary expandIcon={<ExpandMore />}>
                <Typography>{category.title}</Typography>
              </AccordionSummary>
              <AccordionDetails sx={{ p: 0 }}>
                <List dense>
                  {category.nodes.map((node) => (
                    <ListItem
                      key={node.id}
                      button
                      sx={{
                        borderRadius: 1,
                        mb: 0.5,
                        '&:hover': { backgroundColor: 'action.hover' }
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <Box sx={{ color: node.color }}>
                          {node.icon}
                        </Box>
                      </ListItemIcon>
                      <ListItemText
                        primary={node.name}
                        primaryTypographyProps={{ fontSize: '0.875rem' }}
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

          {/* قوالب جاهزة */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              قوالب جاهزة
            </Typography>
            {quickTemplates.map((template, index) => (
              <Paper
                key={index}
                sx={{
                  p: 2,
                  mb: 1,
                  cursor: 'pointer',
                  '&:hover': { backgroundColor: 'action.hover' }
                }}
              >
                <Typography variant="body2" fontWeight="bold">
                  {template.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {template.description}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* منطقة الرسم */}
        <Box sx={{ flex: 1, p: 3, backgroundColor: '#f8f9fa' }}>
          <Paper
            sx={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px dashed #ddd'
            }}
          >
            <Box textAlign="center">
              <AutoAwesome sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h5" color="textSecondary" gutterBottom>
                ابدأ بسحب العناصر هنا
              </Typography>
              <Typography variant="body2" color="textSecondary">
                اسحب المشغلات والإجراءات من اليسار لبناء سير العمل
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Box>

      <Fab
        color="primary"
        sx={{
          position: 'absolute',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>
    </Drawer>
  );
};

export default WorkflowBuilder;