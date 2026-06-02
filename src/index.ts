import type { SemanticArtifactManifest } from "@cinatra-ai/sdk-extensions";

// `@cinatra-ai/default-artifact`: the built-in FLOOR semantic artifact type
// ("uncategorized artifact"). It is NOT a parallel match — it is the floor:
// an artifact carries a `default-artifact` *eligible* assertion iff it has NO
// non-default *eligible* assertion (the invariant is enforced atomically by the
// assertion service + DB guards). This guarantees every artifact ALWAYS has ≥1
// eligible semantic type — there is no user-visible unclassified state (spec §4).
// Parallels cinatra's existing data-object default-type pattern. No backfill.
//
// `accepts` is universal (any form) because the floor must admit anything;
// it declares no `satisfies` (the floor satisfies no interface), no
// `templates`, and no `skills` (default is asserted by the creating
// source/fallback, never by a matcher — there is nothing to match TO).
//
// Metadata-only `kind:"artifact"` extension. The descriptor is mirrored in
// package.json `cinatra.artifact`; this typed export is the source of truth
// the semantic-manifest bridge consumes.
export const defaultArtifactManifest: SemanticArtifactManifest = {
  accepts: {
    file: { mimeTypes: ["*/*"] },
    connectorRef: { resolvedMimeTypes: ["*/*"] },
    dashboard: true,
  },
};
