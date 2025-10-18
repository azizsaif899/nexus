# 🚀 دليل النشر الشامل
## Deployment Guide - Visual Workflow Automation

---

## 📋 نظرة عامة

هذا الدليل يشرح كيفية نشر تطبيق **نظام الأتمتة المرئية** في بيئات الإنتاج المختلفة.

---

## 🎯 خيارات النشر

### 1️⃣ Vercel (موصى به)
- ✅ نشر مجاني
- ✅ CDN عالمي
- ✅ HTTPS تلقائي
- ✅ CI/CD تلقائي

### 2️⃣ Netlify
- ✅ نشر مجاني
- ✅ سهل الاستخدام
- ✅ Serverless Functions

### 3️⃣ Docker
- ✅ تحكم كامل
- ✅ قابل للتوسع
- ✅ يعمل في أي مكان

### 4️⃣ VPS (Linux Server)
- ✅ خصوصية كاملة
- ✅ أداء عالي
- ✅ تكلفة منخفضة

---

## 🚀 النشر على Vercel

### الطريقة 1: عبر واجهة Vercel

1. **إنشاء حساب**
   - اذهب إلى [vercel.com](https://vercel.com)
   - سجّل دخول بـ GitHub

2. **استيراد المشروع**
   ```
   New Project → Import Git Repository → اختر المشروع
   ```

3. **التكوين**
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **متغيرات البيئة**
   ```
   VITE_ACTIVEPIECES_API_URL=https://your-activepieces.com/api/v1
   VITE_ACTIVEPIECES_API_KEY=your-api-key
   ```

5. **النشر**
   - انقر على Deploy
   - انتظر 2-3 دقائق
   - ✅ جاهز!

### الطريقة 2: عبر Vercel CLI

```bash
# 1. ثبّت Vercel CLI
npm install -g vercel

# 2. تسجيل الدخول
vercel login

# 3. النشر
vercel

# 4. للإنتاج
vercel --prod
```

---

## 🚀 النشر على Netlify

### الطريقة 1: عبر واجهة Netlify

1. **إنشاء حساب**
   - اذهب إلى [netlify.com](https://netlify.com)
   - سجّل دخول بـ GitHub

2. **استيراد المشروع**
   ```
   Add New Site → Import from Git → اختر المشروع
   ```

3. **التكوين**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

4. **متغيرات البيئة**
   ```
   Site Settings → Environment Variables
   
   VITE_ACTIVEPIECES_API_URL=https://your-activepieces.com/api/v1
   VITE_ACTIVEPIECES_API_KEY=your-api-key
   ```

5. **النشر**
   - انقر على Deploy
   - ✅ جاهز!

### الطريقة 2: عبر Netlify CLI

```bash
# 1. ثبّت Netlify CLI
npm install -g netlify-cli

# 2. تسجيل الدخول
netlify login

# 3. Initialize
netlify init

# 4. النشر
netlify deploy --prod
```

### إنشاء netlify.toml

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

---

## 🐳 النشر عبر Docker

### إنشاء Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### إنشاء nginx.conf

```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

### إنشاء .dockerignore

```
node_modules
dist
.git
.env
.env.local
*.log
```

### بناء وتشغيل

```bash
# بناء Image
docker build -t workflow-automation .

# تشغيل Container
docker run -d -p 80:80 --name workflow-app workflow-automation

# أو باستخدام docker-compose
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
```

---

## 🖥️ النشر على VPS (Ubuntu/Debian)

### 1. الإعداد الأولي

```bash
# تحديث النظام
sudo apt update && sudo apt upgrade -y

# تثبيت Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# تثبيت Nginx
sudo apt install -y nginx

# تثبيت PM2
sudo npm install -g pm2
```

### 2. نسخ المشروع

```bash
# إنشاء مجلد
sudo mkdir -p /var/www/workflow-automation
cd /var/www/workflow-automation

# نسخ الملفات (من جهازك المحلي)
scp -r * user@server:/var/www/workflow-automation/

# أو عبر Git
git clone https://github.com/your-repo/workflow-automation.git .
```

### 3. التثبيت والبناء

```bash
# تثبيت التبعيات
npm install

# بناء للإنتاج
npm run build
```

### 4. تكوين Nginx

```bash
# إنشاء ملف التكوين
sudo nano /etc/nginx/sites-available/workflow-automation
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    root /var/www/workflow-automation/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Static files
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
}
```

```bash
# تفعيل الموقع
sudo ln -s /etc/nginx/sites-available/workflow-automation /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL بـ Let's Encrypt

```bash
# تثبيت Certbot
sudo apt install -y certbot python3-certbot-nginx

# الحصول على شهادة
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# تجديد تلقائي
sudo systemctl enable certbot.timer
```

---

## 🔒 الأمان

### 1. متغيرات البيئة

```bash
# إنشاء .env.production
cat > .env.production << EOF
VITE_ACTIVEPIECES_API_URL=https://your-activepieces.com/api/v1
VITE_ACTIVEPIECES_API_KEY=your-production-api-key
EOF

# تأمين الملف
chmod 600 .env.production
```

### 2. Firewall

```bash
# UFW (Ubuntu)
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Security Headers (Nginx)

```nginx
# في ملف nginx config
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## 📊 المراقبة

### PM2 Monitoring

```bash
# عرض الحالة
pm2 status

# عرض Logs
pm2 logs

# عرض المراقبة
pm2 monit
```

### Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 CI/CD مع GitHub Actions

### إنشاء .github/workflows/deploy.yml

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Build
        run: npm run build
        env:
          VITE_ACTIVEPIECES_API_URL: ${{ secrets.ACTIVEPIECES_API_URL }}
          VITE_ACTIVEPIECES_API_KEY: ${{ secrets.ACTIVEPIECES_API_KEY }}
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## ✅ قائمة التحقق قبل النشر

- [ ] تحديث package.json (version, name, etc.)
- [ ] إنشاء .env.production
- [ ] اختبار البناء المحلي (`npm run build`)
- [ ] اختبار معاينة البناء (`npm run preview`)
- [ ] تحديث README.md
- [ ] حذف console.log
- [ ] تحديث CHANGELOG.md
- [ ] إنشاء Git tag
- [ ] اختبار على بيئة staging أولاً
- [ ] تفعيل HTTPS
- [ ] تكوين DNS بشكل صحيح

---

## 🐛 استكشاف الأخطاء

### المشكلة: صفحة بيضاء بعد النشر

**الحل:**
```bash
# تحقق من console في المتصفح
# تأكد من baseUrl في vite.config.ts
base: '/',
```

### المشكلة: متغيرات البيئة لا تعمل

**الحل:**
- تأكد من أن المتغيرات تبدأ بـ `VITE_`
- أعد البناء بعد تغيير المتغيرات
- في Vercel/Netlify: أعد deploy بعد تغيير Environment Variables

### المشكلة: 404 عند Refresh

**الحل:**
- تأكد من تكوين SPA fallback في Nginx
- أو أضف `_redirects` في Netlify:
```
/*  /index.html  200
```

---

## 📚 الموارد

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Docs](https://vercel.com/docs)
- [Netlify Docs](https://docs.netlify.com/)
- [Docker Docs](https://docs.docker.com/)

---

**آخر تحديث:** 2025-01-09  
**الإصدار:** 3.3.0
