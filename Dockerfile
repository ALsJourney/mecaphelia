FROM node:20 AS builder 

# Install pnpm globally in the builder image
RUN npm install -g pnpm

# Install build-essential and Python 3 for native compilation (e.g., better-sqlite3)
RUN apt-get update \
    && apt-get install -y \
        python3 \
        make \
        g++ \
        sqlite3 \
        libsqlite3-dev \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

WORKDIR /app

# Copy the core configuration files needed for installation/generation
COPY package.json pnpm-lock.yaml ./
COPY prisma ./prisma
COPY prisma.config.ts ./ 

# Install dependencies using pnpm
# This step handles the native compilation
RUN pnpm install --frozen-lockfile

# Copy the rest of the application files (source code)
COPY . . 

# Run the Next.js build command using pnpm
RUN pnpm run build

# ----------------------------------------------------
# Stage 2: The Production/Runner Stage
FROM node:20 AS runner

# Install pnpm globally in the runner image (needed for 'pnpm start')
RUN npm install -g pnpm

ENV NODE_ENV production
ENV PORT 3000

WORKDIR /app

# Copy production assets and necessary files from the build stage:
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY package.json next.config.ts ./

EXPOSE 3000

# Define the command to start the Next.js production server
CMD ["pnpm", "start"]