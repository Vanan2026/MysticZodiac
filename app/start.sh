#!/bin/bash
# Start Mystic Fate Development Server

cd /app/data/所有对话/主对话/MysticZodiac/app

echo "Starting Mystic Fate..."
echo "Open http://localhost:5173 in your browser"
echo ""

# Run vite directly with node
node node_modules/vite/bin/vite.js --host 0.0.0.0 --port 5173
