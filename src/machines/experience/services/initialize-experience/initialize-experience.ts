import {
  Color4,
  DracoCompression,
  Engine,
  HavokPlugin,
  Axis,
  Scene,
  ShadowGenerator,
  Sound,
  Vector3,
  WebXRDefaultExperience,
  WebGPUEngine,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF"; // TODO: 667kB, tree-shake it?

// @ts-expect-error
import HavokPhysics from "@babylonjs/havok";

import { addDevtimeFeatures } from "./helpers/add-devtime-features";
import { createBalls } from "./helpers/create-balls";
import { drawTargetDot } from "./helpers/draw-target-dot";
import { createCamera } from "./helpers/create-camera";
import { createGround } from "./helpers/create-ground";
import { createLights } from "./helpers/create-lights";
import { createPoolTable } from "./helpers/create-pool-table";
import { applyForceOnInteraction } from "./helpers/apply-force-on-interaction";

import myHeartIsHome from "../../../../assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3";

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
    fallbackUrl: "/draco/draco_decoder_gltf.wasm",
  },
};

export const initializeExperience = async () => {
  const canvas = document.getElementById("canvas") as HTMLCanvasElement;
  const engine = navigator.gpu
    ? new WebGPUEngine(canvas, {
        antialias: true,
      })
    : new Engine(canvas, true);
  engine.displayLoadingUI();
  navigator.gpu && (await (engine as WebGPUEngine).initAsync());
  const havokPlugin = new HavokPlugin(true, await HavokPhysics());

  const scene = new Scene(engine);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.15, 0);
  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  const camera = createCamera(scene, canvas);

  const lights = createLights(scene);

  const [{ table }, { ground }] = await Promise.all([
    createPoolTable(scene),
    createGround(scene),
  ]);

  const shadowGenerator = new ShadowGenerator(2048, lights.spotLight, true);
  shadowGenerator.addShadowCaster(table);
  shadowGenerator.bias = 0.001;
  shadowGenerator.usePoissonSampling = true;

  const balls = createBalls(scene);
  balls.forEach((ball) => {
    shadowGenerator.addShadowCaster(ball, true);
  });

  const removeDot = drawTargetDot();

  const xrExperience = await WebXRDefaultExperience.CreateAsync(scene, {
    floorMeshes: [ground],
    optionalFeatures: true,
    disableTeleportation: true,
  });

  // WebXR events
  xrExperience.input.onControllerAddedObservable.add((controller) => {
    removeDot();

    let currentAxes = { x: 0, y: 0 };
    let targetMovementVector = new Vector3(0, 0, 0);
    const lerpFactor = 0.1;

    controller.onMotionControllerInitObservable.add((motionController) => {
      // Enable smooth movement with the VR controllers
      const thumbstick = motionController.getComponent(
        "xr-standard-thumbstick"
      );

      thumbstick.onAxisValueChangedObservable.add((axes) => {
        currentAxes = axes;
      });

      let lastUpdateTime = performance.now();

      scene.registerBeforeRender(() => {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastUpdateTime) / 1000; // Calculate delta time in seconds
        lastUpdateTime = currentTime;

        // Get the XR camera from the scene
        var xrCamera = xrExperience.baseExperience.camera;

        // Get the direction vector of the camera
        var cameraDirection = xrCamera.getDirection(new Vector3(0, 0, 1));
        cameraDirection.y = 0;

        // Rotate the camera direction vector by 90 degrees around the up vector to get the right vector
        var rightVector = Vector3.Cross(Axis.Y, cameraDirection).normalize();

        // Combine the camera direction and right vectors to get the movement vector
        var rawMovementVector = cameraDirection
          .scale(-currentAxes.y)
          .add(rightVector.scale(currentAxes.x))
          .normalize();

        // LERP between the current target movement vector and the raw movement vector
        targetMovementVector = Vector3.Lerp(
          targetMovementVector,
          rawMovementVector,
          lerpFactor
        );

        // Scale the movement vector by the desired speed, delta time factor and add it to the camera position
        xrCamera.position.addInPlace(targetMovementVector.scale(deltaTime));
      });

      // push the ball
      const triggerComponent = motionController.getComponent(
        "xr-standard-trigger"
      );

      // Add an event listener for the trigger button
      triggerComponent.onButtonStateChangedObservable.add((component) => {
        if (component.pressed) {
          applyForceOnInteraction(scene, controller);
        }
      });
    });
  });

  xrExperience.input.onControllerRemovedObservable.add(() => {
    drawTargetDot();
  });

  canvas.addEventListener("click", () => {
    applyForceOnInteraction(scene);
  });

  if (process.env.NODE_ENV === "development") {
    addDevtimeFeatures(scene, [lights.spotLight]);
  }

  engine.runRenderLoop(() => {
    scene.render();
  });

  // TODO: add fullscreen button
  canvas.addEventListener("click", () => {
    canvas.requestPointerLock?.();
  });
  window.addEventListener("resize", () => engine.resize());

  // add background music
  new Sound("Mark Woollard - My Heart Is Home", myHeartIsHome, scene, null, {
    loop: true,
    autoplay: true,
  });

  engine.hideLoadingUI();

  return { scene, engine, camera, canvas, lights };
};
