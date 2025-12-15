# syntax=docker.io/docker/dockerfile:1

# ----------------------------------------------------
# Base Stage
# ----------------------------------------------------
FROM node:20-alpine AS base

# Install dependencies only when needed
# ----------------------------------------------------
# Stage 1: Dependencies Stage (deps)
# Purpose: Install node modules including Prisma binary dependencies.
# ----------------------------------------------------
FROM base AS deps
# For node-alpine compatibility
RUN apk add --no-cache libc6-compat
# Install essential build packages needed for native modules like better-sqlite3
# We are using alpine, so we use `apk add` instead of `apt-get install`
# Packages: build-base (replaces build-essential), python3, sqlite-dev (replaces libsqlite3-dev)
RUN apk add --no-cache build-base python3 sqlite-dev

WORKDIR /app

# Install dependencies based on the preferred package manager (pnpm in your case)
COPY package.json pnpm-lock.yaml* .npmrc* ./
COPY prisma ./prisma

# Enable pnpm via corepack and install dependencies
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# ----------------------------------------------------
# Stage 2: Builder Stage (builder)
# Purpose: Build the Next.js application, generate Prisma client.
# ----------------------------------------------------
FROM base AS builder
WORKDIR /app
# Copy installed dependencies
COPY --from=deps /app/node_modules ./node_modules
# Copy source code and config
COPY . .
# Copy Prisma schema and config from the deps stage
COPY --from=deps /app/prisma ./prisma
COPY prisma.config.ts ./

# Next.js telemetry is often disabled during build for CI/CD consistency
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Set a temporary DATABASE_URL for build time (Prisma generate needs it)
ENV DATABASE_URL="file:/app/data/cars.db"

# Generate Prisma Client only - db push will happen at runtime
RUN corepack enable pnpm && pnpm prisma generate

# Run the Next.js build command which creates the .next/standalone directory
RUN pnpm run build

# ----------------------------------------------------
# Stage 3: Production/Runner Stage (runner)
# Purpose: The minimal, production-ready image.
# ----------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

# Set the database URL to use persistent volume path
ENV DATABASE_URL="file:/app/data/cars.db"

# CRITICAL FIX: Install the SQLite *runtime* library (needed to run better-sqlite3)
# For alpine, this is the 'sqlite' package.
RUN apk update && \
    apk add --no-cache sqlite

# Create a non-root user for security (as in the Vercel suggestion)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Create data directory for SQLite database with proper permissions
RUN mkdir -p /app/data && chown -R nextjs:nodejs /app/data

COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/package.json ./

# Copy Prisma CLI and generated client for database initialization
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/src/generated ./src/generated

# Copy production assets
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size (Standalone Output)
# The Next.js standalone output includes node_modules and all necessary files.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

# Set the correct working user
USER nextjs

# Declare volume for persistent database storage
VOLUME ["/app/data"]

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Use entrypoint to initialize database, then run server
ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]