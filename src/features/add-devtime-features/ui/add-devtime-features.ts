import { type Light, type Node, type Scene } from "@babylonjs/core";

// TODO: move to a dev-time GUI with buttons and stuff
export const addDevtimeFeatures = async (
  scene: Scene,
  [spotLight, ..._gizmoObjects]: [Light, ...Node[]]
) => {
  if (process.env.NODE_ENV === "development") {
    const { GizmoManager, LightGizmo, AxesViewer } = await import(
      "@babylonjs/core"
    );

    // Create Gizmos
    const gizmoLight = new LightGizmo();
    gizmoLight.light = spotLight;
    gizmoLight.scaleRatio = 2;

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(gizmoLight.attachedMesh);

    // Add Axes Viewer
    if (process.env.NODE_ENV === "development") {
      new AxesViewer(scene, 0.35);
    }
  }
};
