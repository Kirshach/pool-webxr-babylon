import {
  Color4,
  HavokPlugin,
  Scene,
  Vector3,
  WebGPUEngine,
} from "@babylonjs/core";

import HavokPhysics from "@babylonjs/havok";

import { createCamera } from "../../entities/camera";

// const initializeHavok = async () => {
//   return await HavokPhysics();
// };

// initializeHavok().then(() => {
//   const physicsPlugin = new HavokPlugin();
//   scene.enablePhysics(gravityVector, physicsPlugin);
// });

export const configureExperience = async (canvas: HTMLCanvasElement) => {
  const engine = new WebGPUEngine(canvas, { antialias: true });
  await engine.initAsync();

  const scene = new Scene(engine);

  const havokInstance = await HavokPhysics();
  console.log
  const havokPlugin = new HavokPlugin(true, havokInstance);
  // const engine = new Engine(canvas, true);
  // pass the engine to the plugin
  // enable physics in the scene with a gravity

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  createCamera(scene, canvas);

  // await Promise.all([webGPUInitPromise]);

  return { scene, engine };
};
