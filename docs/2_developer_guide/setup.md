# 🛠️ إعداد بيئة التطوير - دليل احترافي

> **الهدف:** توفير نقطة بداية موحدة وخالية من الأخطاء لكل مطور ينضم للمشروع

## 📋 قائمة التحقق الأساسية

### البرامج المطلوبة
| البرنامج | الإصدار | التحقق | رابط التحميل |
|----------|---------|--------|---------------|
| Node.js | >= 18.0.0 | `node --version` | [nodejs.org](https://nodejs.org/) |
| pnpm | >= 8.0.0 | `pnpm --version` | `npm install -g pnpm` |
| Git | أحدث إصدار | `git --version` | [git-scm.com](https://git-scm.com/) |
| Google Clasp | أحدث إصدار | `clasp --version` | `npm install -g @google/clasp` |
| Firebase CLI | أحدث إصدار | `firebase --version` | `npm install -g firebase-tools` |

### حسابات وخدمات مطلوبة
- [ ] **حساب Google Cloud** مع تفعيل APIs:
  - [ ] Vertex AI API
  - [ ] BigQuery API  
  - [ ] Google Sheets API
  - [ ] Apps Script API
- [ ] **مفتاح Gemini API** من [Google AI Studio](https://makersuite.google.com/)
- [ ] **حساب GitHub** مع صلاحيات الكتابة على المستودع
- [ ] **امتدادات VSCode الموصى بها:**
  - [ ] [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
  - [ ] [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [ ] [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
  - [ ] [Turborepo](https://marketplace.visualstudio.com/items?itemName=Turborepo.turborepo)

## 🚀 خطوات التثبيت السريع

### 1. استنساخ المشروع
```bash
# استنساخ المستودع
git clone https://github.com/azizsaif899/g-assistant.git
cd g-assistant

# التبديل إلى Monorepo الجديد
cd monorepo-new
```

### 2. تثبيت التبعيات
```bash
# تثبيت جميع التبعيات في Monorepo
pnpm install

# التحقق من التثبيت
pnpm turbo build --dry-run
```

### 3. إعداد متغيرات البيئة

#### إنشاء ملفات البيئة
```bash
# نسخ القوالب
cp .env.example .env.development
cp .env.example .env.staging  
cp .env.example .env.production
```

#### ملء المتغيرات المطلوبة
```env
# .env.development
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key_here
GOOGLE_CLOUD_PROJECT_ID=your_project_id
FIREBASE_PROJECT_ID=your_firebase_project

# Database
DATABASE_URL=postgresql://localhost:5432/g_assistant_dev

# APIs
OPENAI_API_KEY=your_openai_key_optional
ANTHROPIC_API_KEY=your_anthropic_key_optional

# Security
JWT_SECRET=your_jwt_secret_here
ENCRYPTION_KEY=your_32_char_encryption_key

# Monitoring
SENTRY_DSN=your_sentry_dsn_optional
LOG_LEVEL=debug
```

## 🔐 إدارة الأسرار المتقدمة

### للتطوير المحلي
```bash
# استخدام Google Secret Manager
gcloud secrets create gemini-api-key --data-file=- <<< "your_api_key"

# أو استخدام dotenv-vault
npx dotenv-vault new
npx dotenv-vault push
```

### للإنتاج
- **Google Secret Manager** للبيئة السحابية
- **GitHub Secrets** للـ CI/CD
- **Kubernetes Secrets** للنشر على Kubernetes

## 🔧 إعداد Google Cloud

### 1. إنشاء مشروع جديد
```bash
# إنشاء مشروع
gcloud projects create g-assistant-prod --name="G-Assistant Production"

# تعيين المشروع الافتراضي
gcloud config set project g-assistant-prod
```

### 2. تفعيل APIs المطلوبة
```bash
# تفعيل جميع APIs دفعة واحدة
gcloud services enable \
  aiplatform.googleapis.com \
  bigquery.googleapis.com \
  sheets.googleapis.com \
  script.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com
```

### 3. إنشاء Service Account
```bash
# إنشاء حساب خدمة
gcloud iam service-accounts create g-assistant-service \
  --display-name="G-Assistant Service Account"

# منح الصلاحيات
gcloud projects add-iam-policy-binding g-assistant-prod \
  --member="serviceAccount:g-assistant-service@g-assistant-prod.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user"
```

## 🧪 التحقق من الإعداد

### اختبار البناء
```bash
# اختبار بناء جميع التطبيقات
pnpm turbo build

# اختبار تشغيل الاختبارات
pnpm turbo test

# اختبار فحص الكود
pnpm turbo lint
```

### اختبار الاتصال بالخدمات
```bash
# اختبار Gemini API
curl -H "Authorization: Bearer $GEMINI_API_KEY" \
  https://generativelanguage.googleapis.com/v1/models

# اختبار Google Cloud
gcloud auth application-default login
gcloud projects list
```

## 🎯 نصائح الإنتاجية

### إعداد VSCode المثالي
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true,
    "source.organizeImports": true
  },
  "turbo.useLocalTurbo": true,
  "files.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.turbo": true
  }
}
```

### اختصارات مفيدة
```bash
# إضافة aliases مفيدة
echo 'alias pdev="pnpm run dev"' >> ~/.bashrc
echo 'alias pbuild="pnpm turbo build"' >> ~/.bashrc
echo 'alias ptest="pnpm turbo test"' >> ~/.bashrc

# تحديث PATH للأدوات
export PATH="$PATH:./node_modules/.bin"
```

### Git Hooks المفيدة
```bash
# تثبيت Husky
pnpm add -D husky
npx husky install

# إضافة pre-commit hook
npx husky add .husky/pre-commit "pnpm turbo lint test"
```

## 🔍 استكشاف الأخطاء الشائعة

### مشكلة: pnpm install بطيء
```bash
# الحل: استخدام mirror محلي
pnpm config set registry https://registry.npmmirror.com/

# أو تنظيف cache
pnpm store prune
```

### مشكلة: TypeScript paths لا تعمل
```bash
# التحقق من tsconfig.base.json
cat tsconfig.base.json | grep "paths"

# إعادة بناء التبعيات
pnpm turbo build --force
```

### مشكلة: Clasp authentication
```bash
# إعادة تسجيل الدخول
clasp logout
clasp login

# التحقق من الصلاحيات
clasp list
```

## 📚 الخطوات التالية

بعد إكمال الإعداد:

1. 📖 راجع [هيكل مساحة العمل](./workspace_structure.md)
2. 🏗️ تعرف على [معمارية النظام](./architecture.md)
3. 📝 اقرأ [معايير الكود](./coding_standards.md)
4. 🧪 تعلم [دليل الاختبار](./testing.md)
5. 🚀 ابدأ أول مساهمة مع [دليل المساهمة](./contributing.md)

## 🆘 الحصول على المساعدة

إذا واجهت مشاكل:
1. تحقق من [دليل استكشاف الأخطاء](./troubleshooting.md)
2. ابحث في [GitHub Issues](https://github.com/azizsaif899/g-assistant/issues)
3. اطرح سؤالاً في [Discussions](https://github.com/azizsaif899/g-assistant/discussions)
4. راسل الفريق على Slack: `#g-assistant-dev`