#!/bin/bash

echo "Stopping any running Vite processes..."
pkill -f vite || true

echo "Clearing cache..."
rm -rf node_modules/.vite

# Clean npm cache
echo "Cleaning npm cache..."
npm cache clean --force

echo "Clearing browser WebSocket cache..."
if [[ "$OSTYPE" == "darwin"* ]]; then
  # MacOS DNS flush
  sudo dscacheutil -flushcache || true
  sudo killall -HUP mDNSResponder || true
fi

echo "==================================="
echo "INSTRUCTIONS FOR BROWSER:"
echo "1. Open a new incognito/private window"
echo "2. OR in Chrome DevTools → Network tab → Check 'Disable cache'"
echo "3. OR clear browser cache completely"
echo "==================================="

# Ask which mode to use
echo "Select startup option:"
echo "1) Normal startup"
echo "2) Disable WebSocket compression"
echo "3) Polyfill WebSocket (slower but more compatible)"
read -p "Enter option (1-3): " option

case $option in
  1)
    echo "Starting Vite normally..."
    npm run dev
    ;;
  2)
    echo "Starting Vite with WebSocket compression disabled..."
    VITE_FORCE_NO_WS_COMPRESSION=true VITE_WS_TIMEOUT=60000 npm run dev
    ;;
  3)
    echo "Starting Vite with WebSocket polyfill..."
    VITE_WS_FORCE_POLLING=true npm run dev
    ;;
  *)
    echo "Invalid option. Starting normally..."
    npm run dev
    ;;
esac
