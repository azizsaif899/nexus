import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Search,
  Add,
  FilterList,
  Person,
  Phone,
  Email,
  WhatsApp,
  MoreVert
} from '@mui/icons-material';

const CustomersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // بيانات تجريبية للعملاء
  const customers = [
    {
      id: 1,
      name: 'أحمد محمد السعيد',
      email: 'ahmed@example.com',
      phone: '+966501234567',
      company: 'شركة التقنية المتقدمة',
      status: 'نشط',
      lastContact: '2024-01-15',
      value: 25000
    },
    {
      id: 2,
      name: 'فاطمة علي الزهراني',
      email: 'fatima@example.com',
      phone: '+966507654321',
      company: 'مؤسسة الابتكار',
      status: 'محتمل',
      lastContact: '2024-01-14',
      value: 15000
    },
    {
      id: 3,
      name: 'محمد عبدالله القحطاني',
      email: 'mohammed@example.com',
      phone: '+966509876543',
      company: 'شركة الرؤية الذكية',
      status: 'نشط',
      lastContact: '2024-01-13',
      value: 35000
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'نشط': return 'success';
      case 'محتمل': return 'warning';
      case 'غير نشط': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box>
      {/* رأس الصفحة */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          إدارة العملاء
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          size="large"
        >
          عميل جديد
        </Button>
      </Box>

      {/* شريط البحث والفلاتر */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="البحث عن العملاء..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<FilterList />}
                >
                  فلترة
                </Button>
                <Chip label="العملاء النشطين" clickable />
                <Chip label="العملاء المحتملين" clickable />
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* قائمة العملاء */}
      <Grid container spacing={3}>
        {customers.map((customer) => (
          <Grid item xs={12} md={6} lg={4} key={customer.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                  <Box display="flex" alignItems="center">
                    <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                      <Person />
                    </Avatar>
                    <Box>
                      <Typography variant="h6" component="div">
                        {customer.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {customer.company}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>

                <Box mb={2}>
                  <Chip 
                    label={customer.status}
                    color={getStatusColor(customer.status) as any}
                    size="small"
                  />
                </Box>

                <Box display="flex" flexDirection="column" gap={1} mb={2}>
                  <Box display="flex" alignItems="center">
                    <Email sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{customer.email}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Phone sx={{ mr: 1, fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{customer.phone}</Typography>
                  </Box>
                </Box>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2" color="textSecondary">
                    آخر تواصل: {customer.lastContact}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    {customer.value.toLocaleString('ar-SA')} ر.س
                  </Typography>
                </Box>

                <Box display="flex" gap={1} mt={2}>
                  <Button size="small" startIcon={<Phone />}>
                    اتصال
                  </Button>
                  <Button size="small" startIcon={<Email />}>
                    بريد
                  </Button>
                  <Button size="small" startIcon={<WhatsApp />} color="success">
                    واتساب
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default CustomersPage;