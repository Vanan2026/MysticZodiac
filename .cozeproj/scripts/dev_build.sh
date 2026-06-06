#!/bin/bash
set -e

# Build the Vite project
cd /workspace/projects/app
npm install --silent 2>/dev/null || true
npx vite build

# Copy external JS files to dist
for f in app-config.js ai-engine.js wisdom-engine.js share-cards.js personality-engine.js compliance.js payment-module.js; do
  cp "$f" "dist/$f" 2>/dev/null || true
done

# Copy favicon
cp favicon.ico dist/ 2>/dev/null || true

echo "Build complete"
