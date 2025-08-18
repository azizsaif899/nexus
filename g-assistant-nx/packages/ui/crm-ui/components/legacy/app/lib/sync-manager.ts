import { wsClient } from './websocket-client';

export interface SyncEvent {
  id: string;
  type: 'create' | 'update' | 'delete';
  entity: string;
  entityId: string;
  data: any;
  userId: string;
  timestamp: Date;
}

export interface ConflictResolution {
  strategy: 'last-write-wins' | 'merge' | 'manual';
  resolver?: (local: any, remote: any) => any;
}

export class SyncManager {
  private pendingChanges = new Map<string, SyncEvent>();
  private conflictHandlers = new Map<string, ConflictResolution>();
  private syncListeners = new Map<string, ((event: SyncEvent) => void)[]>();

  constructor() {
    this.setupWebSocketListeners();
  }

  private setupWebSocketListeners(): void {
    wsClient.subscribe('sync.event', (event: SyncEvent) => {
      this.handleRemoteSync(event);
    });

    wsClient.subscribe('sync.conflict', (conflict: any) => {
      this.handleConflict(conflict);
    });
  }

  async syncChange(event: Omit<SyncEvent, 'id' | 'timestamp'>): Promise<void> {
    const syncEvent: SyncEvent = {
      ...event,
      id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    // إضافة للتغييرات المعلقة
    this.pendingChanges.set(syncEvent.id, syncEvent);

    try {
      // إرسال عبر WebSocket
      wsClient.send({
        type: 'sync.event',
        data: syncEvent
      });

      // إشعار المستمعين المحليين
      this.notifyListeners(syncEvent);

    } catch (error) {
      console.error('Failed to sync change:', error);
      // الاحتفاظ بالتغيير للمحاولة لاحقاً
    }
  }

  private async handleRemoteSync(event: SyncEvent): Promise<void> {
    // تجاهل التغييرات من نفس المستخدم
    if (event.userId === this.getCurrentUserId()) {
      return;
    }

    // التحقق من وجود تعارض
    const localChange = this.findConflictingChange(event);
    if (localChange) {
      await this.resolveConflict(localChange, event);
      return;
    }

    // تطبيق التغيير
    this.applyRemoteChange(event);
    this.notifyListeners(event);
  }

  private findConflictingChange(remoteEvent: SyncEvent): SyncEvent | null {
    for (const [id, localEvent] of this.pendingChanges) {
      if (
        localEvent.entity === remoteEvent.entity &&
        localEvent.entityId === remoteEvent.entityId &&
        localEvent.timestamp > remoteEvent.timestamp
      ) {
        return localEvent;
      }
    }
    return null;
  }

  private async resolveConflict(local: SyncEvent, remote: SyncEvent): Promise<void> {
    const resolution = this.conflictHandlers.get(local.entity) || {
      strategy: 'last-write-wins'
    };

    switch (resolution.strategy) {
      case 'last-write-wins':
        if (local.timestamp > remote.timestamp) {
          // الاحتفاظ بالتغيير المحلي
          return;
        } else {
          // تطبيق التغيير البعيد
          this.applyRemoteChange(remote);
        }
        break;

      case 'merge':
        if (resolution.resolver) {
          const merged = resolution.resolver(local.data, remote.data);
          const mergedEvent: SyncEvent = {
            ...local,
            data: merged,
            timestamp: new Date()
          };
          this.applyRemoteChange(mergedEvent);
        }
        break;

      case 'manual':
        // إشعار المستخدم بالتعارض
        this.notifyConflict(local, remote);
        break;
    }
  }

  private applyRemoteChange(event: SyncEvent): void {
    // تطبيق التغيير على البيانات المحلية
    console.log('Applying remote change:', event);
    
    // هنا سيتم تطبيق التغيير على الحالة المحلية
    // مثل تحديث React Query cache أو Redux store
  }

  private notifyListeners(event: SyncEvent): void {
    const listeners = this.syncListeners.get(event.entity) || [];
    listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in sync listener:', error);
      }
    });
  }

  private notifyConflict(local: SyncEvent, remote: SyncEvent): void {
    // إشعار المستخدم بوجود تعارض
    console.warn('Sync conflict detected:', { local, remote });
    
    // يمكن إظهار modal للمستخدم لحل التعارض يدوياً
  }

  subscribeToEntity(entity: string, listener: (event: SyncEvent) => void): () => void {
    if (!this.syncListeners.has(entity)) {
      this.syncListeners.set(entity, []);
    }
    
    this.syncListeners.get(entity)!.push(listener);
    
    return () => {
      const listeners = this.syncListeners.get(entity);
      if (listeners) {
        const index = listeners.indexOf(listener);
        if (index > -1) {
          listeners.splice(index, 1);
        }
      }
    };
  }

  setConflictResolution(entity: string, resolution: ConflictResolution): void {
    this.conflictHandlers.set(entity, resolution);
  }

  private getCurrentUserId(): string {
    // الحصول على معرف المستخدم الحالي
    return 'current_user_id'; // يجب استبداله بالمعرف الفعلي
  }

  getPendingChanges(): SyncEvent[] {
    return Array.from(this.pendingChanges.values());
  }

  clearPendingChanges(): void {
    this.pendingChanges.clear();
  }
}

export const syncManager = new SyncManager();