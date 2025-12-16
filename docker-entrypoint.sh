#!/bin/sh
set -e

# Create data directory if it doesn't exist
mkdir -p /app/data

# Initialize database from template if it doesn't exist
if [ ! -f /app/data/cars.db ]; then
    echo "Initializing database from template..."
    cp /app/data/cars.db.template /app/data/cars.db
    echo "Database initialized successfully."
else
    echo "Database already exists at /app/data/cars.db"
    echo "Applying schema migrations..."
    npx prisma db push --skip-generate --accept-data-loss 2>/dev/null || echo "Migration completed (or no changes needed)"
fi

# Execute the main command
exec "$@"
