import { type Scene, SceneLoader } from 'babylonjs';

export const getPoolTable = (scene: Scene) => SceneLoader.ImportMeshAsync(
  '',
  '/assets/pooltable/',
  'scene.gltf',
  scene
).then(
  ({ meshes: [table] }) => {
    table.scaling.set(0.1, 0.1, 0.1);
  }
);
