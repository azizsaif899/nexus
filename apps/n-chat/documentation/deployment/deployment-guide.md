# 🚀 دليل النشر - Deployment Guide

## 📋 نظرة عامة على النشر

### 🎯 منصات النشر المدعومة
- **Vercel** (مفضل) - تحسين تلقائي لـ Next.js
- **Firebase Hosting** - تكامل مع Firebase services
- **Netlify** - بديل موثوق
- **Docker** - نشر مخصص
- **AWS/GCP/Azure** - حلول المؤسسات

### 🏗️ بيئات النشر
- **Development** - للتطوير المحلي
- **Staging** - للاختبار
- **Production** - للمستخدمين النهائيين

---

## 🌐 النشر على Vercel (مفضل)

### 1️⃣ الإعداد الأولي

#### تثبيت Vercel CLI
```bash
npm install -g vercel@latest
```

#### تسجيل الدخول
```bash
vercel login
```

#### ربط المشروع
```bash
# في مجلد المشروع
vercel link
```

### 2️⃣ تكوين متغيرات البيئة

#### في Vercel Dashboard
```bash
# الانتقال لصفحة المشروع > Settings > Environment Variables

# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# Gemini AI
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
GEMINI_API_KEY=your_gemini_key

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
NEXT_PUBLIC_APP_NAME=FlowCanvasAI
NEXT_PUBLIC_APP_VERSION=3.0.0

# Security
JWT_SECRET=your_super_secure_jwt_secret
ENCRYPTION_KEY=your_encryption_key

# Optional Services
SENDGRID_API_KEY=your_sendgrid_key
SENTRY_DSN=your_sentry_dsn
ANALYTICS_ID=your_analytics_id
```

### 3️⃣ ملف التكوين

#### vercel.json
```json
{
  "version": 2,
  "name": "flowcanvas-ai",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    },
    {
      "source": "/api/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "https://your-domain.vercel.app"
        },
        {
          "key": "Access-Control-Allow-Methods",
          "value": "GET, POST, PUT, DELETE, OPTIONS"
        },
        {
          "key": "Access-Control-Allow-Headers",
          "value": "Content-Type, Authorization"
        }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/home",
      "destination": "/",
      "permanent": true
    }
  ],
  "rewrites": [
    {
      "source": "/docs/:path*",
      "destination": "/documentation/:path*"
    }
  ]
}
```

### 4️⃣ النشر

#### نشر تجريبي
```bash
vercel --prod=false
```

#### نشر للإنتاج
```bash
vercel --prod
```

#### نشر مع domain مخصص
```bash
vercel --prod --scope your-team
```

### 5️⃣ تكوين Domain مخصص

#### في Vercel Dashboard
1. اذهب لـ **Domains** في إعدادات المشروع
2. أضف domain الخاص بك
3. اتبع التعليمات لتكوين DNS

#### تكوين DNS
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A
Name: @
Value: 76.76.19.19
```

---

## 🔥 النشر على Firebase Hosting

### 1️⃣ الإعداد

#### تثبيت Firebase CLI
```bash
npm install -g firebase-tools
```

#### تسجيل الدخول
```bash
firebase login
```

#### إنشاء مشروع Firebase
```bash
firebase projects:create flowcanvas-ai
firebase use flowcanvas-ai
```

### 2️⃣ تكوين Firebase

#### firebase.json
```json
{
  "hosting": {
    "public": "out",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "function": "api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "public, max-age=31536000, immutable"
          }
        ]
      },
      {
        "source": "sw.js",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache"
          }
        ]
      }
    ],
    "cleanUrls": true,
    "trailingSlash": false
  },
  "functions": {
    "source": "functions",
    "runtime": "nodejs18"
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  },
  "storage": {
    "rules": "storage.rules"
  }
}
```

### 3️⃣ تعديل Next.js للـ Static Export

#### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  env: {
    NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    // ... باقي المتغيرات
  }
}

module.exports = nextConfig
```

### 4️⃣ بناء ونشر

#### بناء للإنتاج
```bash
npm run build
```

#### النشر
```bash
firebase deploy
```

#### نشر hosting فقط
```bash
firebase deploy --only hosting
```

---

## 🐳 النشر باستخدام Docker

### 1️⃣ إنشاء Dockerfile

#### Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY yarn.lock* ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Set ownership
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Start application
CMD ["node", "server.js"]
```

#### .dockerignore
```
node_modules
.next
.git
*.md
.env*
.vercel
.DS_Store
coverage
test-results
playwright-report
```

### 2️⃣ Docker Compose للتطوير

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_FIREBASE_API_KEY=${FIREBASE_API_KEY}
      - NEXT_PUBLIC_FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./logs:/app/logs
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

volumes:
  logs:
```

### 3️⃣ إعداد Nginx

#### nginx.conf
```nginx
events {
    worker_connections 1024;
}

http {
    upstream app {
        server app:3000;
    }

    server {
        listen 80;
        server_name your-domain.com;
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name your-domain.com;

        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;

        location / {
            proxy_pass http://app;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

---

## ⚙️ CI/CD Pipeline

### 1️⃣ GitHub Actions

#### .github/workflows/deploy.yml
```yaml
name: 🚀 Deploy FlowCanvasAI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: 18

jobs:
  test:
    name: 🧪 Test & Build
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        
      - name: 📦 Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          
      - name: 📚 Install dependencies
        run: npm ci
        
      - name: 🔍 Lint code
        run: npm run lint
        
      - name: 🧪 Run tests
        run: npm run test
        
      - name: 📊 Type check
        run: npm run type-check
        
      - name: 🏗️ Build application
        run: npm run build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          NEXT_PUBLIC_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}

  deploy-staging:
    name: 🎭 Deploy to Staging
    runs-on: ubuntu-latest
    needs: test
    if: github.event_name == 'pull_request'
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        
      - name: 🚀 Deploy to Vercel (Preview)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          github-comment: true

  deploy-production:
    name: 🌟 Deploy to Production
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        
      - name: 🚀 Deploy to Vercel (Production)
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          
      - name: 📧 Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          channel: '#deployments'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
        if: always()

  security-scan:
    name: 🔒 Security Scan
    runs-on: ubuntu-latest
    
    steps:
      - name: 📥 Checkout
        uses: actions/checkout@v4
        
      - name: 🔍 Run security audit
        run: npm audit --audit-level moderate
        
      - name: 🛡️ Run CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          languages: typescript
```

### 2️⃣ Deployment Scripts

#### scripts/deploy.sh
```bash
#!/bin/bash

set -e

echo "🚀 Starting deployment process..."

# Environment check
if [ -z "$VERCEL_TOKEN" ]; then
    echo "❌ Error: VERCEL_TOKEN is not set"
    exit 1
fi

# Build and test
echo "🏗️ Building application..."
npm run build

echo "🧪 Running tests..."
npm run test

echo "📊 Checking types..."
npm run type-check

# Deploy
echo "🚀 Deploying to Vercel..."
vercel --prod --token $VERCEL_TOKEN

echo "✅ Deployment completed successfully!"

# Health check
echo "🏥 Running health check..."
sleep 10
curl -f https://flowcanvas-ai.vercel.app/api/health || {
    echo "❌ Health check failed!"
    exit 1
}

echo "🎉 Deployment successful and healthy!"
```

---

## 📊 مراقبة النشر

### 1️⃣ Health Checks

#### app/api/health/route.ts
```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    status: 'healthy',
    version: process.env.NEXT_PUBLIC_APP_VERSION || '3.0.0',
    environment: process.env.NODE_ENV,
    services: {
      database: await checkDatabase(),
      ai: await checkAI(),
      storage: await checkStorage()
    },
    performance: {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      loadTime: await measureLoadTime()
    }
  };

  const isHealthy = Object.values(healthCheck.services).every(
    service => service.status === 'healthy'
  );

  return NextResponse.json(healthCheck, {
    status: isHealthy ? 200 : 503
  });
}

async function checkDatabase() {
  try {
    // Test Firebase connection
    await testFirebaseConnection();
    return { status: 'healthy', responseTime: '< 100ms' };
  } catch (error) {
    return { status: 'unhealthy', error: error.message };
  }
}
```

### 2️⃣ Monitoring مع Sentry

#### sentry.client.config.ts
```typescript
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['localhost', /^https:\/\/flowcanvas-ai\.vercel\.app/]
    })
  ]
});
```

### 3️⃣ Performance Monitoring

#### lib/analytics.ts
```typescript
export const trackDeployment = async (version: string, environment: string) => {
  await analytics.track('Deployment', {
    version,
    environment,
    timestamp: new Date().toISOString(),
    buildTime: process.env.BUILD_TIME,
    deployTime: Date.now()
  });
};

export const trackPerformance = async (metrics: WebVitals) => {
  await analytics.track('Performance', metrics);
};
```

---

## 🔧 البيئات المختلفة

### Development
```bash
# .env.development
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
DEBUG=true
```

### Staging
```bash
# .env.staging
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging-flowcanvas-ai.vercel.app
NEXT_PUBLIC_API_URL=https://staging-flowcanvas-ai.vercel.app/api
DEBUG=false
```

### Production
```bash
# .env.production
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://flowcanvas-ai.vercel.app
NEXT_PUBLIC_API_URL=https://flowcanvas-ai.vercel.app/api
DEBUG=false
SENTRY_ENVIRONMENT=production
```

---

## 🚨 استكشاف مشاكل النشر

### مشاكل شائعة وحلولها

#### 1. Build Failures
```bash
# Clear cache
npm run clean
rm -rf .next node_modules package-lock.json
npm install

# Check environment variables
vercel env ls

# Test build locally
npm run build
```

#### 2. Environment Variables
```bash
# Check if variables are set
vercel env ls

# Add missing variable
vercel env add VARIABLE_NAME production

# Pull environment variables
vercel env pull .env.local
```

#### 3. Performance Issues
```bash
# Analyze bundle
npm run analyze

# Check Core Web Vitals
lighthouse https://your-domain.com

# Monitor performance
curl -w "@curl-format.txt" -o /dev/null your-domain.com
```

### Rollback Strategy
```bash
# List deployments
vercel ls

# Rollback to previous
vercel rollback [deployment-url]

# Promote specific deployment
vercel promote [deployment-url]
```

---

## 📞 الدعم والمساعدة

### للدعم التقني
- **Email:** deployment@flowcanvas-ai.com
- **Discord:** [قناة النشر](https://discord.gg/flowcanvas-deployment)
- **Status Page:** [status.flowcanvas-ai.com](https://status.flowcanvas-ai.com)

### موارد مفيدة
- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Docker Documentation](https://docs.docker.com)

---

*🚀 النشر الناجح يتطلب تخطيط دقيق ومراقبة مستمرة*