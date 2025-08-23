# 🎨 هيكل التصميم - CRM Interface

## 📱 الصفحات الأساسية (بالأولوية)

### 1. 📊 Dashboard الرئيسي
```
/crm/dashboard
├── Header (Logo + User Menu + Notifications)
├── KPI Cards Row
│   ├── Total Customers
│   ├── Active Leads  
│   ├── Monthly Revenue
│   └── Conversion Rate
├── Quick Actions Bar
│   ├── Add Customer
│   ├── Create Lead
│   └── New Campaign
├── Charts Section (2 columns)
│   ├── Sales Pipeline Chart
│   └── Monthly Performance
└── Recent Activities List
```

### 2. 👥 Customer Management
```
/crm/customers
├── Search & Filter Bar
├── Action Buttons (Add, Export, Import)
├── Customer Cards Grid/List Toggle
└── Customer Card Components
    ├── Avatar + Name
    ├── Contact Info
    ├── Status Badge
    ├── Last Activity
    └── Quick Actions Menu
```

### 3. 🎯 Lead Management  
```
/crm/leads
├── Pipeline Stages (Kanban Board)
│   ├── New Leads
│   ├── Qualified
│   ├── Proposal
│   └── Closed Won/Lost
└── Lead Card (Draggable)
    ├── Lead Score Badge
    ├── Company + Contact
    ├── Value + Source
    └── Next Action
```

### 4. 📈 Campaign Tracker
```
/crm/campaigns
├── Campaign Summary Cards
├── Performance Metrics
├── Meta Ads Integration Panel
└── ROI Calculator
```

## 🎨 Design System

### Colors Palette
```css
:root {
  /* Primary */
  --primary-50: #eff6ff;
  --primary-500: #3b82f6;
  --primary-600: #2563eb;
  
  /* Success */
  --success-50: #f0fdf4;
  --success-500: #22c55e;
  
  /* Warning */
  --warning-50: #fffbeb;
  --warning-500: #f59e0b;
  
  /* Danger */
  --danger-50: #fef2f2;
  --danger-500: #ef4444;
  
  /* Gray Scale */
  --gray-50: #f9fafb;
  --gray-100: #f3f4f6;
  --gray-500: #6b7280;
  --gray-900: #111827;
}
```

### Typography Scale
```css
.text-xs { font-size: 0.75rem; }    /* 12px */
.text-sm { font-size: 0.875rem; }   /* 14px */
.text-base { font-size: 1rem; }     /* 16px */
.text-lg { font-size: 1.125rem; }   /* 18px */
.text-xl { font-size: 1.25rem; }    /* 20px */
.text-2xl { font-size: 1.5rem; }    /* 24px */
.text-3xl { font-size: 1.875rem; }  /* 30px */
```

### Component Sizes
```css
/* Buttons */
.btn-sm { padding: 0.5rem 1rem; }     /* Small */
.btn-md { padding: 0.75rem 1.5rem; }  /* Medium */
.btn-lg { padding: 1rem 2rem; }       /* Large */

/* Cards */
.card { border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }

/* Spacing */
.space-xs { margin: 0.25rem; }  /* 4px */
.space-sm { margin: 0.5rem; }   /* 8px */
.space-md { margin: 1rem; }     /* 16px */
.space-lg { margin: 1.5rem; }   /* 24px */
.space-xl { margin: 2rem; }     /* 32px */
```

## 📱 Responsive Breakpoints

```css
/* Mobile First */
.container {
  width: 100%;
  padding: 1rem;
}

/* Tablet */
@media (min-width: 768px) {
  .container { max-width: 768px; }
  .grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
}

/* Desktop */
@media (min-width: 1024px) {
  .container { max-width: 1024px; }
  .grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
  .grid-cols-4 { grid-template-columns: repeat(4, 1fr); }
}

/* Large Desktop */
@media (min-width: 1280px) {
  .container { max-width: 1280px; }
}
```

## 🧩 Component Library

### 1. KPI Card
```jsx
<KPICard
  title="Total Customers"
  value="1,234"
  change="+12%"
  trend="up"
  icon="users"
  color="primary"
/>
```

### 2. Customer Card
```jsx
<CustomerCard
  avatar="/avatar.jpg"
  name="أحمد محمد"
  company="شركة التقنية"
  email="ahmed@tech.com"
  phone="+966501234567"
  status="active"
  lastActivity="منذ يومين"
  value="25,000 ريال"
/>
```

### 3. Lead Card (Kanban)
```jsx
<LeadCard
  draggable
  leadScore={85}
  company="شركة جديدة"
  contact="سارة أحمد"
  value="50,000 ريال"
  source="Meta Ads"
  nextAction="اتصال متابعة"
  dueDate="2024-01-15"
/>
```

### 4. Status Badges
```jsx
<StatusBadge status="active" />    <!-- أخضر -->
<StatusBadge status="pending" />   <!-- أصفر -->
<StatusBadge status="inactive" />  <!-- رمادي -->
<StatusBadge status="closed" />    <!-- أحمر -->
```

## 📊 Charts & Visualizations

### 1. Sales Pipeline (Funnel Chart)
```jsx
<PipelineChart
  data={[
    { stage: "Leads", count: 100 },
    { stage: "Qualified", count: 75 },
    { stage: "Proposal", count: 50 },
    { stage: "Closed Won", count: 25 }
  ]}
/>
```

### 2. Performance Chart (Line/Bar)
```jsx
<PerformanceChart
  type="line"
  data={monthlyData}
  metrics={["revenue", "customers", "leads"]}
/>
```

## 🎯 User Flow Priority

```
1. Login → Dashboard (أول انطباع)
2. Dashboard → Customer List (الأكثر استخداماً)
3. Customer List → Customer Details (التفاصيل)
4. Dashboard → Add New Lead (إضافة سريعة)
5. Lead Management → Pipeline View (إدارة المبيعات)
```

## 📱 Mobile Optimizations

### Touch Targets
- الحد الأدنى: 44px × 44px
- المسافة بين الأزرار: 8px على الأقل
- Swipe gestures للكروت

### Mobile Navigation
```jsx
<MobileNav>
  <NavItem icon="dashboard" label="الرئيسية" />
  <NavItem icon="users" label="العملاء" />
  <NavItem icon="target" label="العملاء المحتملين" />
  <NavItem icon="chart" label="التقارير" />
  <NavItem icon="settings" label="الإعدادات" />
</MobileNav>
```

## 🎨 Animation Guidelines

```css
/* Smooth transitions */
.transition-all { transition: all 0.2s ease-in-out; }

/* Hover effects */
.card:hover { transform: translateY(-2px); }

/* Loading states */
.skeleton { animation: pulse 2s infinite; }

/* Page transitions */
.page-enter { opacity: 0; transform: translateX(20px); }
.page-enter-active { opacity: 1; transform: translateX(0); }
```

## 🔧 Development Workflow

1. **Design in Figma** → Export assets
2. **Build components** in Storybook
3. **Implement pages** with real data
4. **Test responsive** on devices
5. **Optimize performance** and accessibility

## 📋 Checklist للمصمم

- [ ] Dashboard wireframe
- [ ] Customer list design
- [ ] Lead kanban board
- [ ] Mobile responsive layouts
- [ ] Component library in Figma
- [ ] Color palette & typography
- [ ] Icon set selection
- [ ] Animation specifications
- [ ] Accessibility guidelines
- [ ] Dark mode considerations