#!/usr/bin/env bash
set -e

# Apply migrations in production (idempotent)
cd /app/packages/db
bun x prisma migrate deploy

# Start the server (adjust if your start script differs)
cd /app/apps/server
exec "$@"

