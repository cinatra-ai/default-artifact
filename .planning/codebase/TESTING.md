# Testing Patterns

**Analysis Date:** 2026-06-09

## Test Framework

**Runner:**
- Not configured — no test runner (`jest`, `vitest`, `mocha`, etc.) is present in `package.json`
- No test config files detected (`jest.config.*`, `vitest.config.*`, etc.)

**Assertion Library:**
- Not applicable

**Run Commands:**
```bash
# CI uses pnpm test --if-present (ci.yml)
# No `test` script is defined in package.json — the command exits 0 silently
pnpm test --if-present
```

## Test File Organization

**Location:**
- No test files exist in the repository

**Naming:**
- Not applicable

**Structure:**
- Not applicable

## Test Structure

**Suite Organization:**
- Not applicable — no tests are defined

**Patterns:**
- Not applicable

## Mocking

**Framework:** Not applicable

**Patterns:**
- Not applicable

**What to Mock:**
- Not applicable

**What NOT to Mock:**
- Not applicable

## Fixtures and Factories

**Test Data:**
- Not applicable

**Location:**
- Not applicable

## Coverage

**Requirements:** None enforced — no coverage tooling configured

**View Coverage:**
```bash
# Not configured
```

## Test Types

**Unit Tests:**
- None present. The package is a metadata-only export (`src/index.ts`) with a single typed constant; there is no runtime logic to unit test.

**Integration Tests:**
- None present.

**E2E Tests:**
- Not used. The CI pipeline notes that this is a "source mirror" — the cinatra monorepo owns integration and E2E testing when it clones this repo into its workspace.

## CI Test Behavior

The CI workflow (`.github/workflows/ci.yml`) handles testing as follows:

- **Source mirror repos** (repos declaring host-internal `@cinatra-ai/*` optional peers): tests are skipped entirely with `exit 0`. The monorepo runs the tests when it integrates this package.
- **Standalone repos** (no `@cinatra-ai/*` peers): `pnpm test --if-present` is run.

This repo is a **source mirror** (it declares `@cinatra-ai/sdk-extensions` as an optional peer), so standalone test execution is always skipped in CI.

## Testing Guidance for Future Additions

If runtime logic is added to this package:

- A test runner (vitest recommended for ESM-native projects) should be added to `devDependencies`
- Test files should be placed as `src/*.test.ts` or in a `src/__tests__/` directory
- A `test` script must be added to `package.json` so `pnpm test --if-present` picks it up
- The `@cinatra-ai/sdk-extensions` peer dependency would need to be mocked or provided via a local stub, since it is not published to any registry

---

*Testing analysis: 2026-06-09*
