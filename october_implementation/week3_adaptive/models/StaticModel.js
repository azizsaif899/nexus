/**
 * النموذج الثابت - Fallback للنموذج التكيفي
 */
class StaticModel {
    process(data) {
        // معالجة أساسية ثابتة
        return {
            processed: true,
            type: this.detectType(data),
            result: `معالج ثابت: ${data.content}`,
            timestamp: Date.now(),
            model: 'static'
        };
    }

    detectType(data) {
        if (data.type) return data.type;
        
        const content = data.content || '';
        if (/مالي|فاتورة|حساب|مبلغ/.test(content)) return 'financial';
        if (/\?|كيف|ماذا|متى/.test(content)) return 'chat';
        return 'general';
    }
}

module.exports = StaticModel;