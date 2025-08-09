/**
 * مدير Git المركزي
 * Centralized Git Manager for coordinated pushes
 */
defineModule('System.Core.GitManager', ({ ChangeSyncAgent, Utils, Config }) => {

  return {
    /**
     * رفع تغييرات مساعد محدد
     */
    async pushAssistantChanges(assistant, changes, options = {}) {
      try {
        // فحص التضارب
        const conflicts = this.checkForConflicts(changes);
        if (conflicts.length > 0 && !options.force) {
          throw new Error(`تضارب مع تغييرات أخرى: ${conflicts.map(c => c.id).join(', ')}`);
        }

        // تسجيل التغييرات
        const changeIds = changes.map(change =>
          ChangeSyncAgent.registerChange(
            assistant,
            change.type,
            change.files,
            change.description
          )
        );

        // رفع إلى GitHub
        const result = await ChangeSyncAgent.pushToGitHub(changes, assistant);

        // إشعار المساعدين الآخرين
        this.notifySuccessfulPush(assistant, changes);

        return {
          success: true,
          changeIds,
          gitResult: result
        };

      } catch (error) {
        Logger.error(`خطأ في رفع تغييرات ${assistant}:`, error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * فحص التضارب
     */
    checkForConflicts(newChanges) {
      const conflicts = [];

      newChanges.forEach(change => {
        const changeConflicts = ChangeSyncAgent.checkConflicts(change);
        conflicts.push(...changeConflicts);
      });

      return conflicts;
    },

    /**
     * إشعار بنجاح الرفع
     */
    notifySuccessfulPush(assistant, changes) {
      const notification = {
        type: 'push_success',
        assistant,
        changes: changes.length,
        timestamp: new Date().toISOString()
      };

      // إرسال للمساعدين الآخرين
      ChangeSyncAgent.notifyOtherAssistants({
        assistant: 'system',
        changeType: 'notification',
        description: `${assistant} رفع ${changes.length} تغييرات بنجاح`
      });
    },

    /**
     * رفع طارئ (للتغييرات الحرجة)
     */
    async emergencyPush(assistant, change, reason) {
      const emergencyChange = {
        ...change,
        type: 'critical',
        emergency: true,
        reason
      };

      return await this.pushAssistantChanges(assistant, [emergencyChange], { force: true });
    },

    /**
     * مزامنة مع GitHub
     */
    async syncWithGitHub() {
      try {
        // سحب آخر التحديثات
        await Utils.executeCommand('git pull origin master');

        // فحص الحالة
        const status = await Utils.executeCommand('git status --porcelain');

        return {
          success: true,
          hasChanges: status.trim().length > 0,
          status: status
        };

      } catch (error) {
        Logger.error('خطأ في المزامنة:', error);
        return {
          success: false,
          error: error.message
        };
      }
    },

    /**
     * إنشاء فرع للمساعد
     */
    async createAssistantBranch(assistant, feature) {
      const branchName = `${assistant}/${feature}-${Date.now()}`;

      try {
        await Utils.executeCommand(`git checkout -b ${branchName}`);
        return { success: true, branch: branchName };
      } catch (error) {
        return { success: false, error: error.message };
      }
    },

    /**
     * دمج فرع المساعد
     */
    async mergeAssistantBranch(branchName, assistant) {
      try {
        // التبديل للفرع الرئيسي
        await Utils.executeCommand('git checkout master');

        // دمج الفرع
        await Utils.executeCommand(`git merge ${branchName}`);

        // حذف الفرع
        await Utils.executeCommand(`git branch -d ${branchName}`);

        // رفع التغييرات
        await Utils.executeCommand('git push origin master');

        return { success: true };

      } catch (error) {
        Logger.error(`خطأ في دمج فرع ${assistant}:`, error);
        return { success: false, error: error.message };
      }
    }
  };
});
