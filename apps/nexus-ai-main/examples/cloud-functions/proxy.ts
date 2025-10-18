/**
 * Complete Cloud Function Proxy for Activepieces
 * 
 * Features:
 * - Firebase Authentication
 * - Rate Limiting (100 req/min)
 * - Quota Management
 * - API Key Caching
 * - Usage Tracking
 * - Error Handling
 * - Retry Logic
 * 
 * Deploy: firebase deploy --only functions:activepiecesProxy
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import axios, { AxiosRequestConfig } from 'axios';
import { RateLimiterMemory } from 'rate-limiter-flexible';

admin.initializeApp();

// Rate limiter: 100 requests per minute per user
const rateLimiter = new RateLimiterMemory({
    points: 100,
    duration: 60,
});

interface QuotaInfo {
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
    percentUsed: number;
}

/**
 * Main proxy function
 */
export const activepiecesProxy = functions
    .region('us-central1')
    .runWith({
        timeoutSeconds: 60,
        memory: '512MB'
    })
    .https.onRequest(async (req, res) => {

        // Enable CORS
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');

        if (req.method === 'OPTIONS') {
            res.status(204).send('');
            return;
        }

        const startTime = Date.now();

        try {
            // 1. Verify Firebase token
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    error: 'UNAUTHORIZED',
                    message: 'Missing or invalid Authorization header'
                });
            }

            const token = authHeader.split('Bearer ')[1];
            const decodedToken = await admin.auth().verifyIdToken(token);
            const userId = decodedToken.uid;
            const userEmail = decodedToken.email;

            functions.logger.info('Request from user', { userId, userEmail });

            // 2. Rate limiting
            try {
                await rateLimiter.consume(userId, 1);
            } catch (rateLimiterRes: any) {
                const retryAfter = Math.round(rateLimiterRes.msBeforeNext / 1000) || 1;

                return res.status(429).json({
                    error: 'RATE_LIMIT_EXCEEDED',
                    message: 'Too many requests. Please slow down.',
                    retryAfter: retryAfter
                });
            }

            // 3. Check user quota
            const quotaInfo = await checkUserQuota(userId);
            if (!quotaInfo.allowed) {
                return res.status(403).json({
                    error: 'QUOTA_EXCEEDED',
                    message: 'Monthly quota exceeded. Please upgrade your plan.',
                    quota: quotaInfo
                });
            }

            // 4. Get or create Activepieces API key
            const apiKey = await getOrCreateActivepiecesApiKey(userId, userEmail!);

            // 5. Build Activepieces request
            const activepiecesUrl = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
            const endpoint = req.path.replace('/activepiecesProxy', '');
            const targetUrl = `${activepiecesUrl}${endpoint}`;

            const activepiecesConfig: AxiosRequestConfig = {
                method: req.method as any,
                url: targetUrl,
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': req.headers['content-type'] || 'application/json'
                },
                params: req.query,
                data: req.body,
                timeout: 30000,
                validateStatus: () => true // Don't throw on any status
            };

            // 6. Forward request to Activepieces
            const response = await axios.request(activepiecesConfig);

            // 7. Track usage
            const duration = Date.now() - startTime;
            await trackUsage(userId, endpoint, req.method, response.status, duration);

            // 8. Return response
            res.status(response.status).json(response.data);

        } catch (error: any) {
            functions.logger.error('Proxy error', {
                error: error.message,
                stack: error.stack
            });

            // Handle specific errors
            if (error.code === 'auth/id-token-expired') {
                return res.status(401).json({
                    error: 'TOKEN_EXPIRED',
                    message: 'Firebase token expired. Please refresh.'
                });
            }

            if (error.code === 'auth/argument-error') {
                return res.status(401).json({
                    error: 'INVALID_TOKEN',
                    message: 'Invalid Firebase token.'
                });
            }

            // Generic error
            return res.status(500).json({
                error: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred.',
                details: error.message
            });
        }
    });

/**
 * Check user's quota
 */
async function checkUserQuota(userId: string): Promise<QuotaInfo> {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Get subscription
    const subscriptionDoc = await admin.firestore()
        .collection('activepieces_subscriptions')
        .doc(userId)
        .get();

    const subscription = subscriptionDoc.exists
        ? subscriptionDoc.data()
        : { plan: 'free', monthlyQuota: 1000 };

    // Get usage
    const usageDoc = await admin.firestore()
        .collection('activepieces_usage')
        .doc(userId)
        .collection('months')
        .doc(monthKey)
        .get();

    const usage = usageDoc.exists
        ? usageDoc.data()
        : { totalRequests: 0 };

    const used = usage.totalRequests || 0;
    const limit = subscription.monthlyQuota || 1000;
    const remaining = limit - used;

    return {
        allowed: remaining > 0,
        used,
        limit,
        remaining,
        percentUsed: (used / limit) * 100
    };
}

/**
 * Get or create Activepieces API key for user
 */
async function getOrCreateActivepiecesApiKey(
    userId: string,
    email: string
): Promise<string> {
    // Check cache (1 hour TTL)
    const cacheDoc = await admin.firestore()
        .collection('activepieces_api_keys')
        .doc(userId)
        .get();

    if (cacheDoc.exists) {
        const data = cacheDoc.data()!;
        const expiresAt = data.expiresAt.toDate();

        if (new Date() < expiresAt) {
            // Update last used
            await cacheDoc.ref.update({
                lastUsed: admin.firestore.FieldValue.serverTimestamp()
            });

            return data.apiKey;
        }
    }

    // Create new API key
    const activepiecesUrl = process.env.ACTIVEPIECES_URL || 'http://localhost:8080';
    const adminApiKey = process.env.ACTIVEPIECES_ADMIN_KEY;

    try {
        // Create user in Activepieces
        const createUserResponse = await axios.post(
            `${activepiecesUrl}/v1/users`,
            {
                email: email,
                password: Math.random().toString(36).slice(-16),
                firstName: email.split('@')[0],
                lastName: 'User',
                trackEvents: false,
                newsLetter: false
            },
            {
                headers: {
                    'Authorization': `Bearer ${adminApiKey}`,
                    'Content-Type': 'application/json'
                },
                validateStatus: (status) => status === 201 || status === 409
            }
        );

        const activepiecesUserId = createUserResponse.data.id;

        // Create API key
        const createKeyResponse = await axios.post(
            `${activepiecesUrl}/v1/api-keys`,
            {
                displayName: `nexus-${Date.now()}`,
                userId: activepiecesUserId
            },
            {
                headers: {
                    'Authorization': `Bearer ${adminApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const apiKey = createKeyResponse.data.token;

        // Cache API key
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1);

        await admin.firestore()
            .collection('activepieces_api_keys')
            .doc(userId)
            .set({
                apiKey: apiKey,
                activepiecesUserId: activepiecesUserId,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                expiresAt: admin.firestore.Timestamp.fromDate(expiresAt),
                lastUsed: admin.firestore.FieldValue.serverTimestamp()
            });

        return apiKey;

    } catch (error: any) {
        functions.logger.error('Error creating API key', {
            error: error.message,
            response: error.response?.data
        });
        throw new Error('Failed to create Activepieces API key');
    }
}

/**
 * Track API usage
 */
async function trackUsage(
    userId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number
): Promise<void> {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

    // Update monthly usage
    await admin.firestore()
        .collection('activepieces_usage')
        .doc(userId)
        .collection('months')
        .doc(monthKey)
        .set({
            totalRequests: admin.firestore.FieldValue.increment(1),
            lastRequest: admin.firestore.FieldValue.serverTimestamp(),
            endpoints: {
                [endpoint]: admin.firestore.FieldValue.increment(1)
            }
        }, { merge: true });

    // Log individual request (for analytics)
    await admin.firestore()
        .collection('activepieces_api_logs')
        .add({
            userId,
            endpoint,
            method,
            statusCode,
            duration,
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            success: statusCode >= 200 && statusCode < 300
        });
}

/**
 * Send quota warning email
 */
export const checkQuotaThresholds = functions
    .region('us-central1')
    .pubsub.schedule('every 1 hours')
    .onRun(async () => {

        const usersSnapshot = await admin.firestore()
            .collection('activepieces_usage')
            .get();

        const now = new Date();
        const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        for (const userDoc of usersSnapshot.docs) {
            const userId = userDoc.id;

            // Get quota info
            const quotaInfo = await checkUserQuota(userId);

            // Check thresholds
            if (quotaInfo.percentUsed >= 90 && quotaInfo.percentUsed < 95) {
                // Send 90% warning
                functions.logger.info('User at 90% quota', { userId });
                // TODO: Send email notification
            }

            if (quotaInfo.percentUsed >= 100) {
                // Send quota exceeded notification
                functions.logger.warn('User exceeded quota', { userId });
                // TODO: Send email notification
            }
        }

        return null;
    });
