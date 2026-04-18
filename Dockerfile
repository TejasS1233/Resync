# Resync - Single Container (100% Private, SQLite-based)
# Build: docker build -t resync .
# Run: docker run -p 3000:3000 -v resync_data:/app/data resync

FROM node:20-alpine

WORKDIR /app

# Install build tools for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY app/web/package*.json app/web/
COPY app/api/package*.json app/api/
COPY app/cli/package*.json app/cli/
COPY package.json ./

# Install dependencies
RUN npm install && \
    cd app/web && npm install && \
    cd ../../app/api && npm install && \
    cd ../../app/cli && npm install

# Copy source code
COPY app/ app/

# Create data directory
RUN mkdir -p /app/data

# Build web UI
ENV NODE_ENV=production
ENV VITE_API_URL=/api
WORKDIR /app/web
RUN npm run build

# Run server
WORKDIR /app/api

ENV DB_PATH=/app/data/resync.db
ENV JWT_SECRET=resync-local-dev-secret
ENV JWT_EXPIRE=7d
ENV PORT=3000

EXPOSE 3000

CMD ["node", "server.js"]