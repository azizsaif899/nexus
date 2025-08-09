/**
 * نظام دعم متعدد اللغات
 */
class MultilingualSupport {
    constructor() {
        this.supportedLangs = ['ar', 'en', 'fr', 'es', 'de', 'ru', 'zh', 'ja', 'pt', 'tr'];
        this.translations = new Map();
        this.initializeTranslations();
    }

    initializeTranslations() {
        // ترجمات أساسية للردود الشائعة
        this.translations.set('greeting', {
            ar: 'مرحباً! كيف يمكنني مساعدتك؟',
            en: 'Hello! How can I help you?',
            fr: 'Bonjour! Comment puis-je vous aider?',
            es: '¡Hola! ¿Cómo puedo ayudarte?',
            de: 'Hallo! Wie kann ich Ihnen helfen?',
            ru: 'Привет! Как я могу помочь?',
            zh: '你好！我怎么能帮助你？',
            ja: 'こんにちは！どのようにお手伝いできますか？',
            pt: 'Olá! Como posso ajudá-lo?',
            tr: 'Merhaba! Size nasıl yardımcı olabilirim?'
        });

        this.translations.set('thanks', {
            ar: 'شكراً لك!',
            en: 'Thank you!',
            fr: 'Merci!',
            es: '¡Gracias!',
            de: 'Danke!',
            ru: 'Спасибо!',
            zh: '谢谢！',
            ja: 'ありがとう！',
            pt: 'Obrigado!',
            tr: 'Teşekkürler!'
        });

        this.translations.set('error', {
            ar: 'عذراً، حدث خطأ. يرجى المحاولة مرة أخرى.',
            en: 'Sorry, an error occurred. Please try again.',
            fr: 'Désolé, une erreur s\'est produite. Veuillez réessayer.',
            es: 'Lo siento, ocurrió un error. Por favor, inténtalo de nuevo.',
            de: 'Entschuldigung, ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
            ru: 'Извините, произошла ошибка. Пожалуйста, попробуйте еще раз.',
            zh: '抱歉，发生了错误。请再试一次。',
            ja: '申し訳ございませんが、エラーが発生しました。もう一度お試しください。',
            pt: 'Desculpe, ocorreu um erro. Tente novamente.',
            tr: 'Üzgünüm, bir hata oluştu. Lütfen tekrar deneyin.'
        });
    }

    async detectLanguage(text) {
        // كشف اللغة بناءً على الأحرف المستخدمة
        const patterns = {
            ar: /[\u0600-\u06FF]/,
            en: /^[a-zA-Z\s.,!?]+$/,
            fr: /[àâäéèêëïîôöùûüÿç]/,
            es: /[áéíóúñü]/,
            de: /[äöüß]/,
            ru: /[\u0400-\u04FF]/,
            zh: /[\u4e00-\u9fff]/,
            ja: /[\u3040-\u309f\u30a0-\u30ff]/,
            pt: /[ãõáéíóúâêîôûàèìòù]/,
            tr: /[çğıöşü]/
        };

        for (const [lang, pattern] of Object.entries(patterns)) {
            if (pattern.test(text)) {
                return lang;
            }
        }

        return 'en'; // افتراضي
    }

    async translate(text, targetLang, sourceLang = null) {
        if (!this.supportedLangs.includes(targetLang)) {
            throw new Error(`اللغة ${targetLang} غير مدعومة`);
        }

        // إذا لم تحدد اللغة المصدر، اكتشفها تلقائياً
        if (!sourceLang) {
            sourceLang = await this.detectLanguage(text);
        }

        // إذا كانت اللغة المصدر والهدف متشابهة، أرجع النص كما هو
        if (sourceLang === targetLang) {
            return text;
        }

        // محاولة العثور على ترجمة جاهزة
        const preTranslated = this.findPreTranslation(text, targetLang);
        if (preTranslated) {
            return preTranslated;
        }

        // محاكاة ترجمة (في التطبيق الحقيقي، استخدم Google Translate API)
        return this.mockTranslate(text, sourceLang, targetLang);
    }

    findPreTranslation(text, targetLang) {
        for (const [key, translations] of this.translations.entries()) {
            // البحث في الترجمات الجاهزة
            for (const [lang, translation] of Object.entries(translations)) {
                if (text.toLowerCase().includes(translation.toLowerCase())) {
                    return translations[targetLang];
                }
            }
        }
        return null;
    }

    mockTranslate(text, sourceLang, targetLang) {
        // محاكاة بسيطة للترجمة
        const mockTranslations = {
            'ar-en': {
                'مرحبا': 'Hello',
                'شكرا': 'Thank you',
                'نعم': 'Yes',
                'لا': 'No'
            },
            'en-ar': {
                'hello': 'مرحبا',
                'thank you': 'شكرا',
                'yes': 'نعم',
                'no': 'لا'
            }
        };

        const translationKey = `${sourceLang}-${targetLang}`;
        const translations = mockTranslations[translationKey];

        if (translations) {
            let translatedText = text.toLowerCase();
            for (const [source, target] of Object.entries(translations)) {
                translatedText = translatedText.replace(new RegExp(source, 'gi'), target);
            }
            return translatedText;
        }

        return `[ترجمة ${text} من ${sourceLang} إلى ${targetLang}]`;
    }

    getSystemMessage(messageKey, language = 'ar') {
        const messages = this.translations.get(messageKey);
        return messages ? messages[language] || messages['ar'] : messageKey;
    }

    getSupportedLanguages() {
        return this.supportedLangs.map(lang => ({
            code: lang,
            name: this.getLanguageName(lang),
            nativeName: this.getLanguageNativeName(lang)
        }));
    }

    getLanguageName(code) {
        const names = {
            ar: 'Arabic',
            en: 'English',
            fr: 'French',
            es: 'Spanish',
            de: 'German',
            ru: 'Russian',
            zh: 'Chinese',
            ja: 'Japanese',
            pt: 'Portuguese',
            tr: 'Turkish'
        };
        return names[code] || code;
    }

    getLanguageNativeName(code) {
        const nativeNames = {
            ar: 'العربية',
            en: 'English',
            fr: 'Français',
            es: 'Español',
            de: 'Deutsch',
            ru: 'Русский',
            zh: '中文',
            ja: '日本語',
            pt: 'Português',
            tr: 'Türkçe'
        };
        return nativeNames[code] || code;
    }
}

module.exports = MultilingualSupport;