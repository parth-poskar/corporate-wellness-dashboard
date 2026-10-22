# PowerShell script to run Corporate Wellness Dashboard
Write-Host "Starting Corporate Wellness Dashboard..." -ForegroundColor Cyan
& ".\mvn.cmd" spring-boot:run
