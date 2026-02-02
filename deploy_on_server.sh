#!/bin/bash
set -e

echo "Updating system..."
apt-get update
apt-get install -y certbot git

echo "Stopping existing containers to free port 80..."
docker compose -f /var/www/dacha/docker-compose.prod.yml down --remove-orphans || true

echo "Checking SSL certificates..."
if [ ! -d "/etc/letsencrypt/live/jizzaxrest.uz" ]; then
    echo "Generating SSL certificates..."
    certbot certonly --standalone -d jizzaxrest.uz -d www.jizzaxrest.uz --non-interactive --agree-tos --register-unsafely-without-email
fi

mkdir -p /var/www
cd /var/www

if [ ! -d "dacha" ]; then
    echo "Cloning repository..."
    git clone https://github.com/Tamurbek/dacha-bron.git dacha
    cd dacha
else
    echo "Updating repository..."
    cd dacha
    git pull
fi

echo "Creating .env file..."
cat <<EOF > .env
DOCKER_USERNAME=dacha
TELEGRAM_BOT_TOKEN=8313441569:AAFCTeSRf2PQt23FAmGEGKr8DWJJQRQbHV4
TELEGRAM_CHANNEL_ID=-1003867602554
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=dacha
SECRET_KEY=e8f9a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z7a8b9c0d1
ACCESS_TOKEN_EXPIRE_MINUTES=10080
VITE_API_URL=https://jizzaxrest.uz/api/v1
EOF

echo "Starting Docker containers..."
docker compose -f docker-compose.prod.yml up -d --build

echo "Deployment finished!"
