defineModule('System.AI.Agents.Developer', ({ Utils, Config, DocsManager, AI, Telemetry }) => {
  const MODULE_VERSION = '2.1.0';
  const METRICS_SHEET = 'AI_Developer_Agent_Metrics';

  DocsManager.registerModuleDocs('System.AI.Agents.Developer', [
    {
      name: 'handleRequest',
      version: MODULE_VERSION,
      description: 'معالجة طلبات المطور مع تحليل كود متقدم',
      parameters: {
        type: 'OBJECT',
        properties: {
          sessionId: { type: 'STRING', required: true },
          message: { type: 'STRING', required: true },
          intent: { type: 'OBJECT', required: true }
        }
      }
    },
    {
      name: 'runWeeklyCodeReview',
      version: MODULE_VERSION,
      description: 'مراجعة كود أسبوعية شاملة مع تحليل جودة متقدم'
    },
    {
      name: 'analyzeCodeComplexity',
      version: MODULE_VERSION,
      description: 'تحليل تعقيد الكود وتقديم اقتراحات التحسين'
    },
    {
      name: 'generateCodeDocumentation',
      version: MODULE_VERSION,
      description: 'توليد وثائق الكود تلقائياً'
    }
  ]);

  function _recordInvocation(action, status, durationMs, meta = {}) {
    const rec = {
      module: 'AI.Agents.Developer',
      action,
      version: MODULE_VERSION,
      timestamp: new Date().toISOString(),
      status,
      durationMs,
      ...meta
    };

    if (AI?.LongTermMemory?.save) {
      AI.LongTermMemory.save('DeveloperAgentInvocation', rec);
    }

    Telemetry.track('AI.Agents.Developer.Invocation', rec);

    const sheet = Utils.getSheet(METRICS_SHEET, [
      'Timestamp', 'Action', 'Status', 'DurationMs', 'Version', 'Details'
    ]);
    if (sheet) {
      sheet.appendRow([
        new Date(), action, status, durationMs, MODULE_VERSION,
        JSON.stringify(meta.details || {})
      ]);
    }
  }

  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    let status = 'processing';

    try {
      Utils.log(`Developer Agent: Processing - Intent: ${intent.type}, Message: "${message}"`);

      switch (intent.type) {
      case 'tool_call':
        const toolName = intent.data?.toolName || intent.data?.functionName;

        if (toolName === 'Developer.runWeeklyCodeReview') {
          const result = runWeeklyCodeReview();
          status = result.type === 'success' ? 'success' : 'error';
          return result;
        } else if (toolName === 'Developer.analyzeCodeComplexity') {
          const result = analyzeCodeComplexity(intent.data?.fileName);
          status = result.type === 'success' ? 'success' : 'error';
          return result;
        } else if (toolName === 'Developer.generateCodeDocumentation') {
          const result = generateCodeDocumentation(intent.data?.fileName);
          status = result.type === 'success' ? 'success' : 'error';
          return result;
        } else {
          status = 'unknown_tool';
          return {
            type: 'warning',
            text: `Developer Agent: أداة مطور غير معروفة: ${toolName || 'غير محددة'}`
          };
        }

      case 'general_query':
        if (AI?.Core?.ask) {
          const devPrompt = `كمطور خبير في Google Apps Script وJavaScript، أجب على السؤال التالي بدقة تقنية:

السؤال: ${message}

يرجى تقديم:
1. إجابة تقنية مفصلة
2. أمثلة كود إذا كانت مناسبة
3. أفضل الممارسات
4. تحذيرات تقنية إذا لزم الأمر
5. موارد إضافية للتعلم`;

          const aiResponse = AI.Core.ask(devPrompt, {
            sessionId,
            generationConfig: { temperature: 0.2, maxOutputTokens: 3000 }
          });

          status = aiResponse.type === 'info' ? 'success' : 'ai_error';
          return {
            type: aiResponse.type,
            text: aiResponse.text,
            data: { ...aiResponse.data, agent: 'Developer', expertise: 'technical' }
          };
        } else {
          status = 'ai_unavailable';
          return {
            type: 'error',
            text: 'Developer Agent: خدمة الذكاء الاصطناعي غير متوفرة'
          };
        }

      case 'clarification_needed':
        status = 'clarification';
        return {
          type: 'warning',
          text: 'Developer Agent: هل يمكنك توضيح طلبك التقني؟ مثلاً: مراجعة كود، تحليل تعقيد، أو توليد وثائق.'
        };

      default:
        status = 'unknown_intent';
        return {
          type: 'info',
          text: `Developer Agent: رسالة "${message}" بنوع نية غير متوقع: "${intent.type}"`
        };
      }

    } catch (e) {
      status = 'exception';
      Utils.error(`Developer Agent error: ${e.message}`, e.stack);
      return {
        type: 'error',
        text: `💥 خطأ في Developer Agent: ${e.message}`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('handleRequest', status, duration, {
        sessionId,
        intentType: intent.type,
        details: { messageLength: message.length }
      });
    }
  }

  function runWeeklyCodeReview() {
    const start = Date.now();
    let status = 'processing';

    return Utils.executeSafely(() => {
      Utils.log('Developer Agent: Starting enhanced weekly code review');

      const projectCode = _getProjectSourceCode();
      if (!projectCode) {
        status = 'no_code';
        return {
          type: 'warning',
          text: 'لا يوجد كود مشروع للمراجعة'
        };
      }

      // تحليل شامل للكود
      const codeAnalysis = _performCodeAnalysis(projectCode);

      // مراجعة بالذكاء الاصطناعي
      let aiReview = null;
      if (AI?.Core?.ask) {
        const reviewPrompt = `كمهندس برمجيات خبير، راجع كود G-Assistant التالي وقدم تحليلاً شاملاً:

إحصائيات الكود:
- إجمالي الأسطر: ${codeAnalysis.totalLines}
- عدد الدوال: ${codeAnalysis.functionsCount}
- متوسط التعقيد: ${codeAnalysis.averageComplexity}
- الملفات المعقدة: ${codeAnalysis.complexFiles.join(', ')}

الكود:
\`\`\`javascript
${projectCode.substring(0, 8000)} // عرض جزء من الكود
\`\`\`

يرجى تقديم:
1. تقييم عام لجودة الكود (1-10)
2. أهم 5 نقاط قوة
3. أهم 5 نقاط تحتاج تحسين
4. اقتراحات محددة للتحسين
5. أولويات الإصلاح
6. توصيات للأداء والأمان`;

        try {
          const reviewResult = AI.Core.ask(reviewPrompt, {
            generationConfig: { temperature: 0.3, maxOutputTokens: 3000 }
          });

          if (reviewResult.type === 'info' && reviewResult.text) {
            aiReview = reviewResult.text;
          }
        } catch (e) {
          Utils.warn('Failed to generate AI code review', e);
        }
      }

      // حفظ النتائج
      const logSheetName = Config.get('DEVELOPMENT_LOG_SHEET') || 'Development_Log';
      const logSheet = Utils.getSheet(logSheetName, [
        'تاريخ المراجعة', 'إجمالي الأسطر', 'عدد الدوال', 'متوسط التعقيد',
        'الملفات المعقدة', 'مراجعة الذكاء الاصطناعي'
      ]);

      if (logSheet) {
        logSheet.appendRow([
          new Date(),
          codeAnalysis.totalLines,
          codeAnalysis.functionsCount,
          codeAnalysis.averageComplexity,
          codeAnalysis.complexFiles.join(', '),
          aiReview || 'غير متوفر'
        ]);
      }

      // حفظ في الذاكرة طويلة الأمد
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('WeeklyCodeReview', {
          agent: 'Developer',
          analysis: codeAnalysis,
          aiReview: aiReview,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return {
        type: 'success',
        text: 'تمت مراجعة الكود الأسبوعية المحسنة بنجاح',
        data: {
          analysis: codeAnalysis,
          aiReview: aiReview,
          loggedToSheet: !!logSheet
        }
      };

    }, [], 'Developer.runWeeklyCodeReview', () => {
      const duration = Date.now() - start;
      _recordInvocation('runWeeklyCodeReview', status, duration, {
        details: { hasAiReview: !!aiReview }
      });
    });
  }

  function analyzeCodeComplexity(fileName) {
    const start = Date.now();
    let status = 'processing';

    try {
      const code = fileName ? _getSingleFileContent(fileName) : _getProjectSourceCode();
      if (!code) {
        status = 'no_code';
        return {
          type: 'warning',
          text: `تعذر قراءة الكود${fileName ? ` للملف: ${fileName}` : ''}`
        };
      }

      const complexity = _performDetailedComplexityAnalysis(code);

      // تحليل بالذكاء الاصطناعي
      let aiComplexityAnalysis = null;
      if (AI?.Core?.ask) {
        const complexityPrompt = `كخبير في تحليل جودة الكود، حلل التعقيد التالي وقدم توصيات:

تحليل التعقيد:
- التعقيد السايكلوماتي: ${complexity.cyclomaticComplexity}
- عمق التداخل: ${complexity.nestingDepth}
- طول الدوال: ${complexity.averageFunctionLength}
- عدد المعاملات: ${complexity.averageParameters}

الكود:
\`\`\`javascript
${code.substring(0, 4000)}
\`\`\`

يرجى تقديم:
1. تقييم مستوى التعقيد (منخفض/متوسط/عالي)
2. المناطق الأكثر تعقيداً
3. اقتراحات محددة لتقليل التعقيد
4. أولويات إعادة الهيكلة`;

        try {
          const analysisResult = AI.Core.ask(complexityPrompt, {
            generationConfig: { temperature: 0.2, maxOutputTokens: 2000 }
          });

          if (analysisResult.type === 'info' && analysisResult.text) {
            aiComplexityAnalysis = analysisResult.text;
          }
        } catch (e) {
          Utils.warn('Failed to generate AI complexity analysis', e);
        }
      }

      status = 'success';
      return {
        type: 'success',
        text: aiComplexityAnalysis || 'تم تحليل تعقيد الكود بنجاح',
        data: {
          fileName: fileName,
          complexity: complexity,
          aiAnalysis: aiComplexityAnalysis
        }
      };

    } catch (e) {
      status = 'exception';
      Utils.error(`Code complexity analysis failed: ${e.message}`, e.stack);
      return {
        type: 'error',
        text: `فشل في تحليل تعقيد الكود: ${e.message}`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('analyzeCodeComplexity', status, duration, {
        details: { fileName: fileName || 'entire_project' }
      });
    }
  }

  function generateCodeDocumentation(fileName) {
    const start = Date.now();
    let status = 'processing';

    try {
      const code = fileName ? _getSingleFileContent(fileName) : _getProjectSourceCode();
      if (!code) {
        status = 'no_code';
        return {
          type: 'warning',
          text: `تعذر قراءة الكود${fileName ? ` للملف: ${fileName}` : ''}`
        };
      }

      // توليد وثائق بالذكاء الاصطناعي
      let documentation = null;
      if (AI?.Core?.ask) {
        const docPrompt = `كخبير في توثيق الكود، أنشئ وثائق شاملة للكود التالي:

${fileName ? `الملف: ${fileName}` : 'المشروع الكامل'}

الكود:
\`\`\`javascript
${code}
\`\`\`

يرجى إنشاء:
1. وصف عام للوحدة/المشروع
2. قائمة بالدوال الرئيسية مع وصف كل دالة
3. المعاملات المطلوبة والاختيارية
4. أمثلة على الاستخدام
5. ملاحظات مهمة للمطورين
6. التبعيات المطلوبة

تنسيق الإخراج: Markdown`;

        try {
          const docResult = AI.Core.ask(docPrompt, {
            generationConfig: { temperature: 0.1, maxOutputTokens: 4000 }
          });

          if (docResult.type === 'info' && docResult.text) {
            documentation = docResult.text;
          }
        } catch (e) {
          Utils.error('Failed to generate documentation', e);
        }
      }

      if (!documentation) {
        status = 'ai_unavailable';
        return {
          type: 'error',
          text: 'فشل في توليد الوثائق: خدمة الذكاء الاصطناعي غير متوفرة'
        };
      }

      // حفظ الوثائق
      const docSheetName = Config.get('CODE_DOCUMENTATION_SHEET') || 'Code_Documentation';
      const docSheet = Utils.getSheet(docSheetName, [
        'التاريخ', 'الملف', 'الوثائق'
      ]);

      if (docSheet) {
        docSheet.appendRow([
          new Date(),
          fileName || 'المشروع الكامل',
          documentation
        ]);
      }

      // حفظ في الذاكرة طويلة الأمد
      if (AI?.LongTermMemory?.save) {
        AI.LongTermMemory.save('CodeDocumentation', {
          agent: 'Developer',
          fileName: fileName,
          documentation: documentation,
          timestamp: new Date().toISOString()
        });
      }

      status = 'success';
      return {
        type: 'success',
        text: 'تم توليد وثائق الكود بنجاح',
        data: {
          fileName: fileName,
          documentation: documentation,
          savedToSheet: !!docSheet
        }
      };

    } catch (e) {
      status = 'exception';
      Utils.error(`Code documentation generation failed: ${e.message}`, e.stack);
      return {
        type: 'error',
        text: `فشل في توليد وثائق الكود: ${e.message}`
      };
    } finally {
      const duration = Date.now() - start;
      _recordInvocation('generateCodeDocumentation', status, duration, {
        details: { fileName: fileName || 'entire_project' }
      });
    }
  }

  // دوال مساعدة محسنة
  function _performCodeAnalysis(code) {
    const lines = code.split('\n');
    const functions = code.match(/function\s+\w+|\w+\s*[:=]\s*function|\w+\s*=>|defineModule/g) || [];
    const complexityMatches = code.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || [];

    // تحليل الملفات المعقدة
    const fileBlocks = code.split('// --- START OF FILE:');
    const complexFiles = [];

    fileBlocks.forEach(block => {
      const fileMatch = block.match(/([^\n]+)/);
      if (fileMatch) {
        const fileName = fileMatch[1].trim();
        const fileComplexity = (block.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || []).length;
        if (fileComplexity > 20) {
          complexFiles.push(fileName);
        }
      }
    });

    return {
      totalLines: lines.length,
      functionsCount: functions.length,
      averageComplexity: Math.round(complexityMatches.length / Math.max(functions.length, 1)),
      complexFiles: complexFiles.slice(0, 5) // أكثر 5 ملفات تعقيداً
    };
  }

  function _performDetailedComplexityAnalysis(code) {
    const cyclomaticComplexity = (code.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || []).length + 1;
    const nestingDepth = _calculateMaxNestingDepth(code);
    const functions = code.match(/function[^{]*{[^}]*}/g) || [];
    const averageFunctionLength = functions.reduce((sum, fn) => sum + fn.split('\n').length, 0) / Math.max(functions.length, 1);
    const parameters = code.match(/function[^(]*\(([^)]*)\)/g) || [];
    const averageParameters = parameters.reduce((sum, param) => {
      const paramCount = param.split(',').filter(p => p.trim()).length;
      return sum + paramCount;
    }, 0) / Math.max(parameters.length, 1);

    return {
      cyclomaticComplexity,
      nestingDepth,
      averageFunctionLength: Math.round(averageFunctionLength),
      averageParameters: Math.round(averageParameters)
    };
  }

  function _calculateMaxNestingDepth(code) {
    let maxDepth = 0;
    let currentDepth = 0;

    for (const char of code) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }

    return maxDepth;
  }

  function _getProjectFiles() {
    try {
      if (typeof AppsScript !== 'undefined' && AppsScript.Projects?.getContent) {
        const content = AppsScript.Projects.getContent(ScriptApp.getScriptId());
        return content.files.filter(f => f.type === 'SERVER_JS');
      }
    } catch (e) {
      Utils.error('Failed to fetch project files', e);
    }
    return null;
  }

  function _getProjectSourceCode() {
    const files = _getProjectFiles();
    if (!files) return null;
    return files.map(f => `//--- FILE: ${f.name} ---\n${f.source}`).join('\n\n');
  }

  function _getSingleFileContent(fileName) {
    const files = _getProjectFiles();
    if (!files) return null;
    const file = files.find(f => f.name === fileName);
    return file ? file.source : null;
  }

  return {
    handleRequest,
    runWeeklyCodeReview,
    analyzeCodeComplexity,
    generateCodeDocumentation,
    MODULE_VERSION
  };
});
