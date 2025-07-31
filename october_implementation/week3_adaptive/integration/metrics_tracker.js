class MetricsTracker {
    constructor() {
        this.metrics = {
            ai_latency: [],
            adaptive_success: 0,
            fallback_used: 0,
            cache_hit_rate: 0
        };
    }

    record(name, value) {
        if (name === 'ai_latency') {
            this.metrics.ai_latency.push(value);
            if (this.metrics.ai_latency.length > 100) {
                this.metrics.ai_latency.shift();
            }
        } else {
            this.metrics[name] += value;
        }
        
        console.log(`📊 ${name}: ${value}`);
    }

    getMetrics() {
        return {
            ...this.metrics,
            avg_latency: this.getAverageLatency()
        };
    }

    getAverageLatency() {
        if (this.metrics.ai_latency.length === 0) return 0;
        const sum = this.metrics.ai_latency.reduce((a, b) => a + b, 0);
        return sum / this.metrics.ai_latency.length;
    }
}

module.exports = MetricsTracker;