import { SceneLoader, type Scene } from "@babylonjs/core";

// TODO: utilize AVIF
export const createPoolTable = (scene: Scene) =>
  SceneLoader.ImportMeshAsync(
    "",
    "/assets/pooltable/",
    "scene.gltf",
    scene
  ).then(({ meshes: [table] }) => {
    table.scaling.set(0.01, 0.01, 0.01);
    table.position.set(0, 0.85, 0);
    return table;
  });
