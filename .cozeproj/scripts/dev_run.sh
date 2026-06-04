#!/bin/bash
set -e

# Kill existing services
kill $(lsof -ti:5000) 2>/dev/null || true
kill $(lsof -ti:9091) 2>/dev/null || true

# Start backend health server on 9091
nohup node /tmp/health-server.js > /tmp/health-server.log 2>&1 &

# Start Nginx on 5000
nginx -t && nginx -s reload 2>/dev/null || nginx

echo "Services started on ports 5000 and 9091"
