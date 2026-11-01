# ================================================================
# Stage 1: Build stage (optional here since we pre-built with Maven)
# Using Eclipse Temurin JRE 21 Alpine for minimal image footprint
# ================================================================
FROM eclipse-temurin:21-jre-alpine AS runtime

# Labels for Docker Hub & CI traceability
LABEL maintainer="parthposkar5@gmail.com" \
      org.opencontainers.image.title="Corporate Wellness Dashboard" \
      org.opencontainers.image.description="Spring Boot 3 Corporate Wellness Dashboard with H2 and Stitch Clinical Clarity Theme" \
      org.opencontainers.image.version="1.0.0" \
      org.opencontainers.image.source="https://github.com/parth-poskar/corporate-wellness-dashboard"

# Security: run as non-root user
RUN addgroup -S wellnessgroup && adduser -S wellnessuser -G wellnessgroup

# App working directory
WORKDIR /app

# Copy the pre-built Spring Boot fat JAR
COPY target/corporate-wellness-dashboard-1.0.0-SNAPSHOT.jar app.jar

# Change ownership to non-root user
RUN chown -R wellnessuser:wellnessgroup /app

# Switch to non-root user
USER wellnessuser

# Expose app port
EXPOSE 8081

# Spring Boot Actuator health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8081/actuator/health || exit 1

# JVM tuning for container environments
ENV JAVA_OPTS="-Xms256m -Xmx512m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0"

# Launch application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]

