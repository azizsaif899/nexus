/**
 * React Hook for Activepieces
 * 
 * Usage:
 * const { flows, loading, error, createFlow, deleteFlow } = useActivepieces();
 * 
 * Features:
 * - Auto-refresh flows
 * - Loading states
 * - Error handling
 * - Quota management
 */

import { useState, useEffect, useCallback } from 'react';
import {
    activepiecesService,
    Flow,
    FlowRun,
    QuotaInfo,
    ActivepiecesError
} from '../services/activepieces.service';

interface UseActivepiecesReturn {
    // Flows
    flows: Flow[];
    flowsLoading: boolean;
    flowsError: ActivepiecesError | null;
    refreshFlows: () => Promise<void>;
    createFlow: (name: string) => Promise<Flow>;
    deleteFlow: (flowId: string) => Promise<void>;
    enableFlow: (flowId: string) => Promise<void>;
    disableFlow: (flowId: string) => Promise<void>;

    // Quota
    quota: QuotaInfo | null;
    quotaLoading: boolean;
    quotaError: ActivepiecesError | null;
    refreshQuota: () => Promise<void>;
}

export function useActivepieces(): UseActivepiecesReturn {
    // Flows state
    const [flows, setFlows] = useState<Flow[]>([]);
    const [flowsLoading, setFlowsLoading] = useState(true);
    const [flowsError, setFlowsError] = useState<ActivepiecesError | null>(null);

    // Quota state
    const [quota, setQuota] = useState<QuotaInfo | null>(null);
    const [quotaLoading, setQuotaLoading] = useState(true);
    const [quotaError, setQuotaError] = useState<ActivepiecesError | null>(null);

    /**
     * Refresh flows
     */
    const refreshFlows = useCallback(async () => {
        try {
            setFlowsLoading(true);
            setFlowsError(null);

            const result = await activepiecesService.listFlows(100);
            setFlows(result.data);

        } catch (error: any) {
            setFlowsError(error);
            console.error('Error fetching flows:', error);
        } finally {
            setFlowsLoading(false);
        }
    }, []);

    /**
     * Refresh quota
     */
    const refreshQuota = useCallback(async () => {
        try {
            setQuotaLoading(true);
            setQuotaError(null);

            const quotaInfo = await activepiecesService.getQuota();
            setQuota(quotaInfo);

        } catch (error: any) {
            setQuotaError(error);
            console.error('Error fetching quota:', error);
        } finally {
            setQuotaLoading(false);
        }
    }, []);

    /**
     * Create flow
     */
    const createFlow = useCallback(async (name: string): Promise<Flow> => {
        try {
            const newFlow = await activepiecesService.createFlow(name);
            setFlows((prev) => [newFlow, ...prev]);
            return newFlow;
        } catch (error: any) {
            throw error;
        }
    }, []);

    /**
     * Delete flow
     */
    const deleteFlow = useCallback(async (flowId: string): Promise<void> => {
        try {
            await activepiecesService.deleteFlow(flowId);
            setFlows((prev) => prev.filter((f) => f.id !== flowId));
        } catch (error: any) {
            throw error;
        }
    }, []);

    /**
     * Enable flow
     */
    const enableFlow = useCallback(async (flowId: string): Promise<void> => {
        try {
            const updated = await activepiecesService.enableFlow(flowId);
            setFlows((prev) =>
                prev.map((f) => (f.id === flowId ? updated : f))
            );
        } catch (error: any) {
            throw error;
        }
    }, []);

    /**
     * Disable flow
     */
    const disableFlow = useCallback(async (flowId: string): Promise<void> => {
        try {
            const updated = await activepiecesService.disableFlow(flowId);
            setFlows((prev) =>
                prev.map((f) => (f.id === flowId ? updated : f))
            );
        } catch (error: any) {
            throw error;
        }
    }, []);

    // Load initial data
    useEffect(() => {
        refreshFlows();
        refreshQuota();
    }, [refreshFlows, refreshQuota]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            refreshFlows();
            refreshQuota();
        }, 30000);

        return () => clearInterval(interval);
    }, [refreshFlows, refreshQuota]);

    return {
        // Flows
        flows,
        flowsLoading,
        flowsError,
        refreshFlows,
        createFlow,
        deleteFlow,
        enableFlow,
        disableFlow,

        // Quota
        quota,
        quotaLoading,
        quotaError,
        refreshQuota
    };
}

/**
 * Hook for single flow
 */
export function useFlow(flowId: string) {
    const [flow, setFlow] = useState<Flow | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ActivepiecesError | null>(null);

    const refresh = useCallback(async () => {
        if (!flowId) return;

        try {
            setLoading(true);
            setError(null);

            const flowData = await activepiecesService.getFlow(flowId);
            setFlow(flowData);

        } catch (error: any) {
            setError(error);
            console.error('Error fetching flow:', error);
        } finally {
            setLoading(false);
        }
    }, [flowId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    return { flow, loading, error, refresh };
}

/**
 * Hook for flow execution history
 */
export function useFlowRuns(flowId: string) {
    const [runs, setRuns] = useState<FlowRun[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ActivepiecesError | null>(null);

    const refresh = useCallback(async () => {
        if (!flowId) return;

        try {
            setLoading(true);
            setError(null);

            const result = await activepiecesService.listFlowRuns(flowId, 50);
            setRuns(result.data);

        } catch (error: any) {
            setError(error);
            console.error('Error fetching flow runs:', error);
        } finally {
            setLoading(false);
        }
    }, [flowId]);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // Auto-refresh every 10 seconds
    useEffect(() => {
        const interval = setInterval(refresh, 10000);
        return () => clearInterval(interval);
    }, [refresh]);

    return { runs, loading, error, refresh };
}
