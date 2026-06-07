#!/bin/bash
set -e

# Build the Vite project
cd /workspace/projects/app
npm install --silent 2>/dev/null || true
npx vite build

# Copy external JS files and CSS to dist
for f in app-config.js wisdom-engine.js share-cards.js personality-engine.js compliance.js cloud-sync.js payment-module.js; do
  [ -f "$f" ] && cp "$f" "dist/$f" && echo "  ✅ $f" || echo "  ⚠️  $f not found"
done

# Copy external CSS
[ -f "styles.css" ] && cp styles.css "dist/styles.css" && echo "  ✅ styles.css" || echo "  ⚠️  styles.css not found"

# Copy favicon
[ -f "favicon.ico" ] && cp favicon.ico "dist/favicon.ico" && echo "  ✅ favicon.ico" || echo "  ⚠️  favicon.ico not found"

echo "Build complete"
