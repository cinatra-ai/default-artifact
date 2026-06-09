# External Integrations

**Analysis Date:** 2026-06-09

## APIs & External Services

**Cinatra Platform (internal):**
- `@cinatra-ai/sdk-extensions` - provides `SemanticArtifactManifest` type; this is a host-internal package resolved only within the Cinatra monorepo, not published to any public registry
  - SDK/Client: optional peer dependency declared in `package.json`
  - Auth: Not applicable (compile-time type dependency only)

**Cinatra Marketplace:**
- Extension submit/review/promotion pipeline via `registry.cinatra.ai`
  - Triggered by GitHub Release publish events (see `.github/workflows/ci.yml` release job)
  - Auth: `CINATRA_MARKETPLACE_VENDOR_TOKEN` org secret (inherited by reusable workflow)
  - Reusable workflow: `cinatra-ai/.github/.github/workflows/reusable-extension-release.yml@main`

## Data Storage

**Databases:**
- Not applicable (metadata-only extension; no database access)

**File Storage:**
- Not applicable

**Caching:**
- Not applicable

## Authentication & Identity

**Auth Provider:**
- Not applicable at runtime (no auth logic in this package)
- CI/CD: GitHub OIDC (`id-token: write`) for build-provenance attestation on release

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Not applicable (no runtime code beyond a typed constant export)

## CI/CD & Deployment

**Hosting:**
- `registry.cinatra.ai` (Cinatra Marketplace extension registry)

**CI Pipeline:**
- GitHub Actions - `.github/workflows/ci.yml`
  - Triggers: push/PR to `main`
  - Jobs: `build` (classify, install, typecheck, test, pack dry-run) and `kind-gates` (no extra gate for `artifact` kind)
  - Node.js 24, corepack/pnpm

**Release Pipeline:**
- GitHub Actions - `.github/workflows/ci.yml` (release workflow section)
  - Triggers: GitHub Release published, or manual `workflow_dispatch` from a tag ref
  - Delegates entirely to `cinatra-ai/.github` reusable workflow
  - Permissions: `contents: read`, `id-token: write`, `attestations: write`

## Environment Configuration

**Required env vars:**
- None at runtime
- CI/CD: `CINATRA_MARKETPLACE_VENDOR_TOKEN` org secret (used only during release)

**Secrets location:**
- GitHub org-level secrets (not stored in repo)
- `.npmrc` present - existence noted, contents not read

## Webhooks & Callbacks

**Incoming:**
- Not applicable

**Outgoing:**
- Not applicable

---

*Integration audit: 2026-06-09*
