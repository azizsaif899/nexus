'use client';

import { useEffect, useCallback } from 'react';
import { syncManager, SyncEvent } from '../lib/sync-manager';

export function useSync(entity: string) {
  const syncCreate = useCallback(async (entityId: string, data: any) => {
    await syncManager.syncChange({
      type: 'create',
      entity,
      entityId,
      data,
      userId: 'current_user' // يجب الحصول على المعرف الفعلي
    });
  }, [entity]);

  const syncUpdate = useCallback(async (entityId: string, data: any) => {
    await syncManager.syncChange({
      type: 'update',
      entity,
      entityId,
      data,
      userId: 'current_user'
    });
  }, [entity]);

  const syncDelete = useCallback(async (entityId: string) => {
    await syncManager.syncChange({
      type: 'delete',
      entity,
      entityId,
      data: null,
      userId: 'current_user'
    });
  }, [entity]);

  const subscribe = useCallback((listener: (event: SyncEvent) => void) => {
    return syncManager.subscribeToEntity(entity, listener);
  }, [entity]);

  return {
    syncCreate,
    syncUpdate,
    syncDelete,
    subscribe
  };
}