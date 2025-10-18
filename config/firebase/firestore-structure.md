# 🏗️ Firestore Multi-tenant Structure

## 📊 **هيكل قاعدة البيانات**

```
firestore/
├── tenants/                    # معلومات الشركات
│   └── {tenantId}/
│       ├── name: "شركة المثال"
│       ├── plan: "pro"
│       ├── status: "active"
│       └── settings: {...}
│
├── users/                      # المستخدمين
│   └── {userId}/
│       ├── email: "user@example.com"
│       ├── tenantId: "tenant_123"
│       ├── role: "admin"
│       └── subscription: {...}
│
└── tenant_data/               # بيانات منفصلة لكل شركة
    └── {tenantId}/
        ├── chats/             # محادثات الشركة
        ├── files/             # ملفات الشركة  
        ├── customers/         # عملاء الشركة
        └── settings/          # إعدادات الشركة
```

## 🔐 **Firestore Security Rules**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Tenant data isolation
    match /tenant_data/{tenantId}/{document=**} {
      allow read, write: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
    }
    
    // Admins can read tenant info
    match /tenants/{tenantId} {
      allow read: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.tenantId == tenantId;
    }
  }
}
```