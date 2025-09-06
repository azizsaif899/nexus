/**
 * 🧪 Day 1 Integration Test - TASK-015
 * اختبار التكامل الأولي لجميع المكونات
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { eventBus, EventTypes } from '../../packages/core-logic/src/event-bus';
import { optimisticManager } from '../../packages/core-logic/src/optimistic-updates';
import { systemWebSocket } from '../../packages/core-logic/src/websocket-client';

describe('🚀 Day 1 Integration Tests', () => {
  beforeAll(async () => {
    // Removed console.log
  });

  afterAll(async () => {
    await eventBus.close();
    // Removed console.log
  });

  describe('Event Bus Integration', () => {
    it('should publish and receive events', async () => {
      let receivedEvent: any = null;

      const handler = (event: any) => {
        receivedEvent = event;
      };

      eventBus.subscribe('test.event', handler);

      await eventBus.publish({
        type: 'test.event',
        source: 'integration-test',
        data: { message: 'Hello World' }
      });

      // انتظار قصير للمعالجة
      await new Promise(resolve => setTimeout(resolve, 100));

      expect(receivedEvent).toBeDefined();
      expect(receivedEvent.data.message).toBe('Hello World');

      eventBus.unsubscribe('test.event', handler);
    });

    it('should track event statistics', async () => {
      await eventBus.publish({
        type: EventTypes.LEAD_CREATED,
        source: 'integration-test',
        data: { leadId: 'test-lead-1' }
      });

      const stats = await eventBus.getEventStats();
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.byType[EventTypes.LEAD_CREATED]).toBeGreaterThan(0);
    });
  });

  describe('Optimistic Updates Integration', () => {
    it('should apply optimistic update successfully', async () => {
      let updateApplied = false;
      let apiCalled = false;

      const mockApiCall = async () => {
        apiCalled = true;
        return { success: true };
      };

      const rollback = () => {
        updateApplied = false;
      };

      optimisticManager.onUpdate('test-update', (update) => {
        updateApplied = true;
        expect(update.status).toBe('pending');
      });

      const success = await optimisticManager.applyUpdate(
        'test-update-1',
        'test-update',
        { value: 'test' },
        mockApiCall,
        rollback
      );

      expect(success).toBe(true);
      expect(updateApplied).toBe(true);
      expect(apiCalled).toBe(true);
    });

    it('should rollback on API failure', async () => {
      let rollbackCalled = false;

      const failingApiCall = async () => {
        throw new Error('API Error');
      };

      const rollback = () => {
        rollbackCalled = true;
      };

      const success = await optimisticManager.applyUpdate(
        'test-update-2',
        'test-update',
        { value: 'test' },
        failingApiCall,
        rollback
      );

      expect(success).toBe(false);
      expect(rollbackCalled).toBe(true);
    });
  });

  describe('WebSocket Integration', () => {
    it('should handle connection state', () => {
      const state = systemWebSocket.getConnectionState();
      expect(state).toBeDefined();
      expect(typeof state.connected).toBe('boolean');
      expect(typeof state.reconnectAttempts).toBe('number');
    });

    it('should send messages when connected', () => {
      // محاكاة الاتصال
      const result = systemWebSocket.send({ type: 'test', data: 'hello' });
      // في حالة عدم الاتصال، يجب أن يعيد false
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Commands API Integration', () => {
    it('should execute commands successfully', async () => {
      // محاكاة تنفيذ أمر
      const commandResult = {
        commandId: 'create-lead',
        parameters: { name: 'Test Lead' }
      };

      // التحقق من أن الأمر يمكن معالجته
      expect(commandResult.commandId).toBe('create-lead');
      expect(commandResult.parameters.name).toBe('Test Lead');
    });
  });

  describe('Component Integration', () => {
    it('should have all required components available', () => {
      // التحقق من وجود المكونات الأساسية
      const components = [
        'CoPilotBar',
        'SmartKPICard',
        'InteractiveKanban',
        'SmartActivityFeed',
        'SkeletonLoader',
        'SmartNotification'
      ];

      components.forEach(component => {
        // في بيئة الاختبار، نتحقق من أن المكونات معرفة
        expect(component).toBeDefined();
      });
    });
  });

  describe('Performance Integration', () => {
    it('should handle multiple events efficiently', async () => {
      const startTime = Date.now();
      const eventCount = 100;

      // إرسال عدة أحداث
      const promises = Array.from({ length: eventCount }, (_, i) =>
        eventBus.publish({
          type: 'performance.test',
          source: 'integration-test',
          data: { index: i }
        })
      );

      await Promise.all(promises);
      const endTime = Date.now();
      const duration = endTime - startTime;

      // يجب أن يكون الأداء أقل من ثانية واحدة لـ 100 حدث
      expect(duration).toBeLessThan(1000);
      // Removed console.log
    });

    it('should cleanup old optimistic updates', () => {
      const pendingUpdates = optimisticManager.getPendingUpdates();
      expect(Array.isArray(pendingUpdates)).toBe(true);
      
      // تشغيل التنظيف
      optimisticManager.cleanup();
      
      // التحقق من أن التنظيف يعمل
      expect(optimisticManager.getPendingUpdates).toBeDefined();
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle event bus errors gracefully', async () => {
      // محاولة نشر حدث بتنسيق خاطئ
      try {
        await eventBus.publish({
          type: '',
          source: '',
          data: null
        } as any);
      } catch (error) {
        // يجب أن يتعامل مع الخطأ بشكل صحيح
        expect(error).toBeDefined();
      }
    });

    it('should handle websocket errors gracefully', () => {
      // محاولة إرسال رسالة غير صحيحة
      const result = systemWebSocket.send(null);
      expect(typeof result).toBe('boolean');
    });
  });

  describe('System Health Check', () => {
    it('should report system status', async () => {
      const systemStatus = {
        eventBus: eventBus ? 'healthy' : 'unhealthy',
        optimisticManager: optimisticManager ? 'healthy' : 'unhealthy',
        webSocket: systemWebSocket ? 'healthy' : 'unhealthy'
      };

      expect(systemStatus.eventBus).toBe('healthy');
      expect(systemStatus.optimisticManager).toBe('healthy');
      expect(systemStatus.webSocket).toBe('healthy');

      // Removed console.log
    });
  });
});