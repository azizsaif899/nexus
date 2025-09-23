# 🔗 روابط التحميل المباشر لـ Firebase

## 📥 **الملفات الأساسية (5 ملفات فقط):**

### **1. Firebase Configuration:**
```bash
curl -o firebase.json https://raw.githubusercontent.com/azizsaif899/nexus/main/firebase.json
curl -o .firebaserc https://raw.githubusercontent.com/azizsaif899/nexus/main/.firebaserc
```

### **2. Environment Variables:**
```bash
curl -o .env.example https://raw.githubusercontent.com/azizsaif899/nexus/main/.env.example
```

### **3. Package Dependencies:**
```json
{
  "name": "firebase-mini",
  "version": "1.0.0",
  "dependencies": {
    "firebase": "^11.3.0",
    "firebase-admin": "^12.0.0",
    "firebase-functions": "^5.0.0",
    "@google/genai": "^0.3.0"
  }
}
```

### **4. TypeScript Config:**
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "lib": ["ES2020"],
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

## 🚀 **أوامر الإعداد السريع:**

### **إنشاء المشروع:**
```bash
mkdir firebase-mini && cd firebase-mini
npm init -y
npm install firebase firebase-admin firebase-functions @google/genai
```

### **تحميل الملفات:**
```bash
# Firebase configs
curl -o firebase.json https://raw.githubusercontent.com/azizsaif899/nexus/main/firebase.json
curl -o .firebaserc https://raw.githubusercontent.com/azizsaif899/nexus/main/.firebaserc

# Environment
curl -o .env.example https://raw.githubusercontent.com/azizsaif899/nexus/main/.env.example
cp .env.example .env
```

### **إنشاء البنية:**
```bash
mkdir -p config functions/src rules docs
touch config/firebase.config.ts
touch config/auth.config.ts
touch functions/src/index.ts
touch rules/firestore.rules
```

## 📋 **قائمة المهام السريعة:**

### **🔥 CRITICAL (2 ساعة):**
- [ ] إعداد Firebase project
- [ ] Auth configuration
- [ ] Firestore rules

### **⚡ HIGH (2 ساعة):**
- [ ] Cloud Functions setup
- [ ] Gemini AI integration
- [ ] Storage configuration

### **📊 MEDIUM (1 ساعة):**
- [ ] Testing مع emulators
- [ ] تصدير configs للـ INT

## 🎯 **النتيجة المطلوبة:**

### **ملفات للتسليم:**
```
deliverables/
├── firebase.config.ts       # للـ INT
├── auth.service.ts          # للـ INT  
├── firestore.rules          # للـ VSC
├── functions-build/         # للنشر
└── integration-guide.md     # للفريق
```

## ⚡ **البدء فوراً:**
**انسخ الأوامر أعلاه وابدأ العمل في 5 دقائق!** 🚀