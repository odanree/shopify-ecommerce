#!/usr/bin/env pwsh
# Quick test for modern homepage

Write-Host "🚀 Starting homepage test..." -ForegroundColor Green
Write-Host ""

# Navigate to project
Push-Location "shopify-headless"

# Check dependencies
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
} else {
    Write-Host "✓ Dependencies installed" -ForegroundColor Green
}

Write-Host ""
Write-Host "🏃 Starting development server..." -ForegroundColor Yellow
Write-Host "Visit: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Things to test:" -ForegroundColor Yellow
Write-Host "  1. Hero section loads immediately (above fold)" -ForegroundColor Gray
Write-Host "  2. Featured products grid is visible" -ForegroundColor Gray
Write-Host "  3. Scroll down to see hero carousel below fold" -ForegroundColor Gray
Write-Host "  4. Click carousel navigation dots or arrow buttons" -ForegroundColor Gray
Write-Host "  5. Carousel auto-advances every 5 seconds" -ForegroundColor Gray
Write-Host "  6. Text overlay animates when slide changes" -ForegroundColor Gray
Write-Host "  7. Test on mobile (DevTools: toggle device toolbar)" -ForegroundColor Gray
Write-Host ""
Write-Host "⏸️  Press Ctrl+C to stop" -ForegroundColor Magenta

npm run dev

Pop-Location
