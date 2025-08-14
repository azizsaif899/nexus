/**
 * ⚡ Optimistic Updates - TASK-008
 * التحديثات المتفائلة للاستجابة الفورية
 */

import { eventBus, EventTypes } from './event-bus';

export interface OptimisticUpdate<T = any> {
  id: string;
  type: string;
  data: T;
  timestamp: Date;
  status: 'pending' | 'success' | 'failed';
  rollback?: () => void;
}

export class OptimisticUpdateManager {
  private updates: Map<string, OptimisticUpdate> = new Map();
  private callbacks: Map<string, (update: OptimisticUpdate) => void> = new Map();

  /**
   * تطبيق تحديث متفائل
   */
  async applyUpdate<T>(
    id: string,
    type: string,
    data: T,
    apiCall: () => Promise<any>,
    rollback?: () => void
  ): Promise<boolean> {
    const update: OptimisticUpdate<T> = {
      id,
      type,
      data,
      timestamp: new Date(),
      status: 'pending',
      rollback
    };

    // حفظ التحديث
    this.updates.set(id, update);

    // تطبيق التحديث فوراً في الواجهة
    this.notifyCallbacks(update);

    // إرسال الحدث للمكونات
    await eventBus.publish({
      type: 'optimistic.update.applied',
      source: 'optimistic-manager',
      data: { updateId: id, type, data }
    });

    try {
      // تنفيذ API call في الخلفية
      const result = await apiCall();
      
      // تحديث الحالة للنجاح
      update.status = 'success';
      this.updates.set(id, update);
      
      // إشعار بالنجاح
      await eventBus.publish({
        type: 'optimistic.update.success',
        source: 'optimistic-manager',
        data: { updateId: id, result }
      });

      // إزالة التحديث بعد 5 ثوان
      setTimeout(() => this.removeUpdate(id), 5000);
      
      return true;
    } catch (error) {
      // تحديث الحالة للفشل
      update.status = 'failed';
      this.updates.set(id, update);

      // تطبيق rollback إذا كان متاحاً
      if (rollback) {
        rollback();
      }

      // إشعار بالفشل
      await eventBus.publish({
        type: 'optimistic.update.failed',
        source: 'optimistic-manager',
        data: { updateId: id, error: error.message }
      });

      console.error(`❌ Optimistic update failed: ${id}`, error);
      return false;
    }
  }

  /**
   * تسجيل callback للتحديثات
   */
  onUpdate(type: string, callback: (update: OptimisticUpdate) => void): void {
    this.callbacks.set(type, callback);
  }

  /**
   * إلغاء تسجيل callback
   */
  offUpdate(type: string): void {
    this.callbacks.delete(type);
  }

  /**
   * الحصول على تحديث معين
   */
  getUpdate(id: string): OptimisticUpdate | undefined {
    return this.updates.get(id);
  }

  /**
   * الحصول على جميع التحديثات المعلقة
   */
  getPendingUpdates(): OptimisticUpdate[] {
    return Array.from(this.updates.values()).filter(u => u.status === 'pending');
  }

  /**
   * إزالة تحديث
   */
  removeUpdate(id: string): void {
    this.updates.delete(id);
  }

  /**
   * إشعار المستمعين
   */
  private notifyCallbacks(update: OptimisticUpdate): void {
    const callback = this.callbacks.get(update.type);
    if (callback) {
      callback(update);
    }
  }

  /**
   * تنظيف التحديثات القديمة
   */
  cleanup(): void {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 دقائق

    for (const [id, update] of this.updates.entries()) {
      if (now - update.timestamp.getTime() > maxAge) {
        this.removeUpdate(id);
      }
    }
  }
}

// مدير التحديثات المتفائلة العام
export const optimisticManager = new OptimisticUpdateManager();

// تنظيف دوري للتحديثات القديمة
setInterval(() => {
  optimisticManager.cleanup();
}, 60000); // كل دقيقة

// Helper functions للاستخدام السهل
export const optimisticHelpers = {
  /**
   * تحديث عميل محتمل
   */
  updateLead: async (leadId: string, updates: any, apiCall: () => Promise<any>) => {
    return optimisticManager.applyUpdate(
      `lead_${leadId}`,
      'lead_update',
      { leadId, updates },
      apiCall,
      () => {
        // rollback logic - إعادة القيم السابقة
        console.log(`Rolling back lead update: ${leadId}`);
      }
    );
  },

  /**
   * إنشاء مهمة جديدة
   */
  createTask: async (taskData: any, apiCall: () => Promise<any>) => {
    const tempId = `temp_${Date.now()}`;
    return optimisticManager.applyUpdate(
      tempId,
      'task_create',
      { ...taskData, id: tempId },
      apiCall,
      () => {
        // rollback - إزالة المهمة من الواجهة
        console.log(`Rolling back task creation: ${tempId}`);
      }
    );
  },

  /**
   * تحديث حالة صفقة
   */
  updateDealStage: async (dealId: string, newStage: string, apiCall: () => Promise<any>) => {
    return optimisticManager.applyUpdate(
      `deal_stage_${dealId}`,
      'deal_stage_update',
      { dealId, newStage },
      apiCall,
      () => {
        // rollback - إعادة الصفقة للمرحلة السابقة
        console.log(`Rolling back deal stage update: ${dealId}`);
      }
    );
  },

  /**
   * إرسال رسالة
   */
  sendMessage: async (messageData: any, apiCall: () => Promise<any>) => {
    const tempId = `msg_${Date.now()}`;
    return optimisticManager.applyUpdate(
      tempId,
      'message_send',
      { ...messageData, id: tempId, status: 'sending' },
      apiCall,
      () => {
        // rollback - وضع علامة فشل على الرسالة
        console.log(`Rolling back message send: ${tempId}`);
      }
    );
  }
};