# Windows Node.js Deployment Script for Contextual AI
# Run in PowerShell

$ErrorActionPreference = "Stop"

Write-Host "=== Contextual AI - Node.js Deployment Script ===" -ForegroundColor Cyan

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm install
npm run build

if (-not (Test-Path "dist")) {
    Write-Error "Build failed - dist directory not found"
    exit 1
}

# Install serve globally if not present
Write-Host "Checking for 'serve' package..." -ForegroundColor Yellow
$serveInstalled = npm list -g serve 2>$null
if (-not $serveInstalled) {
    Write-Host "Installing 'serve' globally..." -ForegroundColor Yellow
    npm install -g serve
}

Write-Host "`n=== Build Complete! ===" -ForegroundColor Green
Write-Host "To start the server, run:" -ForegroundColor Cyan
Write-Host " serve -s dist -l 3000" -ForegroundColor Yellow
Write-Host "`nOr to run as background service with PM2:" -ForegroundColor Cyan
Write-Host " npm install -g pm2" -ForegroundColor Yellow
Write-Host " pm2 serve dist 3000 --name contextual-ai --spa" -ForegroundColor Yellow