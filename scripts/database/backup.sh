#!/bin/bash
# Database Backup Script

DB_NAME="azizsys_db"
DB_USER="azizsys"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

echo "🔄 Starting database backup..."
pg_dump -h localhost -U $DB_USER -d $DB_NAME > $BACKUP_DIR/backup_$DATE.sql

if [ $? -eq 0 ]; then
    echo "✅ Backup completed: backup_$DATE.sql"
else
    echo "❌ Backup failed"
    exit 1
fi