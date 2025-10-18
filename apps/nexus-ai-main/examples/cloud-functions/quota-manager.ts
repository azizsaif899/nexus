/**
 * Quota Manager for Activepieces
 * 
 * Handles:
 * - Subscription management
 * - Quota checking
 * - Usage tracking
 * - Notifications
 */

import * as admin from 'firebase-admin';

export interface SubscriptionPlan {
    name: string;
    monthlyQuota: number;
    flowsLimit: number;
    executionsLimit: number;
    price: number;
}

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlan> = {
    free: {
        name: 'Free',
        monthlyQuota: 1000,
        flowsLimit: 3,
        executionsLimit: 500,
        price: 0
    },
    starter: {
        name: 'Starter',
        monthlyQuota: 10000,
        flowsLimit: 15,
        executionsLimit: 5000,
        price: 15
    },
    pro: {
        name: 'Pro',
        monthlyQuota: 50000,
        flowsLimit: 50,
        executionsLimit: 25000,
        price: 50
    },
    enterprise: {
        name: 'Enterprise',
        monthlyQuota: Number.MAX_SAFE_INTEGER,
        flowsLimit: Number.MAX_SAFE_INTEGER,
        executionsLimit: Number.MAX_SAFE_INTEGER,
        price: 500
    }
};

export class QuotaManager {

    /**
     * Get user's subscription
     */
    async getSubscription(userId: string): Promise<SubscriptionPlan> {
        const doc = await admin.firestore()
            .collection('activepieces_subscriptions')
            .doc(userId)
            .get();

        if (!doc.exists) {
            // Default to free plan
            await this.setSubscription(userId, 'free');
            return SUBSCRIPTION_PLANS.free;
        }

        const data = doc.data()!;
        const planName = data.plan || 'free';

        return SUBSCRIPTION_PLANS[planName] || SUBSCRIPTION_PLANS.free;
    }

    /**
     * Set user's subscription
     */
    async setSubscription(userId: string, planName: string): Promise<void> {
        const plan = SUBSCRIPTION_PLANS[planName];

        if (!plan) {
            throw new Error(`Invalid plan: ${planName}`);
        }

        await admin.firestore()
            .collection('activepieces_subscriptions')
            .doc(userId)
            .set({
                plan: planName,
                monthlyQuota: plan.monthlyQuota,
                flowsLimit: plan.flowsLimit,
                executionsLimit: plan.executionsLimit,
                price: plan.price,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
                nextBillingDate: this.getNextBillingDate()
            }, { merge: true });
    }

    /**
     * Check if user can make request
     */
    async canMakeRequest(userId: string): Promise<{
        allowed: boolean;
        reason?: string;
        quota: {
            used: number;
            limit: number;
            remaining: number;
        };
    }> {
        const subscription = await this.getSubscription(userId);
        const usage = await this.getMonthlyUsage(userId);

        const remaining = subscription.monthlyQuota - usage.totalRequests;

        if (remaining <= 0) {
            return {
                allowed: false,
                reason: 'Monthly quota exceeded',
                quota: {
                    used: usage.totalRequests,
                    limit: subscription.monthlyQuota,
                    remaining: 0
                }
            };
        }

        return {
            allowed: true,
            quota: {
                used: usage.totalRequests,
                limit: subscription.monthlyQuota,
                remaining: remaining
            }
        };
    }

    /**
     * Check if user can create flow
     */
    async canCreateFlow(userId: string): Promise<{
        allowed: boolean;
        reason?: string;
        flows: {
            current: number;
            limit: number;
        };
    }> {
        const subscription = await this.getSubscription(userId);
        const flowCount = await this.getFlowCount(userId);

        if (flowCount >= subscription.flowsLimit) {
            return {
                allowed: false,
                reason: `Flow limit reached (${subscription.flowsLimit})`,
                flows: {
                    current: flowCount,
                    limit: subscription.flowsLimit
                }
            };
        }

        return {
            allowed: true,
            flows: {
                current: flowCount,
                limit: subscription.flowsLimit
            }
        };
    }

    /**
     * Get monthly usage
     */
    async getMonthlyUsage(userId: string): Promise<{
        totalRequests: number;
        totalExecutions: number;
        lastRequest: Date | null;
    }> {
        const monthKey = this.getCurrentMonthKey();

        const doc = await admin.firestore()
            .collection('activepieces_usage')
            .doc(userId)
            .collection('months')
            .doc(monthKey)
            .get();

        if (!doc.exists) {
            return {
                totalRequests: 0,
                totalExecutions: 0,
                lastRequest: null
            };
        }

        const data = doc.data()!;

        return {
            totalRequests: data.totalRequests || 0,
            totalExecutions: data.totalExecutions || 0,
            lastRequest: data.lastRequest ? data.lastRequest.toDate() : null
        };
    }

    /**
     * Get flow count
     */
    async getFlowCount(userId: string): Promise<number> {
        // This would query Activepieces API
        // For now, return from cache

        const doc = await admin.firestore()
            .collection('activepieces_flow_counts')
            .doc(userId)
            .get();

        return doc.exists ? (doc.data()!.count || 0) : 0;
    }

    /**
     * Update flow count
     */
    async updateFlowCount(userId: string, count: number): Promise<void> {
        await admin.firestore()
            .collection('activepieces_flow_counts')
            .doc(userId)
            .set({
                count: count,
                updatedAt: admin.firestore.FieldValue.serverTimestamp()
            });
    }

    /**
     * Increment usage
     */
    async incrementUsage(
        userId: string,
        type: 'request' | 'execution'
    ): Promise<void> {
        const monthKey = this.getCurrentMonthKey();

        const field = type === 'request' ? 'totalRequests' : 'totalExecutions';

        await admin.firestore()
            .collection('activepieces_usage')
            .doc(userId)
            .collection('months')
            .doc(monthKey)
            .set({
                [field]: admin.firestore.FieldValue.increment(1),
                lastRequest: admin.firestore.FieldValue.serverTimestamp()
            }, { merge: true });

        // Check if user should be notified
        await this.checkNotificationThresholds(userId);
    }

    /**
     * Check if user needs notification
     */
    private async checkNotificationThresholds(userId: string): Promise<void> {
        const subscription = await this.getSubscription(userId);
        const usage = await this.getMonthlyUsage(userId);

        const percentUsed = (usage.totalRequests / subscription.monthlyQuota) * 100;

        // Check if notification already sent
        const notificationDoc = await admin.firestore()
            .collection('activepieces_notifications')
            .doc(userId)
            .collection('sent')
            .doc(this.getCurrentMonthKey())
            .get();

        const notificationsSent = notificationDoc.exists
            ? notificationDoc.data()!
            : { threshold_50: false, threshold_80: false, threshold_90: false, threshold_100: false };

        // 50% threshold
        if (percentUsed >= 50 && !notificationsSent.threshold_50) {
            await this.sendNotification(userId, 'warning', 50, subscription, usage);
            await notificationDoc.ref.set({ threshold_50: true }, { merge: true });
        }

        // 80% threshold
        if (percentUsed >= 80 && !notificationsSent.threshold_80) {
            await this.sendNotification(userId, 'alert', 80, subscription, usage);
            await notificationDoc.ref.set({ threshold_80: true }, { merge: true });
        }

        // 90% threshold
        if (percentUsed >= 90 && !notificationsSent.threshold_90) {
            await this.sendNotification(userId, 'critical', 90, subscription, usage);
            await notificationDoc.ref.set({ threshold_90: true }, { merge: true });
        }

        // 100% threshold
        if (percentUsed >= 100 && !notificationsSent.threshold_100) {
            await this.sendNotification(userId, 'exceeded', 100, subscription, usage);
            await notificationDoc.ref.set({ threshold_100: true }, { merge: true });
        }
    }

    /**
     * Send notification
     */
    private async sendNotification(
        userId: string,
        type: 'warning' | 'alert' | 'critical' | 'exceeded',
        percent: number,
        subscription: SubscriptionPlan,
        usage: { totalRequests: number }
    ): Promise<void> {

        const messages = {
            warning: `You've used ${percent}% of your monthly quota. ${subscription.monthlyQuota - usage.totalRequests} requests remaining.`,
            alert: `⚠️ You've used ${percent}% of your monthly quota. Consider upgrading your plan.`,
            critical: `🚨 You've used ${percent}% of your monthly quota. You're almost at the limit!`,
            exceeded: `❌ You've exceeded your monthly quota. Please upgrade to continue using flows.`
        };

        // Store notification
        await admin.firestore()
            .collection('notifications')
            .add({
                userId,
                type: `quota_${type}`,
                title: 'Quota Notification',
                message: messages[type],
                read: false,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                metadata: {
                    percent,
                    used: usage.totalRequests,
                    limit: subscription.monthlyQuota,
                    plan: subscription.name
                }
            });

        // TODO: Send email via SendGrid
        // TODO: Send push notification

        console.log(`Notification sent to ${userId}: ${messages[type]}`);
    }

    /**
     * Get current month key
     */
    private getCurrentMonthKey(): string {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }

    /**
     * Get next billing date
     */
    private getNextBillingDate(): admin.firestore.Timestamp {
        const now = new Date();
        const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        return admin.firestore.Timestamp.fromDate(next);
    }

    /**
     * Reset monthly usage (run on 1st of month)
     */
    async resetMonthlyUsage(userId: string): Promise<void> {
        const monthKey = this.getCurrentMonthKey();

        await admin.firestore()
            .collection('activepieces_usage')
            .doc(userId)
            .collection('months')
            .doc(monthKey)
            .set({
                totalRequests: 0,
                totalExecutions: 0,
                lastRequest: null
            });
    }
}
