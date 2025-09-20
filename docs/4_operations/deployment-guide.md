# 🚀 دليل النشر الشامل - AzizSys AI Assistant

## 📋 نظرة عامة

هذا الدليل يوضح كيفية نشر نظام AzizSys AI Assistant في بيئات مختلفة باستخدام أحدث تقنيات DevOps.

## 🏗️ معمارية النشر

### البيئات المدعومة
- **Development**: بيئة التطوير المحلية
- **Staging**: بيئة الاختبار والمراجعة
- **Production**: بيئة الإنتاج
- **Disaster Recovery**: بيئة الاستعادة من الكوارث

### التقنيات المستخدمة
- **Container Orchestration**: Kubernetes
- **Container Runtime**: Docker
- **Infrastructure as Code**: Terraform
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana

## 🔧 متطلبات النشر

### الأدوات المطلوبة
```bash
# Docker
docker --version  # >= 20.10

# Kubernetes CLI
kubectl version --client  # >= 1.28

# Terraform
terraform version  # >= 1.0

# Helm
helm version  # >= 3.12

# Node.js & pnpm
node --version  # >= 18
pnpm --version  # >= 8
```

## 🚀 خطوات النشر

### 1. إعداد البنية التحتية

#### أ. إنشاء البنية التحتية باستخدام Terraform
```bash
cd infrastructure/
terraform init
terraform plan -var="environment=production"
terraform apply -var="environment=production"
```

#### ب. الحصول على معلومات الكلاستر
```bash
aws eks update-kubeconfig --region us-east-1 --name azizsys-cluster-production
kubectl get nodes
```

### 2. إعداد Kubernetes

#### أ. إنشاء Namespace
```bash
kubectl create namespace azizsys
```

#### ب. إنشاء Secrets
```bash
kubectl create secret generic azizsys-secrets \
  --from-literal=database-url="postgresql://user:pass@host:5432/db" \
  --from-literal=gemini-api-key="your-gemini-key" \
  --from-literal=jwt-secret="your-jwt-secret" \
  -n azizsys
```

### 3. بناء ونشر الصور

#### أ. بناء صور Docker
```bash
pnpm build:docker
docker build -t azizsys/api:latest -f apps/api/Dockerfile .
docker build -t azizsys/admin-dashboard:latest -f apps/admin-dashboard/Dockerfile .
docker build -t azizsys/web-chatbot:latest -f apps/web-chatbot/Dockerfile .
```

#### ب. رفع الصور إلى Registry
```bash
docker login
docker push azizsys/api:latest
docker push azizsys/admin-dashboard:latest
docker push azizsys/web-chatbot:latest
```

### 4. نشر التطبيقات

```bash
kubectl apply -f k8s/api-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl get pods -n azizsys
```

## 🔍 التحقق من النشر

### فحص صحة التطبيقات
```bash
kubectl get pods -n azizsys
kubectl logs -f deployment/azizsys-api -n azizsys
curl -k https://api.azizsys.com/health
```

## 🛡️ الأمان

### إعدادات الأمان الأساسية
```bash
kubectl apply -f k8s/network-policies.yaml
kubectl label namespace azizsys pod-security.kubernetes.io/enforce=restricted
trivy image azizsys/api:latest
```

## 📊 المراقبة والتنبيهات

### إعداد Prometheus
```bash
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm install prometheus prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace
```

## 🔧 استكشاف الأخطاء

### مشاكل شائعة وحلولها

#### Pod لا يبدأ
```bash
kubectl describe pod <pod-name> -n azizsys
kubectl logs <pod-name> -n azizsys
```

#### مشاكل الشبكة
```bash
kubectl get svc -n azizsys
kubectl exec -it <pod-name> -n azizsys -- curl http://service-name
```

## 📈 تحسين الأداء

### تحسين Resources
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## 🔄 النسخ الاحتياطي والاستعادة

### نسخ احتياطي لقاعدة البيانات
```bash
kubectl exec postgresql-0 -n azizsys -- pg_dump -U postgres azizsys > backup.sql
kubectl exec -i postgresql-0 -n azizsys -- psql -U postgres azizsys < backup.sql
```

---

**تم إعداد هذا الدليل بواسطة فريق AzizSys DevOps 🚀**