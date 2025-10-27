# apps/web/Dockerfile
# --- builder ------------------------------------------------------------------
FROM oven/bun:1 AS builder
WORKDIR /app

COPY bun.lockb package.json ./
# Include workspace manifests used by web if you import from packages/*
COPY packages/api/package.json packages/api/package.json
COPY packages/auth/package.json packages/auth/package.json
COPY packages/db/package.json packages/db/package.json
COPY apps/web/package.json apps/web/package.json

RUN bun install --frozen-lockfile

COPY . .

# If any internal packages require a build step (tsc/tsup), do that before web build:
# RUN cd packages/api && bun run build
# RUN cd packages/auth && bun run build
# RUN cd packages/db && bun run build

RUN cd apps/web && bun run build

# --- runtime (nginx) ----------------------------------------------------------
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

COPY --from=builder /app/apps/web/dist ./
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

