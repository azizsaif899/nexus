# ⚙️ إعداد CI/CD

## نظرة عامة

نظام التكامل المستمر والنشر المستمر (CI/CD) يضمن جودة الكود والنشر الآمن لجميع مكونات G-Assistant.

## GitHub Actions Workflows

### 1. Quality Gate (quality-gate.yml)
```yaml
name: 🛡️ Quality Gate

on:
  pull_request:
    branches: [ main, develop ]
  push:
    branches: [ main, develop ]

jobs:
  lint-and-format:
    name: 🔍 Lint & Format Check
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run ESLint
      run: npm run lint
      
    - name: Check Prettier formatting
      run: npx prettier --check .

  security-check:
    name: 🔒 Security Audit
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run security audit
      run: npm audit --audit-level=critical

  test:
    name: 🧪 Run Tests
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Run tests
      run: npm test

  build:
    name: 🔨 Build Check
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build all packages
      run: npm run build
```

### 2. Deployment (deploy.yml)
```yaml
name: 🚀 Deploy

on:
  push:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  deploy-sidebar:
    name: 📱 Deploy Sidebar
    runs-on: ubuntu-latest
    if: github.ref === 'refs/heads/main'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build sidebar
      run: |
        cd apps/sidebar
        npm run build
        
    - name: Deploy to Google Apps Script
      env:
        CLASP_CREDENTIALS: ${{ secrets.CLASP_CREDENTIALS }}
        SCRIPT_ID: ${{ secrets.SCRIPT_ID }}
      run: |
        cd apps/sidebar
        echo "$CLASP_CREDENTIALS" > ~/.clasprc.json
        npx clasp push --force

  deploy-web:
    name: 🌐 Deploy Web App
    runs-on: ubuntu-latest
    if: github.event_name === 'release'
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build web app
      run: |
        cd apps/web
        npm run build
        
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: apps/web
        vercel-args: '--prod'
```

## إعداد الأسرار (Secrets)

### في GitHub Repository Settings

#### للـ Sidebar
```
CLASP_CREDENTIALS = {
  "token": {
    "access_token": "...",
    "refresh_token": "...",
    "scope": "...",
    "token_type": "Bearer",
    "expiry_date": ...
  },
  "oauth2ClientSettings": {
    "clientId": "...",
    "clientSecret": "...",
    "redirectUri": "..."
  },
  "isLocalCreds": false
}

SCRIPT_ID = your_google_apps_script_id
```

#### للـ Web App
```
VERCEL_TOKEN = your_vercel_token
VERCEL_ORG_ID = your_vercel_org_id
VERCEL_PROJECT_ID = your_vercel_project_id
```

#### للـ API Keys
```
GEMINI_API_KEY = your_gemini_api_key
DATABASE_URL = your_database_url
```

## Branch Protection Rules

### للفرع main
```json
{
  "required_status_checks": {
    "strict": true,
    "contexts": [
      "lint-and-format",
      "security-check", 
      "test",
      "build"
    ]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "required_approving_review_count": 1,
    "dismiss_stale_reviews": true
  },
  "restrictions": null
}
```

## Local Development Hooks

### Pre-commit Hook (.husky/pre-commit)
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# تشغيل lint-staged
npx lint-staged

if [ $? -ne 0 ]; then
  echo "❌ Pre-commit checks failed. Please fix the issues and try again."
  exit 1
fi

echo "✅ Pre-commit checks passed."
```

### Lint-staged Configuration
```json
{
  "lint-staged": {
    "*.{js,ts,tsx,json,md}": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.{css,scss}": [
      "prettier --write"
    ]
  }
}
```

## Environment-specific Deployments

### Staging Environment
```yaml
deploy-staging:
  name: 🧪 Deploy to Staging
  runs-on: ubuntu-latest
  if: github.ref === 'refs/heads/develop'
  
  environment:
    name: staging
    url: https://staging.g-assistant.com
    
  steps:
    # ... deployment steps for staging
```

### Production Environment
```yaml
deploy-production:
  name: 🏭 Deploy to Production
  runs-on: ubuntu-latest
  if: github.event_name === 'release'
  
  environment:
    name: production
    url: https://g-assistant.com
    
  steps:
    # ... deployment steps for production
```

## Monitoring and Notifications

### Slack Notifications
```yaml
- name: Notify Slack on Success
  if: success()
  uses: 8398a7/action-slack@v3
  with:
    status: success
    text: '✅ Deployment successful!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}

- name: Notify Slack on Failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: failure
    text: '❌ Deployment failed!'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

## Performance Monitoring

### Lighthouse CI
```yaml
lighthouse-ci:
  name: 🔍 Lighthouse CI
  runs-on: ubuntu-latest
  
  steps:
  - name: Checkout code
    uses: actions/checkout@v4
    
  - name: Setup Node.js
    uses: actions/setup-node@v4
    with:
      node-version: '18'
      
  - name: Install dependencies
    run: npm ci
    
  - name: Build web app
    run: |
      cd apps/web
      npm run build
      
  - name: Run Lighthouse CI
    run: |
      npm install -g @lhci/cli@0.12.x
      lhci autorun
```

## Rollback Strategy

### Automatic Rollback
```yaml
rollback:
  name: 🔄 Rollback on Failure
  runs-on: ubuntu-latest
  if: failure()
  
  steps:
  - name: Rollback to Previous Version
    run: |
      # Rollback logic here
      echo "Rolling back to previous stable version..."
```

## Best Practices

### 1. Fast Feedback
- اجعل الـ CI pipeline سريعاً (< 10 دقائق)
- قم بتشغيل الاختبارات السريعة أولاً
- استخدم التخزين المؤقت للتبعيات

### 2. Security
- لا تعرض الأسرار في السجلات
- استخدم أقل الصلاحيات المطلوبة
- قم بمراجعة الأسرار بانتظام

### 3. Reliability
- اجعل الـ pipeline idempotent
- استخدم retry logic للعمليات الشبكية
- احتفظ بنسخ احتياطية قبل النشر

### 4. Monitoring
- راقب معدل نجاح الـ deployments
- اجمع metrics عن أوقات البناء
- اعرض حالة الـ CI في README