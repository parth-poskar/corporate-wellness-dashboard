# ⚔️ Git Merge Conflict Scenario & Resolution Report (Tasks 4–6)

This document formally captures the intentional Git merge conflict created between `main` and `feature/telemetry-metrics-v2`, along with its root cause analysis and resolution steps.

---

## 1. 🔀 Divergence Setup

Two parallel streams of work occurred:
1. **Feature Branch (`feature/telemetry-metrics-v2`)**:
   - Commit: `feat(telemetry): Add Issue #101 Prometheus metrics, issue templates, and branch policy`
   - Configured `management.endpoints.web.exposure.include=health,info,metrics,prometheus`, `show-details=always`, `refresh-interval-seconds=30`.
2. **Main Branch Baseline (`main`)**:
   - Commit: `chore(config): Update baseline telemetry intervals on main`
   - Configured `management.endpoints.web.exposure.include=health,info,env`, `show-details=when-authorized`, `refresh-interval-seconds=60`.

---

## 2. 💥 The Conflict Output

When issuing `git merge feature/telemetry-metrics-v2`, Git halted fast-forward and emitted the following conflict notification:

```
Auto-merging src/main/resources/application.properties
CONFLICT (content): Merge conflict in src/main/resources/application.properties
Automatic merge failed; fix conflicts and then commit the result.
```

### Git Conflict Markers:
```properties
<<<<<<< HEAD
# Telemetry & Operational Metrics (Main Baseline: hotfix/sync)
# ===================================================================
management.endpoints.web.exposure.include=health,info,env
management.endpoint.health.show-details=when-authorized
wellness.telemetry.metrics.enabled=false
wellness.telemetry.refresh-interval-seconds=60
wellness.telemetry.pipeline-alert-threshold=10
=======
# Telemetry & Operational Metrics (Feature Branch: feature/telemetry-metrics-v2)
# ===================================================================
management.endpoints.web.exposure.include=health,info,metrics,prometheus
management.endpoint.health.show-details=always
wellness.telemetry.metrics.enabled=true
wellness.telemetry.refresh-interval-seconds=30
wellness.telemetry.pipeline-alert-threshold=5
>>>>>>> feature/telemetry-metrics-v2
```

---

## 3. 🛠️ Conflict Resolution Strategy

Both changes contained valuable operational configurations. The conflict was reconciled by combining the unified endpoints and applying the proactive telemetry intervals:

```properties
# ===================================================================
# Telemetry & Operational Metrics (Resolved: Merged Feature & Main Baseline)
# ===================================================================
management.endpoints.web.exposure.include=health,info,metrics,prometheus,env
management.endpoint.health.show-details=always
wellness.telemetry.metrics.enabled=true
wellness.telemetry.refresh-interval-seconds=30
wellness.telemetry.pipeline-alert-threshold=5
```

### Resolution Commands Executed:
```powershell
git add src/main/resources/application.properties docs/GIT_CONFLICT_RESOLUTION.md
git commit -m "Merge branch 'feature/telemetry-metrics-v2' into main - Resolved telemetry configuration conflict"
```
Verification confirmed a clean tree and a dual-parent merge commit on `main`.
