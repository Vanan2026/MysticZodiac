#!/bin/bash
set -e

# Determine project root (where .coze is located)
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"

# Kill existing services on our ports
pid9090=$(lsof -ti:9090 2>/dev/null) && kill "$pid9090" 2>/dev/null || true
pid9091=$(lsof -ti:9091 2>/dev/null) && kill "$pid9091" 2>/dev/null || true

# Start frontend static server on 9090 (Nginx proxies 5000 → 9090)
nohup node "$SCRIPT_DIR/static-server.mjs" > /app/work/logs/bypass/console.log 2>&1 &

# Start backend health server on 9091
nohup node "$SCRIPT_DIR/health-server.mjs" > /app/work/logs/bypass/app.log 2>&1 &

# Reload Nginx (managed by Coze platform)
nginx -t && nginx -s reload 2>/dev/null || true

echo "Deployment services started: 5000(Nginx) → 9090(Frontend), 9091(Health API)"