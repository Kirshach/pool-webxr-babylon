import {
  GizmoManager,
  LightGizmo,
  AxesViewer,
  type Light,
  type Node,
  type Scene,
} from "@babylonjs/core";

// TODO: create a proper GUI for this
export const addDevtimeFeatures = async (
  scene: Scene,
  [spotLight, ..._gizmoObjects]: [Light, ...Node[]]
) => {
  const gizmoLight = new LightGizmo();
  gizmoLight.light = spotLight;
  gizmoLight.scaleRatio = 2;

  const gizmoManager = new GizmoManager(scene);
  gizmoManager.positionGizmoEnabled = true;
  gizmoManager.rotationGizmoEnabled = true;
  gizmoManager.usePointerToAttachGizmos = false;
  gizmoManager.attachToMesh(gizmoLight.attachedMesh);

  new AxesViewer(scene, 0.35);
};
