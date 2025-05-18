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

#versioning
DATE_TAG=$(date +'%Y-%m-%d')
BUILD_COUNT=$(git tag --list "$DATE_TAG.*" | wc -l)
BUILD_VERSION=$((BUILD_COUNT + 1))
FULL_TAG="$DATE_TAG.$BUILD_VERSION"

git tag "$FULL_TAG"
git push origin "$FULL_TAG"

sed -i "s/^VITE_APP_VERSION=.*/VITE_APP_VERSION=$FULL_TAG/" .env

npm install >> /var/log/deploy.log 2>&1
npm run build >> /var/log/deploy.log 2>&1

# Restart services
systemctl restart apache2

echo "Deployment completed at $(date)" >> /var/log/deploy.log
