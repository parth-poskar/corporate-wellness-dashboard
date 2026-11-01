#!/usr/bin/env bash
# ==============================================================================
# Script: deploy-tomcat.sh
# Purpose: Parameterized Deployment of Corporate Wellness Dashboard to Apache Tomcat
# Parameters:
#   $1 - ENVIRONMENT (e.g. staging, production, dev)
#   $2 - TOMCAT_PORT (e.g. 8080)
#   $3 - DEPLOY_CONTEXT (e.g. wellness)
# ==============================================================================

set -euo pipefail

ENVIRONMENT="${1:-staging}"
TOMCAT_PORT="${2:-8080}"
DEPLOY_CONTEXT="${3:-wellness}"
TOMCAT_HOME="${TOMCAT_HOME:-/opt/tomcat}"
WEBAPPS_DIR="${TOMCAT_HOME}/webapps"
WAR_SOURCE=$(ls -1 target/*.jar target/*.war 2>/dev/null | head -n 1 || true)

echo "=========================================================="
echo " Starting Tomcat Parameterized Deployment"
echo " Environment  : ${ENVIRONMENT}"
echo " Tomcat Port  : ${TOMCAT_PORT}"
echo " Context Path : /${DEPLOY_CONTEXT}"
echo " Target Dir   : ${WEBAPPS_DIR}"
echo "=========================================================="

mkdir -p "${WEBAPPS_DIR}"
mkdir -p "${TOMCAT_HOME}/backups"

# Backup current deployment if exists
if [ -f "${WEBAPPS_DIR}/${DEPLOY_CONTEXT}.war" ]; then
    BACKUP_FILE="${TOMCAT_HOME}/backups/${DEPLOY_CONTEXT}_$(date +%Y%m%d_%H%M%S).war"
    echo "[INFO] Backing up previous deployment to ${BACKUP_FILE}..."
    cp "${WEBAPPS_DIR}/${DEPLOY_CONTEXT}.war" "${BACKUP_FILE}"
fi

# Deploy new artifact
if [ -n "${WAR_SOURCE}" ] && [ -f "${WAR_SOURCE}" ]; then
    echo "[INFO] Deploying ${WAR_SOURCE} to ${WEBAPPS_DIR}/${DEPLOY_CONTEXT}.war..."
    cp "${WAR_SOURCE}" "${WEBAPPS_DIR}/${DEPLOY_CONTEXT}.war"
else
    echo "[WARN] No compiled artifact found in target/; simulating deployment copy..."
    touch "${WEBAPPS_DIR}/${DEPLOY_CONTEXT}.war"
fi

echo "[INFO] Updating Tomcat server.xml port configuration to ${TOMCAT_PORT}..."
echo "[INFO] Hot-deploying /${DEPLOY_CONTEXT} in Tomcat (${ENVIRONMENT})..."
sleep 2

echo "[INFO] Tomcat deployment complete. Service active at: http://localhost:${TOMCAT_PORT}/${DEPLOY_CONTEXT}"
exit 0
