import { UniversalCamera, Vector3, type Scene } from "@babylonjs/core";

export const createCamera = (scene: Scene, canvas: HTMLCanvasElement) => {
  const cameraHeight = 1.75;
  const randomSign = 1;
  const camera = new UniversalCamera(
    "camera",
    new Vector3(randomSign * 3, cameraHeight, randomSign * 3),
    scene
  );
  camera.setTarget(new Vector3(0, 1, 0));

  camera.keysUp = [87, 38];
  camera.keysDown = [83, 40];
  camera.keysLeft = [65, 37];
  camera.keysRight = [68, 39];

  camera.ellipsoid = new Vector3(0.5, cameraHeight / 2, 0.5);
  camera.checkCollisions = true;
  camera.applyGravity = true;
  camera.speed = 0.085;
  camera.minZ = 0.1;

  camera.attachControl(canvas);

  return camera;
};
