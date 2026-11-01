# 🌿 Corporate Wellness Dashboard - Git Branching Policy & Protection Rules

This document outlines the version control strategy, branch protection rules, and governance policies enforced for the `corporate-wellness-dashboard` repository to maintain high release velocity and zero defects in production.

---

## 1. 🏗️ Branching Model (GitFlow Simplified)

| Branch Pattern | Base Branch | Merge Target | Purpose |
|---|---|---|---|
| `main` | N/A | Production Deploy | Production-ready, fully verified stable code. Direct push is strictly disabled. |
| `feature/*` | `main` | `main` (via PR) | Development of new features (e.g. `feature/telemetry-metrics-v2`). |
| `bugfix/*` | `main` | `main` (via PR) | Resolution of non-critical defects and test failures. |
| `hotfix/*` | `main` | `main` (via PR) | Urgent emergency fixes directly against the production baseline. |
| `release/*` | `main` | `main` | Release candidate stabilization, metadata bumping, and release tagging (`v1.0.0`). |

---

## 2. 🛡️ Branch Protection Rules on `main`

The `main` branch is protected by the following GitHub / Git repository policy:

1. **Require a Pull Request Before Merging**:
   - Direct `git push origin main` is blocked for all users (including repository administrators).
   - All code enters `main` exclusively through a reviewed and approved Pull Request.
2. **Require Pull Request Approvals**:
   - Minimum 1 independent peer code review approval required before merge enablement.
   - Dismiss stale pull request approvals when new commits are pushed.
3. **Require Status Checks to Pass Before Merging**:
   - Continuous Integration build (`Jenkins CI` / `GitHub Actions`) must return `SUCCESS`.
   - All Maven unit tests (`mvn test`) must pass with 0 failures and 0 errors.
   - Selenium automated end-to-end regression test suite must execute cleanly.
4. **Require Linear History & Prohibit Force Pushes**:
   - `git push --force` is blocked on `main` to preserve permanent audit trails.
   - Branch deletions are disabled on `main`.
5. **Merge Conflict Protocol**:
   - In case of diverging branches, the author must rebase or merge `main` into their feature branch, resolve all conflict markers cleanly, re-run test suites, and obtain green CI status.

---

## 3. 📋 Pull Request & Issue Governance

- **Issue Requirement**: Every PR must reference an active GitHub tracking issue (e.g., `Closes #101`).
- **Standard PR Template**: Every PR must fill out the `.github/pull_request_template.md` checklist.
- **Semantic Release Tagging**: Releases must follow Semantic Versioning (`vMAJOR.MINOR.PATCH`).
  - Example: `git tag -a v1.0.0 -m "Release v1.0.0"`

