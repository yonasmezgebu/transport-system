#!/bin/bash

# =====================================================
# DATABASE RESTORE SCRIPT
# Description: Restore transport-system database from backup
# =====================================================

# Configuration
DB_NAME="transport-system"
DB_USER="transportAdmin"
DB_PASS="transportSystem"
DB_HOST="localhost"
BACKUP_DIR="/var/backups/transport-system"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to list available backups
list_backups() {
    echo -e "${YELLOW}Available backups:${NC}"
    ls -lh $BACKUP_DIR/*.sql.gz 2>/dev/null | awk '{print $9 " - " $5}'
    echo ""
}

# Function to confirm restore
confirm_restore() {
    echo -e "${RED}WARNING: This will overwrite the current database!${NC}"
    read -p "Are you sure you want to continue? (yes/no): " confirm
    if [ "$confirm" != "yes" ]; then
        echo "Restore cancelled."
        exit 0
    fi
}

# Check if backup directory exists
if [ ! -d "$BACKUP_DIR" ]; then
    echo -e "${RED}Error: Backup directory not found: $BACKUP_DIR${NC}"
    exit 1
fi

# List available backups
list_backups

# Get backup file from user
read -p "Enter backup filename to restore (or press Enter for latest): " BACKUP_FILE

if [ -z "$BACKUP_FILE" ]; then
    # Use latest backup
    BACKUP_FILE=$(ls -t $BACKUP_DIR/*.sql.gz 2>/dev/null | head -1)
    if [ -z "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: No backups found${NC}"
        exit 1
    fi
    echo -e "Using latest backup: $BACKUP_FILE"
else
    BACKUP_FILE="$BACKUP_DIR/$BACKUP_FILE"
    if [ ! -f "$BACKUP_FILE" ]; then
        echo -e "${RED}Error: Backup file not found: $BACKUP_FILE${NC}"
        exit 1
    fi
fi

# Confirm restore
confirm_restore

# Create restore log
LOG_FILE="$BACKUP_DIR/restore_$(date +%Y%m%d_%H%M%S).log"

echo "========================================" | tee -a $LOG_FILE
echo "Starting database restore at $(date)" | tee -a $LOG_FILE
echo "Backup file: $BACKUP_FILE" | tee -a $LOG_FILE
echo "========================================" | tee -a $LOG_FILE

# Decompress and restore
echo "Decompressing backup file..." | tee -a $LOG_FILE
gunzip -c $BACKUP_FILE | mysql -h $DB_HOST -u $DB_USER -p$DB_PASS $DB_NAME 2>> $LOG_FILE

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Database restored successfully!${NC}" | tee -a $LOG_FILE
    echo "Restore completed at $(date)" | tee -a $LOG_FILE
else
    echo -e "${RED}✗ Database restore failed!${NC}" | tee -a $LOG_FILE
    echo "Check log file for details: $LOG_FILE" | tee -a $LOG_FILE
    exit 1
fi

# Verify restore
echo "Verifying restore..." | tee -a $LOG_FILE
TABLE_COUNT=$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -D $DB_NAME -e "SHOW TABLES;" 2>/dev/null | wc -l)
echo "Tables restored: $((TABLE_COUNT - 1))" | tee -a $LOG_FILE

echo -e "${GREEN}========================================${NC}" | tee -a $LOG_FILE
echo -e "${GREEN}Restore process completed${NC}" | tee -a $LOG_FILE