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
  PhysicsRaycastResult,
  Ray,
  WebXRDefaultExperience,
  WebGPUEngine,
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
  const engine = navigator.gpu
    ? new WebGPUEngine(canvas, {
        antialias: true,
      })
    : new Engine(canvas, true);

  if (navigator.gpu) {
    await (engine as WebGPUEngine).initAsync();
  }

  engine.displayLoadingUI();

  const scene = new Scene(engine);
  scene.collisionsEnabled = true;
  scene.gravity = new Vector3(0, -0.15, 0);

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

  const balls = Array.from({ length: 20 }).map(() => createBall(scene));

  // shadows
  const shadowGenerator = new ShadowGenerator(2048, spotLight, true);
  shadowGenerator.addShadowCaster(
    table,
    true /* check if this parameter changes anything */
  );
  shadowGenerator.bias = 0.001;
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

  // WebXR events
  xrExperience.input.onControllerAddedObservable.add((controller) => {
    const yAxis = Axis.Y;
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
        var rightVector = Vector3.Cross(yAxis, cameraDirection).normalize();

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
          // Create a Ray object to store the direction
          const directionRay = new Ray(Vector3.Zero(), Vector3.Zero());

          // Use the 'getWorldPointerRayToRef' method to update the Ray object with the current direction
          controller.getWorldPointerRayToRef(directionRay);

          // The 'direction' property of the Ray object contains the controller's direction
          const controllerDirection = directionRay.direction;

          // Cast a ray from the controller's position in the forward direction
          const startPosition = directionRay.origin;
          const endPosition = startPosition.add(controllerDirection.scale(100));
          const raycastResult = new PhysicsRaycastResult();

          // Perform the raycast
          scene
            .getPhysicsEngine()!
            // @ts-ignore
            .raycastToRef(startPosition, endPosition, raycastResult);

          // Apply a force to the hit body if there's a hit
          if (raycastResult.hasHit) {
            const forceMagnitude = 1;
            const force = controllerDirection.scale(forceMagnitude);
            // @ts-ignore
            raycastResult.body.mass = 1; // Ensure the hit body has mass before applying impulse
            // @ts-ignore
            raycastResult.body.applyImpulse(force, raycastResult.hitPointWorld);
          }
        }
      });
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

  engine.hideLoadingUI();
  return { scene, engine };
};
