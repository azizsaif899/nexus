# (Ar) دليل رسائل الـ Commit الرسمي - مشروع G-Assistant

## 📋 تعريف الوثيقة
**الغرض**: توحيد معايير كتابة رسائل Commit في مشروع G-Assistant، وتحويل سجل المساهمات إلى مصدر معلومات قيم وواضح يسهل تتبع التغييرات وإصدار التحديثات.
**الجمهور المستهدف**: جميع مطوري ومساهمي المشروع.
**الإلزامية**: الالتزام بهذه القواعد إلزامي لجميع الـ commits التي يتم دمجها في الفرع الرئيسي.

---

**الإصدار**: 1.0
**آخر تحديث**: 2024-05-21

---

## 📝 هيكل رسالة الـ Commit

يجب أن تتبع كل رسالة commit الهيكل التالي بدقة:
```markdown
<type>(<scope>): <subject>

<body>

<footer>
```

### 🏷️ أنواع الـ Commit المعتمدة
| النوع | الوصف |
| --- | --- |
| feat | إضافة ميزة جديدة للمستخدم (e.g., أمر صوتي جديد). |
| fix | إصلاح خطأ برمجي (e.g., معالجة خطأ في المصادقة). |
| docs | التغييرات التي تخص التوثيق فقط (e.g., تحديث README). |
| style | تعديلات على تنسيق الكود لا تؤثر على وظيفته (e.g., تطبيق black). |
| refactor | إعادة هيكلة الكود بدون تغيير وظيفته (e.g., تبسيط دالة معقدة). |
| perf | تحسين أداء الكود (e.g., تقليل استجابة API). |
| test | إضافة أو تعديل الاختبارات. |
| build | تغييرات تؤثر على نظام البناء أو الاعتماديات (e.g., تحديث requirements.txt). |
| ci | تغييرات على ملفات وإعدادات التكامل المستمر (CI). |
| chore | مهام أخرى لا تعدل الكود المصدري (e.g., تعديل .gitignore). |
| security | إصلاح ثغرة أمنية أو تحسينات متعلقة بالأمان. |

### 🎯 النطاقات (Scopes) الخاصة بمشروع G-Assistant
النطاق يحدد الجزء من المشروع الذي تأثر بالتغيير. اختر النطاق الأكثر صلة.

| النطاق | الوصف |
| --- | --- |
| auth | كل ما يتعلق بالمصادقة مع Google (OAuth, client_secret.json, token.pickle). |
| audio | كل ما يتعلق بالتقاط الصوت من الميكروفون أو تشغيل الاستجابة الصوتية. |
| api | التفاعل المباشر مع Google Assistant Service API. |
| cli | واجهة سطر الأوامر، المعاملات، والمخرجات للمستخدم. |
| config | ملفات وإعدادات التكوين. |
| setup | عملية التثبيت، الإعداد الأولي، وملفات requirements. |
| docs | التوثيق العام للمشروع (e.g., README, CONTRIBUTING). |
| core | التغييرات في المنطق الرئيسي للبرنامج (e.g., main.py). |

### ✍️ قواعد كتابة الرسالة
#### العنوان (Subject)
- **الحد الأقصى**: 50 حرفًا.
- **الصيغة**: فعل أمر (e.g., "Add", "Fix", "Update" وليس "Added", "Fixes").
- **الحرف الأول**: كبير.
- **النهاية**: بدون نقطة ..

#### الجسم (Body)
- اختياري للتغييرات البسيطة.
- إلزامي للتغييرات المعقدة لشرح "لماذا" تم التغيير.
- استخدم نقاط (-) لسرد التفاصيل.
- التفاف السطر عند 72 حرفًا.

#### التذييل (Footer)
- **لإغلاق الـ Issues**: Closes #123, Fixes #456.
- **للتغييرات الكاسرة**: يجب أن يبدأ بـ BREAKING CHANGE:.

### 🚨 مثال على تغيير كاسر (Breaking Change)
استخدم ! بعد النطاق للإشارة إلى تغيير كاسر، مع شرح تفصيلي في التذييل.
```
feat(cli)!: change default microphone behavior

BREAKING CHANGE: The application no longer defaults to the system's
default microphone. Users must now specify the microphone device ID
using the `--device` flag.

This change was made to prevent issues on systems with multiple
audio devices. Refer to `docs/AUDIO_SETUP.md` for instructions
on how to find the device ID.
```

### ✅ أمثلة عملية من G-Assistant
#### إضافة ميزة جديدة
```
feat(audio): add support for custom audio device selection

Implements the `--device-index` command-line argument to allow users
to specify which microphone to use for recording. This resolves
issues for users with multiple input devices.

- Adds `argparse` logic for the new flag.
- Modifies the `AudioRecorder` class to accept a device index.
- Updates documentation with usage instructions.

Closes #42
```

#### إصلاح خطأ
```
fix(auth): handle expired token by forcing re-authentication

Previously, an expired or revoked token would cause an `invalid_grant`
error, crashing the application. This fix catches the exception,
deletes the invalid `token.pickle` file, and prompts the user to
re-authenticate.

Fixes #31
```

#### تحديث الاعتماديات
```
build(setup): upgrade google-auth-library to version 2.29.0

Upgrades the core authentication library to patch a known
vulnerability and improve performance of token refresh operations.

- Updated version number in `requirements.txt`.
- Tested the authentication flow to ensure no regressions.
```

#### تحديث التوثيق
```
docs(auth): clarify OAuth consent screen setup steps

Many users face `access_denied` errors because they forget to
add their email to the "Test Users" list in Google Cloud Console.
This change adds a highlighted warning and a screenshot to the
README file to make this step clearer.
```
