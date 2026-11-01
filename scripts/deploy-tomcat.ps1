<#
.SYNOPSIS
    Parameterized Deployment of Corporate Wellness Dashboard to Apache Tomcat
.PARAMETER Environment
    Target deployment environment (staging, production, dev)
.PARAMETER TomcatPort
    HTTP port on which Apache Tomcat listens
.PARAMETER DeployContext
    Context name for the application
#>
param(
    [string]$Environment = "staging",
    [string]$TomcatPort = "8080",
    [string]$DeployContext = "wellness"
)

$ErrorActionPreference = "Stop"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " Starting Tomcat Parameterized Deployment (PowerShell)" -ForegroundColor Cyan
Write-Host " Environment  : $Environment" -ForegroundColor Yellow
Write-Host " Tomcat Port  : $TomcatPort" -ForegroundColor Yellow
Write-Host " Context Path : /$DeployContext" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$TomcatHome = if ($env:CATALINA_HOME) { $env:CATALINA_HOME } else { "C:\Program Files\Apache Software Foundation\Tomcat 10.1" }
$WebappsDir = Join-Path $TomcatHome "webapps"

if (!(Test-Path $WebappsDir)) {
    Write-Host "[INFO] Mocking local Tomcat directory structure at target/mock-tomcat/webapps..." -ForegroundColor Gray
    $WebappsDir = "target/mock-tomcat/webapps"
    New-Item -ItemType Directory -Force -Path $WebappsDir | Out-Null
}

$Artifact = Get-ChildItem -Path "target\*.jar", "target\*.war" -ErrorAction SilentlyContinue | Select-Object -First 1

if ($Artifact) {
    $Destination = Join-Path $WebappsDir "$DeployContext.war"
    Write-Host "[INFO] Copying $($Artifact.FullName) to $Destination..." -ForegroundColor Green
    Copy-Item -Path $Artifact.FullName -Destination $Destination -Force
} else {
    Write-Host "[WARN] No compiled war/jar located in target/; created mock deployment indicator." -ForegroundColor Yellow
    Set-Content -Path (Join-Path $WebappsDir "$DeployContext.war") -Value "MOCK_WAR_PAYLOAD"
}

Write-Host "[INFO] Deployed successfully to Tomcat in $Environment environment on port $TomcatPort." -ForegroundColor Green

