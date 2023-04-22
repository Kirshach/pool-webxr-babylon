import { type Light, type Node, type Scene } from "@babylonjs/core";

export const addDevtimeFeatures = (
  scene: Scene,
  [spotLight, ..._gizmoObjects]: [Light, ...Node[]]
) => {
  // create gizmos
  if (process.env.NODE_ENV === "development") {
    Promise.all([
      import("@babylonjs/core/Gizmos/gizmoManager"),
      import("@babylonjs/core/Gizmos/lightGizmo"),
    ]).then(([{ GizmoManager }, { LightGizmo }]) => {
      const gizmoLight = new LightGizmo();
      gizmoLight.light = spotLight;
      gizmoLight.scaleRatio = 2;

      const gizmoManager = new GizmoManager(scene);
      gizmoManager.positionGizmoEnabled = true;
      gizmoManager.rotationGizmoEnabled = true;
      gizmoManager.usePointerToAttachGizmos = false;
      gizmoManager.attachToMesh(gizmoLight.attachedMesh);
    });
  }
};
