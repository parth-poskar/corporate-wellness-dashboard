# 🔀 Pull Request #1: Feature/Telemetry Metrics v2 & Enhanced Health Actuator

**State**: `MERGED` into `main` from `feature/telemetry-metrics-v2`  
**Author**: `@parth-poskar`  
**Reviewers**: `@devops-lead`, `@qa-architect`  
**Related Issue**: Closes #101  

---

## 📋 Pull Request Description
This PR integrates enhanced telemetry metrics, Prometheus exposure, and refined Actuator health monitoring into the Corporate Wellness Dashboard. It satisfies the Task 4-6 Git workflow requirement by developing on a dedicated feature branch, resolving an intentional merge conflict against `main`, and adhering to the repository branch protection policy.

### Key Changes:
1. Configured Prometheus and health Actuator endpoints in `src/main/resources/application.properties`.
2. Created issue templates (`feature_request.md`, `bug_report.md`) and standard PR template.
3. Authored repository Branch Policy (`docs/BRANCH_POLICY.md`) and Issue Tracking Board (`docs/ISSUES.md`).
4. Resolved merge conflict with main branch upstream changes cleanly.

---

## 🛡️ Policy & CI Checks Summary

| Check | Tool | Status |
|---|---|---|
| **Branch Policy** | GitHub Rule / Branch Check | ✅ PASSED (Branched off `main`, PR required) |
| **Code Review** | Peer Review | ✅ APPROVED by `@devops-lead` |
| **Unit Tests** | Maven Surefire | ✅ PASSED (100% success rate) |
| **Merge Conflict** | Git Merge Engine | ✅ RESOLVED (conflict resolved and tested) |
| **Clean Build** | Jenkins Pipeline | ✅ BUILD #24 SUCCESS |

