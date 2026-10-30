#!/bin/bash
# ==============================================================================
# HMS - Automated PostgreSQL Database Backup Script
# Retention Policy: 7 Days Rolling
# ==============================================================================

set -e

BACKUP_DIR="/var/backups/hms"
TIMESTAMP=$(date +'%Y%m%d_%H%M%S')
BACKUP_FILE="$BACKUP_DIR/hms_db_$TIMESTAMP.sql.gz"

echo "💾 Starting automated PostgreSQL database backup..."

mkdir -p "$BACKUP_DIR"

# Detect whether production or local container is running
DB_CONTAINER="hms_db_prod"
if ! docker ps --format '{{.Names}}' | grep -q "^hms_db_prod$"; then
    DB_CONTAINER="hms_db"
fi

echo "📦 Dumping database from container: $DB_CONTAINER..."
docker exec "$DB_CONTAINER" pg_dump -U postgres hostel_saas | gzip > "$BACKUP_FILE"

FILE_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
echo "✅ Database backup created: $BACKUP_FILE ($FILE_SIZE)"

# Clean up backups older than 7 days
echo "🧹 Purging backups older than 7 days..."
find "$BACKUP_DIR" -type f -name "hms_db_*.sql.gz" -mtime +7 -delete

echo "🎉 Database backup routine completed."

