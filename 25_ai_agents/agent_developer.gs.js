// *************************************************************************************************
// --- START OF FILE: 25_ai_agents/agent_developer.gs ---
// *************************************************************************************************

/**
 * @file 25_ai_agents/agent_developer.gs
 * @module System.AgentDeveloper
 * @version 21 // تم تحديث الإصدار ليعكس الدمج الجديد والتنفيذ الفعلي للوظائف
 * @author عبدالعزيز
 * @description
 * وكيل ذكاء اصطناعي متخصص في مهام المطورين. يمتلك مجموعة من القدرات
 * لمراجعة الكود، اقتراح التحسينات، وتحليل جودة المشروع بشكل دوري وتفاعلي.
 * يدعم الآن واجهة موحدة handleRequest للتوجيه من AgentDispatcher.
 * مرتبطة بـ: AI.Core, Config, Utils, AppsScript API
 */

defineModule('System.AI.Agents.Developer', ({ Utils, Config, DocsManager, AI, Telemetry, Context, Tools, ModuleVerifier, Security }) => {
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

  /**
   * الواجهة الموحدة لاستقبال الطلبات من AgentDispatcher.
   * تقوم بتوجيه الطلبات بناءً على النية المكتشفة.
   * @param {{ sessionId: string, message: string, intent: object }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function handleRequest({ sessionId, message, intent }) {
    const start = Date.now();
    let status = 'processing';

    try {
      // ✅ تطبيق البرمجة الدفاعية (المرحلة 8، الخطوة 4)
      if (!ModuleVerifier?.checkReady('AI', ['Core', 'Context'])) {
        status = 'dependencies_not_ready';
        return { type: 'error', text: 'Developer Agent: Core AI dependencies are not ready.' };
      }
      if (!ModuleVerifier?.checkReady('Tools', ['ProjectService'])) {
        status = 'tools_not_ready';
        return { type: 'error', text: 'Developer Agent: ProjectService tool is not ready.' };
      }

      Utils.log(`Developer Agent: Processing - Intent: ${intent.type}, Message: "${message}"`);

      switch (intent.type) {
        case 'tool_call':
          const toolName = intent.data?.toolName || intent.data?.functionName;
          
          if (toolName === 'Developer.runWeeklyCodeReview') {
            const result = runWeeklyCodeReview();
            status = result.type === 'success' ? 'success' : 'error';
            return result;
          } else if (toolName === 'Developer.generateCodeFromPrompt') {
            const result = generateCodeFromPrompt({ description: intent.data?.description });
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
          } else if (toolName === 'Developer.suggestRefactoring') {
            if (intent.data?.fileName) {
              const result = suggestRefactoring(intent.data.fileName);
              status = result.type === 'success' ? 'success' : 'error';
              return result;
            } else {
              status = 'missing_parameter';
              return { type: 'error', text: 'Developer Agent: يتطلب suggestRefactoring اسم ملف.' };
            }
          } else if (toolName === 'Developer.logCodeQualityMetrics') {
            const result = logCodeQualityMetrics();
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

  /**
   * يولد كودًا أو صيغة بناءً على وصف المستخدم وسياق ورقة العمل.
   * @param {{ description: string }} args
   * @returns {{ type: string, text: string, data?: any }}
   */
  function generateCodeFromPrompt({ description }) {
    return Utils.executeSafely(() => {
      const sanitizedDescription = Security.sanitize(description);
      Utils.log(`AgentDeveloper: Generating code for description: "${sanitizedDescription}"`);

      // 1. بناء السياق من الورقة النشطة
      const sheetContext = AI.Context.build({ sessionId: 'code-gen-session', includeSheetContext: true, includeTools: false, includeLongTermMemory: false });
      const contextText = sheetContext.systemInstruction;

      // 2. بناء Prompt هندسي دقيق
      const engineeredPrompt = `
أنت خبير برمجة Google Apps Script وصيغ Google Sheets. مهمتك هي تحويل وصف المستخدم إلى كود أو صيغة قابلة للتنفيذ.

**سياق ورقة العمل الحالية:**
${contextText}

**وصف المستخدم:**
"${sanitizedDescription}"

**المطلوب:**
1.  **حدد النية:** هل الطلب هو (أ) صيغة (Formula) لخلية واحدة، (ب) كود برمجي (Apps Script) لتنفيذ مهمة.
2.  **ولّد الناتج:**
    - إذا كانت **صيغة**، أرجع الصيغة فقط، بدون أي نص إضافي. مثال: \`=VLOOKUP(A2, 'Data'!A:B, 2, FALSE)\`.
    - إذا كان **كود برمجي**، أرجع الكود داخل كتلة \`\`\`javascript. تأكد أن الكود كامل وفعّال.
3.  **أضف شرحًا:** في فقرة منفصلة، اشرح بإيجاز ماذا يفعل الكود أو الصيغة.
`;

      // 3. استدعاء AI.Core
      const aiResponse = AI.Core.ask(engineeredPrompt, {
        modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest',
        generationConfig: { temperature: 0.2 } // درجة حرارة منخفضة للحصول على كود دقيق
      });

      if (aiResponse.type === 'info' || aiResponse.type === 'text_response') {
        const responseText = aiResponse.text;
        const codeBlock = Utils.extractCodeBlocks(responseText, 'javascript')[0] || '';
        const explanation = Utils.removeCodeBlocks(responseText, 'javascript').trim();

        const isFormula = codeBlock.startsWith('=');

        return {
          type: 'success',
          text: 'تم توليد الكود بنجاح.',
          data: {
            code: codeBlock,
            explanation: explanation,
            isFormula: isFormula
          }
        };
      } else {
        Utils.error('AgentDeveloper.generateCodeFromPrompt: Failed to get a valid response from AI.Core', aiResponse);
        return { type: 'error', text: `فشل توليد الكود: ${aiResponse.text}` };
      }

    }, [], 'AgentDeveloper.generateCodeFromPrompt');
  }

  /**
   * يقوم بمراجعة أسبوعية للكود ويقدم تقارير حول جودته.
   * يستدعي AI.Core لتحليل الكود ويسجل النتائج في Google Sheet.
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function runWeeklyCodeReview() {
    return Utils.executeSafely(() => {
      Utils.log('AgentDeveloper: Starting weekly code review.');
      const projectCode = Tools.ProjectService.getProjectSourceCode();
      if (!projectCode) {
        Utils.warn('AgentDeveloper.runWeeklyCodeReview: No project source code found to review.');
        return { type: 'warning', text: 'لا يوجد كود مشروع للمراجعة.' };
      }

      const prompt = `أنت مهندس برمجيات خبير في Google Apps Script. راجع كود G-Assistant التالي وقدم 3 اقتراحات رئيسية لتحسين الأداء، الموثوقية، أو قابلية الصيانة. أجب باللغة العربية.\n\nالكود:\n\`\`\`javascript\n${projectCode}\n\`\`\``;
      
      // التأكد من أن AI.Core متاح وقابل للاستدعاء
      if (!AI || !AI.Core || typeof AI.Core.ask !== 'function') {
        Utils.error('AgentDeveloper.runWeeklyCodeReview: AI.Core.ask is not defined or callable.');
        return { type: 'error', text: 'فشل في مراجعة الكود: خدمة الذكاء الاصطناعي غير متوفرة.' };
      }

      const reviewResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest' });

      // ✅ تحديث: تجهيز النتائج في ورشة العمل بدلاً من السجل العام
      const workshopSheetName = Config.get('DEVELOPER_WORKSHOP_SHEET') || 'Developer_Workshop';
      const workshopSheet = Utils.getSheet(workshopSheetName, ["تاريخ", "الفئة", "الملف المقترح", "ملخص المراجعة", "الكود المقترح", "الحالة"]);

      if (workshopSheet && (reviewResult.type === 'info' || reviewResult.type === 'text_response') && reviewResult.text) {
        workshopSheet.appendRow([
            new Date(),
            'مراجعة أسبوعية',
            'المشروع بأكمله',
            reviewResult.text,
            '', // لا يوجد كود مقترح محدد في هذه المراجعة العامة
            'للمراجعة'
        ]);
        Utils.log('AgentDeveloper: Weekly code review suggestions staged in workshop.', { sheet: workshopSheetName });
        return { type: 'success', text: 'تمت مراجعة الكود الأسبوعية وتسجيل الاقتراحات بنجاح.' };
      } else {
        Utils.error('AgentDeveloper: Failed to get valid review result or workshop sheet.', reviewResult);
        return { type: 'error', text: 'فشل في الحصول على نتائج المراجعة أو تسجيلها.' };
      }
    }, [], 'AgentDeveloper.runWeeklyCodeReview');
  }

  /**
   * يقترح تحسينات وإعادة هيكلة للكود في ملف معين.
   * يستدعي AI.Core لتحليل الكود وتقديم اقتراحات.
   * @param {string} fileName اسم الملف المراد إعادة هيكلته.
   * @returns {{ type: string, text: string, data?: any }} نتيجة العملية.
   */
  function suggestRefactoring(fileName) {
    return Utils.executeSafely(() => {
      const code = Tools.ProjectService.getSingleFileContent(fileName);
      if (!code) {
        Utils.warn(`AgentDeveloper.suggestRefactoring: Could not read file: ${fileName}`);
        return { type: 'warning', text: `تعذر قراءة محتوى الملف: ${fileName}.` };
      }

      const prompt = `أنت مهندس برمجيات خبير. راجع كود الوحدة التالية (${fileName}) واقترح تحسينات محددة لتحسين النظافة والكفاءة والأداء. أجب باللغة العربية.\n\nالكود:\n\`\`\`javascript\n${code}\n\`\`\``;
      
      // التأكد من أن AI.Core متاح وقابل للاستدعاء
      if (!AI || !AI.Core || typeof AI.Core.ask !== 'function') {
        Utils.error('AgentDeveloper.suggestRefactoring: AI.Core.ask is not defined or callable.');
        return { type: 'error', text: 'فشل في اقتراح إعادة الهيكلة: خدمة الذكاء الاصطناعي غير متوفرة.' };
      }

      const refactorResult = AI.Core.ask(prompt, { modelOverride: Config.get('GEMINI_PRO_MODEL') || 'gemini-1.5-pro-latest' });

      if ((refactorResult.type === 'info' || refactorResult.type === 'text_response') && refactorResult.text) {
        Utils.log(`AgentDeveloper: Refactoring suggestions for ${fileName} generated.`, { result: refactorResult.text.substring(0, 100) });
        return { type: 'success', text: `تم اقتراح تحسينات لـ ${fileName}:\n${refactorResult.text}` };
      } else {
        Utils.error('AgentDeveloper: Failed to get valid refactoring suggestions.', refactorResult);
        return { type: 'error', text: `فشل في الحصول على اقتراحات إعادة الهيكلة لـ ${fileName}.` };
      }
    }, [], 'AgentDeveloper.suggestRefactoring');
  }

  /**
   * يسجل مقاييس جودة الكود للمشروع (مثل التعقيد السايكلوماتي وعدد الأسطر).
   * @returns {{ type: string, text: string }} نتيجة العملية.
   */
  function logCodeQualityMetrics() {
    return Utils.executeSafely(() => {
      const files = Tools.ProjectService.getProjectFiles();
      if (!files || files.length === 0) {
        Utils.warn('AgentDeveloper.logCodeQualityMetrics: No project files found to analyze.');
        return { type: 'warning', text: 'لا توجد ملفات مشروع لتحليل مقاييس الجودة.' };
      }

      const metrics = files.map(file => {
        const complexity = _estimateCyclomaticComplexity(file.source);
        return { file: file.name, complexity: complexity, lines: file.source.split('\n').length };
      });

      const logSheetName = Config.get('CODE_QUALITY_METRICS_SHEET') || "Code_Quality_Metrics"; // يمكن تعريف اسم الشيت في Config
      const logSheet = Utils.getSheet(logSheetName, ["التاريخ", "الملف", "درجة التعقيد", "عدد الأسطر"]);

      if (logSheet) {
        metrics.forEach(m => logSheet.appendRow([new Date(), m.file, m.complexity, m.lines]));
        Utils.log("AgentDeveloper: Code quality metrics logged.", { count: metrics.length, sheet: logSheetName });
        return { type: 'success', text: `تم تسجيل مقاييس جودة الكود لـ ${metrics.length} ملفات بنجاح.` };
      } else {
        Utils.error(`AgentDeveloper: Failed to get sheet '${logSheetName}' for logging metrics.`);
        return { type: 'error', text: `فشل في تسجيل مقاييس جودة الكود: تعذر الوصول إلى الشيت.` };
      }
    }, [], 'AgentDeveloper.logCodeQualityMetrics');
  }

  /**
   * يقدر التعقيد السايكلوماتي لكود معين.
   * @param {string} code الكود المراد تقدير تعقيده.
   * @returns {number} التعقيد السايكلوماتي المقدر.
   * @private
   */
  function _estimateCyclomaticComplexity(code) {
    // تعقيد سايكلوماتي: عدد نقاط القرار + 1
    // الكلمات المفتاحية التي تزيد التعقيد: if, for, while, case, catch, &&, ||, ?
    const keywords = (code.match(/\b(if|for|while|case|catch|&&|\|\||\?)\b/g) || []).length;
    return 1 + keywords;
  }

  // إضافة دوال جديدة محسنة
  function analyzeCodeComplexity(fileName) {
    const start = Date.now();
    let status = 'processing';

    try {
      const code = fileName ? Tools.ProjectService.getSingleFileContent(fileName) : Tools.ProjectService.getProjectSourceCode();
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
      const code = fileName ? Tools.ProjectService.getSingleFileContent(fileName) : Tools.ProjectService.getProjectSourceCode();
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
    
    for (let char of code) {
      if (char === '{') {
        currentDepth++;
        maxDepth = Math.max(maxDepth, currentDepth);
      } else if (char === '}') {
        currentDepth--;
      }
    }
    
    return maxDepth;
  }

  const exports = {
    handleRequest,
    generateCodeFromPrompt,
    runWeeklyCodeReview,
    suggestRefactoring,
    logCodeQualityMetrics,
    analyzeCodeComplexity,
    generateCodeDocumentation,
    MODULE_VERSION
  };

  // Register with main AI.Agents module
  if (typeof GAssistant !== 'undefined' && GAssistant.AI && GAssistant.AI.Agents) {
    GAssistant.AI.Agents.registerSubModule('Developer', exports);
  }

  return exports;
});
