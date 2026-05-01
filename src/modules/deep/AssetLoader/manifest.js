// Asset manifest: key → public URL path
// Priority 1 = antechamber assets (load first), priority 2 = bedroom assets
export const ASSET_MANIFEST = {
  // No external GLTF assets in v1 — bedroom is built from Three.js primitives.
  // This manifest is ready for populating with Poly Haven / Sketchfab GLBs.
  //
  // Example:
  // 'desk-chair': { url: '/assets/models/desk-chair.glb', priority: 2 },
}
