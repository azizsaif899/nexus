/**
 * useActivepieces Hook
 * React hook للتعامل مع Activepieces بسهولة
 */

import { useState, useEffect, useCallback } from 'react';
import { activepiecesService, Flow, FlowExecution, QuotaInfo } from '../services/activepieces.service';

export function useActivepieces() {
    const [flows, setFlows] = useState<Flow[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Load all flows
     */
    const loadFlows = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await activepiecesService.getFlows();
            setFlows(data);
        } catch (err: any) {
            setError(err.message);
            console.error('Failed to load flows:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Create new flow
     */
    const createFlow = useCallback(async (data: {
        displayName: string;
        trigger: any;
        actions: any[];
    }) => {
        setLoading(true);
        setError(null);
        try {
            const newFlow = await activepiecesService.createFlow(data);
            setFlows(prev => [...prev, newFlow]);
            return newFlow;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Update flow
     */
    const updateFlow = useCallback(async (flowId: string, data: Partial<Flow>) => {
        setLoading(true);
        setError(null);
        try {
            const updated = await activepiecesService.updateFlow(flowId, data);
            setFlows(prev => prev.map(f => f.id === flowId ? updated : f));
            return updated;
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Delete flow
     */
    const deleteFlow = useCallback(async (flowId: string) => {
        setLoading(true);
        setError(null);
        try {
            await activepiecesService.deleteFlow(flowId);
            setFlows(prev => prev.filter(f => f.id !== flowId));
        } catch (err: any) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Toggle flow on/off
     */
    const toggleFlow = useCallback(async (flowId: string) => {
        const flow = flows.find(f => f.id === flowId);
        if (!flow) return;

        const newStatus = flow.status === 'ENABLED' ? 'DISABLED' : 'ENABLED';
        await updateFlow(flowId, { status: newStatus });
    }, [flows, updateFlow]);

    useEffect(() => {
        loadFlows();
    }, [loadFlows]);

    return {
        flows,
        loading,
        error,
        loadFlows,
        createFlow,
        updateFlow,
        deleteFlow,
        toggleFlow,
    };
}

/**
 * Hook for quota information
 */
export function useQuota() {
    const [quota, setQuota] = useState<QuotaInfo | null>(null);
    const [loading, setLoading] = useState(false);

    const loadQuota = useCallback(async () => {
        setLoading(true);
        try {
            const data = await activepiecesService.getQuota();
            setQuota(data);
        } catch (err) {
            console.error('Failed to load quota:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadQuota();
        // Refresh every 5 minutes
        const interval = setInterval(loadQuota, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, [loadQuota]);

    return { quota, loading, refresh: loadQuota };
}

/**
 * Hook for flow executions
 */
export function useExecutions(flowId?: string) {
    const [executions, setExecutions] = useState<FlowExecution[]>([]);
    const [loading, setLoading] = useState(false);

    const loadExecutions = useCallback(async () => {
        setLoading(true);
        try {
            const data = await activepiecesService.getExecutions(flowId);
            setExecutions(data);
        } catch (err) {
            console.error('Failed to load executions:', err);
        } finally {
            setLoading(false);
        }
    }, [flowId]);

    useEffect(() => {
        loadExecutions();
    }, [loadExecutions]);

    return { executions, loading, refresh: loadExecutions };
}
