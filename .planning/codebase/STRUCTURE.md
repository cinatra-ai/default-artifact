# Codebase Structure

**Analysis Date:** 2026-06-09

## Directory Layout

```
default-artifact/
├── src/
│   └── index.ts          # Only source file — exports defaultArtifactManifest
├── .github/
│   └── workflows/
│       ├── ci.yml        # Build, typecheck, pack, and kind-gate pipeline
│       └── release.yml   # Release pipeline
├── .planning/
│   └── codebase/         # GSD codebase map documents (this directory)
├── package.json          # Package manifest + cinatra.artifact descriptor block
├── tsconfig.json         # Standalone strict TypeScript config (ES2023, ESNext modules)
├── .npmrc                # auto-install-peers=false
├── LICENSE               # Apache-2.0
└── README.md             # Human-readable description of the default artifact type
```

## Directory Purposes

**`src/`:**
- Purpose: TypeScript source — the single typed export consumed by the cinatra monorepo
- Contains: `index.ts` only
- Key files: `src/index.ts`

**`.github/workflows/`:**
- Purpose: CI/CD pipelines for validation and release
- Contains: `ci.yml` (build gate), `release.yml` (publish)
- Key files: `.github/workflows/ci.yml`, `.github/workflows/release.yml`

**`.planning/codebase/`:**
- Purpose: GSD codebase map documents written by `/gsd-map-codebase`
- Contains: ARCHITECTURE.md, STRUCTURE.md (and future map documents)
- Generated: Yes (by GSD tooling)
- Committed: Yes

## Key File Locations

**Entry Points:**
- `src/index.ts`: TypeScript source of truth — exports `defaultArtifactManifest`

**Configuration:**
- `package.json`: Package identity, `cinatra` platform block (kind, apiVersion, artifact.accepts), peer dependencies
- `tsconfig.json`: TypeScript compiler config; `rootDir: src`, `outDir: dist`, strict mode, ESNext module
- `.npmrc`: Disables automatic peer installation (`auto-install-peers=false`)

**Core Logic:**
- `src/index.ts`: Only file with logic — one constant export, one type import

**CI/CD:**
- `.github/workflows/ci.yml`: Validates dep shape, runs typecheck, pack dry-run, and kind-specific gates
- `.github/workflows/release.yml`: Release workflow

## Naming Conventions

**Files:**
- Single entry point: `index.ts` — standard ESM barrel pattern
- Workflows: kebab-case (`ci.yml`, `release.yml`)

**Exports:**
- Constants: camelCase with descriptive noun (`defaultArtifactManifest`)
- Types: PascalCase imported from peer (`SemanticArtifactManifest`)

**Directories:**
- `src/` for TypeScript sources
- `dist/` for compiled output (generated, not committed — excluded from tsconfig)

## Where to Add New Code

**New exported constant or type:**
- Implementation: `src/index.ts` (append to the single file; keep it minimal)

**New cinatra platform metadata:**
- Update `package.json` under the `cinatra` key AND keep `src/index.ts` in sync (the TS export is source of truth)

**New CI gate:**
- Append steps to `.github/workflows/ci.yml` under `kind-gates` job (per extraction script convention)

**Utilities:**
- Not applicable — this package has no utility layer; it is metadata-only

## Special Directories

**`dist/`:**
- Purpose: TypeScript compilation output (declared in `tsconfig.json outDir`)
- Generated: Yes (by `tsc`)
- Committed: No (not present in repo; excluded by tsconfig)

**`.planning/`:**
- Purpose: GSD planning and codebase map documents
- Generated: Yes (by GSD tooling)
- Committed: Yes

---

*Structure analysis: 2026-06-09*
