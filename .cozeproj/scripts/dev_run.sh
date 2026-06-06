#!/bin/bash
set -e

# Kill existing services on our ports
kill $(lsof -ti:9090) 2>/dev/null || true
kill $(lsof -ti:9091) 2>/dev/null || true

# Start frontend static server on 9090 (Nginx proxies 5000 → 9090)
cd /workspace/projects/app/dist && nohup python3 -m http.server 9090 --bind 0.0.0.0 > /tmp/frontend9090.log 2>&1 &

# Start backend health server on 9091
nohup node /tmp/health-server.js > /tmp/health-server.log 2>&1 &

# Reload Nginx (managed by Coze platform)
nginx -t && nginx -s reload 2>/dev/null || true

echo "Services started: 5000(Nginx) → 9090(Frontend), 9091(Health API)"