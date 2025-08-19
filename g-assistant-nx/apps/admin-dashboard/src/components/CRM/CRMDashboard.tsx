import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  LinearProgress,
  Chip,
  Button,
  Fab
} from '@mui/material';
import {
  TrendingUp,
  People,
  Campaign,
  AttachMoney,
  Phone,
  Email,
  WhatsApp,
  AutoAwesome
} from '@mui/icons-material';
import { crmColors } from '../../theme';
import { WorkflowBuilder } from './WorkflowBuilder';

interface DashboardStats {
  totalCustomers: number;
  newLeads: number;
  activeCampaigns: number;
  monthlyRevenue: number;
  conversionRate: number;
  responseRate: number;
}

interface CRMDashboardProps {
  stats: DashboardStats;
}

const CRMDashboard: React.FC<CRMDashboardProps> = ({ stats }) => {
  const [workflowBuilderOpen, setWorkflowBuilderOpen] = useState(false);

  const statCards = [
    {
      title: 'إجمالي العملاء',
      value: stats.totalCustomers.toLocaleString('ar-SA'),
      icon: <People />,
      color: crmColors.primary.main,
      change: '+12%'
    },
    {
      title: 'عملاء محتملون جدد',
      value: stats.newLeads.toLocaleString('ar-SA'),
      icon: <TrendingUp />,
      color: crmColors.success.main,
      change: '+8%'
    },
    {
      title: 'حملات نشطة',
      value: stats.activeCampaigns.toLocaleString('ar-SA'),
      icon: <Campaign />,
      color: crmColors.warning.main,
      change: '+3%'
    },
    {
      title: 'الإيرادات الشهرية',
      value: `${stats.monthlyRevenue.toLocaleString('ar-SA')} ر.س`,
      icon: <AttachMoney />,
      color: crmColors.secondary.main,
      change: '+15%'
    }
  ];

  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="textSecondary" gutterBottom variant="body2">
                      {card.title}
                    </Typography>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
                      {card.value}
                    </Typography>
                    <Chip 
                      label={card.change} 
                      size="small" 
                      color="success" 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Avatar sx={{ bgcolor: card.color, width: 56, height: 56 }}>
                    {card.icon}
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معدل التحويل
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ mr: 2 }}>
                  {stats.conversionRate}%
                </Typography>
                <Chip label="+2.5%" size="small" color="success" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.conversionRate} 
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                معدل الاستجابة
              </Typography>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Typography variant="h4" sx={{ mr: 2 }}>
                  {stats.responseRate}%
                </Typography>
                <Chip label="+1.8%" size="small" color="success" />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.responseRate} 
                color="secondary"
                sx={{ height: 8, borderRadius: 4 }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          إجراءات سريعة
        </Typography>
        <Grid container spacing={2}>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Phone />}
              color="primary"
            >
              اتصال جديد
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<Email />}
              color="secondary"
            >
              إرسال بريد
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              startIcon={<WhatsApp />}
              color="success"
            >
              رسالة واتساب
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              startIcon={<AutoAwesome />}
              onClick={() => setWorkflowBuilderOpen(true)}
            >
              إنشاء أتمتة
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* زر الأتمتة المرئية */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          left: 24,
        }}
        onClick={() => setWorkflowBuilderOpen(true)}
      >
        <AutoAwesome />
      </Fab>

      {/* محرر الأتمتة المرئية */}
      <WorkflowBuilder
        open={workflowBuilderOpen}
        onClose={() => setWorkflowBuilderOpen(false)}
      />
    </Box>
  );
};

export default CRMDashboard;