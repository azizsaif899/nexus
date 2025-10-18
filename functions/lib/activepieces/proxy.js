"use strict";
/**
 * Activepieces Proxy - Cloud Function
 * يستقبل طلبات من React → يتحقق من Firebase Auth → يرسل لـ Activepieces
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.activepiecesProxy = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const axios_1 = __importDefault(require("axios"));
const rate_limiter_flexible_1 = require("rate-limiter-flexible");
// Initialize Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp();
}
const db = admin.firestore();
// Rate Limiter: 100 requests per minute per user
const rateLimiter = new rate_limiter_flexible_1.RateLimiterMemory({
    points: 100,
    duration: 60,
});
// Activepieces API Configuration
const ACTIVEPIECES_API_URL = process.env.ACTIVEPIECES_API_URL || 'http://localhost:3000/api/v1';
/**
 * Get or create Activepieces API key for user
 */
async function getOrCreateApiKey(userId) {
    var _a;
    const cacheRef = db.collection('activepieces_api_keys').doc(userId);
    const cache = await cacheRef.get();
    // Check if cached and not expired (1 hour TTL)
    if (cache.exists) {
        const data = cache.data();
        const expiresAt = data.expiresAt.toDate();
        if (expiresAt > new Date()) {
            return data.apiKey;
        }
    }
    // Create new API key via Activepieces API
    try {
        const response = await axios_1.default.post(`${ACTIVEPIECES_API_URL}/users`, {
            email: `user-${userId}@nexxs.ai`,
            password: generateSecurePassword(),
            firstName: 'User',
            lastName: userId.substring(0, 8),
        });
        const apiKey = response.data.token;
        // Cache for 1 hour
        await cacheRef.set({
            apiKey,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            expiresAt: new Date(Date.now() + 3600000), // 1 hour
            lastUsed: admin.firestore.FieldValue.serverTimestamp(),
        });
        return apiKey;
    }
    catch (error) {
        if (((_a = error.response) === null || _a === void 0 ? void 0 : _a.status) === 409) {
            // User already exists, try to login
            const loginResponse = await axios_1.default.post(`${ACTIVEPIECES_API_URL}/authentication/sign-in`, {
                email: `user-${userId}@nexxs.ai`,
                password: generateSecurePassword(),
            });
            const apiKey = loginResponse.data.token;
            await cacheRef.set({
                apiKey,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                expiresAt: new Date(Date.now() + 3600000),
                lastUsed: admin.firestore.FieldValue.serverTimestamp(),
            });
            return apiKey;
        }
        throw error;
    }
}
/**
 * Generate secure password for Activepieces user
 */
function generateSecurePassword() {
    return `AP_${Date.now()}_${Math.random().toString(36).substring(7)}`;
}
/**
 * Check user quota
 */
async function checkUserQuota(userId) {
    const subscriptionRef = db.collection('activepieces_subscriptions').doc(userId);
    const subscription = await subscriptionRef.get();
    if (!subscription.exists) {
        // Create free tier subscription
        await subscriptionRef.set({
            plan: 'free',
            monthlyQuota: 1000,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
    const data = subscription.data() || { plan: 'free', monthlyQuota: 1000 };
    // Get current month usage
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const usageRef = db.collection('activepieces_usage').doc(userId).collection('monthly').doc(monthKey);
    const usage = await usageRef.get();
    const used = usage.exists ? usage.data().totalRequests || 0 : 0;
    return {
        plan: data.plan,
        monthlyQuota: data.monthlyQuota,
        used,
        remaining: data.monthlyQuota - used,
    };
}
/**
 * Track API usage
 */
async function trackUsage(userId, endpoint, method) {
    const now = new Date();
    const monthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const usageRef = db.collection('activepieces_usage').doc(userId).collection('monthly').doc(monthKey);
    await usageRef.set({
        totalRequests: admin.firestore.FieldValue.increment(1),
        lastRequest: admin.firestore.FieldValue.serverTimestamp(),
        endpoints: {
            [endpoint]: {
                [method]: admin.firestore.FieldValue.increment(1),
            },
        },
    }, { merge: true });
}
/**
 * Main Proxy Function
 */
exports.activepiecesProxy = functions
    .region('us-central1')
    .https.onRequest(async (req, res) => {
    var _a;
    // CORS Headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    try {
        // 1. Verify Firebase Token
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Unauthorized: Missing or invalid token' });
            return;
        }
        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token);
        const userId = decodedToken.uid;
        // 2. Rate Limiting
        try {
            await rateLimiter.consume(userId, 1);
        }
        catch (rateLimiterRes) {
            res.status(429).json({
                error: 'Rate limit exceeded',
                retryAfter: Math.round(rateLimiterRes.msBeforeNext / 1000) || 60,
            });
            return;
        }
        // 3. Check Quota
        const quota = await checkUserQuota(userId);
        if (quota.remaining <= 0) {
            res.status(403).json({
                error: 'Quota exceeded',
                quota: {
                    used: quota.used,
                    limit: quota.monthlyQuota,
                    plan: quota.plan,
                },
                message: 'Please upgrade your plan to continue',
            });
            return;
        }
        // 4. Get or Create API Key
        const apiKey = await getOrCreateApiKey(userId);
        // 5. Forward Request to Activepieces
        const activepiecesUrl = `${ACTIVEPIECES_API_URL}${req.path}`;
        const config = {
            method: req.method,
            url: activepiecesUrl,
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            },
            data: req.body,
            params: req.query,
        };
        const response = await axios_1.default.request(config);
        // 6. Track Usage
        await trackUsage(userId, req.path, req.method);
        // 7. Return Response
        res.status(response.status).json(response.data);
    }
    catch (error) {
        console.error('Activepieces Proxy Error:', error);
        if (error.response) {
            // Activepieces API error
            res.status(error.response.status).json({
                error: ((_a = error.response.data) === null || _a === void 0 ? void 0 : _a.message) || 'Activepieces API error',
                details: error.response.data,
            });
        }
        else if (error.code === 'auth/id-token-expired') {
            res.status(401).json({ error: 'Token expired' });
        }
        else {
            res.status(500).json({
                error: 'Internal server error',
                message: error.message,
            });
        }
    }
});
//# sourceMappingURL=proxy.js.map