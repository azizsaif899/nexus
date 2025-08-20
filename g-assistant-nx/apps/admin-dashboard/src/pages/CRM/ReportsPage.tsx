import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Paper
} from '@mui/material';
import {
  Download,
  Assessment,
  TrendingUp,
  People,
  Campaign
} from '@mui/icons-material';

const ReportsPage: React.FC = () => {
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          التقارير والتحليلات
        </Typography>
        <Button
          variant="contained"
          startIcon={<Download />}
          size="large"
        >
          تصدير التقارير
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Assessment sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                تقرير الأداء العام
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                نظرة شاملة على أداء النظام والمبيعات
              </Typography>
              <Button variant="outlined" fullWidth>
                عرض التقرير
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 48, color: 'success.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                تقرير العملاء
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                تحليل سلوك العملاء ومعدلات التحويل
              </Typography>
              <Button variant="outlined" fullWidth>
                عرض التقرير
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Campaign sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                تقرير الحملات
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={2}>
                أداء الحملات التسويقية والعائد على الاستثمار
              </Typography>
              <Button variant="outlined" fullWidth>
                عرض التقرير
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 3, textAlign: 'center' }}>
        <TrendingUp sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          التحليلات المتقدمة قريباً
        </Typography>
        <Typography variant="body1" color="textSecondary">
          سيتم إضافة المزيد من التقارير والتحليلات المتقدمة في التحديثات القادمة
        </Typography>
      </Paper>
    </Box>
  );
};

export default ReportsPage;