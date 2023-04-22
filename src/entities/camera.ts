import { UniversalCamera, Vector3, type Scene } from "@babylonjs/core";

export const createCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
  const camera = new UniversalCamera("camera", new Vector3(3, 2, 3), scene);
  camera.keysUp = [87, 38];
  camera.keysDown = [83, 40];
  camera.keysLeft = [65, 37];
  camera.keysRight = [68, 39];
  camera.setTarget(new Vector3(0, 1, 0));
  camera.attachControl(canvas);

  camera.speed = 0.085;
  camera.minZ = 0.1;
  camera.applyGravity = true;

  camera.ellipsoid = new Vector3(0.5, 1, 0.5);
  camera.checkCollisions = true;

  return camera;
};
