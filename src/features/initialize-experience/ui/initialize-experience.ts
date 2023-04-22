import {
  AxesViewer,
  Color4,
  DracoCompression,
  HavokPlugin,
  Scene,
  ShadowGenerator,
  Sound,
  Vector3,
  WebGPUEngine,
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

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
    fallbackUrl: "/draco/draco_decoder_gltf.wasm",
  },
};

export const initializeExperience = async (canvas: HTMLCanvasElement) => {
  const engine = new WebGPUEngine(canvas, { antialias: true });
  await engine.initAsync();

  const scene = new Scene(engine);
  scene.collisionsEnabled = true;

  const havokInstance = await HavokPhysics();
  const havokPlugin = new HavokPlugin(true, havokInstance);

  scene.clearColor = new Color4(0, 0, 0, 1);
  scene.enablePhysics(new Vector3(0, -9.81, 0), havokPlugin);

  createCamera(scene, canvas);

  const { spotLight } = createSpotLight(scene);
  addDevtimeFeatures(scene, [spotLight]);

  const [{ table }, { ground }] = await Promise.all([
    createPoolTable(scene),
    createGround(scene),
  ]);

  // shadows
  const shadowGenerator = new ShadowGenerator(2048, spotLight, true);
  shadowGenerator.addShadowCaster(
    table,
    true /* check if this parameter changes anything */
  );
  shadowGenerator.usePoissonSampling = true;

  // WebXP
  WebXRDefaultExperience.CreateAsync(scene, {
    floorMeshes: [ground],
    optionalFeatures: true,
  }).then((xrExperience) => {
    console.log(xrExperience);

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

    // TODO: move to a dev-time button
    if (process.env.NODE_ENV === "development") {
      new AxesViewer(scene, 0.35);
      import("@babylonjs/inspector").then(() => {
        Object.defineProperty(window, "debug", {
          get() {
            return this._debug;
          },
          set(v: boolean) {
            this._debug = v;
            if (v) {
              scene.debugLayer.show({ overlay: true });
            } else {
              scene.debugLayer.hide();
            }
          },
        });
      });
    }
  });

  console.log(scene.gravity);
  return { scene, engine };
};
