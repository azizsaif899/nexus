"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserManager = void 0;
class UserManager {
    constructor() {
        this.users = new Map();
    }
    async authenticateUser(whatsappId) {
        let user = this.users.get(whatsappId);
        if (!user) {
            user = {
                whatsappId,
                isAuthenticated: false,
                lastActivity: new Date(),
                permissions: ['basic']
            };
            this.users.set(whatsappId, user);
        }
        user.lastActivity = new Date();
        return user;
    }
    async linkSystemUser(whatsappId, systemUserId) {
        const user = this.users.get(whatsappId);
        if (user) {
            user.systemUserId = systemUserId;
            user.isAuthenticated = true;
            user.permissions.push('authenticated');
            return true;
        }
        return false;
    }
    hasPermission(whatsappId, permission) {
        const user = this.users.get(whatsappId);
        return user?.permissions.includes(permission) || false;
    }
    isAuthenticated(whatsappId) {
        const user = this.users.get(whatsappId);
        return user?.isAuthenticated || false;
    }
}
exports.UserManager = UserManager;
//# sourceMappingURL=user-manager.js.map