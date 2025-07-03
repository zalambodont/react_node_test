# TaskFlow Deployment Guide

## Overview

This guide covers deployment strategies for TaskFlow in various environments, from development to production.

## Prerequisites

### System Requirements

**Minimum Requirements:**
- CPU: 2 cores
- RAM: 4GB
- Storage: 20GB SSD
- Network: 10 Mbps

**Recommended for Production:**
- CPU: 4+ cores
- RAM: 8GB+
- Storage: 100GB+ SSD
- Network: 100+ Mbps
- Load balancer capability

### Software Dependencies

- Node.js 18.x or higher
- MongoDB 6.x or higher
- Nginx (for production)
- PM2 (for process management)
- SSL certificates (for HTTPS)

## Development Deployment

### Local Development Setup

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd taskflow
   npm install
   cd server && npm install
   ```

2. **Environment Configuration**
   Create `.env` files:
   
   **Frontend (.env):**
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_APP_NAME=TaskFlow
   ```
   
   **Backend (server/.env):**
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskflow
   JWT_SECRET=your-development-secret-key
   NODE_ENV=development
   CORS_ORIGIN=http://localhost:5173
   ```

3. **Start Services**
   ```bash
   # Terminal 1: MongoDB
   mongod
   
   # Terminal 2: Backend
   cd server
   npm run dev
   
   # Terminal 3: Frontend
   npm run dev
   ```

### Docker Development

1. **Create docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     mongodb:
       image: mongo:6
       container_name: taskflow-mongo
       restart: always
       ports:
         - "27017:27017"
       volumes:
         - mongodb_data:/data/db
       environment:
         MONGO_INITDB_ROOT_USERNAME: admin
         MONGO_INITDB_ROOT_PASSWORD: password
   
     backend:
       build: ./server
       container_name: taskflow-backend
       restart: always
       ports:
         - "5000:5000"
       depends_on:
         - mongodb
       environment:
         MONGODB_URI: mongodb://admin:password@mongodb:27017/taskflow?authSource=admin
         JWT_SECRET: development-secret
   
     frontend:
       build: .
       container_name: taskflow-frontend
       restart: always
       ports:
         - "5173:5173"
       depends_on:
         - backend
   
   volumes:
     mongodb_data:
   ```

2. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

## Staging Deployment

### Server Setup

1. **Server Preparation**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install MongoDB
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

2. **Application Deployment**
   ```bash
   # Clone repository
   git clone <repository-url> /var/www/taskflow
   cd /var/www/taskflow
   
   # Install dependencies
   npm install
   cd server && npm install && cd ..
   
   # Build frontend
   npm run build
   ```

3. **Environment Configuration**
   ```bash
   # Create production environment files
   sudo nano /var/www/taskflow/.env.production
   sudo nano /var/www/taskflow/server/.env.production
   ```

4. **PM2 Configuration**
   Create `ecosystem.config.js`:
   ```javascript
   module.exports = {
     apps: [{
       name: 'taskflow-backend',
       script: './server/src/index.js',
       cwd: '/var/www/taskflow',
       env: {
         NODE_ENV: 'production',
         PORT: 5000
       },
       instances: 'max',
       exec_mode: 'cluster',
       max_memory_restart: '1G'
     }]
   };
   ```

5. **Start Application**
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

### Nginx Configuration

1. **Create Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           root /var/www/taskflow/dist;
           try_files $uri $uri/ /index.html;
           
           # Security headers
           add_header X-Frame-Options "SAMEORIGIN" always;
           add_header X-Content-Type-Options "nosniff" always;
           add_header X-XSS-Protection "1; mode=block" always;
       }
       
       # API routes
       location /api/ {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Static assets caching
       location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

2. **Enable Configuration**
   ```bash
   sudo ln -s /etc/nginx/sites-available/taskflow /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

## Production Deployment

### SSL/HTTPS Setup

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Obtain SSL Certificate**
   ```bash
   sudo certbot --nginx -d your-domain.com
   ```

3. **Auto-renewal Setup**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Database Configuration

1. **MongoDB Production Setup**
   ```bash
   # Create MongoDB configuration
   sudo nano /etc/mongod.conf
   ```
   
   ```yaml
   storage:
     dbPath: /var/lib/mongodb
     journal:
       enabled: true
   
   systemLog:
     destination: file
     logAppend: true
     path: /var/log/mongodb/mongod.log
   
   net:
     port: 27017
     bindIp: 127.0.0.1
   
   security:
     authorization: enabled
   ```

2. **Create Database User**
   ```bash
   mongo
   use admin
   db.createUser({
     user: "taskflow_admin",
     pwd: "secure_password",
     roles: ["readWrite", "dbAdmin"]
   })
   ```

### Environment Variables

**Production Environment (.env.production):**
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://taskflow_admin:secure_password@localhost:27017/taskflow
JWT_SECRET=super-secure-jwt-secret-for-production
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=error
SESSION_TIMEOUT=3600000
```

### Monitoring Setup

1. **PM2 Monitoring**
   ```bash
   # Install PM2 monitoring
   pm2 install pm2-server-monit
   
   # View logs
   pm2 logs
   
   # Monitor processes
   pm2 monit
   ```

2. **Log Management**
   ```bash
   # Configure log rotation
   sudo nano /etc/logrotate.d/taskflow
   ```
   
   ```
   /var/www/taskflow/logs/*.log {
       daily
       missingok
       rotate 52
       compress
       notifempty
       create 644 www-data www-data
       postrotate
           pm2 reload taskflow-backend
       endscript
   }
   ```

### Backup Strategy

1. **Database Backup Script**
   ```bash
   #!/bin/bash
   # backup.sh
   
   DATE=$(date +%Y%m%d_%H%M%S)
   BACKUP_DIR="/backups/mongodb"
   DB_NAME="taskflow"
   
   mkdir -p $BACKUP_DIR
   
   mongodump --db $DB_NAME --out $BACKUP_DIR/backup_$DATE
   
   # Compress backup
   tar -czf $BACKUP_DIR/backup_$DATE.tar.gz -C $BACKUP_DIR backup_$DATE
   rm -rf $BACKUP_DIR/backup_$DATE
   
   # Keep only last 7 days
   find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
   ```

2. **Automated Backups**
   ```bash
   # Add to crontab
   0 2 * * * /var/www/taskflow/scripts/backup.sh
   ```

## Cloud Deployment

### AWS Deployment

1. **EC2 Instance Setup**
   - Instance type: t3.medium or larger
   - Security groups: HTTP (80), HTTPS (443), SSH (22)
   - Elastic IP for static IP address

2. **RDS for MongoDB**
   - Use DocumentDB for managed MongoDB
   - Configure security groups for database access

3. **S3 for Static Assets**
   - Store uploaded files and backups
   - Configure CloudFront for CDN

### Docker Production

1. **Production Dockerfile**
   ```dockerfile
   # Frontend
   FROM node:18-alpine AS build
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci --only=production
   COPY . .
   RUN npm run build
   
   FROM nginx:alpine
   COPY --from=build /app/dist /usr/share/nginx/html
   COPY nginx.conf /etc/nginx/nginx.conf
   EXPOSE 80
   ```

2. **Kubernetes Deployment**
   ```yaml
   apiVersion: apps/v1
   kind: Deployment
   metadata:
     name: taskflow-frontend
   spec:
     replicas: 3
     selector:
       matchLabels:
         app: taskflow-frontend
     template:
       metadata:
         labels:
           app: taskflow-frontend
       spec:
         containers:
         - name: frontend
           image: taskflow:latest
           ports:
           - containerPort: 80
   ```

## Health Checks and Monitoring

### Application Health Checks

1. **Health Check Endpoint**
   ```javascript
   // server/src/routes/health.js
   app.get('/health', (req, res) => {
     res.status(200).json({
       status: 'healthy',
       timestamp: new Date().toISOString(),
       uptime: process.uptime(),
       memory: process.memoryUsage()
     });
   });
   ```

2. **Database Health Check**
   ```javascript
   app.get('/health/db', async (req, res) => {
     try {
       await mongoose.connection.db.admin().ping();
       res.status(200).json({ database: 'connected' });
     } catch (error) {
       res.status(500).json({ database: 'disconnected' });
     }
   });
   ```

### Performance Monitoring

1. **Application Metrics**
   - Response time monitoring
   - Error rate tracking
   - Memory usage alerts
   - CPU utilization monitoring

2. **Database Monitoring**
   - Query performance
   - Connection pool status
   - Index usage statistics
   - Storage utilization

## Rollback Procedures

### Application Rollback

1. **PM2 Rollback**
   ```bash
   # Stop current version
   pm2 stop taskflow-backend
   
   # Checkout previous version
   git checkout <previous-commit>
   npm install
   npm run build
   
   # Restart application
   pm2 start taskflow-backend
   ```

2. **Database Rollback**
   ```bash
   # Restore from backup
   mongorestore --db taskflow /backups/mongodb/backup_YYYYMMDD.tar.gz
   ```

### Emergency Procedures

1. **Service Restart**
   ```bash
   # Restart all services
   pm2 restart all
   sudo systemctl restart nginx
   sudo systemctl restart mongod
   ```

2. **Maintenance Mode**
   ```nginx
   # Nginx maintenance configuration
   location / {
       return 503;
   }
   
   error_page 503 @maintenance;
   location @maintenance {
       root /var/www/maintenance;
       rewrite ^(.*)$ /maintenance.html break;
   }
   ```

## Security Checklist

### Server Security

- [ ] Firewall configured (UFW/iptables)
- [ ] SSH key-based authentication
- [ ] Regular security updates
- [ ] Non-root user for application
- [ ] Fail2ban for brute force protection

### Application Security

- [ ] Environment variables secured
- [ ] HTTPS enforced
- [ ] Security headers configured
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured

### Database Security

- [ ] Authentication enabled
- [ ] Strong passwords used
- [ ] Network access restricted
- [ ] Regular backups automated
- [ ] Encryption at rest enabled

---

**Document Version**: 1.0.0  
**Last Updated**: December 2024  
**Next Review**: March 2025 