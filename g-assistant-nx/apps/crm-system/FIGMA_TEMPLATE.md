# 🎨 Figma Template Structure

## 📁 File Organization

```
CRM Design System
├── 🎨 Design Tokens
│   ├── Colors
│   ├── Typography
│   ├── Spacing
│   └── Shadows
├── 🧩 Components
│   ├── Buttons
│   ├── Cards
│   ├── Forms
│   ├── Navigation
│   └── Charts
├── 📱 Pages - Mobile
│   ├── Dashboard Mobile
│   ├── Customer List Mobile
│   └── Lead Management Mobile
├── 💻 Pages - Desktop
│   ├── Dashboard Desktop
│   ├── Customer Management
│   ├── Lead Pipeline
│   └── Campaign Tracker
└── 🔄 Prototypes
    ├── User Flow 1: Add Customer
    ├── User Flow 2: Manage Leads
    └── User Flow 3: View Reports
```

## 🎯 Artboard Sizes

### Mobile
- **iPhone 14 Pro**: 393 × 852px
- **Android Large**: 360 × 800px

### Tablet  
- **iPad**: 768 × 1024px
- **Android Tablet**: 800 × 1280px

### Desktop
- **Desktop Small**: 1280 × 720px
- **Desktop Large**: 1440 × 900px
- **Desktop XL**: 1920 × 1080px

## 🎨 Design Tokens Setup

### Colors (Auto Layout)
```
Primary Colors
├── Primary 50  #eff6ff
├── Primary 500 #3b82f6  ← Main
└── Primary 600 #2563eb

Status Colors  
├── Success #22c55e
├── Warning #f59e0b
├── Danger #ef4444
└── Info #06b6d4

Neutral Colors
├── White #ffffff
├── Gray 50 #f9fafb
├── Gray 100 #f3f4f6
├── Gray 500 #6b7280
└── Gray 900 #111827
```

### Typography Styles
```
Headings
├── H1 - 30px Bold
├── H2 - 24px Bold  
├── H3 - 20px SemiBold
└── H4 - 18px SemiBold

Body Text
├── Body Large - 16px Regular
├── Body - 14px Regular
└── Body Small - 12px Regular

UI Text
├── Button - 14px Medium
├── Caption - 12px Regular
└── Label - 12px Medium
```

## 🧩 Component Specifications

### KPI Card Component
```
Size: 280 × 120px
Padding: 20px
Border Radius: 8px
Shadow: 0 1px 3px rgba(0,0,0,0.1)

Elements:
├── Icon (24×24px) - Top Left
├── Title (Body Small, Gray 500)
├── Value (H2, Gray 900)
├── Change Badge (12px, Success/Danger)
└── Trend Icon (16×16px)
```

### Customer Card Component
```
Size: 320 × 180px (Desktop)
Size: 280 × 160px (Mobile)
Padding: 16px
Border Radius: 8px

Elements:
├── Avatar (48×48px) - Top Left
├── Name (Body Large, Gray 900)
├── Company (Body Small, Gray 500)
├── Status Badge (Top Right)
├── Contact Info (Email + Phone)
├── Last Activity (Caption, Gray 400)
└── Action Menu (3 dots, Top Right)
```

### Lead Card (Kanban)
```
Size: 280 × 140px
Padding: 16px
Border Radius: 6px
Border Left: 4px solid (Status Color)

Elements:
├── Lead Score Badge (Top Right)
├── Company Name (Body, Gray 900)
├── Contact Person (Body Small, Gray 600)
├── Value (H4, Primary 600)
├── Source Tag (Bottom Left)
└── Due Date (Caption, Gray 400)
```

## 📱 Layout Grids

### Mobile Grid
```
Columns: 4
Gutter: 16px
Margin: 16px
```

### Tablet Grid  
```
Columns: 8
Gutter: 20px
Margin: 24px
```

### Desktop Grid
```
Columns: 12
Gutter: 24px
Margin: 32px
Max Width: 1200px
```

## 🎯 Page Templates

### Dashboard Layout
```
Header (Fixed)
├── Logo + Title
├── Search Bar (Center)
└── User Menu + Notifications

Main Content
├── KPI Cards Row (4 cards)
├── Quick Actions Bar
├── Charts Section (2 columns)
└── Recent Activities (Full width)

Sidebar (Desktop only)
├── Navigation Menu
└── Quick Stats
```

### Customer List Layout
```
Header
├── Page Title
├── Search & Filters
└── Action Buttons

Content Area
├── View Toggle (Grid/List)
├── Sort & Filter Options
└── Customer Cards Grid
    ├── 4 columns (Desktop)
    ├── 2 columns (Tablet)  
    └── 1 column (Mobile)
```

## 🔄 Interactive States

### Button States
```
Default: Primary 500 background
Hover: Primary 600 background + lift shadow
Active: Primary 700 background
Disabled: Gray 300 background + Gray 400 text
Loading: Spinner + disabled state
```

### Card States
```
Default: White background + subtle shadow
Hover: Lift shadow + slight scale
Selected: Primary 50 background + Primary 500 border
Loading: Skeleton animation
```

## 📊 Chart Specifications

### Pipeline Chart
```
Type: Horizontal Funnel
Colors: Primary gradient
Height: 300px
Animation: Slide in from left
```

### Performance Chart
```
Type: Line + Bar combo
Colors: Primary (line) + Success (bars)
Height: 400px
Grid: Light gray dotted
```

## 🎨 Export Settings

### Icons
- Format: SVG
- Size: 24×24px (default)
- Stroke: 2px
- Style: Outline

### Images  
- Format: PNG
- Resolution: 2x for retina
- Compression: Optimized

### Assets
- Format: SVG (icons), PNG (images)
- Naming: kebab-case
- Organization: By component/page

## 📋 Handoff Checklist

- [ ] All components documented
- [ ] Responsive breakpoints defined  
- [ ] Interactive states specified
- [ ] Animation timing noted
- [ ] Color values in CSS format
- [ ] Typography styles exported
- [ ] Icon library organized
- [ ] Asset naming consistent
- [ ] Developer notes added
- [ ] Prototype flows working