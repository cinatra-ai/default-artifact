<!-- refreshed: 2026-06-09 -->
# Architecture

**Analysis Date:** 2026-06-09

## System Overview

```text
┌─────────────────────────────────────────────────────────────┐
│           @cinatra-ai/default-artifact (ESM package)        │
├─────────────────────────────────────────────────────────────┤
│  Typed export: defaultArtifactManifest                      │
│  `src/index.ts`                                             │
└──────────────────────┬──────────────────────────────────────┘
                       │ consumed by
                       ▼
┌─────────────────────────────────────────────────────────────┐
│           cinatra monorepo (host)                           │
│  semantic-manifest bridge + assertion service               │
│  (resolves @cinatra-ai/sdk-extensions peer at build time)   │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| defaultArtifactManifest | Declares the universal floor artifact type that matches all file, connectorRef, and dashboard inputs | `src/index.ts` |
| package.json `cinatra` block | Machine-readable mirror of the manifest consumed by cinatra tooling without importing TypeScript | `package.json` |
| tsconfig.json | Standalone strict TypeScript config for compiling `src/` to `dist/` | `tsconfig.json` |
| CI pipeline | Validates package shape, dep constraints, typecheck, and kind-specific gates | `.github/workflows/ci.yml` |

## Pattern Overview

**Overall:** Metadata-only extension package (no runtime logic)

**Key Characteristics:**
- A single exported constant (`defaultArtifactManifest`) typed against `@cinatra-ai/sdk-extensions`
- The semantic descriptor is dual-declared: as a typed TypeScript export in `src/index.ts` (source of truth) and mirrored verbatim in `package.json` under `cinatra.artifact` (for tooling that cannot import TS)
- No dependencies; `@cinatra-ai/sdk-extensions` is an optional peer provided by the cinatra monorepo host workspace — this package is a source mirror, not standalone-installable
- No runtime behaviour, no business logic, no side effects

## Layers

**Type Declaration Layer:**
- Purpose: Export the `SemanticArtifactManifest` constant used by the semantic-manifest bridge
- Location: `src/index.ts`
- Contains: One exported constant, typed import from peer
- Depends on: `@cinatra-ai/sdk-extensions` (optional peer, host-resolved)
- Used by: cinatra monorepo semantic-manifest bridge and assertion service

**Package Descriptor Layer:**
- Purpose: Machine-readable `cinatra` block for cinatra platform tooling
- Location: `package.json` (`cinatra.artifact` key)
- Contains: `apiVersion`, `kind`, `dependencies`, `artifact.accepts`
- Depends on: Nothing (plain JSON)
- Used by: cinatra extraction/classification tooling without requiring TS compilation

## Data Flow

### Artifact Classification Path

1. A file, connectorRef, or dashboard enters the cinatra library
2. The assertion service checks all non-default semantic artifact matchers
3. If no matcher produces an eligible assertion, the `default-artifact` invariant fires
4. The `defaultArtifactManifest` (from `src/index.ts`) is referenced to confirm universal acceptance (`accepts: { file: { mimeTypes: ["*/*"] }, connectorRef: { resolvedMimeTypes: ["*/*"] }, dashboard: true }`)
5. The item is classified as `@cinatra-ai/default-artifact` — it becomes visible, searchable, and addressable in the library

### Package Consumption Path

1. cinatra monorepo workspace clones this repo as a source mirror
2. The monorepo resolves `@cinatra-ai/sdk-extensions` peer locally
3. TypeScript compilation outputs to `dist/` via `tsconfig.json`
4. The semantic-manifest bridge imports `defaultArtifactManifest` from the compiled output

**State Management:**
- Stateless — the package exports only a constant; no mutable state, no side effects

## Key Abstractions

**SemanticArtifactManifest:**
- Purpose: SDK-defined type describing what content forms an artifact type accepts
- Examples: `src/index.ts` (only usage)
- Pattern: Interface/type from peer dependency, instantiated as a plain object constant

**defaultArtifactManifest:**
- Purpose: The floor/fallback artifact descriptor; `accepts` is universal (`*/*`) to guarantee every artifact always has ≥1 eligible type
- Examples: `src/index.ts`
- Pattern: Typed constant export

## Entry Points

**TypeScript export:**
- Location: `src/index.ts`
- Triggers: Imported by the cinatra monorepo semantic-manifest bridge
- Responsibilities: Exports `defaultArtifactManifest`

**Package descriptor:**
- Location: `package.json` (`cinatra.artifact`)
- Triggers: Read by cinatra platform tooling
- Responsibilities: Provides `kind`, `apiVersion`, and `artifact.accepts` without requiring TS resolution

## Architectural Constraints

- **Threading:** Not applicable — no runtime, pure static export
- **Global state:** None — single exported constant, no module-level mutable state
- **Circular imports:** None — one file, one import (`@cinatra-ai/sdk-extensions` type only)
- **Peer resolution:** `@cinatra-ai/sdk-extensions` is optional and host-internal; this package cannot be installed or typechecked standalone without the monorepo providing it
- **No templates, no satisfies, no skills:** The floor type declares only `accepts`; it satisfies no interface and invokes no skill matchers (enforced by spec §4)

## Anti-Patterns

### Declaring first-party deps outside peerDependenciesMeta.optional

**What happens:** Adding `@cinatra-ai/*` to `dependencies`, `devDependencies`, or `optionalDependencies` instead of optional peerDependencies
**Why it's wrong:** The CI `classify repo` step (`.github/workflows/ci.yml` lines 47-69) explicitly fails with exit 2 if first-party packages leak into non-peer dep fields, hiding real regressions
**Do this instead:** Declare host-internal packages under `peerDependencies` marked `peerDependenciesMeta.<pkg>.optional = true`, as done for `@cinatra-ai/sdk-extensions` in `package.json`

### Duplicating `cinatra.artifact` and `defaultArtifactManifest` out of sync

**What happens:** Editing `package.json cinatra.artifact` without updating `src/index.ts` (or vice versa)
**Why it's wrong:** `src/index.ts` is the source of truth; `package.json` is a mirror. Drift causes tooling that reads the JSON to behave differently from the type-safe path
**Do this instead:** Treat `src/index.ts` as authoritative; update `package.json cinatra.artifact` to match whenever `defaultArtifactManifest` changes

## Error Handling

**Strategy:** Not applicable — no runtime logic, no error paths

**Patterns:**
- None (static metadata export only)

## Cross-Cutting Concerns

**Logging:** Not applicable
**Validation:** Package shape validated at CI time by the `classify repo` step in `.github/workflows/ci.yml`
**Authentication:** Not applicable

---

*Architecture analysis: 2026-06-09*
