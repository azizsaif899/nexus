import React from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip
} from '@mui/material';
import {
  ExpandMore,
  Email,
  WhatsApp,
  Schedule,
  Notifications,
  Storage,
  Transform,
  FilterList,
  Loop,
  CallSplit,
  Stop,
  PlayArrow,
  TableChart,
  CloudUpload
} from '@mui/icons-material';

interface NodePaletteProps {
  onNodeSelect: (node: any) => void;
}

export const NodePalette: React.FC<NodePaletteProps> = ({ onNodeSelect }) => {
  const nodeCategories = [
    {
      title: 'المشغلات (Triggers)',
      icon: <PlayArrow />,
      nodes: [
        { id: 'email-received', name: 'وصول بريد إلكتروني', icon: <Email />, color: '#1976d2' },
        { id: 'whatsapp-message', name: 'رسالة واتساب', icon: <WhatsApp />, color: '#25d366' },
        { id: 'schedule', name: 'جدولة زمنية', icon: <Schedule />, color: '#ff9800' },
        { id: 'lead-status-change', name: 'تغيير حالة العميل', icon: <Notifications />, color: '#9c27b0' }
      ]
    },
    {
      title: 'الإجراءات (Actions)',
      icon: <Transform />,
      nodes: [
        { id: 'send-email', name: 'إرسال بريد إلكتروني', icon: <Email />, color: '#d32f2f' },
        { id: 'send-whatsapp', name: 'إرسال واتساب', icon: <WhatsApp />, color: '#25d366' },
        { id: 'create-sheet-row', name: 'إضافة صف Google Sheets', icon: <TableChart />, color: '#0f9d58' },
        { id: 'upload-drive', name: 'رفع ملف Google Drive', icon: <CloudUpload />, color: '#4285f4' },
        { id: 'slack-notification', name: 'إشعار Slack', icon: <Notifications />, color: '#4a154b' }
      ]
    },
    {
      title: 'المعالجة (Processing)',
      icon: <Transform />,
      nodes: [
        { id: 'filter', name: 'فلترة البيانات', icon: <FilterList />, color: '#795548' },
        { id: 'transform', name: 'تحويل البيانات', icon: <Transform />, color: '#607d8b' },
        { id: 'condition', name: 'شرط منطقي', icon: <CallSplit />, color: '#ff5722' },
        { id: 'loop', name: 'حلقة تكرار', icon: <Loop />, color: '#3f51b5' }
      ]
    },
    {
      title: 'التخزين (Storage)',
      icon: <Storage />,
      nodes: [
        { id: 'save-database', name: 'حفظ في قاعدة البيانات', icon: <Storage />, color: '#2e7d32' },
        { id: 'read-database', name: 'قراءة من قاعدة البيانات', icon: <Storage />, color: '#388e3c' }
      ]
    }
  ];

  const handleNodeDrag = (node: any) => {
    onNodeSelect(node);
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflow: 'auto' }}>
      <Typography variant="h6" gutterBottom>
        عناصر الأتمتة
      </Typography>
      
      {nodeCategories.map((category, index) => (
        <Accordion key={index} defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box display="flex" alignItems="center">
              {category.icon}
              <Typography sx={{ ml: 1 }}>{category.title}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails sx={{ p: 0 }}>
            <List dense>
              {category.nodes.map((node) => (
                <ListItem
                  key={node.id}
                  button
                  draggable
                  onDragStart={() => handleNodeDrag(node)}
                  onClick={() => handleNodeDrag(node)}
                  sx={{
                    borderRadius: 1,
                    mb: 0.5,
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Box
                      sx={{
                        color: node.color,
                        display: 'flex',
                        alignItems: 'center'
                      }}
                    >
                      {node.icon}
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={node.name}
                    primaryTypographyProps={{
                      fontSize: '0.875rem'
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}

      {/* أمثلة سريعة */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle2" gutterBottom>
          قوالب جاهزة
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Chip
            label="Meta Lead → WhatsApp"
            size="small"
            variant="outlined"
            clickable
          />
          <Chip
            label="Email → Google Sheets"
            size="small"
            variant="outlined"
            clickable
          />
          <Chip
            label="Lead Status → Slack"
            size="small"
            variant="outlined"
            clickable
          />
        </Box>
      </Box>
    </Box>
  );
};

export default NodePalette;