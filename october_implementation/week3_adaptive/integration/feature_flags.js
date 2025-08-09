class FeatureFlags {
    constructor() {
        this.flags = {
            adaptive_model: true,
            model_finance: true,
            model_conversation: true,
            model_general: true,
            cache_enabled: true
        };
    }

    isEnabled(flag) {
        return this.flags[flag] || false;
    }

    enable(flag) {
        this.flags[flag] = true;
    }

    disable(flag) {
        this.flags[flag] = false;
    }
}

module.exports = FeatureFlags;