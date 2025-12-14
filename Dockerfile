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
# Purpose: Build the Next.js application, generate Prisma client, and apply schema.
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

# CRITICAL STEP: Generate Prisma Client and apply the schema (migration/db push).
# We assume the database (e.g., SQLite file) will be mounted externally
# in the runner stage. The generate step is essential here.
RUN corepack enable pnpm && \
    pnpm prisma generate && \
    pnpm prisma db push

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

# CRITICAL FIX: Install the SQLite *runtime* library (needed to run better-sqlite3)
# For alpine, this is the 'sqlite' package.
RUN apk update && \
    apk add --no-cache sqlite

# Create a non-root user for security (as in the Vercel suggestion)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy production assets
COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size (Standalone Output)
# The Next.js standalone output includes node_modules and all necessary files.
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set the correct working user
USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]