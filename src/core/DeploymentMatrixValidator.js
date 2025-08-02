/**
 * مدقق مصفوفة النشر - Deployment Matrix Validator
 * يتحقق من أذونات النشر وينفذ قواعد التوافق
 */
defineModule('System.Core.DeploymentMatrixValidator', ({ Utils, Config }) => {
  
  let deploymentMatrix = null;

  return {
    /**
     * تحميل مصفوفة النشر
     */
    async loadDeploymentMatrix() {
      if (!deploymentMatrix) {
        try {
          // قراءة ملف YAML (محاكاة)
          const matrixData = PropertiesService.getScriptProperties()
            .getProperty('DEPLOYMENT_MATRIX');
          
          if (matrixData) {
            deploymentMatrix = JSON.parse(matrixData);
          } else {
            // تحميل افتراضي
            deploymentMatrix = this.getDefaultMatrix();
          }
        } catch (error) {
          Logger.error('خطأ في تحميل مصفوفة النشر:', error);
          deploymentMatrix = this.getDefaultMatrix();
        }
      }
      return deploymentMatrix;
    },

    /**
     * التحقق من إذن النشر
     */
    async validateDeployment(assistant, changeType, files, options = {}) {
      const matrix = await this.loadDeploymentMatrix();
      const assistantConfig = matrix.deployment_matrix[assistant];
      
      if (!assistantConfig) {
        return {
          allowed: false,
          reason: 'مساعد غير معروف',
          action: 'block'
        };
      }

      // فحص النوع المسموح
      if (!assistantConfig.allowed_changes.includes(changeType)) {
        return {
          allowed: false,
          reason: `نوع التغيير ${changeType} غير مسموح للمساعد ${assistant}`,
          action: 'block'
        };
      }

      // فحص النوع المحظور
      if (assistantConfig.blocked_changes.includes(changeType)) {
        return {
          allowed: false,
          reason: `نوع التغيير ${changeType} محظور للمساعد ${assistant}`,
          action: 'block'
        };
      }

      // فحص القيود
      const restrictionCheck = await this.checkRestrictions(
        assistant, 
        changeType, 
        assistantConfig.restrictions[changeType],
        files
      );

      if (!restrictionCheck.passed) {
        return {
          allowed: false,
          reason: restrictionCheck.reason,
          action: restrictionCheck.action,
          details: restrictionCheck.details
        };
      }

      // فحص التوافق
      const compatibilityCheck = await this.checkCompatibility(
        assistant,
        changeType,
        assistantConfig.restrictions[changeType]?.dependencies || []
      );

      if (!compatibilityCheck.passed) {
        return {
          allowed: compatibilityCheck.action !== 'block',
          reason: compatibilityCheck.reason,
          action: compatibilityCheck.action,
          warnings: compatibilityCheck.warnings
        };
      }

      // فحص النافذة الزمنية
      const timeWindowCheck = this.checkDeploymentWindow(changeType);
      if (!timeWindowCheck.allowed) {
        return {
          allowed: false,
          reason: timeWindowCheck.reason,
          action: 'block',
          nextWindow: timeWindowCheck.nextWindow
        };
      }

      return {
        allowed: true,
        requiresApproval: assistantConfig.require_approval,
        autoDeployEnabled: assistantConfig.auto_deploy
      };
    },

    /**
     * فحص القيود
     */
    async checkRestrictions(assistant, changeType, restrictions, files) {
      if (!restrictions) {
        return { passed: true };
      }

      const conditions = restrictions.conditions || {};
      
      for (const [condition, required] of Object.entries(conditions)) {
        const checkResult = await this.evaluateCondition(condition, required, files);
        
        if (!checkResult.passed) {
          return {
            passed: false,
            reason: `شرط ${condition} غير محقق`,
            action: 'block',
            details: checkResult.details
          };
        }
      }

      return { passed: true };
    },

    /**
     * تقييم شرط معين
     */
    async evaluateCondition(condition, required, files) {
      switch (condition) {
        case 'backend_stable':
          return await this.checkBackendStability();
        
        case 'no_breaking_changes':
          return await this.checkBreakingChanges(files);
        
        case 'api_version_match':
          return await this.checkApiVersionMatch();
        
        case 'existing_tests_pass':
          return await this.runExistingTests();
        
        case 'ui_compatible':
          return await this.checkUICompatibility();
        
        case 'memory_usage_acceptable':
          return await this.checkMemoryUsage();
        
        default:
          Logger.warn(`شرط غير معروف: ${condition}`);
          return { passed: true };
      }
    },

    /**
     * فحص التوافق
     */
    async checkCompatibility(assistant, changeType, dependencies) {
      const matrix = await this.loadDeploymentMatrix();
      const checks = matrix.compatibility_checks || {};
      const warnings = [];
      
      for (const dependency of dependencies) {
        const checkName = dependency.check;
        const action = dependency.action;
        const checkConfig = checks[checkName];
        
        if (!checkConfig) {
          warnings.push(`فحص التوافق ${checkName} غير موجود`);
          continue;
        }

        const result = await this.runCompatibilityCheck(checkConfig);
        
        if (!result.passed) {
          if (action === 'block_if_false') {
            return {
              passed: false,
              reason: `فشل فحص التوافق: ${checkConfig.description}`,
              action: 'block'
            };
          } else if (action === 'warn_if_false') {
            warnings.push(`تحذير: ${checkConfig.description}`);
          }
        }
      }

      return {
        passed: true,
        warnings
      };
    },

    /**
     * تشغيل فحص التوافق
     */
    async runCompatibilityCheck(checkConfig) {
      try {
        // محاكاة تشغيل الأمر
        const result = await Utils.executeCommand(checkConfig.command, {
          timeout: checkConfig.timeout * 1000
        });
        
        return {
          passed: result.exitCode === 0,
          output: result.output
        };
      } catch (error) {
        Logger.error(`فشل فحص التوافق: ${checkConfig.description}`, error);
        return {
          passed: false,
          error: error.message
        };
      }
    },

    /**
     * فحص النافذة الزمنية
     */
    checkDeploymentWindow(changeType) {
      const matrix = deploymentMatrix;
      const windows = matrix.deployment_windows;
      const now = new Date();
      
      // فحص النشر الطارئ
      if (changeType === 'critical') {
        const emergencyWindow = windows.emergency;
        if (emergencyWindow.days.includes('all') && emergencyWindow.hours === 'all') {
          return { allowed: true };
        }
      }

      // فحص النافذة العادية
      const normalWindow = windows.normal;
      const currentDay = now.toLocaleDateString('en', { weekday: 'lowercase' });
      const currentHour = now.getHours();
      
      if (!normalWindow.days.includes(currentDay)) {
        return {
          allowed: false,
          reason: 'خارج أيام النشر المسموحة',
          nextWindow: this.getNextDeploymentWindow()
        };
      }

      const [startHour, endHour] = normalWindow.hours.split('-').map(h => parseInt(h.split(':')[0]));
      if (currentHour < startHour || currentHour >= endHour) {
        return {
          allowed: false,
          reason: 'خارج ساعات النشر المسموحة',
          nextWindow: this.getNextDeploymentWindow()
        };
      }

      return { allowed: true };
    },

    /**
     * فحص التضارب
     */
    async checkConflicts(assistant, changeType, files) {
      const matrix = await this.loadDeploymentMatrix();
      const conflictRules = matrix.conflict_resolution;
      
      // فحص التضارب بين UI و AI
      if (changeType === 'ui' || changeType === 'ai') {
        const activeDeployments = await this.getActiveDeployments();
        const conflictingDeployment = activeDeployments.find(d => 
          (d.changeType === 'ui' && changeType === 'ai') ||
          (d.changeType === 'ai' && changeType === 'ui')
        );
        
        if (conflictingDeployment) {
          const rule = conflictRules.ui_ai_conflict;
          return {
            hasConflict: true,
            rule,
            conflictingDeployment
          };
        }
      }

      // فحص تضارب الملفات الحرجة
      const criticalFiles = ['src/core/', 'config/', 'package.json'];
      const hasCriticalFiles = files.some(file => 
        criticalFiles.some(critical => file.includes(critical))
      );
      
      if (hasCriticalFiles) {
        const activeDeployments = await this.getActiveDeployments();
        if (activeDeployments.length > 0) {
          const rule = conflictRules.critical_files_conflict;
          return {
            hasConflict: true,
            rule,
            activeDeployments
          };
        }
      }

      return { hasConflict: false };
    },

    /**
     * إرسال إشعار للمراجعة البشرية
     */
    async requestHumanReview(assistant, changeType, reason, details = {}) {
      const matrix = await this.loadDeploymentMatrix();
      const notifications = matrix.notifications;
      
      const message = this.formatMessage('deployment_blocked', {
        assistant,
        change_type: changeType,
        reason,
        required_action: 'مراجعة بشرية مطلوبة'
      });

      // إرسال إشعار Slack
      if (notifications.slack?.webhook_url) {
        await this.sendSlackNotification(
          notifications.slack.webhook_url,
          notifications.slack.channels.alerts,
          message
        );
      }

      // إرسال إشعار Discord
      if (notifications.discord?.webhook_url) {
        await this.sendDiscordNotification(
          notifications.discord.webhook_url,
          message
        );
      }

      // حفظ طلب المراجعة
      this.saveReviewRequest({
        assistant,
        changeType,
        reason,
        details,
        timestamp: new Date().toISOString(),
        status: 'pending'
      });
    },

    /**
     * تنسيق الرسالة
     */
    formatMessage(template, variables) {
      const matrix = deploymentMatrix;
      const messageTemplate = matrix.message_templates[template];
      
      if (!messageTemplate) {
        return `${template}: ${JSON.stringify(variables)}`;
      }

      let message = `${messageTemplate.title}\n\n${messageTemplate.body}`;
      
      for (const [key, value] of Object.entries(variables)) {
        message = message.replace(`{${key}}`, value);
      }
      
      return message;
    },

    /**
     * الحصول على المصفوفة الافتراضية
     */
    getDefaultMatrix() {
      return {
        deployment_matrix: {
          copilot: {
            allowed_changes: ['ui', 'test', 'docs'],
            blocked_changes: ['ai', 'config', 'critical'],
            auto_deploy: false,
            require_approval: true
          },
          gemini: {
            allowed_changes: ['ai', 'agents', 'analysis'],
            blocked_changes: ['ui', 'config', 'critical'],
            auto_deploy: true,
            require_approval: false
          },
          human: {
            allowed_changes: ['critical', 'config', 'ui', 'ai', 'docs'],
            blocked_changes: [],
            auto_deploy: false,
            require_approval: false
          }
        }
      };
    }
  };
});