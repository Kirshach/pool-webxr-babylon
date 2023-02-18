import {
  UniversalCamera,
  Vector3,
  type Scene
} from '@babylonjs/core';

export const createCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
  const camera = new UniversalCamera(
    "camera",
    new Vector3(3, 1.65, 3),
    scene
  );
  camera.setTarget(new Vector3(0, 1, 0));
  camera.attachControl(canvas);
  camera.speed = 0.2;
  return camera;
};
