/**
 * Complete Activepieces Service for React
 * 
 * Usage:
 * import { activepiecesService } from './services/activepieces.service';
 * 
 * const flows = await activepiecesService.listFlows();
 * const flow = await activepiecesService.getFlow(flowId);
 * await activepiecesService.createFlow(name);
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getAuth } from 'firebase/auth';

export interface Flow {
    id: string;
    projectId: string;
    name: string;
    status: 'ENABLED' | 'DISABLED';
    created: string;
    updated: string;
}

export interface FlowRun {
    id: string;
    flowId: string;
    status: 'RUNNING' | 'SUCCEEDED' | 'FAILED' | 'TIMEOUT';
    startTime: string;
    finishTime: string | null;
    duration: number;
}

export interface QuotaInfo {
    used: number;
    limit: number;
    remaining: number;
    percentUsed: number;
}

export class ActivepiecesError extends Error {
    constructor(
        public statusCode: number,
        public code: string,
        message: string,
        public action: string
    ) {
        super(message);
        this.name = 'ActivepiecesError';
    }
}

export class ActivepiecesService {
    private api: AxiosInstance;
    private maxRetries = 3;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_CLOUD_FUNCTIONS_URL ||
                'https://us-central1-gen-lang-client-0147492600.cloudfunctions.net/activepiecesProxy',
            timeout: 30000
        });

        // Add Firebase token interceptor
        this.api.interceptors.request.use(async (config) => {
            const auth = getAuth();
            const user = auth.currentUser;

            if (user) {
                const token = await user.getIdToken();
                config.headers.Authorization = `Bearer ${token}`;
            }

            return config;
        });

        // Add error handler interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                return Promise.reject(this.handleError(error));
            }
        );
    }

    /**
     * List all flows
     */
    async listFlows(limit = 20, cursor?: string): Promise<{
        data: Flow[];
        next: string | null;
    }> {
        const response = await this.executeWithRetry(() =>
            this.api.get('/v1/flows', {
                params: { limit, cursor }
            })
        );

        return response.data;
    }

    /**
     * Get flow by ID
     */
    async getFlow(flowId: string): Promise<Flow> {
        const response = await this.executeWithRetry(() =>
            this.api.get(`/v1/flows/${flowId}`)
        );

        return response.data;
    }

    /**
     * Create new flow
     */
    async createFlow(name: string, projectId?: string): Promise<Flow> {
        // Get project ID if not provided
        if (!projectId) {
            const projects = await this.listProjects();
            projectId = projects.data[0]?.id;

            if (!projectId) {
                // Create default project
                const newProject = await this.createProject('My Workspace');
                projectId = newProject.id;
            }
        }

        const response = await this.executeWithRetry(() =>
            this.api.post('/v1/flows', {
                projectId,
                displayName: name
            })
        );

        return response.data;
    }

    /**
     * Update flow
     */
    async updateFlow(
        flowId: string,
        updates: {
            displayName?: string;
            status?: 'ENABLED' | 'DISABLED';
            schedule?: {
                type: 'CRON';
                cronExpression: string;
            };
        }
    ): Promise<Flow> {
        const response = await this.executeWithRetry(() =>
            this.api.post(`/v1/flows/${flowId}`, updates)
        );

        return response.data;
    }

    /**
     * Delete flow
     */
    async deleteFlow(flowId: string): Promise<void> {
        await this.executeWithRetry(() =>
            this.api.delete(`/v1/flows/${flowId}`)
        );
    }

    /**
     * Enable flow
     */
    async enableFlow(flowId: string): Promise<Flow> {
        return this.updateFlow(flowId, { status: 'ENABLED' });
    }

    /**
     * Disable flow
     */
    async disableFlow(flowId: string): Promise<Flow> {
        return this.updateFlow(flowId, { status: 'DISABLED' });
    }

    /**
     * List flow runs (execution history)
     */
    async listFlowRuns(
        flowId: string,
        limit = 20,
        cursor?: string
    ): Promise<{
        data: FlowRun[];
        next: string | null;
    }> {
        const response = await this.executeWithRetry(() =>
            this.api.get('/v1/flow-runs', {
                params: { flowId, limit, cursor }
            })
        );

        return response.data;
    }

    /**
     * Get flow run details
     */
    async getFlowRun(runId: string): Promise<FlowRun> {
        const response = await this.executeWithRetry(() =>
            this.api.get(`/v1/flow-runs/${runId}`)
        );

        return response.data;
    }

    /**
     * List projects (workspaces)
     */
    async listProjects(): Promise<{
        data: Array<{
            id: string;
            displayName: string;
            ownerId: string;
            created: string;
            updated: string;
        }>;
    }> {
        const response = await this.executeWithRetry(() =>
            this.api.get('/v1/projects')
        );

        return response.data;
    }

    /**
     * Create project
     */
    async createProject(name: string): Promise<{
        id: string;
        displayName: string;
        ownerId: string;
        created: string;
    }> {
        const response = await this.executeWithRetry(() =>
            this.api.post('/v1/projects', {
                displayName: name
            })
        );

        return response.data;
    }

    /**
     * Get user's quota
     */
    async getQuota(): Promise<QuotaInfo> {
        // This would be returned in error response when quota exceeded
        // Or you could create a separate Cloud Function to fetch quota

        try {
            const response = await this.api.get('/quota');
            return response.data;
        } catch (error: any) {
            if (error.statusCode === 403 && error.code === 'QUOTA_EXCEEDED') {
                return error.quota;
            }
            throw error;
        }
    }

    /**
     * Execute with retry logic
     */
    private async executeWithRetry<T>(
        operation: () => Promise<T>,
        attempt = 0
    ): Promise<T> {
        try {
            return await operation();
        } catch (error: any) {
            // Don't retry client errors (except rate limit)
            if (error.statusCode && error.statusCode < 500 && error.statusCode !== 429) {
                throw error;
            }

            // Last attempt, don't retry
            if (attempt >= this.maxRetries) {
                throw error;
            }

            // Exponential backoff: 1s, 2s, 4s
            const delay = 1000 * Math.pow(2, attempt);
            console.log(`Retry attempt ${attempt + 1} after ${delay}ms`);

            await new Promise(resolve => setTimeout(resolve, delay));

            return this.executeWithRetry(operation, attempt + 1);
        }
    }

    /**
     * Handle errors
     */
    private handleError(error: any): ActivepiecesError {
        const status = error.response?.status || 500;
        const data = error.response?.data || {};

        const errorMap: Record<number, { code: string; message: string; action: string }> = {
            401: {
                code: 'UNAUTHORIZED',
                message: 'Your session expired. Please log in again.',
                action: 'Redirect to login'
            },
            403: {
                code: data.error || 'FORBIDDEN',
                message: data.message || 'You do not have permission to perform this action.',
                action: data.code === 'QUOTA_EXCEEDED' ? 'Upgrade plan' : 'Contact support'
            },
            404: {
                code: 'NOT_FOUND',
                message: 'The requested resource was not found.',
                action: 'Check resource ID'
            },
            429: {
                code: 'RATE_LIMIT_EXCEEDED',
                message: 'Too many requests. Please slow down.',
                action: `Wait ${data.retryAfter || 60} seconds`
            },
            500: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred. Please try again.',
                action: 'Retry'
            },
            502: {
                code: 'BAD_GATEWAY',
                message: 'Service temporarily unavailable.',
                action: 'Retry'
            },
            503: {
                code: 'SERVICE_UNAVAILABLE',
                message: 'Service is currently down for maintenance.',
                action: 'Try again later'
            }
        };

        const errorInfo = errorMap[status] || errorMap[500];

        return new ActivepiecesError(
            status,
            errorInfo.code,
            data.message || errorInfo.message,
            errorInfo.action
        );
    }
}

// Export singleton instance
export const activepiecesService = new ActivepiecesService();
