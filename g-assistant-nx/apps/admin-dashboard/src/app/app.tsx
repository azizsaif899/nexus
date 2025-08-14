import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CRMDashboard from '../components/crm/CRMDashboard';

export function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/crm/dashboard" replace />} />
          <Route path="/crm/dashboard" element={<CRMDashboard />} />
          <Route path="/crm/*" element={<CRMDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;