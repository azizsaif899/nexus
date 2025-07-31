/**
 * محسن الذاكرة للنظام
 */
const cluster = require('cluster');

class MemoryOptimizer {
    static optimize() {
        if (cluster.isMaster) {
            const numCPUs = require('os').cpus().length;
            
            for (let i = 0; i < Math.min(numCPUs, 4); i++) {
                const worker = cluster.fork();
                worker.memoryLimit = 2048; // 2GB per worker
            }

            cluster.on('exit', (worker) => {
                console.log(`Worker ${worker.process.pid} died, restarting...`);
                cluster.fork();
            });
        }
    }

    static monitorMemory() {
        setInterval(() => {
            const usage = process.memoryUsage();
            const usedMB = Math.round(usage.heapUsed / 1024 / 1024);
            
            if (usedMB > 1500) { // 1.5GB warning
                console.warn(`⚠️ High memory usage: ${usedMB}MB`);
                global.gc && global.gc(); // Force garbage collection
            }
        }, 30000);
    }

    static cleanup() {
        process.on('SIGTERM', () => {
            console.log('🧹 Cleaning up memory...');
            global.gc && global.gc();
            process.exit(0);
        });
    }
}

module.exports = MemoryOptimizer;