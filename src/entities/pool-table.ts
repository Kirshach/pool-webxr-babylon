import { type Scene } from '@babylonjs/core/scene';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

// TODO: utilize AVIF
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
    return table;
  }
);
