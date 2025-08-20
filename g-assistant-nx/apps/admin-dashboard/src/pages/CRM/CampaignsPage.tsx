import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  LinearProgress,
  IconButton
} from '@mui/material';
import {
  Add,
  Campaign,
  TrendingUp,
  Visibility,
  Edit,
  PlayArrow,
  Pause
} from '@mui/icons-material';

const CampaignsPage: React.FC = () => {
  const campaigns = [
    {
      id: 1,
      name: 'حملة العروض الشتوية',
      type: 'Meta Ads',
      status: 'نشطة',
      budget: 10000,
      spent: 6500,
      leads: 145,
      conversions: 23,
      startDate: '2024-01-01',
      endDate: '2024-01-31'
    },
    {
      id: 2,
      name: 'حملة المنتجات الجديدة',
      type: 'Google Ads',
      status: 'متوقفة',
      budget: 15000,
      spent: 12000,
      leads: 89,
      conversions: 18,
      startDate: '2023-12-15',
      endDate: '2024-01-15'
    },
    {
      id: 3,
      name: 'حملة البريد الإلكتروني',
      type: 'Email',
      status: 'مجدولة',
      budget: 5000,
      spent: 0,
      leads: 0,
      conversions: 0,
      startDate: '2024-02-01',
      endDate: '2024-02-28'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشطة': return 'success';
      case 'متوقفة': return 'error';
      case 'مجدولة': return 'info';
      default: return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Meta Ads': return '#1877f2';
      case 'Google Ads': return '#4285f4';
      case 'Email': return '#ea4335';
      default: return '#757575';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          إدارة الحملات
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          حملة جديدة
        </Button>
      </Box>

      <Grid container spacing={3}>
        {campaigns.map((campaign) => (
          <Grid item xs={12} md={6} lg={4} key={campaign.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Campaign sx={{ mr: 1, color: getTypeColor(campaign.type) }} />
                    <Typography variant="h6" component="div">
                      {campaign.name}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={0.5}>
                    <IconButton size="small">
                      <Visibility />
                    </IconButton>
                    <IconButton size="small">
                      <Edit />
                    </IconButton>
                    {campaign.status === 'نشطة' ? (
                      <IconButton size="small" color="error">
                        <Pause />
                      </IconButton>
                    ) : (
                      <IconButton size="small" color="success">
                        <PlayArrow />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Box display="flex" gap={1} mb={2}>
                  <Chip 
                    label={campaign.status}
                    color={getStatusColor(campaign.status) as any}
                    size="small"
                  />
                  <Chip 
                    label={campaign.type}
                    variant="outlined"
                    size="small"
                  />
                </Box>

                <Box mb={2}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="body2">الميزانية المستخدمة</Typography>
                    <Typography variant="body2">
                      {campaign.spent.toLocaleString('ar-SA')} / {campaign.budget.toLocaleString('ar-SA')} ر.س
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={(campaign.spent / campaign.budget) * 100}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                </Box>

                <Grid container spacing={2} mb={2}>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="primary">
                        {campaign.leads}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        عملاء محتملون
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box textAlign="center">
                      <Typography variant="h6" color="success.main">
                        {campaign.conversions}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        تحويلات
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    {campaign.startDate} - {campaign.endDate}
                  </Typography>
                  <Box display="flex" alignItems="center">
                    <TrendingUp sx={{ mr: 0.5, fontSize: 16, color: 'success.main' }} />
                    <Typography variant="body2" color="success.main">
                      {campaign.conversions > 0 ? ((campaign.conversions / campaign.leads) * 100).toFixed(1) : 0}%
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CampaignsPage;