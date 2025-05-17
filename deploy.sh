#!/bin/bash

echo "Starting deployment at $(date)" >> /var/log/deploy.log

cd /var/www/erudits2 || exit

# Pull latest changes
git pull origin main >> /var/log/deploy.log 2>&1

# Backend
cd api
composer install --no-interaction --prefer-dist >> /var/log/deploy.log 2>&1
php artisan migrate --force >> /var/log/deploy.log 2>&1
php artisan config:cache
php artisan route:cache

# Frontend
cd ../web
npm install >> /var/log/deploy.log 2>&1
npm run build >> /var/log/deploy.log 2>&1

# Permissions (if needed)
chown -R www-data:www-data /var/www/erudits2

# Restart services
systemctl restart php8.2-fpm
systemctl restart apache2

echo "Deployment completed at $(date)" >> /var/log/deploy.log
