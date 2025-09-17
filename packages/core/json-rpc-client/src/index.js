"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcClient = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
class JsonRpcClient {
    constructor(config) {
        this.baseUrl = config.baseUrl;
        this.database = config.database;
        this.username = config.username;
        this.password = config.password;
    }
    async authenticate() {
        const response = await axios_1.default.post(`${this.baseUrl}/jsonrpc`, {
            jsonrpc: '2.0',
            method: 'call',
            params: {
                service: 'common',
                method: 'authenticate',
                args: [this.database, this.username, this.password, {}]
            },
            id: 1
        });
        this.uid = response.data.result;
        return this.uid;
    }
    async createLead(leadData) {
        try {
            if (!this.uid)
                await this.authenticate();
            const response = await axios_1.default.post(`${this.baseUrl}/jsonrpc`, {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        this.database,
                        this.uid,
                        this.password,
                        'crm.lead',
                        'create',
                        [leadData]
                    ]
                },
                id: 2
            });
            return {
                success: true,
                data: { id: response.data.result, ...leadData }
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getLeads() {
        try {
            if (!this.uid)
                await this.authenticate();
            const response = await axios_1.default.post(`${this.baseUrl}/jsonrpc`, {
                jsonrpc: '2.0',
                method: 'call',
                params: {
                    service: 'object',
                    method: 'execute_kw',
                    args: [
                        this.database,
                        this.uid,
                        this.password,
                        'crm.lead',
                        'search_read',
                        [[]],
                        { fields: ['name', 'phone', 'email', 'description'] }
                    ]
                },
                id: 3
            });
            return {
                success: true,
                data: response.data.result
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
}
exports.JsonRpcClient = JsonRpcClient;
//# sourceMappingURL=index.js.map