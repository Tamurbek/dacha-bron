#!/usr/bin/expect -f
set timeout 600
spawn ssh root@94.183.184.106 {
    apt-get update
    apt-get install -y certbot
    certbot certonly --standalone -d jizzaxrest.uz -d www.jizzaxrest.uz --non-interactive --agree-tos --register-unsafely-without-email || true
    
    mkdir -p /var/www
    cd /var/www
    if [ ! -d "dacha" ]; then
        git clone https://github.com/Tamurbek/dacha-bron.git dacha
    else
        cd dacha
        git pull
    fi
    
    cd /var/www/dacha
    cat <<EOF > .env
DOCKER_USERNAME=dacha
TELEGRAM_BOT_TOKEN=8313441569:AAFCTeSRf2PQt23FAmGEGKr8DWJJQRQbHV4
TELEGRAM_CHANNEL_ID=-1003867602554
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=dacha
SECRET_KEY=your-super-secret-key-change-it-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=10080
VITE_API_URL=https://jizzaxrest.uz/api/v1
EOF

    # Fix docker-compose command if needed (using 'docker compose' instead of 'docker-compose')
    # The docker-compose.prod.yml uses DOCKER_USERNAME variable for image names.
    
    docker compose -f docker-compose.prod.yml down --remove-orphans
    docker compose -f docker-compose.prod.yml up -d --build
}
expect {
    "password:" {
        send "Code2025#\r"
    }
}
expect eof
