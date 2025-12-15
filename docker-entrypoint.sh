#!/bin/sh
set -e

# Create data directory if it doesn't exist
mkdir -p /app/data

# Initialize database if it doesn't exist
if [ ! -f /app/data/cars.db ]; then
    echo "Initializing database..."
    # Create empty database file with proper permissions
    touch /app/data/cars.db
    # Run prisma db push to create tables
    node ./node_modules/prisma/build/index.js db push --skip-generate
    echo "Database initialized successfully."
else
    echo "Database already exists at /app/data/cars.db"
fi

# Execute the main command
exec "$@"
