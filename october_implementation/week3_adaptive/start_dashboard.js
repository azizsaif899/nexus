/**
 * تشغيل لوحة المراقبة المحسنة
 */
const MetricsDashboard = require('./metrics_dashboard');

console.log('🚀 بدء تشغيل لوحة المراقبة المتقدمة...');

const dashboard = new MetricsDashboard();
dashboard.start(8082);

console.log('📊 لوحة المراقبة جاهزة:');
console.log('🌐 الواجهة: http://localhost:8080');
console.log('🔌 WebSocket: ws://localhost:8081');
console.log('📡 API: http://localhost:8080/api/metrics');

// إشارة إيقاف نظيفة
process.on('SIGINT', () => {
    console.log('\n🛑 إيقاف لوحة المراقبة...');
    process.exit(0);
});