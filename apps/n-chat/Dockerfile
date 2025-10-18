FROM node:24-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Environment
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Start app with Next.js built-in server
CMD ["npm", "start"]