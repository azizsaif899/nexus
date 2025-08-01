/**
 * Semantic Search API - واجهة برمجية محسنة للبحث الدلالي
 * تحل مشاكل الأداء عبر استخدام Vector Store المسبق
 */

class SemanticSearchAPI {
  constructor() {
    this.embeddingService = Injector.get('Services.EmbeddingService');
    this.vectorStore = Injector.get('Services.VectorStore');
    this.auth = Injector.get('System.Auth');
    
    // إعدادات قابلة للتكوين
    this.DEFAULT_THRESHOLD = 0.5;
    this.MAX_RESULTS = 50;
    this.CACHE_DURATION = 300000; // 5 دقائق
    this.queryCache = new Map();
  }

  /**
   * نقطة النهاية الرئيسية للبحث الدلالي
   */
  async handleSemanticSearch(request) {
    try {
      // 1. التحقق من الصلاحيات
      const authResult = await this.validateRequest(request);
      if (!authResult.valid) {
        return this.createErrorResponse(403, 'غير مصرح بالوصول', authResult.error);
      }

      // 2. استخراج وتنظيف المعاملات
      const params = this.extractSearchParams(request);
      const validationResult = this.validateSearchParams(params);
      
      if (!validationResult.valid) {
        return this.createErrorResponse(400, 'معاملات غير صحيحة', validationResult.errors);
      }

      // 3. التحقق من الذاكرة المؤقتة
      const cacheKey = this.generateCacheKey(params);
      const cachedResult = this.getCachedResult(cacheKey);
      
      if (cachedResult) {
        console.log('📋 إرجاع نتيجة من الذاكرة المؤقتة');
        return this.createSuccessResponse(cachedResult, { fromCache: true });
      }

      // 4. تنفيذ البحث المحسن
      const searchResult = await this.executeOptimizedSearch(params);

      // 5. حفظ في الذاكرة المؤقتة
      this.cacheResult(cacheKey, searchResult);

      // 6. إرجاع النتيجة
      return this.createSuccessResponse(searchResult, { 
        fromCache: false,
        processingTime: searchResult.processingTime 
      });

    } catch (error) {
      console.error('❌ خطأ في البحث الدلالي:', error);
      return this.createErrorResponse(500, 'خطأ داخلي في الخادم', error.message);
    }
  }

  /**
   * تنفيذ البحث المحسن - بدون استدعاءات API متكررة
   */
  async executeOptimizedSearch(params) {
    const startTime = Date.now();
    
    try {
      console.log(`🔍 بدء البحث الدلالي: "${params.query}"`);

      // 1. توليد embedding للاستعلام فقط (استدعاء API واحد)
      const queryEmbedding = await this.embeddingService.generateEmbedding(params.query);
      
      if (!queryEmbedding) {
        throw new Error('فشل في معالجة الاستعلام');
      }

      // 2. البحث في المتجهات المخزنة مسبقاً (سريع جداً)
      const vectorResults = await this.vectorStore.findSimilar(queryEmbedding, {
        threshold: params.threshold,
        topN: params.maxResults
      });

      // 3. تطبيق المرشحات الإضافية
      const filteredResults = await this.applyFilters(vectorResults, params.filters);

      // 4. إثراء النتائج بالمعلومات الإضافية
      const enrichedResults = await this.enrichResults(filteredResults, params.includeContent);

      // 5. ترتيب وتجميع النتائج
      const finalResults = this.organizeResults(enrichedResults, params.groupBy);

      const processingTime = Date.now() - startTime;
      
      console.log(`✅ اكتمل البحث في ${processingTime}ms - ${finalResults.length} نتيجة`);

      return {
        query: params.query,
        totalResults: finalResults.length,
        threshold: params.threshold,
        results: finalResults,
        processingTime,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ خطأ في تنفيذ البحث:', error);
      throw error;
    }
  }

  /**
   * التحقق من صحة الطلب والصلاحيات
   */
  async validateRequest(request) {
    try {
      // التحقق من وجود رمز المصادقة
      const authHeader = request.headers?.authorization || request.parameter?.token;
      
      if (!authHeader) {
        return { valid: false, error: 'رمز المصادقة مطلوب' };
      }

      // التحقق من صحة الرمز
      const token = authHeader.replace('Bearer ', '');
      const user = await this.auth.validateToken(token);
      
      if (!user) {
        return { valid: false, error: 'رمز مصادقة غير صحيح' };
      }

      // التحقق من صلاحية البحث
      if (!user.permissions?.includes('search') && !user.permissions?.includes('admin')) {
        return { valid: false, error: 'لا تملك صلاحية البحث' };
      }

      return { valid: true, user };

    } catch (error) {
      console.error('❌ خطأ في التحقق من الصلاحيات:', error);
      return { valid: false, error: 'خطأ في التحقق من الصلاحيات' };
    }
  }

  /**
   * استخراج معاملات البحث من الطلب
   */
  extractSearchParams(request) {
    const body = request.postData ? JSON.parse(request.postData.contents) : {};
    const params = request.parameter || {};
    
    return {
      query: body.query || params.query || '',
      threshold: parseFloat(body.threshold || params.threshold || this.DEFAULT_THRESHOLD),
      maxResults: parseInt(body.maxResults || params.maxResults || 10),
      includeContent: body.includeContent !== false, // افتراضياً true
      groupBy: body.groupBy || params.groupBy || null,
      filters: body.filters || params.filters || {},
      sortBy: body.sortBy || params.sortBy || 'similarity'
    };
  }

  /**
   * التحقق من صحة معاملات البحث
   */
  validateSearchParams(params) {
    const errors = [];

    if (!params.query || params.query.trim().length < 2) {
      errors.push('الاستعلام يجب أن يحتوي على حرفين على الأقل');
    }

    if (params.threshold < 0 || params.threshold > 1) {
      errors.push('عتبة التشابه يجب أن تكون بين 0 و 1');
    }

    if (params.maxResults < 1 || params.maxResults > this.MAX_RESULTS) {
      errors.push(`عدد النتائج يجب أن يكون بين 1 و ${this.MAX_RESULTS}`);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * تطبيق المرشحات الإضافية على النتائج
   */
  async applyFilters(results, filters) {
    if (!filters || Object.keys(filters).length === 0) {
      return results;
    }

    let filtered = results;

    // تصفية حسب النوع
    if (filters.type) {
      filtered = filtered.filter(r => r.id.includes(filters.type));
    }

    // تصفية حسب التاريخ
    if (filters.dateFrom || filters.dateTo) {
      filtered = await this.filterByDateRange(filtered, filters);
    }

    // تصفية حسب الفئة
    if (filters.category) {
      filtered = await this.filterByCategory(filtered, filters.category);
    }

    return filtered;
  }

  /**
   * إثراء النتائج بالمعلومات الإضافية
   */
  async enrichResults(results, includeContent = true) {
    const enriched = [];

    for (const result of results) {
      const enrichedResult = {
        id: result.id,
        similarity: result.similarity,
        timestamp: result.timestamp
      };

      if (includeContent) {
        // جلب المحتوى الكامل والمعلومات الإضافية
        const fullContent = await this.getFullContent(result.id);
        if (fullContent) {
          enrichedResult.title = fullContent.title;
          enrichedResult.preview = fullContent.content.substring(0, 200) + '...';
          enrichedResult.metadata = fullContent.metadata;
          
          if (includeContent === 'full') {
            enrichedResult.fullContent = fullContent.content;
          }
        }
      }

      enriched.push(enrichedResult);
    }

    return enriched;
  }

  /**
   * تنظيم وترتيب النتائج
   */
  organizeResults(results, groupBy = null) {
    // ترتيب حسب التشابه (افتراضياً)
    results.sort((a, b) => b.similarity - a.similarity);

    if (!groupBy) {
      return results;
    }

    // تجميع النتائج
    const grouped = {};
    
    results.forEach(result => {
      const groupKey = this.getGroupKey(result, groupBy);
      if (!grouped[groupKey]) {
        grouped[groupKey] = [];
      }
      grouped[groupKey].push(result);
    });

    return grouped;
  }

  /**
   * الحصول على مفتاح التجميع
   */
  getGroupKey(result, groupBy) {
    switch (groupBy) {
      case 'type':
        return result.id.split('_')[0] || 'unknown';
      case 'similarity':
        if (result.similarity >= 0.8) return 'high';
        if (result.similarity >= 0.6) return 'medium';
        return 'low';
      case 'date':
        return result.metadata?.date?.substring(0, 7) || 'unknown'; // YYYY-MM
      default:
        return 'all';
    }
  }

  /**
   * جلب المحتوى الكامل للنتيجة
   */
  async getFullContent(id) {
    try {
      // تحديد المصدر حسب نمط الـ ID
      let sheetName, contentColumn;
      
      if (id.startsWith('Financial_Reports_')) {
        sheetName = 'Financial_Reports';
        contentColumn = 2; // العمود C
      } else if (id.startsWith('Monthly_Analysis_')) {
        sheetName = 'Monthly_Analysis';
        contentColumn = 3; // العمود D
      } else {
        sheetName = 'Budget_Reports';
        contentColumn = 1; // العمود B
      }

      const sheets = Injector.get('Tools.Sheets');
      const data = await sheets.readRange(sheetName, 'A:Z');
      const cleanId = id.replace(/^[^_]+_/, '');

      for (let i = 1; i < data.length; i++) {
        if (data[i][0] === cleanId) {
          return {
            title: data[i][1] || `تقرير ${cleanId}`,
            content: data[i][contentColumn] || '',
            metadata: {
              date: data[i][1],
              type: sheetName,
              originalId: cleanId
            }
          };
        }
      }

      return null;

    } catch (error) {
      console.error(`❌ خطأ في جلب المحتوى لـ ${id}:`, error);
      return null;
    }
  }

  // ===== إدارة الذاكرة المؤقتة =====

  /**
   * توليد مفتاح الذاكرة المؤقتة
   */
  generateCacheKey(params) {
    const keyData = {
      query: params.query,
      threshold: params.threshold,
      maxResults: params.maxResults,
      filters: params.filters
    };
    
    return 'search_' + this.hashObject(keyData);
  }

  /**
   * الحصول على نتيجة من الذاكرة المؤقتة
   */
  getCachedResult(cacheKey) {
    const cached = this.queryCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
      return cached.data;
    }
    
    // إزالة النتيجة المنتهية الصلاحية
    if (cached) {
      this.queryCache.delete(cacheKey);
    }
    
    return null;
  }

  /**
   * حفظ النتيجة في الذاكرة المؤقتة
   */
  cacheResult(cacheKey, data) {
    // تنظيف الذاكرة المؤقتة إذا امتلأت
    if (this.queryCache.size > 100) {
      const oldestKey = this.queryCache.keys().next().value;
      this.queryCache.delete(oldestKey);
    }
    
    this.queryCache.set(cacheKey, {
      data,
      timestamp: Date.now()
    });
  }

  // ===== دوال مساعدة =====

  /**
   * إنشاء hash للكائن
   */
  hashObject(obj) {
    const str = JSON.stringify(obj);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return hash.toString();
  }

  /**
   * إنشاء استجابة نجاح
   */
  createSuccessResponse(data, metadata = {}) {
    return {
      success: true,
      data,
      metadata,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * إنشاء استجابة خطأ
   */
  createErrorResponse(statusCode, message, details = null) {
    return {
      success: false,
      error: {
        code: statusCode,
        message,
        details
      },
      timestamp: new Date().toISOString()
    };
  }
}

// تسجيل الخدمة في نظام DI
if (typeof Injector !== 'undefined') {
  Injector.register('API.SemanticSearch', () => new SemanticSearchAPI());
}

// دالة للاستخدام في Google Apps Script Web App
function doPost(e) {
  const api = Injector.get('API.SemanticSearch');
  const result = api.handleSemanticSearch(e);
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// دالة للاستخدام في GET requests
function doGet(e) {
  const api = Injector.get('API.SemanticSearch');
  const result = api.handleSemanticSearch(e);
  
  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// تصدير للاستخدام في Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SemanticSearchAPI;
}