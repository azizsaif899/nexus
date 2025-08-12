import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ModelSelectionStats } from '../features/analytics/ModelSelectionStats';

const Dashboard = () => (
  <div className="dashboard">
    <h1>🎨 AzizSys Admin Dashboard</h1>
    <div className="dashboard-grid">
      <div className="card">
        <h3>📊 إحصائيات النظام</h3>
        <p>✅ النظام يعمل بكفاءة عالية</p>
        <p>🤖 5 وكلاء ذكيين نشطين</p>
        <p>📱 3 واجهات متاحة</p>
      </div>
      <div className="card">
        <h3>🔗 تكامل Odoo</h3>
        <p>✅ متصل ويعمل</p>
        <p>📋 العملاء المحتملين: 25</p>
        <p>💰 أوامر البيع: 12</p>
      </div>
      <div className="card">
        <h3>🧠 الذكاء الاصطناعي</h3>
        <p>✅ Gemini AI متصل</p>
        <p>🎯 اختيار النماذج الذكي</p>
        <p>🔊 تحويل النص إلى كلام</p>
      </div>
    </div>
  </div>
);

const ProjectOverview = () => (
  <div className="project-overview">
    <h1>🚀 نظرة عامة على المشروع</h1>
    <div className="project-stats">
      <div className="stat-card">
        <h3>📦 المكونات</h3>
        <ul>
          <li>✅ 7 تطبيقات متكاملة</li>
          <li>✅ 15 حزمة متخصصة</li>
          <li>✅ 5 وكلاء ذكيين</li>
          <li>✅ نظام إصلاح ذاتي</li>
        </ul>
      </div>
      <div className="stat-card">
        <h3>🔗 التكاملات</h3>
        <ul>
          <li>✅ Odoo CRM</li>
          <li>✅ BigQuery Analytics</li>
          <li>✅ WhatsApp Business</li>
          <li>✅ Google Sheets</li>
        </ul>
      </div>
      <div className="stat-card">
        <h3>🎯 الميزات</h3>
        <ul>
          <li>✅ جلسات تفاعلية حية</li>
          <li>✅ رسوم بيانية ديناميكية</li>
          <li>✅ تحديثات فورية</li>
          <li>✅ تحليلات ذكية</li>
        </ul>
      </div>
    </div>
  </div>
);

const SystemHealth = () => (
  <div className="system-health">
    <h1>🏥 صحة النظام</h1>
    <div className="health-indicators">
      <div className="health-card healthy">
        <h3>🟢 API Server</h3>
        <p>حالة: متاح</p>
        <p>المنفذ: 3000</p>
        <p>الاستجابة: 45ms</p>
      </div>
      <div className="health-card healthy">
        <h3>🟢 Admin Dashboard</h3>
        <p>حالة: متاح</p>
        <p>المنفذ: 4200</p>
        <p>المستخدمين: 1</p>
      </div>
      <div className="health-card healthy">
        <h3>🟢 Web Chatbot</h3>
        <p>حالة: متاح</p>
        <p>المنفذ: 4201</p>
        <p>الجلسات: 0</p>
      </div>
      <div className="health-card healthy">
        <h3>🟢 Gemini Backend</h3>
        <p>حالة: متاح</p>
        <p>المنفذ: 8000</p>
        <p>النماذج: 3</p>
      </div>
    </div>
  </div>
);

export function App() {
  return (
    <Router>
      <div className="app">
        <nav className="sidebar">
          <div className="logo">
            <h2>🚀 AzizSys</h2>
            <p>AI Assistant v2.0</p>
          </div>
          <ul className="nav-menu">
            <li><Link to="/">🏠 الرئيسية</Link></li>
            <li><Link to="/project">📊 المشروع</Link></li>
            <li><Link to="/health">🏥 صحة النظام</Link></li>
            <li><Link to="/analytics">📈 التحليلات</Link></li>
            <li><Link to="/odoo">🔗 Odoo</Link></li>
            <li><Link to="/ai">🤖 الذكاء الاصطناعي</Link></li>
          </ul>
          <div className="nav-footer">
            <p>🌐 الواجهات:</p>
            <a href="http://localhost:4201" target="_blank">💬 Chatbot</a>
            <a href="http://localhost:3000/api/docs" target="_blank">📚 API Docs</a>
          </div>
        </nav>
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/project" element={<ProjectOverview />} />
            <Route path="/health" element={<SystemHealth />} />
            <Route path="/analytics" element={<ModelSelectionStats />} />
            <Route path="/odoo" element={<div><h1>🔗 Odoo Integration</h1><p>تكامل Odoo يعمل بكفاءة</p></div>} />
            <Route path="/ai" element={<div><h1>🤖 AI Engine</h1><p>محرك الذكاء الاصطناعي نشط</p></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;