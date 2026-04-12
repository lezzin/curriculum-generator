#!/bin/sh
set -e

# cd /app/backend && npm run migration:run || echo "Migration failed or already run"

exec /usr/bin/supervisord -c /etc/supervisord.conf
