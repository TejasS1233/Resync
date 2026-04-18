# Resync - Simple container (API only, pre-built web)

FROM node:20

WORKDIR /app

# Install ONLY API deps
COPY app/api/package.json /app/
WORKDIR /app
RUN npm install

# Copy API code
COPY app/api /app/api

# Copy lib
COPY lib /app/lib
COPY lib/db.js /app/api/db.js

# Copy pre-built web dist
COPY app/web/dist /app/web/dist

RUN mkdir -p /app/data

ENV NODE_ENV=production
ENV DB_PATH=/app/data/resync.db
ENV JWT_SECRET=local-dev
ENV JWT_EXPIRE=7d
ENV PORT=3000
ENV CORS_ORIGIN=http://localhost:3000

EXPOSE 3000

CMD ["node", "/app/api/server.js"]