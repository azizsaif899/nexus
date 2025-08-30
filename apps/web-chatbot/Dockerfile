# Multi-stage build for web chatbot
FROM node:18-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm

# Dependencies stage
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
COPY apps/web-chatbot/package.json ./apps/web-chatbot/
COPY packages/ai-engine/package.json ./packages/ai-engine/
RUN pnpm install --frozen-lockfile

# Build stage
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN pnpm build:web-chatbot

# Production stage with nginx
FROM nginx:alpine AS runner
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

# Copy built chatbot app
COPY --from=builder /app/dist/apps/web-chatbot .

# Advanced nginx configuration for chatbot
RUN echo 'events { \
    worker_connections 1024; \
} \
\
http { \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    \
    # Logging \
    log_format main '\''$remote_addr - $remote_user [$time_local] "$request" '\'' \
                    '\''$status $body_bytes_sent "$http_referer" '\'' \
                    '\''"$http_user_agent" "$http_x_forwarded_for"'\''; \
    \
    access_log /var/log/nginx/access.log main; \
    error_log /var/log/nginx/error.log warn; \
    \
    # Performance optimizations \
    sendfile on; \
    tcp_nopush on; \
    tcp_nodelay on; \
    keepalive_timeout 65; \
    types_hash_max_size 2048; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_comp_level 6; \
    gzip_types \
        text/plain \
        text/css \
        text/xml \
        text/javascript \
        application/javascript \
        application/xml+rss \
        application/json \
        application/wasm; \
    \
    server { \
        listen 80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        \
        # Security headers \
        add_header X-Frame-Options "SAMEORIGIN" always; \
        add_header X-XSS-Protection "1; mode=block" always; \
        add_header X-Content-Type-Options "nosniff" always; \
        add_header Referrer-Policy "no-referrer-when-downgrade" always; \
        add_header Content-Security-Policy "default-src '\''self'\'' ws: wss: http: https: data: blob: '\''unsafe-inline'\'' '\''unsafe-eval'\''" always; \
        \
        # WebSocket support for real-time chat \
        location /ws { \
            proxy_pass http://api:3000; \
            proxy_http_version 1.1; \
            proxy_set_header Upgrade $http_upgrade; \
            proxy_set_header Connection "upgrade"; \
            proxy_set_header Host $host; \
            proxy_set_header X-Real-IP $remote_addr; \
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
            proxy_set_header X-Forwarded-Proto $scheme; \
        } \
        \
        # API proxy \
        location /api { \
            proxy_pass http://api:3000; \
            proxy_set_header Host $host; \
            proxy_set_header X-Real-IP $remote_addr; \
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
            proxy_set_header X-Forwarded-Proto $scheme; \
        } \
        \
        # Handle client-side routing \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
        \
        # Cache static assets \
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
            expires 1y; \
            add_header Cache-Control "public, immutable"; \
        } \
        \
        # Cache HTML with shorter expiry \
        location ~* \.html$ { \
            expires 1h; \
            add_header Cache-Control "public"; \
        } \
    } \
}' > /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]