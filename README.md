# Corporate Wellness Dashboard 🌿

A modern enterprise **Corporate Wellness Dashboard** web application developed with **Java 17, Spring Boot 3, Spring Data JPA, H2 In-Memory Database, and Vanilla HTML/CSS/JavaScript**.

The interface directly implements the **Google Stitch** design system *"Clinical Clarity & Executive Vitality"* featuring a botanical clinical green palette (`#15684d` / `#398568`), sleek high-contrast canvas (`#f8f9ff`), typography powered by **Geist**, and icons by **Material Symbols Outlined**.

---

## 📑 Table of Contents
1. [Tech Stack](#-tech-stack)
2. [Project Structure & Important Files](#-project-structure--important-files)
3. [The 8 Screen Implementations](#-the-8-screen-implementations)
4. [Prerequisites & System Setup](#-prerequisites--system-setup)
5. [How to Run Locally](#-how-to-run-locally)
6. [H2 Database Console](#-h2-database-console)
7. [Important Note on CI/CD Telemetry](#-important-note-on-cicd-telemetry)

---

## 🚀 Tech Stack

- **Backend**: Java 17 / 21, Spring Boot 3.2.5 (Spring Web, Spring Data JPA, Jakarta Validation)
- **Database**: In-Memory H2 Database (with pre-seeded demo dataset)
- **Frontend**: Vanilla HTML5, Vanilla JavaScript (ES6+), Vanilla CSS + Tailwind CSS (Stitch Design Tokens)
- **Design Theme**: *Clinical Clarity & Executive Vitality*
  - Primary Green: `#15684d` / `#398568`
  - Typography: `Geist` (Google Fonts)
  - Icons: `Material Symbols Outlined`
- **Build Tool**: Apache Maven 3.9+

---

## 📂 Project Structure & Important Files

```
corporate-wellness-dashboard/
├── pom.xml                                   # Maven dependencies & build configuration
├── README.md                                 # Complete documentation & run guide
├── .gitignore                                # Excludes target/, IDE configs, OS logs
└── src/
    ├── main/
    │   ├── java/com/acme/wellness/
    │   │   ├── CorporateWellnessApplication.java   # Main Spring Boot entry point
    │   │   ├── config/
    │   │   │   └── WebConfig.java                  # Static resource handler configuration
    │   │   ├── controller/
    │   │   │   ├── AuthController.java             # Login & session API (/api/auth)
    │   │   │   ├── DashboardController.java        # Executive KPIs & summary (/api/dashboard)
    │   │   │   ├── EventController.java            # Event CRUD & status lifecycle (/api/events)
    │   │   │   ├── AlertController.java            # Triage & exception resolution (/api/alerts)
    │   │   │   ├── ReportController.java           # Reporting & CSV export (/api/reports)
    │   │   │   └── DeploymentController.java       # Simulated CI/CD telemetry (/api/deployment)
    │   │   ├── model/
    │   │   │   ├── Department.java                 # Entity for organizational business units
    │   │   │   ├── WellnessEvent.java              # Entity for corporate wellness events
    │   │   │   ├── AlertException.java             # Entity for operational alerts & SLA exceptions
    │   │   │   ├── ParticipationTrend.java         # Entity for 6-month historical participation
    │   │   │   ├── EventAuditLog.java              # Immutable event lifecycle audit trail
    │   │   │   └── DeploymentTelemetry.java        # Simulated CI/CD build metrics
    │   │   ├── repository/                         # Spring Data JPA interfaces for database access
    │   │   ├── service/                            # Business logic & transactional operations
    │   │   └── init/
    │   │       └── DataInitializer.java            # Seeds 24 events, 8 exceptions, and departments
    │   └── resources/
    │       ├── application.properties              # Server port 8080 & H2 database configuration
    │       └── static/                             # Web Frontend (Served directly by Spring Boot)
    │           ├── index.html                      # Single Page Application container & Tailwind theme
    │           ├── css/styles.css                  # Stitch design token variables & typography
    │           └── js/
    │               ├── api.js                      # REST API client helper
    │               └── app.js                      # Client router, App Shell, & 8 view renderers
    └── test/                                       # Unit and integration tests
```

---

## 🖥️ The 8 Screen Implementations

| Screen | Route | Key Features & Stitch Assets |
|---|---|---|
| **1. Wellness Hub Login** | `#/login` | Botanical leaf emblem, interactive demo state switcher (*Default*, *Validation Error*, *Invalid Auth*, *Loading*, *Success*), SSO direct sign-in. |
| **2. Overview Dashboard** | `#/overview` | 4 KPI metric cards, dual-layer SVG participation curve (Aug '24 - Jan '25) with 75% target benchmark and peak hover callout, recent events table, actionable alert widgets, program portfolio breakdown. |
| **3. Wellness Events** | `#/events` | KPI strip, status pills (*All*, *Active*, *Scheduled*, *Completed*, *At Risk*), instant text search, department filter, capacity meters, slide-over Quick Add Event drawer. |
| **4. Create Wellness Event** | `#/create-event` | 2-column form, 0/80 live title character counter, ISO 45003 mental well-being standards checklist, interactive Dev Sandbox toast simulation toolbar. |
| **5. Event Details** | `#/event-detail` | Logistics breakdown (`EVT-2025-0802`), benefit credit allocation, registration progress bar, audit timeline, and an interactive **Update Status** modal dialog. |
| **6. Alerts & Exceptions** | `#/alerts` | Administrative triage board: 8 exceptions (SLA critical vs resolved), priority tags, single-click resolution, bulk resolve action, and automated dispatcher webhook indicator. |
| **7. Wellness Reports** | `#/reports` | 4 KPI indicators, interactive time-series chart with show/hide toggle for corporate 75% target, department comparison progress bars, working **Export CSV** download. |
| **8. Deployment Status** | `#/deployment` | DevOps telemetry board: simulated build states (`#24 Running`, `#23 Stable`, `#22 Failed`), 6 pipeline stages visualizer, raw Jenkins console log modal. |

---

## ⚙️ Prerequisites & System Setup

Ensure you have:
- **Java**: Java 17 or higher (tested on Java 21 LTS)
  ```powershell
  java -version
  ```
- **Maven**: Apache Maven 3.6+
  ```powershell
  mvn -version
  ```

---

## 🏃 How to Run Locally

1. Open PowerShell and navigate to the project directory:
   ```powershell
   cd C:\Users\parth\.gemini\antigravity-ide\scratch\corporate-wellness-dashboard
   ```

2. Compile and run the application:
   ```powershell
   mvn spring-boot:run
   ```

3. Open your browser and visit:
   ```
   http://localhost:8080
   ```
   *(To test the standalone login screen, visit `http://localhost:8080/#/login`)*.

---

## 🗄️ H2 Database Console

The application includes an in-memory H2 database pre-populated with realistic records.

- **Console URL**: `http://localhost:8080/h2-console`
- **JDBC URL**: `jdbc:h2:mem:wellnessdb`
- **User Name**: `sa`
- **Password**: *(leave blank)*

---

## ⚠️ Important Note on CI/CD Telemetry

All Jenkins CI/CD pipeline telemetry shown on the **Deployment Status** page is **simulated demonstration data** designed for educational presentation and college mini-project review. It does not control or connect to an external production build server.
