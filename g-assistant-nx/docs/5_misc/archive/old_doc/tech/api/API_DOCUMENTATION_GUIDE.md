# دليل توثيق الكود وواجهات برمجة التطبيقات

## 1. مقدمة

التوثيق الجيد ليس اختياريًا، بل هو جزء لا يتجزأ من الكود. يجب أن تحتوي جميع الدوال (functions)، الكلاسات (classes)، والوحدات (modules) على `docstrings` واضحة تتبع المعيار الموضح أدناه.

---

## 2. معيار Docstrings (Google Style)

نعتمد أسلوب Google في كتابة الـ `docstrings` لكونه مقروءًا وواضحًا.

### مكونات الـ Docstring:

- **سطر واحد موجز:** جملة قصيرة تصف ما تفعله الوحدة، وتنتهي بنقطة.
- **وصف تفصيلي (اختياري):** فقرة أو أكثر تشرح "لماذا" و"كيف" تعمل الوحدة بشكل أكثر تفصيلاً.
- **`Args:`:** قائمة بالمعاملات (parameters). لكل معامل: `name (type): description`.
- **`Returns:`:** وصف للقيمة التي تعيدها الوحدة، بما في ذلك نوعها.
- **`Raises:`:** قائمة بالأخطاء (Exceptions) التي قد تطلقها الوحدة.

---

## 3. مثال على توثيق دالة (Function)

```python
def calculate_revenue(transactions: list[dict]) -> float:
    """Calculates the total revenue from a list of transactions.

    This function iterates through a list of transaction dictionaries,
    summing up the 'amount' for all transactions marked as 'sale'.

    Args:
        transactions (list[dict]): A list of transaction objects.
            Each dict should have 'type' and 'amount' keys.

    Returns:
        float: The total calculated revenue. Returns 0.0 if the list is empty.

    Raises:
        KeyError: If a transaction dictionary is missing 'type' or 'amount'.
    """
    total = 0.0
    for tx in transactions:
        if tx['type'] == 'sale':
            total += tx['amount']
    return total
```

## 4. توثيق الكلاسات والوحدات

- **الكلاسات (Classes):** يجب أن يوضع الـ `docstring` مباشرة بعد تعريف الكلاس ويصف الغرض من الكلاس ومسؤولياته الرئيسية.
- **الوحدات (Modules):** يجب أن يبدأ كل ملف `.py` بـ `docstring` على مستوى الوحدة يشرح الغرض من الملف والمكونات التي يحتوي عليها.