/**
 * محسن الترجمة للمصطلحات التقنية
 */
class TranslationEnhancer {
    constructor() {
        this.glossary = {
            technical: {
                'نظام إدارة': 'management system',
                'ذكاء اصطناعي': 'artificial intelligence',
                'معالجة البيانات': 'data processing',
                'واجهة برمجة': 'API interface',
                'قاعدة بيانات': 'database'
            },
            medical: {
                'تشخيص': 'diagnosis',
                'علاج': 'treatment',
                'مريض': 'patient'
            },
            legal: {
                'عقد': 'contract',
                'قانون': 'law',
                'محكمة': 'court'
            }
        };
    }

    async enhanceTranslation(text, targetLang, domain = 'technical') {
        const enhancedText = this.replaceTerms(text, this.glossary[domain] || {});
        return enhancedText;
    }

    replaceTerms(text, glossary) {
        let result = text;
        Object.entries(glossary).forEach(([arabic, english]) => {
            const regex = new RegExp(arabic, 'gi');
            result = result.replace(regex, english);
        });
        return result;
    }

    loadGlossary(domain) {
        return this.glossary[domain] || {};
    }
}

module.exports = TranslationEnhancer;