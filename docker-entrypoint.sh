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
    # Add missing columns if they don't exist (SQLite doesn't support IF NOT EXISTS for columns)
    # Check and add imageUrl to Problem table
    if ! sqlite3 /app/data/cars.db "SELECT imageUrl FROM Problem LIMIT 1" 2>/dev/null; then
        echo "Adding imageUrl column to Problem table..."
        sqlite3 /app/data/cars.db "ALTER TABLE Problem ADD COLUMN imageUrl TEXT"
    fi
    # Check and add imageUrl to Expense table
    if ! sqlite3 /app/data/cars.db "SELECT imageUrl FROM Expense LIMIT 1" 2>/dev/null; then
        echo "Adding imageUrl column to Expense table..."
        sqlite3 /app/data/cars.db "ALTER TABLE Expense ADD COLUMN imageUrl TEXT"
    fi
    # Check and add imageUrl to Car table
    if ! sqlite3 /app/data/cars.db "SELECT imageUrl FROM Car LIMIT 1" 2>/dev/null; then
        echo "Adding imageUrl column to Car table..."
        sqlite3 /app/data/cars.db "ALTER TABLE Car ADD COLUMN imageUrl TEXT"
    fi
    echo "Migration completed"
fi

# Execute the main command
exec "$@"
