FROM node:18-alpine

WORKDIR /app

# نسخ package files
COPY package*.json ./

# تثبيت التبعيات
RUN npm ci --only=production

# نسخ الكود
COPY . .

# إعداد المستخدم غير المميز
RUN addgroup -g 1001 -S nodejs
RUN adduser -S processor -u 1001
USER processor

# المتغيرات
ENV NODE_ENV=production
ENV PORT=8080

# فحص الصحة
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

EXPOSE 8080

CMD ["node", "server.js"]