#!/bin/bash
# Resync - Local Setup Script
# Usage: ./setup.sh

set -e

echo "🔧 Building Resync container..."
docker build -t resync .

echo "🚀 Starting Resync (MongoDB + Server + Client)..."
docker run -d \
  --name resync \
  -p 3000:3000 \
  -p 27017:27017 \
  resync

echo "⏳ Waiting for services to start..."
sleep 10

echo "✅ Resync is running!"
echo "   - Web UI: http://localhost:3000"
echo "   - API: http://localhost:3000/api"
echo "   - MongoDB: localhost:27017"

echo ""
echo "To stop: docker stop resync"
echo "To remove: docker rm resync"