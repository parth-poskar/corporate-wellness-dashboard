@REM ----------------------------------------------------------------------------
@REM Convenience runner script for Corporate Wellness Dashboard
@REM Calls the installed Maven executable
@REM ----------------------------------------------------------------------------
@echo off
set "MAVEN_CMD=C:\Program Files\JetBrains\IntelliJ IDEA Community Edition 2023.3.3\plugins\maven\lib\maven3\bin\mvn.cmd"
if exist "%MAVEN_CMD%" (
    "%MAVEN_CMD%" %*
) else (
    mvn %*
)
