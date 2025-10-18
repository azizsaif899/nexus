# 🚀 دليل إمكانية الوصول السريع - للمطورين

## ⚡ الأساسيات في 5 دقائق

### 1. استخدام نظام الترجمة 🌍

```typescript
// ✅ صحيح
import { useTranslation } from '../lib/i18n';

const MyComponent = ({ language }) => {
  const t = useTranslation(language);
  
  return (
    <button aria-label={t.sendMessage}>
      {t.sendMessage}
    </button>
  );
};

// ❌ خطأ
<button>Send Message</button>
```

---

### 2. ARIA Labels للأزرار 🔘

```tsx
// ✅ صحيح - زر بسيط
<button aria-label={t.action}>
  <Icon aria-hidden="true" />
</button>

// ✅ صحيح - زر toggle
<button 
  aria-label={t.filter}
  aria-pressed={isActive}
>
  {label}
</button>

// ✅ صحيح - زر معطل
<button
  aria-label={t.send}
  aria-disabled={!canSend}
  disabled={!canSend}
>
  Send
</button>

// ❌ خطأ
<div onClick={handleClick}>
  <Icon />
</div>
```

---

### 3. حقول الإدخال 📝

```tsx
// ✅ صحيح
<div>
  <label htmlFor="my-input" className="sr-only">
    {t.label}
  </label>
  <input
    id="my-input"
    aria-label={t.label}
    aria-describedby="hint"
    type="text"
  />
  <span id="hint" className="sr-only">
    {t.hint}
  </span>
</div>

// ❌ خطأ
<input type="text" placeholder="Type here" />
```

---

### 4. القوائم 📋

```tsx
// ✅ صحيح
<div role="list" aria-label={t.listTitle}>
  {items.map((item, index) => (
    <div
      key={item.id}
      role="listitem"
      tabIndex={0}
      aria-selected={selected === item.id}
      onKeyDown={(e) => handleKeyNav(e, index)}
    >
      {item.name}
    </div>
  ))}
</div>

// ❌ خطأ
<div>
  {items.map(item => (
    <div onClick={() => select(item.id)}>
      {item.name}
    </div>
  ))}
</div>
```

---

### 5. Keyboard Navigation ⌨️

```typescript
// ✅ صحيح
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  switch(e.key) {
    case 'ArrowDown':
      e.preventDefault();
      focusNext(index);
      break;
    case 'ArrowUp':
      e.preventDefault();
      focusPrev(index);
      break;
    case 'Enter':
    case ' ':
      e.preventDefault();
      selectItem(index);
      break;
    case 'Home':
      focusFirst();
      break;
    case 'End':
      focusLast();
      break;
  }
};

// ❌ خطأ - لا keyboard support
<div onClick={handleClick}>Item</div>
```

---

### 6. Focus Management 🎯

```typescript
// ✅ صحيح
const inputRef = useRef<HTMLInputElement>(null);

useEffect(() => {
  if (isOpen) {
    inputRef.current?.focus();
  }
}, [isOpen]);

// للقوائم
const itemRefs = useRef<(HTMLElement | null)[]>([]);

const focusItem = (index: number) => {
  itemRefs.current[index]?.focus();
};
```

---

### 7. Live Regions 📢

```tsx
// ✅ صحيح
const [announcement, setAnnouncement] = useState('');

// في المكون
<div role="status" aria-live="polite" className="sr-only">
  {announcement}
</div>

// عند الإجراء
const handleAction = () => {
  // ... do action
  setAnnouncement(t.actionCompleted);
  setTimeout(() => setAnnouncement(''), 3000);
};

// ❌ خطأ - لا توجد live announcements
```

---

### 8. Semantic HTML 🏗️

```tsx
// ✅ صحيح
<aside role="complementary">الشريط الجانبي</aside>
<main role="main">المحتوى الرئيسي</main>
<nav role="navigation">القائمة</nav>
<header>الرأس</header>
<footer>التذييل</footer>
<section>قسم</section>
<article>مقالة</article>
<form>نموذج</form>

// ❌ خطأ
<div>الشريط الجانبي</div>
<div>المحتوى الرئيسي</div>
```

---

## 🎨 CSS Classes المفيدة

```css
/* Screen Reader Only */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
}

.skip-link:focus {
  top: 0;
}
```

---

## ✅ Checklist قبل كل Commit

```
□ جميع الأزرار لها aria-label
□ جميع الحقول لها labels
□ استخدمت semantic HTML
□ أضفت keyboard navigation
□ اختبرت بـ Tab
□ اختبرت بـ screen reader
□ استخدمت i18n للنصوص
□ أضفت focus management
□ لا توجد div مع onClick
□ جميع الأيقونات aria-hidden="true"
```

---

## 🧪 اختبار سريع

### 1. اختبار الكيبورد (30 ثانية)
```
1. اضغط Tab للتنقل
2. تأكد من وضوح Focus
3. اضغط Enter على كل زر
4. جرب الـ Arrows في القوائم
```

### 2. اختبار Screen Reader (دقيقتان)
```
1. شغّل NVDA أو VoiceOver
2. استمع لقراءة كل عنصر
3. تأكد من وضوح الأسماء
4. تأكد من إعلان الحالات
```

---

## 🚨 الأخطاء الشائعة

### ❌ 1. div مع onClick
```tsx
// خطأ
<div onClick={handleClick}>Click me</div>

// صحيح
<button onClick={handleClick}>Click me</button>
```

### ❌ 2. بدون ARIA label
```tsx
// خطأ
<button><SendIcon /></button>

// صحيح
<button aria-label={t.send}>
  <SendIcon aria-hidden="true" />
</button>
```

### ❌ 3. نص hardcoded
```tsx
// خطأ
<button>Send Message</button>

// صحيح
<button>{t.sendMessage}</button>
```

### ❌ 4. بدون keyboard support
```tsx
// خطأ
<div onClick={select}>Item</div>

// صحيح
<div
  role="button"
  tabIndex={0}
  onClick={select}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      select();
    }
  }}
>
  Item
</div>
```

---

## 📚 مراجع سريعة

### ARIA Roles الشائعة
```
button, link, tab, tablist, tabpanel
list, listitem, option
menu, menuitem, menubar
dialog, alertdialog
navigation, main, complementary
search, form, article
status, alert, log
```

### ARIA Attributes الشائعة
```
aria-label="وصف"
aria-labelledby="id"
aria-describedby="id"
aria-pressed="true|false"
aria-selected="true|false"
aria-disabled="true|false"
aria-hidden="true|false"
aria-live="polite|assertive"
aria-atomic="true|false"
aria-expanded="true|false"
aria-haspopup="menu|dialog"
```

### Keyboard Keys
```
Enter, Space      - تفعيل
Escape           - إغلاق/إلغاء
Tab              - التنقل للأمام
Shift+Tab        - التنقل للخلف
Arrow Keys       - التنقل في القوائم
Home             - البداية
End              - النهاية
PageUp/PageDown  - التمرير
```

---

## 💡 نصائح ذهبية

1. **دائماً اختبر بالكيبورد**
   - إذا لم تستطع استخدامه بالكيبورد، فهو غير accessible

2. **استخدم semantic HTML أولاً**
   - `<button>` أفضل من `<div role="button">`

3. **كل نص visible يجب أن يكون في i18n**
   - لا استثناءات!

4. **Icons دائماً aria-hidden="true"**
   - الوصف في aria-label النصي

5. **Focus يجب أن يكون واضحاً**
   - على الأقل outline بـ 2-3px

---

## 🎯 الهدف

> **كل مستخدم، بغض النظر عن قدراته، يجب أن يستطيع استخدام التطبيق بالكامل!**

---

**Happy Accessible Coding! ♿✨**