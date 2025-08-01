# 🚀 دليل النشر والمراقبة - AzizSys Enterprise

## 📋 نظرة عامة

هذا الدليل يوضح كيفية نشر ومراقبة نظام AzizSys في بيئة الإنتاج مع ضمان الموثوقية والأداء العالي.

## 🏗️ بنية النشر

### البيئات المختلفة

#### 1. بيئة التطوير (Development)
```bash
# متغيرات البيئة
NODE_ENV=development
VECTOR_STORE_PROVIDER=in-memory
LOG_LEVEL=debug
GEMINI_API_KEY=dev-api-key
```

#### 2. بيئة التكامل (Staging)
```bash
# متغيرات البيئة
NODE_ENV=staging
VECTOR_STORE_PROVIDER=pinecone
LOG_LEVEL=info
GEMINI_API_KEY=staging-api-key
PINECONE_API_KEY=staging-pinecone-key
PINECONE_ENVIRONMENT=staging-env
```

#### 3. بيئة الإنتاج (Production)
```bash
# متغيرات البيئة
NODE_ENV=production
VECTOR_STORE_PROVIDER=pinecone
LOG_LEVEL=warn
GEMINI_API_KEY=prod-api-key
PINECONE_API_KEY=prod-pinecone-key
PINECONE_ENVIRONMENT=prod-env
MONITORING_ENABLED=true
ALERTS_ENABLED=true
```

## 🐳 النشر باستخدام Docker

### 1. بناء الصورة
```bash
# بناء صورة الإنتاج
docker build -t azizsys:latest .

# بناء مع تحسينات الأداء
docker build --target production -t azizsys:prod .
```

### 2. تشغيل الحاوية
```bash
# تشغيل مع متغيرات البيئة
docker run -d \
  --name azizsys-prod \
  --restart unless-stopped \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e GEMINI_API_KEY=${GEMINI_API_KEY} \
  -e PINECONE_API_KEY=${PINECONE_API_KEY} \
  --health-cmd="curl -f http://localhost:3000/health || exit 1" \
  --health-interval=30s \
  --health-timeout=10s \
  --health-retries=3 \
  azizsys:prod
```

### 3. Docker Compose للإنتاج
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  azizsys:
    image: azizsys:prod
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - VECTOR_STORE_PROVIDER=pinecone
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - PINECONE_API_KEY=${PINECONE_API_KEY}
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    volumes:
      - ./logs:/app/logs
    networks:
      - azizsys-network

  monitoring:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - azizsys-network

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-storage:/var/lib/grafana
    networks:
      - azizsys-network

networks:
  azizsys-network:
    driver: bridge

volumes:
  grafana-storage:
```

## 📊 نظام المراقبة المتقدم

### 1. إعداد المراقبة الأساسية

#### تكوين Prometheus
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

rule_files:
  - "alert_rules.yml"

scrape_configs:
  - job_name: 'azizsys'
    static_configs:
      - targets: ['azizsys:3000']
    metrics_path: '/metrics'
    scrape_interval: 10s

alerting:
  alertmanagers:
    - static_configs:
        - targets:
          - alertmanager:9093
```

#### قواعد الإنذار
```yaml
# monitoring/alert_rules.yml
groups:
  - name: azizsys_alerts
    rules:
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.01
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "معدل أخطاء عالي في AzizSys"
          description: "معدل الأخطاء {{ $value }} أعلى من 1% لمدة 5 دقائق"

      - alert: SlowResponseTime
        expr: histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m])) > 0.2
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "بطء في الاستجابة"
          description: "95% من الطلبات تستغرق أكثر من 200ms"

      - alert: LowCacheHitRate
        expr: cache_hit_rate < 0.8
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "معدل نجاح التخزين المؤقت منخفض"
          description: "معدل نجاح Cache هو {{ $value }} أقل من 80%"
```

### 2. لوحات المعلومات (Dashboards)

#### Grafana Dashboard للأداء
```json
{
  "dashboard": {
    "title": "AzizSys Performance Dashboard",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{status}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "singlestat",
        "targets": [
          {
            "expr": "rate(http_requests_total{status=~\"5..\"}[5m]) / rate(http_requests_total[5m])",
            "legendFormat": "Error Rate"
          }
        ]
      }
    ]
  }
}
```

### 3. التسجيل المنظم

#### إعداد Winston Logger
```javascript
// src/utils/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'azizsys',
    version: process.env.npm_package_version 
  },
  transports: [
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

module.exports = logger;
```

## 🔔 نظام الإنذارات

### 1. إعداد Alertmanager
```yaml
# monitoring/alertmanager.yml
global:
  smtp_smarthost: 'localhost:587'
  smtp_from: 'alerts@azizsys.com'

route:
  group_by: ['alertname']
  group_wait: 10s
  group_interval: 10s
  repeat_interval: 1h
  receiver: 'web.hook'

receivers:
  - name: 'web.hook'
    email_configs:
      - to: 'admin@azizsys.com'
        subject: 'AzizSys Alert: {{ .GroupLabels.alertname }}'
        body: |
          {{ range .Alerts }}
          Alert: {{ .Annotations.summary }}
          Description: {{ .Annotations.description }}
          {{ end }}
    
    slack_configs:
      - api_url: 'YOUR_SLACK_WEBHOOK_URL'
        channel: '#alerts'
        title: 'AzizSys Alert'
        text: '{{ range .Alerts }}{{ .Annotations.summary }}{{ end }}'
```

### 2. إنذارات مخصصة في التطبيق
```javascript
// src/services/alerting.js
class AlertingService {
  constructor() {
    this.channels = [
      new EmailAlertChannel(),
      new SlackAlertChannel(),
      new SMSAlertChannel()
    ];
  }

  async sendAlert(severity, message, metadata = {}) {
    const alert = {
      timestamp: new Date().toISOString(),
      severity,
      message,
      metadata,
      service: 'AzizSys'
    };

    for (const channel of this.channels) {
      try {
        await channel.send(alert);
      } catch (error) {
        console.error(`Failed to send alert via ${channel.name}:`, error);
      }
    }
  }
}
```

## 📈 مؤشرات الأداء الرئيسية (KPIs)

### 1. مؤشرات الأداء التقني
- **Response Time**: أقل من 200ms للـ 95% من الطلبات
- **Throughput**: 100+ طلب/ثانية
- **Error Rate**: أقل من 0.1%
- **Uptime**: 99.9%+
- **Cache Hit Rate**: 80%+

### 2. مؤشرات الأعمال
- **User Satisfaction**: معدل رضا المستخدمين
- **Feature Usage**: استخدام الميزات المختلفة
- **API Usage**: استهلاك APIs الخارجية
- **Cost Efficiency**: تكلفة لكل طلب

### 3. مراقبة الموارد
```javascript
// src/monitoring/resourceMonitor.js
class ResourceMonitor {
  collectMetrics() {
    return {
      memory: {
        used: process.memoryUsage().heapUsed,
        total: process.memoryUsage().heapTotal,
        percentage: (process.memoryUsage().heapUsed / process.memoryUsage().heapTotal) * 100
      },
      cpu: {
        usage: process.cpuUsage(),
        loadAverage: require('os').loadavg()
      },
      disk: {
        // إحصائيات القرص الصلب
      },
      network: {
        // إحصائيات الشبكة
      }
    };
  }
}
```

## 🔧 الصيانة والتحديث

### 1. استراتيجية النشر الآمن
```bash
# نشر تدريجي (Rolling Deployment)
#!/bin/bash

# 1. نشر على خادم واحد
docker-compose -f docker-compose.prod.yml up -d --scale azizsys=1

# 2. فحص الصحة
./scripts/health-check.sh

# 3. نشر على باقي الخوادم تدريجياً
docker-compose -f docker-compose.prod.yml up -d --scale azizsys=3

# 4. فحص نهائي
./scripts/final-health-check.sh
```

### 2. النسخ الاحتياطي والاستعادة
```bash
# نسخ احتياطي للبيانات
#!/bin/bash

# نسخ احتياطي لقاعدة البيانات
docker exec azizsys-db pg_dump -U postgres azizsys > backup_$(date +%Y%m%d_%H%M%S).sql

# نسخ احتياطي للملفات
tar -czf logs_backup_$(date +%Y%m%d_%H%M%S).tar.gz logs/

# رفع إلى التخزين السحابي
aws s3 cp backup_*.sql s3://azizsys-backups/
aws s3 cp logs_backup_*.tar.gz s3://azizsys-backups/
```

## 🚨 خطة الطوارئ

### 1. إجراءات الاستجابة للحوادث
```markdown
## خطة الاستجابة للحوادث

### المرحلة 1: الكشف (0-5 دقائق)
- تلقي إنذار من نظام المراقبة
- تأكيد المشكلة
- تصنيف الخطورة

### المرحلة 2: الاستجابة (5-15 دقيقة)
- إشعار الفريق المختص
- بدء التحقيق
- تطبيق حلول سريعة إن أمكن

### المرحلة 3: الحل (15-60 دقيقة)
- تحديد السبب الجذري
- تطبيق الحل النهائي
- التحقق من استقرار النظام

### المرحلة 4: المتابعة (بعد الحل)
- توثيق الحادث
- تحليل السبب الجذري
- تحديث الإجراءات الوقائية
```

### 2. سيناريوهات الطوارئ الشائعة

#### فشل الخادم الرئيسي
```bash
# التبديل إلى الخادم الاحتياطي
./scripts/failover-to-backup.sh

# إعادة توجيه DNS
# تحديث Load Balancer
# إشعار المستخدمين
```

#### نفاد مساحة القرص
```bash
# تنظيف الملفات المؤقتة
./scripts/cleanup-temp-files.sh

# ضغط السجلات القديمة
./scripts/compress-old-logs.sh

# نقل البيانات إلى تخزين إضافي
./scripts/move-to-archive.sh
```

## 📚 الموارد والأدوات

### أدوات المراقبة المستخدمة
- **Prometheus**: جمع المقاييس
- **Grafana**: لوحات المعلومات
- **Alertmanager**: إدارة الإنذارات
- **ELK Stack**: تحليل السجلات
- **Jaeger**: تتبع الطلبات الموزعة

### سكربتات الأتمتة
- `scripts/deploy.sh`: نشر آلي
- `scripts/health-check.sh`: فحص الصحة
- `scripts/backup.sh`: النسخ الاحتياطي
- `scripts/rollback.sh`: التراجع عن النشر
- `scripts/scale.sh`: توسيع النظام

---

**تاريخ آخر تحديث**: ديسمبر 2024  
**الإصدار**: 1.0.0  
**المسؤول**: فريق DevOps - AzizSys