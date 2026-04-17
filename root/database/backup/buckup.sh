#!/bin/bash

# =====================================================
# DATABASE BACKUP SCRIPT
# Description: Automated backup for transport-system database
# =====================================================

# Configuration
DB_NAME="transport-system"
DB_USER="transportAdmin"
DB_PASS="transportSystem"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/transport-system"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Log file
LOG_FILE="$BACKUP_DIR/backup.log"

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> $LOG_FILE
    echo -e "$1"
}

# Function to check if backup was successful
check_backup() {
    if [ $? -eq 0 ]; then
        log_message "${GREEN}✓ Backup successful: $1${NC}"
        return 0
    else
        log_message "${RED}✗ Backup failed: $1${NC}"
        return 1
    fi
}

# Start backup
log_message "${YELLOW}========================================${NC}"
log_message "${YELLOW}Starting database backup at $(date)${NC}"
log_message "${YELLOW}========================================${NC}"

# 1. Full database backup
log_message "Creating full database backup..."
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_full_$DATE.sql"

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS \
    --single-transaction \
    --routines \
    --triggers \
    --events \
    --complete-insert \
    $DB_NAME > $BACKUP_FILE 2>> $LOG_FILE

if check_backup "Full backup"; then
    # Compress backup
    gzip $BACKUP_FILE
    log_message "Compressed backup: ${BACKUP_FILE}.gz"
fi

# 2. Backup specific tables (optional)
log_message "Creating structure-only backup..."
STRUCTURE_FILE="$BACKUP_DIR/${DB_NAME}_structure_$DATE.sql"

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS \
    --no-data \
    --skip-triggers \
    $DB_NAME > $STRUCTURE_FILE 2>> $LOG_FILE

check_backup "Structure backup"
gzip $STRUCTURE_FILE

# 3. Backup specific tables (critical data)
log_message "Creating critical tables backup..."
CRITICAL_FILE="$BACKUP_DIR/${DB_NAME}_critical_$DATE.sql"

mysqldump -h $DB_HOST -u $DB_USER -p$DB_PASS \
    --single-transaction \
    $DB_NAME \
    users roles drivers vehicles trips trip_assignments \
    > $CRITICAL_FILE 2>> $LOG_FILE

check_backup "Critical tables backup"
gzip $CRITICAL_FILE

# 4. Generate backup metadata
METADATA_FILE="$BACKUP_DIR/backup_metadata_$DATE.txt"
cat > $METADATA_FILE << EOF
========================================
Database Backup Metadata
========================================
Backup Date: $(date)
Database Name: $DB_NAME
Backup Type: Full
Backup Size: $(du -h ${BACKUP_FILE}.gz | cut -f1)
Server: $DB_HOST
MySQL Version: $(mysql -V)
Backup Script Version: 1.0
========================================
Tables backed up:
$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -D $DB_NAME -e "SHOW TABLES;" 2>/dev/null)
========================================
EOF

log_message "Backup metadata saved: $METADATA_FILE"

# 5. Sync to remote backup location (optional)
# Uncomment and configure for remote backup
# REMOTE_SERVER="backup@remote-server.com"
# REMOTE_PATH="/backups/transport-system/"
# 
# log_message "Syncing to remote server..."
# rsync -avz $BACKUP_DIR/ $REMOTE_SERVER:$REMOTE_PATH >> $LOG_FILE 2>&1
# check_backup "Remote sync"

# 6. Clean up old backups (older than RETENTION_DAYS)
log_message "Cleaning up backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*.sql.gz" -type f -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "backup_metadata_*.txt" -type f -mtime +$RETENTION_DAYS -delete

# 7. List current backups
log_message "${YELLOW}Current backups in $BACKUP_DIR:${NC}"
ls -lh $BACKUP_DIR/*.sql.gz 2>/dev/null | tail -5

# 8. Check backup integrity
log_message "Verifying latest backup integrity..."
LATEST_BACKUP=$(ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null | head -1)
if [ -f "$LATEST_BACKUP" ]; then
    gunzip -t $LATEST_BACKUP 2>> $LOG_FILE
    if [ $? -eq 0 ]; then
        log_message "${GREEN}✓ Backup integrity verified${NC}"
    else
        log_message "${RED}✗ Backup integrity check failed${NC}"
    fi
fi

# 9. Send notification (optional)
# Uncomment for email notification
# if [ -f "$LATEST_BACKUP" ]; then
#     echo "Backup completed successfully at $(date)" | mail -s "Backup Success: $DB_NAME" admin@transport.com
# fi

# Completion
log_message "${GREEN}========================================${NC}"
log_message "${GREEN}Backup completed successfully at $(date)${NC}"
log_message "${GREEN}Backup location: $BACKUP_DIR${NC}"
log_message "${GREEN}Total backups: $(ls -1 $BACKUP_DIR/*.sql.gz 2>/dev/null | wc -l)${NC}"
log_message "${GREEN}========================================${NC}"

# Exit with success
exit 0