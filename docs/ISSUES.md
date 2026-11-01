# 📌 Project Issues & Tracking Board (Tasks 4–6)

This document records the tracking issues defined according to the corporate branch and issue governance policy.

---

### 🟢 Issue #101: Implement Telemetry Metrics v2 & Enhanced Actuator Health
- **Type**: `enhancement` / `feature`
- **Reporter**: `@parth-poskar`
- **Assignee**: `@parth-poskar`
- **Milestone**: `v1.0.0 Release`
- **Branch**: `feature/telemetry-metrics-v2`
- **Description**: Expose detailed Spring Boot Actuator endpoints for Prometheus telemetry, health check details, and refresh polling intervals for executive KPI streaming.
- **Acceptance Criteria**:
  - [x] Configure Actuator endpoints in `application.properties`
  - [x] Enable Prometheus metric scraping support
  - [x] Pass all unit and integration tests
  - [x] Merge into `main` via PR #1 after conflict resolution

---

### 🟡 Issue #102: Introduce Multi-Stage Jenkinsfile & Parameterized Tomcat Deployment
- **Type**: `ci/cd` / `devops`
- **Reporter**: `@parth-poskar`
- **Assignee**: `@parth-poskar`
- **Milestone**: `v1.0.0 Release`
- **Branch**: `feature/jenkins-tomcat-pipeline`
- **Description**: Create declarative Jenkins pipeline with parameterized target environment (`ENVIRONMENT`), port (`TOMCAT_PORT`), and automated WAR deployment to Apache Tomcat.
- **Acceptance Criteria**:
  - [x] Declarative `Jenkinsfile` at repository root
  - [x] Parameterized settings for `ENVIRONMENT` and `TOMCAT_PORT`
  - [x] Automated artifact compilation and packaging via Maven
  - [x] Jenkins build execution log with successful Tomcat deployment

---

### 🔴 Issue #103: Automated E2E Regression Testing with Selenium WebDriver & Defect Triage
- **Type**: `qa` / `automation`
- **Reporter**: `@parth-poskar`
- **Assignee**: `@parth-poskar`
- **Milestone**: `v1.0.0 Release`
- **Branch**: `feature/selenium-e2e-suite`
- **Description**: Develop 5 complete user journey tests covering Login, Event Filtering, Event Creation, Alert Resolution, and Report Export. Demonstrate deliberate defect injection, detection by Selenium in Maven build, bug fix, and regression verification.
- **Acceptance Criteria**:
  - [x] 5 Selenium user journeys implemented in Maven test suite
  - [x] Headless Chrome/Firefox execution in CI pipeline
  - [x] Defect injection log captured
  - [x] Root cause fixed and 100% green tests verified

