# ⚠️ READ THIS FIRST - IMPORTANT WARNING

## 🚨 CRITICAL: Protected Files Alert

**DO NOT USE THE FOLLOWING FILES:**
- `guidelines/Guidelines.md` ❌ (PROTECTED - INCORRECT DATA)
- Any files in `guidelines/` folder ❌ (CONTAMINATED)

**WHY?**
- These files contain incorrect color values from Workflow Automation project
- They will break your CRM Nexus design system
- They conflict with established guidelines

---

## ✅ CORRECT FILES TO USE

### Primary Documentation
- `/docs/LESSONS_LEARNED.md` ✅ (4,500 words - Complete guide)
- `/docs/REVIEW_AND_OPINION.md` ✅ (Full evaluation)
- `/docs/README.md` ✅ (Documentation index)

### Design System
- Use only Gray Scale colors (gray-50 to gray-900)
- Glass effects for backgrounds
- IBM Plex Sans Arabic + Inter fonts
- WCAG AA compliant

---

## 📊 COMPARISON: WRONG vs RIGHT

| Aspect | WRONG (guidelines/) | RIGHT (/docs/) |
|--------|-------------------|---------------|
| Colors | Mixed systems | Gray Scale only |
| Typography | Hardcoded classes | Semantic HTML |
| Components | Default shadcn/ui | Customized components |
| Status | ❌ Contaminated | ✅ Verified |

---

## 🛡️ PROTECTION MEASURES

### Files Ignored in .gitignore
```
guidelines/
*.protected
```

### Build Safety
- PostCSS config: `.cjs` extension required
- ES modules compatibility verified
- Tailwind CSS v4 integration confirmed

---

## 🎯 CRM NEXUS RULES

### Typography (GOLDEN RULE)
```
✅ NEVER use: text-sm, font-medium, font-bold
✅ ALWAYS use: <h1>, <p>, semantic elements
✅ RELY on: globals.css for all styling
```

### Components
```
✅ shadcn/ui components MUST be customized
✅ Remove all hardcoded typography classes
✅ Test against design system before use
```

### Colors
```
✅ Gray Scale: gray-50, gray-100, ..., gray-900
✅ Glass effects: backdrop-blur, opacity
❌ NO other color systems
```

---

## 🚀 QUICK START FOR CRM NEXUS

1. **Read:** `/docs/LESSONS_LEARNED.md` (REQUIRED)
2. **Review:** `/docs/REVIEW_AND_OPINION.md` (RECOMMENDED)
3. **Start:** New CRM folder with clean foundation
4. **Apply:** All lessons learned immediately
5. **Test:** Design system compliance continuously

---

## 📞 SUPPORT

- **Documentation:** `/docs/` folder
- **Guidelines:** LESSONS_LEARNED.md
- **Examples:** Code samples in docs
- **Rules:** This file (READ THIS FIRST)

---

**FINAL WARNING:** Ignoring this file will lead to the same problems we just fixed. Read the docs, follow the rules, build correctly.

🟢 **Status:** Ready for proper CRM Nexus development