# Default Artifact

The built-in fallback type that guarantees every item in the library has at least one valid classification. When a file, connector reference, or dashboard is added and no more specific artifact type recognizes it, the platform assigns it a Default Artifact classification so it stays visible, searchable, and addressable until a more specific type is installed or a user reclassifies it. There is no user-visible "unclassified" state.

This artifact ships as a metadata-only extension (`kind: "artifact"`) with no server-side entry point. Installation is automatic — the platform includes this extension on every workspace and there is no manual install step. No credentials or configuration are required.

To reclassify an item, open it in the library, choose "Reclassify", and select a more specific artifact type. Once another eligible type is active and recognizes the item, the Default Artifact assertion is removed automatically. If reclassification does not appear, confirm that a compatible artifact extension is installed for the workspace.

For development, run `node extension-kind-gate.mjs` at the repo root to validate the package manifest and README against the extension contract before publishing.

## Works with

- Any file, connector reference, or dashboard that no other installed artifact type claims

## Capabilities

- Keep every uploaded file, connector reference, or dashboard visible in the library
- Avoid an unclassified dead-end state for any incoming content
- Reclassify an item to a more specific artifact type at any time
- Attach a generic item as untyped context to chats and agents that accept it
