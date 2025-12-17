#!/bin/bash
# Linux Nginx Deployment Script for Contextual AI
# Run with sudo

set -e

echo "=== Contextual AI - Nginx Deployment Script ==="

# Configuration
SITE_NAME="contextual-ai"
WEB_ROOT="/var/www/contextual-ai"
NGINX_AVAILABLE="/etc/nginx/sites-available"
NGINX_ENABLED="/etc/nginx/sites-enabled"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root (use sudo)"
  exit 1
fi

# Build the application
echo "Building application..."
npm install
npm run build

if [ ! -d "dist" ]; then
  echo "Build failed - dist directory not found"
  exit 1
fi

# Create web root directory
echo "Creating web root directory..."
mkdir -p "$WEB_ROOT"

# Copy built files
echo "Copying built files..."
cp -r dist/* "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"
chmod -R 755 "$WEB_ROOT"

# Copy nginx configuration
echo "Configuring nginx..."
cp deploy/linux/nginx.conf "$NGINX_AVAILABLE/$SITE_NAME"

# Enable site
if [ -f "$NGINX_ENABLED/$SITE_NAME" ]; then
  rm "$NGINX_ENABLED/$SITE_NAME"
fi
ln -s "$NGINX_AVAILABLE/$SITE_NAME" "$NGINX_ENABLED/$SITE_NAME"

# Test nginx configuration
echo "Testing nginx configuration..."
nginx -t

# Reload nginx
echo "Reloading nginx..."
systemctl reload nginx

echo ""
echo "=== Deployment Complete! ==="
echo "Site: $SITE_NAME"
echo "Web Root: $WEB_ROOT"
echo "Access at: http://your-server-ip/"
echo ""
echo "To configure HTTPS with Let's Encrypt:"
echo "  sudo apt install certbot python3-certbot-nginx"
echo "  sudo certbot --nginx -d your-domain.com"