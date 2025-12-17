# Windows IIS Deployment Script for Contextual AI
# Run as Administrator

$ErrorActionPreference = "Stop"

Write-Host "=== Contextual AI - IIS Deployment Script ===" -ForegroundColor Cyan

# Configuration
$SiteName = "Contextual-AI"
$AppPoolName = "Contextual-AI-Pool"
$SitePath = "C:\inetpub\wwwroot\contextual-ai"
$HostHeader = "contextual.local" # Change for production

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Error "This script must be run as Administrator"
    exit 1
}

# Build the application
Write-Host "Building application..." -ForegroundColor Yellow
npm install
npm run build

if (-not (Test-Path "dist")) {
    Write-Error "Build failed - dist directory not found"
    exit 1
}

# Import IIS module
Import-Module WebAdministration

# Create site directory
Write-Host "Creating site directory..." -ForegroundColor Yellow
if (Test-Path $SitePath) {
    Remove-Item $SitePath -Recurse -Force
}
New-Item -ItemType Directory -Path $SitePath -Force | Out-Null

# Copy built files
Write-Host "Copying built files..." -ForegroundColor Yellow
Copy-Item -Path "dist\*" -Destination $SitePath -Recurse -Force
Copy-Item -Path "deploy\windows\web.config" -Destination $SitePath -Force

# Create Application Pool
Write-Host "Creating IIS Application Pool..." -ForegroundColor Yellow
if (Test-Path "IIS:\AppPools\$AppPoolName") {
    Remove-WebAppPool -Name $AppPoolName
}
New-WebAppPool -Name $AppPoolName
Set-ItemProperty "IIS:\AppPools\$AppPoolName" -Name "managedRuntimeVersion" -Value ""

# Create Website
Write-Host "Creating IIS Website..." -ForegroundColor Yellow
if (Test-Path "IIS:\Sites\$SiteName") {
    Remove-Website -Name $SiteName
}
New-Website -Name $SiteName -PhysicalPath $SitePath -ApplicationPool $AppPoolName -HostHeader $HostHeader

# Set permissions
Write-Host "Setting permissions..." -ForegroundColor Yellow
$acl = Get-Acl $SitePath
$identity = "IIS_IUSRS"
$fileSystemRights = "ReadAndExecute"
$type = "Allow"
$rule = New-Object System.Security.AccessControl.FileSystemAccessRule($identity, $fileSystemRights, "ContainerInherit,ObjectInherit", "None", $type)
$acl.SetAccessRule($rule)
Set-Acl $SitePath $acl

Write-Host "`n=== Deployment Complete! ===" -ForegroundColor Green
Write-Host "Site Name: $SiteName" -ForegroundColor Cyan
Write-Host "App Pool: $AppPoolName" -ForegroundColor Cyan
Write-Host "Physical Path: $SitePath" -ForegroundColor Cyan
Write-Host "URL: http://$HostHeader" -ForegroundColor Cyan
Write-Host "`nDon't forget to add '$HostHeader' to your hosts file if testing locally." -ForegroundColor Yellow