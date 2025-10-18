# 🚀 Nexus AI Scripts Usage Guide

## 🎯 **Quick Start (Recommended)**

```bash
# Interactive manager (best option):
npm run manager

# Or direct start:
npm start
```

## 📋 **Available Scripts**

### 🎮 **Interactive Manager**
```bash
npm run manager
```
**Full interactive menu with all options**

### 🚀 **Development**
```bash
npm start              # Smart development server
npm run dev            # Standard vite dev
npm run check-port     # Check port 3000 status
```

### 🔧 **Maintenance**
```bash
npm run kill-port      # Kill processes on port 3000
npm run clear-cache    # Clean cache and temp files
```

### 🛠️ **Advanced (Node.js)**
```bash
node scripts/start-dev.js 3001        # Custom port
node scripts/kill-port.js 4000        # Kill specific port
node scripts/check-port.js 5000       # Check specific port
```

### 💻 **Legacy (Batch/PowerShell)**
```bash
.\scripts\NEXUS-MASTER.bat            # Windows batch menu
.\scripts\kill-port.bat 3000          # Windows kill port
.\scripts\clean-cache.bat             # Windows clean cache
```

## 🎯 **Recommended Workflow**

```bash
# 1. Start interactive manager:
npm run manager

# 2. Choose option 1 (Start Development Server)
# 3. Open http://localhost:3000
# 4. Develop your app!
```

## 🔍 **Troubleshooting**

```bash
# Port issues:
npm run check-port     # Check what's using port 3000
npm run kill-port      # Kill processes on port 3000

# Cache issues:
npm run clear-cache    # Clean all cache

# Full reset:
npm run manager        # Choose option 6 (Full Reset)
```

## 📊 **Script Comparison**

| Method | Platform | Features | Best For |
|--------|----------|----------|----------|
| `npm run manager` | Cross-platform | Interactive menu | **Recommended** |
| `npm start` | Cross-platform | Smart start | Quick development |
| `NEXUS-MASTER.bat` | Windows | Batch menu | Windows users |
| PowerShell scripts | Windows | Advanced features | Power users |

**Use `npm run manager` for the best experience! 🎉**