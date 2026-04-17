#!/bin/bash

# =====================================================
# HEALTH CHECK SCRIPT
# Description: Monitor system health for transport system
# Usage: ./scripts/healthcheck.sh
# =====================================================

# Configuration
API_URL="http://localhost:5000"
FRONTEND_URL="http://localhost"
DB_HOST="localhost"
DB_USER="transportAdmin"
DB_PASS="transportSystem"
DB_NAME="transport-system"
LOG_FILE="/var/log/transport-system/healthcheck.log"
ALERT_EMAIL="admin@transport.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Create log directory if it doesn't exist
mkdir -p $(dirname $LOG_FILE)

# Function to log messages
log_message() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a $LOG_FILE
}

# Function to send alert
send_alert() {
    local subject="$1"
    local message="$2"
    
    if command -v mail &> /dev/null; then
        echo "$message" | mail -s "$subject" $ALERT_EMAIL
        log_message "Alert sent to $ALERT_EMAIL"
    else
        log_message "${YELLOW}⚠ mail command not found. Alert not sent.${NC}"
    fi
}

# Function to check backend health
check_backend() {
    log_message "Checking backend health..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $API_URL/health)
    
    if [ "$RESPONSE" == "200" ]; then
        log_message "${GREEN}✓ Backend is healthy (HTTP $RESPONSE)${NC}"
        return 0
    else
        log_message "${RED}✗ Backend is unhealthy (HTTP $RESPONSE)${NC}"
        send_alert "Backend Down" "Backend service is not responding. HTTP Status: $RESPONSE"
        return 1
    fi
}

# Function to check frontend health
check_frontend() {
    log_message "Checking frontend health..."
    
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" $FRONTEND_URL)
    
    if [ "$RESPONSE" == "200" ] || [ "$RESPONSE" == "301" ] || [ "$RESPONSE" == "302" ]; then
        log_message "${GREEN}✓ Frontend is healthy (HTTP $RESPONSE)${NC}"
        return 0
    else
        log_message "${RED}✗ Frontend is unhealthy (HTTP $RESPONSE)${NC}"
        send_alert "Frontend Down" "Frontend service is not responding. HTTP Status: $RESPONSE"
        return 1
    fi
}

# Function to check database health
check_database() {
    log_message "Checking database health..."
    
    if mysqladmin -h $DB_HOST -u $DB_USER -p$DB_PASS ping &>/dev/null; then
        log_message "${GREEN}✓ Database is healthy${NC}"
        return 0
    else
        log_message "${RED}✗ Database is unhealthy${NC}"
        send_alert "Database Down" "Database server is not responding"
        return 1
    fi
}

# Function to check database connection count
check_db_connections() {
    log_message "Checking database connections..."
    
    CONNECTIONS=$(mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SHOW STATUS LIKE 'Threads_connected'" 2>/dev/null | grep -v Variable | awk '{print $2}')
    
    if [ -n "$CONNECTIONS" ] && [ "$CONNECTIONS" -lt 150 ]; then
        log_message "${GREEN}✓ Database connections: $CONNECTIONS${NC}"
        return 0
    else
        log_message "${YELLOW}⚠ High database connections: $CONNECTIONS${NC}"
        return 1
    fi
}

# Function to check disk space
check_disk_space() {
    log_message "Checking disk space..."
    
    DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$DISK_USAGE" -lt 80 ]; then
        log_message "${GREEN}✓ Disk usage: ${DISK_USAGE}%${NC}"
        return 0
    elif [ "$DISK_USAGE" -lt 90 ]; then
        log_message "${YELLOW}⚠ Disk usage is high: ${DISK_USAGE}%${NC}"
        return 0
    else
        log_message "${RED}✗ Disk usage is critical: ${DISK_USAGE}%${NC}"
        send_alert "Disk Space Critical" "Disk usage is at ${DISK_USAGE}% on $(hostname)"
        return 1
    fi
}

# Function to check memory usage
check_memory() {
    log_message "Checking memory usage..."
    
    MEMORY_USAGE=$(free | grep Mem | awk '{print ($3/$2) * 100.0}' | cut -d. -f1)
    
    if [ "$MEMORY_USAGE" -lt 80 ]; then
        log_message "${GREEN}✓ Memory usage: ${MEMORY_USAGE}%${NC}"
        return 0
    elif [ "$MEMORY_USAGE" -lt 90 ]; then
        log_message "${YELLOW}⚠ Memory usage is high: ${MEMORY_USAGE}%${NC}"
        return 0
    else
        log_message "${RED}✗ Memory usage is critical: ${MEMORY_USAGE}%${NC}"
        send_alert "Memory Critical" "Memory usage is at ${MEMORY_USAGE}% on $(hostname)"
        return 1
    fi
}

# Function to check CPU load
check_cpu() {
    log_message "Checking CPU load..."
    
    CPU_LOAD=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    
    if [ -z "$CPU_LOAD" ]; then
        CPU_LOAD=$(top -bn1 | grep "%Cpu" | awk '{print $2}' | cut -d'%' -f1)
    fi
    
    CPU_LOAD_INT=${CPU_LOAD%.*}
    
    if [ "$CPU_LOAD_INT" -lt 80 ]; then
        log_message "${GREEN}✓ CPU usage: ${CPU_LOAD}%${NC}"
        return 0
    elif [ "$CPU_LOAD_INT" -lt 90 ]; then
        log_message "${YELLOW}⚠ CPU usage is high: ${CPU_LOAD}%${NC}"
        return 0
    else
        log_message "${RED}✗ CPU usage is critical: ${CPU_LOAD}%${NC}"
        send_alert "CPU Critical" "CPU usage is at ${CPU_LOAD}% on $(hostname)"
        return 1
    fi
}

# Function to check PM2 process status
check_pm2() {
    if command -v pm2 &> /dev/null; then
        log_message "Checking PM2 process status..."
        
        PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -c '"status":"online"')
        
        if [ "$PM2_STATUS" -gt 0 ]; then
            log_message "${GREEN}✓ PM2 processes are running ($PM2_STATUS online)${NC}"
            return 0
        else
            log_message "${RED}✗ No PM2 processes are running${NC}"
            send_alert "PM2 Down" "No PM2 processes are running"
            return 1
        fi
    else
        log_message "${YELLOW}⚠ PM2 not installed${NC}"
        return 0
    fi
}

# Function to check API response time
check_api_response_time() {
    log_message "Checking API response time..."
    
    START_TIME=$(date +%s%N)
    curl -s -o /dev/null $API_URL/health
    END_TIME=$(date +%s%N)
    RESPONSE_TIME=$(( ($END_TIME - $START_TIME) / 1000000 ))
    
    if [ "$RESPONSE_TIME" -lt 1000 ]; then
        log_message "${GREEN}✓ API response time: ${RESPONSE_TIME}ms${NC}"
        return 0
    elif [ "$RESPONSE_TIME" -lt 3000 ]; then
        log_message "${YELLOW}⚠ API response time is slow: ${RESPONSE_TIME}ms${NC}"
        return 0
    else
        log_message "${RED}✗ API response time is critical: ${RESPONSE_TIME}ms${NC}"
        send_alert "API Slow" "API response time is ${RESPONSE_TIME}ms"
        return 1
    fi
}

# Main health check function
main() {
    log_message "${BLUE}========================================${NC}"
    log_message "${BLUE}Starting health check at $(date)${NC}"
    log_message "${BLUE}========================================${NC}"
    
    FAILED=0
    
    # Run all checks
    check_backend || ((FAILED++))
    check_frontend || ((FAILED++))
    check_database || ((FAILED++))
    check_db_connections || ((FAILED++))
    check_disk_space || ((FAILED++))
    check_memory || ((FAILED++))
    check_cpu || ((FAILED++))
    check_pm2 || ((FAILED++))
    check_api_response_time || ((FAILED++))
    
    log_message "${BLUE}========================================${NC}"
    
    if [ $FAILED -eq 0 ]; then
        log_message "${GREEN}✓ All health checks passed${NC}"
        exit 0
    else
        log_message "${YELLOW}⚠ $FAILED health check(s) failed/warning${NC}"
        exit 1
    fi
}

# Run main function
main