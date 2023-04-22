import {
  Color4,
  HavokPlugin,
  Scene,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";

import HavokPhysics from "@babylonjs/havok";

import { createCamera } from "../../entities/camera";

export const configureExperience = async (canvas: HTMLCanvasElement) => {
  const engine = new WebGPUEngine(canvas, { antialias: true });
  await engine.initAsync();

  const scene = new Scene(engine);

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  createCamera(scene, canvas);

  return { scene, engine };
};
