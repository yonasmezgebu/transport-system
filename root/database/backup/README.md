backup/
├── backup.sh # Automated backup script
├── restore.sh # Database restore script
├── README.md # This file
├── *.sql.gz # Compressed backup files
└── *.log # Backup/restore logs

text

## Backup Scripts

### backup.sh
Automated backup script that creates:
- Full database backup
- Structure-only backup
- Critical tables backup
- Backup metadata

**Usage:**
```bash
chmod +x backup.sh
./backup.sh
Cron Setup (Daily at 2 AM):

bash
crontab -e
# Add line:
0 2 * * * /var/backups/transport-system/backup.sh
restore.sh
Database restore script for recovering from backups.

Usage:

bash
chmod +x restore.sh
./restore.sh
Backup Files
Naming Convention
Full backup: transport-system_full_YYYYMMDD_HHMMSS.sql.gz

Structure backup: transport-system_structure_YYYYMMDD_HHMMSS.sql.gz

Critical backup: transport-system_critical_YYYYMMDD_HHMMSS.sql.gz

Metadata: backup_metadata_YYYYMMDD_HHMMSS.txt

Retention Policy
Backups retained for 30 days

Automatic cleanup of older backups

Restore Procedure
List available backups:

bash
ls -lh *.sql.gz
Run restore script:

bash
./restore.sh
Follow prompts to select backup file

Verify restore:

bash
mysql -u transportAdmin -p transport-system -e "SHOW TABLES;"
Manual Restore
If automatic restore fails, use manual method:

bash
# Decompress backup
gunzip -c backup_file.sql.gz > backup.sql

# Restore to database
mysql -u transportAdmin -p transport-system < backup.sql

# Clean up
rm backup.sql
Monitoring
Check Backup Status
bash
# View latest backups
ls -lt *.sql.gz | head -5

# Check backup log
tail -20 backup.log

# Check backup size
du -sh *.sql.gz
Backup Verification
bash
# Test backup integrity
gunzip -t backup_file.sql.gz

# Check backup content
gunzip -c backup_file.sql.gz | head -50
Emergency Recovery
Quick Recovery from Latest Backup
bash
LATEST=$(ls -t *.sql.gz | head -1)
gunzip -c $LATEST | mysql -u transportAdmin -p transport-system
Restore Specific Tables
bash
# Extract specific tables from backup
gunzip -c backup.sql.gz | sed -n '/CREATE TABLE `users`/,/UNLOCK TABLES/p' | mysql -u transportAdmin -p transport-system
Troubleshooting
Common Issues
Permission Denied

bash
chmod +x backup.sh restore.sh
MySQL Connection Failed

Verify credentials in scripts

Check MySQL is running: systemctl status mysql

Disk Space Full

bash
# Check disk usage
df -h

# Clean old backups manually
rm -f transport-system_*.sql.gz
Backup File Corrupt

bash
# Test integrity
gunzip -t backup_file.sql.gz

# Use older backup if available
Best Practices
Regular Backups: Schedule daily automated backups

Off-site Storage: Sync backups to remote server

Test Restores: Periodically test restore procedure

Monitor Space: Ensure adequate disk space for backups

Encryption: Consider encrypting sensitive backups

Documentation: Keep restore procedure documented

Contact
For backup issues, contact:

System Administrator: admin@transport.com

IT Department: it@injibara.edu.et

text

---

## .gitkeep

**File:** `database/backup/.gitkeep`
This file ensures the backup directory is included in git
Actual backup files are ignored via .gitignore
text

---

**✅ Done. I have implemented the backup directory with backup script, restore script, README documentation, and .gitkeep file as requested.**

**Note:** The actual backup files `(*.sql.gz)` will be generated when the backup script runs and should be added to `.gitignore` to avoid committing large database dumps to version control.