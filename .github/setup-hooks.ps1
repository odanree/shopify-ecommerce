# Git Hook Installation Script
# This script installs the pre-commit hook to prevent direct commits to main

Write-Host "🔧 Installing Git hooks..." -ForegroundColor Cyan
Write-Host ""

$repoRoot = git rev-parse --show-toplevel
$hookSource = Join-Path $repoRoot ".github\hooks\pre-commit"
$hookDest = Join-Path $repoRoot ".git\hooks\pre-commit"

# Check if source hook exists
if (-Not (Test-Path $hookSource)) {
    Write-Host "❌ Error: Hook source file not found at $hookSource" -ForegroundColor Red
    exit 1
}

# Create .git/hooks directory if it doesn't exist
$hooksDir = Split-Path $hookDest
if (-Not (Test-Path $hooksDir)) {
    New-Item -ItemType Directory -Path $hooksDir -Force | Out-Null
}

# Copy the hook
Copy-Item -Path $hookSource -Destination $hookDest -Force

# On Unix systems, make it executable (Git Bash on Windows handles this)
if ($IsLinux -or $IsMacOS) {
    chmod +x $hookDest
}

Write-Host "✅ Git hooks installed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Installed hooks:" -ForegroundColor Yellow
Write-Host "   - pre-commit: Prevents direct commits to main branch" -ForegroundColor Gray
Write-Host ""
Write-Host "The hook will automatically prevent you from committing directly to main." -ForegroundColor Cyan
Write-Host "You will be prompted to switch to dev or create a feature branch instead." -ForegroundColor Gray
Write-Host ""
Write-Host "See .github/BRANCHING_STRATEGY.md for the complete branching workflow." -ForegroundColor Cyan
Write-Host ""
