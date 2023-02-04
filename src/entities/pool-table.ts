import { type Scene, SceneLoader, Vector3 } from '@babylonjs/core';

export const createPoolTable = (scene: Scene) => SceneLoader.ImportMeshAsync(
  'SM_PoolTable01',
  '/assets/pooltable/',
  'scene.gltf',
  scene
).then(
  ({ meshes: [table] }) => {
    table.rotate(new Vector3(-1, 0, 0), Math.PI / 2);
    table.rotate(new Vector3(0, 0, 1), Math.PI / 2);
    table.scaling.set(0.01, 0.01, 0.01);
  }
);
