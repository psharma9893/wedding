#!/bin/bash
# Double-click to preview the wedding invitation at http://localhost:8080
# Close this Terminal window (or press Ctrl+C) to stop it.
cd "$(dirname "$0")/dist" || { echo "dist folder not found - run: npm install && npm run build"; read -r; exit 1; }
PORT=8080
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done
URL="http://localhost:$PORT/"
echo ""
echo "  Nishtha & Pranshu - invitation preview"
echo "  Open: $URL"
echo "  (Ctrl+C to stop)"
echo ""
(sleep 1; open "$URL") &
exec python3 -m http.server "$PORT" --bind 127.0.0.1
