# Technology Stack

**Analysis Date:** 2026-06-09

## Languages

**Primary:**
- TypeScript (ES2023 target) - sole source language, `src/index.ts`

**Secondary:**
- Not applicable (no secondary languages detected)

## Runtime

**Environment:**
- Node.js 24 (specified in `.github/workflows/ci.yml` via `node-version: "24"`)

**Package Manager:**
- pnpm (via corepack) - `corepack pnpm` used in CI
- Lockfile: not committed (CI uses `--no-frozen-lockfile`; this is a source-mirror repo)

## Frameworks

**Core:**
- None - this is a metadata-only artifact extension with a single typed export

**Testing:**
- Not detected (no test framework configured; tests run via the Cinatra monorepo)

**Build/Dev:**
- TypeScript compiler (`tsc`) - `tsconfig.json` targets `outDir: dist`, `rootDir: src`

## Key Dependencies

**Critical:**
- `@cinatra-ai/sdk-extensions` (peer, optional, `*`) - provides the `SemanticArtifactManifest` type consumed by `src/index.ts`

**Infrastructure:**
- No runtime dependencies
- No devDependencies declared
- `.npmrc` present (contents not read; likely registry config)

## Configuration

**Environment:**
- No `.env` files detected
- No runtime environment variables required (metadata-only package)

**Build:**
- `tsconfig.json` - standalone strict TypeScript config; `target: ES2023`, `module: ESNext`, `moduleResolution: bundler`, `jsx: react-jsx`, `strict: true`, `noImplicitAny: false`, `isolatedModules: true`, `verbatimModuleSyntax: true`

## Package Manifest

**`package.json` key fields:**
- `name`: `@cinatra-ai/default-artifact`
- `version`: `0.1.0`
- `license`: `Apache-2.0`
- `type`: `module` (ESM)
- `main` / `types`: `./src/index.ts` (source-mirror; not a compiled dist entry)
- `cinatra.apiVersion`: `cinatra.ai/v1`
- `cinatra.kind`: `artifact`
- Accepts: any file (`*/*`), any connector reference (`*/*`), and dashboards

## Platform Requirements

**Development:**
- Node.js 24+, corepack/pnpm
- Must be consumed inside the Cinatra monorepo (host-internal `@cinatra-ai/*` peers are not published to any public registry)

**Production:**
- Deployed as part of the Cinatra platform extension registry (`registry.cinatra.ai`) via the marketplace release workflow

---

*Stack analysis: 2026-06-09*
