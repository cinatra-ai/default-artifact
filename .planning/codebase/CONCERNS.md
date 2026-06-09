# Codebase Concerns

**Analysis Date:** 2026-06-09

## Tech Debt

**Duplicate descriptor between package.json and src/index.ts:**
- Issue: The `accepts` shape (mimeTypes, connectorRef, dashboard) is declared twice — once in `package.json` under `cinatra.artifact` and once in `src/index.ts` as `defaultArtifactManifest`. These two declarations must be kept in sync manually; there is no code that validates one against the other.
- Files: `package.json`, `src/index.ts`
- Impact: A future edit to one may silently diverge from the other, causing the semantic-manifest bridge and the JSON manifest to disagree.
- Fix approach: Generate one from the other at build time, or add a CI test that imports the manifest and deep-equals it to the `package.json` `cinatra.artifact` section.

**`main` and `types` point to raw TypeScript source:**
- Issue: `package.json` sets `"main": "./src/index.ts"` and `"types": "./src/index.ts"`. Consumers that resolve via the `main` field at runtime will receive unbundled TypeScript, not compiled JavaScript. The `tsconfig.json` sets `outDir: "dist"` but no `exports` or `files` field restricts the published payload.
- Files: `package.json`, `tsconfig.json`
- Impact: Standalone consumers (outside the monorepo) who attempt to `require`/`import` via `main` will fail unless they run a TypeScript-aware bundler. Package shape is technically incorrect for a published npm artifact.
- Fix approach: Add a `build` script that emits to `dist/`, update `main`/`types` to `./dist/index.js` / `./dist/index.d.ts`, and add a `files` field to restrict publishing to `dist/`.

**No `exports` map:**
- Issue: `package.json` has no `exports` field, relying solely on the legacy `main` field.
- Files: `package.json`
- Impact: Dual CJS/ESM consumers, subpath imports, and Node.js `--experimental-require-module` all behave unpredictably without an explicit `exports` map.
- Fix approach: Add an `exports` field with `.` pointing to the compiled CJS and ESM outputs.

**No committed lockfile:**
- Issue: The CI workflow explicitly uses `--no-frozen-lockfile` on the standalone path. No `pnpm-lock.yaml` is present in the repo.
- Files: `package.json`, `.github/workflows/ci.yml`
- Impact: Standalone CI installs are non-deterministic; a dependency update in a transitive package can silently change build behaviour between runs.
- Fix approach: Commit a lockfile and switch to `--frozen-lockfile` in CI once the package has a non-peer dependency (currently moot because `first_party=1` skips install, but relevant if the repo ever goes standalone).

## Known Bugs

**Standalone CI skips typecheck + test entirely for this repo:**
- Symptoms: Because `@cinatra-ai/sdk-extensions` is an optional peer, `first_party=1` is set and all install/typecheck/test steps are skipped in CI. The TypeScript in `src/index.ts` is never type-checked in this repo's own CI pipeline.
- Files: `.github/workflows/ci.yml`, `src/index.ts`
- Trigger: Every push/PR to `main`.
- Workaround: The monorepo is expected to typecheck this file, but if the monorepo integration lags, type errors in `src/index.ts` will not be caught until monorepo CI runs.

## Security Considerations

**`.npmrc` file present:**
- Risk: `.npmrc` may contain registry tokens or scoped registry overrides.
- Files: `.npmrc`
- Current mitigation: File existence noted; contents not read. If tokens are stored here they should be in environment variables instead.
- Recommendations: Audit `.npmrc` to ensure no auth tokens are committed; use `NODE_AUTH_TOKEN` env var in CI instead.

**Release workflow uses `secrets: inherit` with `id-token: write`:**
- Risk: The release job inherits all org secrets and requests OIDC token write permission. If the reusable workflow at `cinatra-ai/.github` is ever compromised or accepts untrusted inputs, it could exfiltrate secrets.
- Files: `.github/workflows/release.yml`
- Current mitigation: Permissions are scoped to `contents: read`, `id-token: write`, `attestations: write` — no write to repo contents.
- Recommendations: Pin the reusable workflow ref to a commit SHA rather than `@main` to prevent supply-chain drift.

**Reusable workflow pinned to `@main`:**
- Risk: `uses: cinatra-ai/.github/.github/workflows/reusable-extension-release.yml@main` means any push to the `.github` repo's `main` branch immediately changes the behaviour of this package's release pipeline without a PR in this repo.
- Files: `.github/workflows/release.yml`
- Current mitigation: None.
- Recommendations: Pin to a tagged version or a commit SHA.

## Performance Bottlenecks

Not applicable — this package exports a single static object with no runtime logic.

## Fragile Areas

**Single-file surface area with no tests:**
- Files: `src/index.ts`
- Why fragile: The entire package is one exported constant. Any change (e.g., adding a field, changing a mimeType) has zero automated test coverage in this repo.
- Safe modification: Changes must be cross-referenced against the monorepo's semantic-manifest bridge and the `package.json` `cinatra.artifact` block manually.
- Test coverage: No tests exist anywhere in the repo.

**`package.json` `cinatra` block is the runtime manifest consumed by the platform:**
- Files: `package.json`
- Why fragile: The platform reads this JSON directly. A typo or structural mistake (e.g., wrong key name under `artifact.accepts`) will silently produce a malformed manifest; there is no schema validation in this repo.
- Safe modification: Cross-check any changes against the `SemanticArtifactManifest` type from `@cinatra-ai/sdk-extensions` before shipping.
- Test coverage: None.

## Scaling Limits

Not applicable — static metadata package with no runtime scaling surface.

## Dependencies at Risk

**`@cinatra-ai/sdk-extensions` — unversioned optional peer (`"*"`):**
- Risk: The peer is declared as `"*"` (any version). A breaking change to `SemanticArtifactManifest` in the SDK would compile cleanly here (typecheck is skipped in standalone CI) and only surface as a runtime failure.
- Impact: `defaultArtifactManifest` export could be structurally incompatible with the SDK type without any local signal.
- Migration plan: Pin to a minimum version range (e.g., `">=0.1.0"`) and ensure the monorepo CI gate catches type incompatibilities.

## Missing Critical Features

**No build script:**
- Problem: `package.json` has no `build` script. The `tsconfig.json` has an `outDir: "dist"` but nothing drives the compilation. `npm pack --dry-run` in CI packs raw source.
- Blocks: Correct standalone publishing to a registry; consumers outside the monorepo cannot use the package.

**No tests:**
- Problem: Zero test files exist. The contract (every artifact always has ≥1 eligible type, the floor admits any MIME) is documented in comments but not verified.
- Blocks: Safe refactoring; confidence that the manifest invariant is upheld after changes.

## Test Coverage Gaps

**Entire package is untested:**
- What's not tested: The exported `defaultArtifactManifest` shape, the equivalence between `src/index.ts` and `package.json` `cinatra.artifact`, and any invariant described in the spec §4 reference in the source comments.
- Files: `src/index.ts`, `package.json`
- Risk: Silent divergence between the TypeScript export and the JSON manifest; breaking changes to `SemanticArtifactManifest` go undetected until monorepo CI runs.
- Priority: Medium — the package is tiny and low-churn, but correctness is load-bearing (every artifact in the system depends on this floor type).

---

*Concerns audit: 2026-06-09*
