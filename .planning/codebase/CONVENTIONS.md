# Coding Conventions

**Analysis Date:** 2026-06-09

## Naming Patterns

**Files:**
- Single `index.ts` entry point under `src/` — all exports go through `src/index.ts`
- Kebab-case for package/repo names: `default-artifact`

**Functions/Variables:**
- camelCase for exported constants: `defaultArtifactManifest` (`src/index.ts`)
- Descriptive names that encode the role and type: `SemanticArtifactManifest`

**Types:**
- PascalCase for TypeScript types/interfaces imported from `@cinatra-ai/sdk-extensions`
- Named imports with `import type` for type-only imports (`src/index.ts` line 1)

## Code Style

**Formatting:**
- No Prettier config detected; formatting enforced by TypeScript strict compiler options

**TypeScript Compiler (tsconfig.json):**
- `strict: true` — full strict mode enabled
- `noImplicitAny: false` — implicit `any` is explicitly allowed as an exception
- `isolatedModules: true` — each file must be independently compilable
- `verbatimModuleSyntax: true` — `import type` must be used for type-only imports
- Target: `ES2023`, module: `ESNext`, moduleResolution: `bundler`
- `forceConsistentCasingInFileNames: true`

**Linting:**
- No ESLint or Biome config detected
- Type correctness enforced via `tsc --noEmit` in CI (`ci.yml`)

## Import Organization

**Order:**
1. Type-only imports (`import type { ... }`) before value imports
2. External package imports (`@cinatra-ai/sdk-extensions`)
3. No internal cross-file imports exist (single-file source)

**Path Aliases:**
- None configured; no `paths` in `tsconfig.json`

**Module System:**
- ESM only (`"type": "module"` in `package.json`)
- `verbatimModuleSyntax` enforces explicit `import type` for type-only imports

## Error Handling

**Patterns:**
- Not applicable at the source level — `src/index.ts` is a metadata-only export with no runtime logic or error paths

## Logging

**Framework:** Not applicable — no runtime logic; metadata-only package

**Patterns:**
- Not applicable

## Comments

**When to Comment:**
- Detailed inline block comments above exported constants explaining design intent, invariants, and spec references (see `src/index.ts` lines 3–18)
- Comments reference specification sections: `spec §4`
- Comments explain what is NOT present and why (no `satisfies`, no `templates`, no `skills`) to prevent future regressions

**JSDoc/TSDoc:**
- Not used; prose block comments preferred for design-level documentation

## Function Design

**Size:** Single-expression object literal exports; no function bodies in this package

**Parameters:** Not applicable — no functions defined

**Return Values:** Not applicable — only constant exports

## Module Design

**Exports:**
- Single named export per module: `export const defaultArtifactManifest`
- No default exports
- `src/index.ts` is both the `main` and `types` entry point in `package.json`

**Barrel Files:**
- `src/index.ts` acts as the sole barrel; no subdirectories

## Package Shape Conventions (Cinatra-specific)

**Dependency Rules (enforced by CI `ci.yml`):**
- First-party `@cinatra-ai/*` packages MUST be declared as optional `peerDependencies`, never in `dependencies`/`devDependencies`
- Every first-party peer must carry `peerDependenciesMeta[pkg].optional = true`
- Violation causes CI exit code 2 (hard failure)

**Package Metadata:**
- `cinatra` field in `package.json` mirrors the TypeScript manifest — TypeScript export is the source of truth; `package.json` field is a mirror for the manifest bridge

---

*Convention analysis: 2026-06-09*
