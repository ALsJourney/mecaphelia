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
fi

# Execute the main command
exec "$@"
