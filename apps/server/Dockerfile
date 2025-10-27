# apps/server/Dockerfile
# --- deps layer ---------------------------------------------------------------
FROM oven/bun:1 AS deps
WORKDIR /app

# Root manifests first for cache efficiency
COPY bun.lockb package.json ./

# Copy ONLY workspace manifests (adjust these if you add more packages)
COPY packages/api/package.json packages/api/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/server/package.json apps/server/package.json

# Install once for all workspaces
RUN bun install --frozen-lockfile

# --- build layer --------------------------------------------------------------
FROM oven/bun:1 AS build
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client where the schema actually lives (packages/db)
RUN cd packages/db && bun x prisma generate

# --- runtime layer ------------------------------------------------------------
FROM oven/bun:1 AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=build /app ./
COPY apps/server/docker-entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/entrypoint.sh"]
CMD ["bun", "run", "start"]

