import {
  Color4,
  DracoCompression,
  Engine,
  HavokPlugin,
  Scene,
  ShadowGenerator,
  Sound,
  Vector3,
  // WebGPUEngine,
  WebXRDefaultExperience,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF"; // TODO: 667kB, tree-shake it?

// @ts-ignore
import HavokPhysics from "@babylonjs/havok";

import { addDevtimeFeatures } from "../../add-devtime-features";
import { createCamera } from "../../../entities/camera";
import { createSpotLight } from "../../../entities/spot-light";
import { createPoolTable } from "../../../entities/pool-table";
import { createGround } from "../../../entities/ground";

import myHeartIsHome from "../../../assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3";
import { createBall } from "../../../entities/ball";

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
    fallbackUrl: "/draco/draco_decoder_gltf.wasm",
  },
};

export const initializeExperience = async (canvas: HTMLCanvasElement) => {
  // const engine = new WebGPUEngine(canvas, { antialias: true });
  // await engine.initAsync();
  const engine = new Engine(canvas, true);

  const scene = new Scene(engine);
  scene.collisionsEnabled = true;

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  createCamera(scene, canvas);

  canvas.addEventListener("click", () => {
    canvas.requestPointerLock?.();
  });

  const { spotLight } = createSpotLight(scene);
  addDevtimeFeatures(scene, [spotLight]);

  const [{ table }, { ground }] = await Promise.all([
    createPoolTable(scene),
    createGround(scene),
  ]);

  const balls = Array.from({ length: 10 }).map(() => createBall(scene));

  // shadows
  const shadowGenerator = new ShadowGenerator(2048, spotLight, true);
  shadowGenerator.addShadowCaster(
    table,
    true /* check if this parameter changes anything */
  );
  balls.forEach((ball) => {
    shadowGenerator.addShadowCaster(ball, true);
  });
  shadowGenerator.usePoissonSampling = true;

  // WebXR
  const xrExperience = await WebXRDefaultExperience.CreateAsync(scene, {
    floorMeshes: [ground],
    optionalFeatures: true,
    disableTeleportation: true,
  });

  // Enable smooth movement with the VR controllers
  xrExperience.input.onControllerAddedObservable.add((controller) => {
    controller.onMotionControllerInitObservable.add((motionController) => {
      if (motionController.handedness !== "left") return;

      const thumbstick = motionController.getComponent(
        "xr-standard-thumbstick"
      );

      if (thumbstick) {
        thumbstick.onAxisValueChangedObservable.add((axes) => {
          xrExperience.baseExperience.camera.position.addInPlace(
            new Vector3(axes.y, 0, axes.x).scale(0.1)
          );
        });
      }
    });
  });

  // run the loop
  engine.runRenderLoop(() => {
    scene.render();
  });

  window.addEventListener("resize", () => engine.resize());

  // add background music
  new Sound("Mark Woollard - My Heart Is Home", myHeartIsHome, scene, null, {
    loop: true,
    autoplay: true,
  });

  return { scene, engine };
};
