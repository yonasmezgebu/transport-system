#!/bin/bash

# =====================================================
# DEPLOYMENT SCRIPT
# Description: Deploy Injibara University Transport System
# Usage: ./scripts/deploy.sh [environment]
# =====================================================

# Configuration
ENVIRONMENT=${1:-production}
PROJECT_ROOT="/var/www/transport-system"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/frontend"
BACKUP_DIR="/var/backups/transport-system"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Function to log messages
log_message() {
    echo -e "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if command succeeded
check_status() {
    if [ $? -eq 0 ]; then
        log_message "${GREEN}✓ $1${NC}"
    else
        log_message "${RED}✗ $1 failed${NC}"
        exit 1
    fi
}

# Function to create backup before deployment
create_backup() {
    log_message "${YELLOW}Creating backup before deployment...${NC}"
    
    BACKUP_FILE="$BACKUP_DIR/pre_deploy_backup_$TIMESTAMP.tar.gz"
    tar -czf $BACKUP_FILE -C $PROJECT_ROOT . 2>/dev/null
    
    if [ -f "$BACKUP_FILE" ]; then
        log_message "${GREEN}✓ Backup created: $BACKUP_FILE${NC}"
    else
        log_message "${YELLOW}⚠ No backup created (directory may not exist)${NC}"
    fi
}

# Function to deploy backend
deploy_backend() {
    log_message "${YELLOW}Deploying backend...${NC}"
    
    cd $BACKEND_DIR || {
        log_message "${RED}✗ Backend directory not found: $BACKEND_DIR${NC}"
        return 1
    }
    
    # Pull latest code (if git repo)
    if [ -d ".git" ]; then
        log_message "Pulling latest code..."
        git pull origin main 2>/dev/null
        check_status "Git pull"
    fi
    
    # Install dependencies
    log_message "Installing dependencies..."
    npm install --production 2>/dev/null
    check_status "NPM install"
    
    # Run database migrations
    log_message "Running database migrations..."
    if [ -f "scripts/migrate.js" ]; then
        node scripts/migrate.js 2>/dev/null
        check_status "Database migrations"
    fi
    
    # Run database seeders
    log_message "Running database seeders..."
    if [ -f "scripts/seed.js" ]; then
        node scripts/seed.js 2>/dev/null
        check_status "Database seeders"
    fi
    
    # Restart PM2 process
    log_message "Restarting backend service..."
    if command -v pm2 &> /dev/null; then
        pm2 restart transport-backend 2>/dev/null || pm2 start server.js --name transport-backend
        check_status "PM2 restart"
    else
        log_message "${YELLOW}⚠ PM2 not installed. Starting with node...${NC}"
        pkill -f "node server.js" 2>/dev/null
        nohup node server.js > /dev/null 2>&1 &
        check_status "Node start"
    fi
    
    log_message "${GREEN}✓ Backend deployed successfully${NC}"
}

# Function to deploy frontend
deploy_frontend() {
    log_message "${YELLOW}Deploying frontend...${NC}"
    
    cd $FRONTEND_DIR || {
        log_message "${RED}✗ Frontend directory not found: $FRONTEND_DIR${NC}"
        return 1
    }
    
    # Pull latest code (if git repo)
    if [ -d ".git" ]; then
        log_message "Pulling latest code..."
        git pull origin main 2>/dev/null
        check_status "Git pull"
    fi
    
    # Install dependencies
    log_message "Installing dependencies..."
    npm install 2>/dev/null
    check_status "NPM install"
    
    # Build frontend
    log_message "Building frontend..."
    npm run build 2>/dev/null
    check_status "Frontend build"
    
    # Copy build files to web server
    log_message "Copying build files to web server..."
    if [ -d "dist" ]; then
        sudo rm -rf /var/www/html/*
        sudo cp -r dist/* /var/www/html/
        check_status "Copy to web server"
    else
        log_message "${RED}✗ Build directory not found${NC}"
        return 1
    fi
    
    log_message "${GREEN}✓ Frontend deployed successfully${NC}"
}

# Function to configure Nginx
configure_nginx() {
    log_message "${YELLOW}Configuring Nginx...${NC}"
    
    NGINX_CONFIG="/etc/nginx/sites-available/transport-system"
    
    sudo tee $NGINX_CONFIG > /dev/null << 'EOF'
server {
    listen 80;
    server_name transport.injibara.edu.et;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name transport.injibara.edu.et;
    
    ssl_certificate /etc/ssl/certs/transport.crt;
    ssl_certificate_key /etc/ssl/private/transport.key;
    
    root /var/www/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /uploads {
        alias /var/www/transport-system/backend/uploads;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    client_max_body_size 10M;
}
EOF
    
    sudo ln -sf $NGINX_CONFIG /etc/nginx/sites-enabled/
    sudo nginx -t 2>/dev/null && sudo systemctl reload nginx
    check_status "Nginx configuration"
}

# Function to run health check
run_health_check() {
    log_message "${YELLOW}Running health check...${NC}"
    sleep 5
    
    # Check backend
    if curl -f http://localhost:5000/health > /dev/null 2>&1; then
        log_message "${GREEN}✓ Backend health check passed${NC}"
    else
        log_message "${RED}✗ Backend health check failed${NC}"
        return 1
    fi
    
    # Check frontend
    if curl -f http://localhost/ > /dev/null 2>&1; then
        log_message "${GREEN}✓ Frontend health check passed${NC}"
    else
        log_message "${RED}✗ Frontend health check failed${NC}"
        return 1
    fi
    
    # Check database
    if mysqladmin -u transportAdmin -ptransportSystem ping > /dev/null 2>&1; then
        log_message "${GREEN}✓ Database health check passed${NC}"
    else
        log_message "${RED}✗ Database health check failed${NC}"
        return 1
    fi
    
    return 0
}

# Main deployment process
main() {
    log_message "${BLUE}========================================${NC}"
    log_message "${BLUE}Starting deployment to $ENVIRONMENT environment${NC}"
    log_message "${BLUE}Timestamp: $TIMESTAMP${NC}"
    log_message "${BLUE}========================================${NC}"
    
    # Create backup
    create_backup
    
    # Deploy backend
    deploy_backend
    
    # Deploy frontend
    deploy_frontend
    
    # Configure Nginx (only in production)
    if [ "$ENVIRONMENT" == "production" ]; then
        configure_nginx
    fi
    
    # Run health check
    run_health_check
    
    if [ $? -eq 0 ]; then
        log_message "${GREEN}========================================${NC}"
        log_message "${GREEN}✓ Deployment completed successfully!${NC}"
        log_message "${GREEN}========================================${NC}"
        log_message "Frontend: http://localhost/"
        log_message "Backend API: http://localhost:5000/api"
        log_message "Health Check: http://localhost:5000/health"
    else
        log_message "${RED}========================================${NC}"
        log_message "${RED}✗ Deployment completed with errors${NC}"
        log_message "${RED}========================================${NC}"
        exit 1
    fi
}

# Run main function
main