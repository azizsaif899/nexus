# Multi-stage build for Nexus AI Assistant
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/crm/package*.json ./apps/crm/
COPY apps/visual-automation/package*.json ./apps/visual-automation/
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm install
RUN cd apps/crm && npm install
RUN cd apps/visual-automation && npm install --legacy-peer-deps
RUN cd apps/api && npm install

# Copy source code
COPY . .

# Build applications
RUN cd apps/crm && npm run build
RUN cd apps/visual-automation && npm run build
RUN cd apps/api && npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy built applications
COPY --from=builder /app/apps/crm/dist ./public/crm
COPY --from=builder /app/apps/visual-automation/dist ./public/automation
COPY --from=builder /app/apps/api/dist ./api

# Install production dependencies
COPY --from=builder /app/apps/api/package*.json ./
RUN npm install --only=production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/health || exit 1

# Start application
CMD ["node", "api/main.js"]