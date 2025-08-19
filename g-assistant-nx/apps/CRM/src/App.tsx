import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RTLProvider } from './theme';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Switch,
  Box,
  Container 
} from '@mui/material';
import { 
  Dashboard as DashboardIcon,
  Brightness4,
  Brightness7 
} from '@mui/icons-material';

// استيراد صفحات CRM
import CRMAdvanced from './pages/crm-advanced';
import Customer360 from './pages/customer-360';
import CampaignTracker from './pages/campaign-tracker';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <RTLProvider darkMode={darkMode}>
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          {/* شريط التنقل العلوي */}
          <AppBar position="static">
            <Toolbar>
              <DashboardIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                نظام إدارة علاقات العملاء - CRM
              </Typography>
              
              {/* مفتاح الوضع الداكن */}
              <IconButton color="inherit" onClick={toggleDarkMode}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
              <Switch
                checked={darkMode}
                onChange={toggleDarkMode}
                color="default"
              />
            </Toolbar>
          </AppBar>

          {/* المحتوى الرئيسي */}
          <Container maxWidth="xl" sx={{ mt: 3, mb: 3 }}>
            <Routes>
              <Route path="/" element={<CRMAdvanced />} />
              <Route path="/dashboard" element={<CRMAdvanced />} />
              <Route path="/customer/:id" element={<Customer360 />} />
              <Route path="/campaigns" element={<CampaignTracker />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </RTLProvider>
  );
};

export default App;