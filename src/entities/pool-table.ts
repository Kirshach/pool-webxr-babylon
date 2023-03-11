import { SceneLoader, type Scene } from "@babylonjs/core";

// TODO: utilize AVIF
export const createPoolTable = (scene: Scene) =>
  SceneLoader.ImportMeshAsync(
    "",
    "/assets/pooltable_2/",
    "scene.gltf",
    scene
  ).then(({ meshes: [table] }) => {
    table.showBoundingBox = true;
    return table;
  });
