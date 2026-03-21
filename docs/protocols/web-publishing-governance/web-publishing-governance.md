# Web Publishing Governance Protocol
Version: 0.2.1
Status: adoptable

## Purpose
Ensure that every web publication under Janus Governance is:
- Traceable
- Deterministic
- Rebuildable
- Verifiable in production

This protocol prevents broken deployments, orphan domains, and inconsistent source-of-truth scenarios.

---

## Core Principles

### 1. Single Source of Truth
Every domain or subdomain MUST map to exactly one repository.

- No shared repos across unrelated domains
- No domain pointing to multiple repos
- No “temporary” publishing sources

---

### 2. Explicit Repository Ownership
Each repository MUST explicitly declare:

- Its production domain
- Its deployment method
- Its publishing branch

Required files:
- `CNAME` (for GitHub Pages custom domains)
- `README.md` (with domain declaration)

---

### 3. Deterministic Deployment
A deployment must be reproducible from:

- Repository state
- Branch reference
- Static assets

No hidden steps.
No manual overrides.

---

### 4. Sitemap Integrity
Rules:

- Apex sitemap MUST reference only valid child sitemaps
- Every referenced sitemap MUST return HTTP 200
- No broken links allowed

Validation required before publish.