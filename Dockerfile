# Stage 1: The Build Stage
FROM node:20 AS builder 

# Install pnpm globally in the builder image
RUN npm install -g pnpm

# Install build essentials and SQLite system libraries for better-sqlite3
RUN apt-get update \
    && apt-get install -y \
        build-essential \
        python3 \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Copy the core configuration files needed for installation/generation/db setup
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./
COPY src/database/cars.db ./src/database/cars.db # Copy the initial database file

# Install dependencies. The native module (better-sqlite3) compiles here.
RUN pnpm install --frozen-lockfile

# CRITICAL STEP: Generate Prisma Client and Initialize SQLite Database
# This must happen before 'pnpm run build'
RUN pnpm prisma generate 
#RUN pnpm prisma db push --skip-generate --accept-data-loss # Force schema application
RUN pnpm prisma db push --skip-generate

# Copy the rest of the application files (source code)
COPY . . 

# Run the Next.js build command using pnpm
RUN pnpm run build

# ----------------------------------------------------
# Stage 2: The Production/Runner Stage
FROM node:20 AS runner

# Install pnpm globally in the runner image
RUN npm install -g pnpm

# CRITICAL FIX: Install the SQLite runtime library in the final image
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
COPY prisma ./prisma # Needed for the Prisma client to find the engines

# Copy the generated/migrated database file
COPY --from=builder /app/src/database/cars.db ./src/database/cars.db 

EXPOSE 3000

# Define the command to start the Next.js production server
CMD ["pnpm", "start"]