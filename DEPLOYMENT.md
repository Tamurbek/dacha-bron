# Deployment and CI/CD Guide

This project is configured for automated deployment using **GitHub Actions**, **Docker**, and **docker-compose**.

## Prerequisites

1. A server with **Docker** and **docker-compose** installed.
2. A **Docker Hub** account.
3. SSH access to your server.

## GitHub Secrets

To make the CI/CD pipeline work, you must add the following secrets to your GitHub repository (**Settings > Secrets and variables > Actions > New repository secret**):

### Docker Hub Credentials
- `DOCKER_USERNAME`: Your Docker Hub username.
- `DOCKER_PASSWORD`: Your Docker Hub password or an Access Token.

### Server Connection
- `SERVER_HOST`: The IP address or domain of your server.
- `SERVER_USER`: The SSH username (e.g., `ubuntu`, `root`).
- `SSH_PRIVATE_KEY`: Your SSH private key used to connect to the server.

### Application Environment
- `POSTGRES_USER`: Database username.
- `POSTGRES_PASSWORD`: Database password.
- `POSTGRES_DB`: Database name (e.g., `dacha`).
- `SECRET_KEY`: A secret key for backend authentication.
- `TELEGRAM_BOT_TOKEN`: Your Telegram bot token.
- `TELEGRAM_CHANNEL_ID`: Your Telegram channel ID.
- `VITE_API_URL`: The public URL of your backend API (e.g., `https://jizzaxrest.uz` or `http://jizzaxrest.uz`).

## How it works

1. **Push to `main`**: Every time you push code to the `main` branch, the GitHub Action triggers.
2. **Build & Push**: It builds production Docker images for both frontend and backend and pushes them to Docker Hub.
3. **Deployment**:
   - Copies `docker-compose.prod.yml` to the server.
   - Generates a `.env` file on the server using the secrets.
   - Pulls the latest images from Docker Hub.
   - Restarts the containers using `docker-compose -f docker-compose.prod.yml up -d`.

## Manual Deployment

If you want to deploy manually on the server:

```bash
# Clone the repo (if not already there)
git clone <your-repo-url>
cd dacha

# Create .env file with your production values
nano .env

# Run with production compose
docker-compose -f docker-compose.prod.yml up -d --build
```

## Domain & SSL Setup

1. **DNS**: Proyektni ishga tushirish uchun `jizzaxrest.uz` domenini serveringiz IP manziliga yo'naltiring (A record).
2. **SSL (HTTPS)**: Sayt xavfsiz bo'lishi uchun SSL sertifikat o'rnatish lozim. Buning uchun serverda **Certbot** orqali yoki **Nginx Proxy Manager** yordamida `jizzaxrest.uz` va `api.jizzaxrest.uz` uchun sertifikat olishingiz mumkin.

Maslahat: Agar serverda faqat shu loyiha bo'lsa, **Caddy** ishlatish ham juda qulay, u SSLni avtomatik boshqaradi.
