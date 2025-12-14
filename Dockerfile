# ----------------------------------------------------
# Stage 1: The Build Stage
# Purpose: Compiles the Next.js application and generates Prisma assets.
# ----------------------------------------------------
FROM node:20 AS builder 

# Install pnpm globally
RUN npm install -g pnpm

# Install build essentials and SQLite system libraries (libsqlite3-dev) 
# needed for 'better-sqlite3' to compile correctly.
RUN apt-get update \
    && apt-get install -y \
        build-essential \
        python3 \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
# Disable Next.js telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Copy lock files and Prisma configuration first to leverage Docker layer caching
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
# NOTE: We DO NOT copy an existing database file here.

# Install dependencies. The native module (better-sqlite3) compiles here.
RUN pnpm install --frozen-lockfile

# CRITICAL STEP: Generate Prisma Client and apply the schema (migration).
# This prepares the application for the first run, where the database file
# will be created in the mounted volume.
RUN pnpm prisma generate 
RUN pnpm prisma db push # Applies the schema

# Copy the rest of the application files (source code)
COPY . . 

# Run the Next.js build command
RUN pnpm run build

# ----------------------------------------------------
# Stage 2: The Production/Runner Stage
# Purpose: The minimal image to run the compiled application.
# ----------------------------------------------------
FROM node:20 AS runner

# Install pnpm globally
RUN npm install -g pnpm

# CRITICAL FIX: Install the SQLite *runtime* library in the final image.
# This is necessary for the application to interact with the database file
# mounted via a volume.
RUN apt-get update && \
    apt-get install -y sqlite3 && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

# Copy production assets and necessary files from the build stage:
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY package.json next.config.ts ./
COPY prisma ./prisma

# *** KEY CHANGE FOR PERSISTENCE ***
# We DO NOT copy the /app/src/database/cars.db file from the builder stage.
# The database will be created/read from a Docker Volume mounted by the user
# at the location specified in your DATABASE_URL (e.g., /app/src/database/).

EXPOSE 3000

# Define the command to start the Next.js production server
CMD ["pnpm", "start"]