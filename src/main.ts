// TODO: tree-shake
import {
  AxesViewer,
  CannonJSPlugin,
  DracoCompression,
  PhysicsImpostor,
  ShadowGenerator,
  Sound,
  Tools,
} from "@babylonjs/core";
import { WebXRDefaultExperience } from '@babylonjs/core/XR/webXRDefaultExperience.js'
import { CreateBox } from '@babylonjs/core/Meshes/Builders/boxBuilder.js'
import { Scene } from '@babylonjs/core/scene.js'
import { Engine } from '@babylonjs/core/Engines/engine.js'
import { Color4 } from '@babylonjs/core/Maths/math.color.js'
import { FreeCamera } from '@babylonjs/core/Cameras/freeCamera.js'
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';

import "@babylonjs/loaders/glTF"; // TODO: 667kB, need to tree-shake it

import * as CANNON_ES_NS from 'cannon-es';

import myHeartIsHome from "./assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3?url";

import { createPoolTable } from "./entities/pool-table";
import { createGround } from './entities/ground';

import { createLights } from './app/createLights';

declare global {
  var CANNON: typeof CANNON_ES_NS;
}

globalThis.CANNON = CANNON_ES_NS;

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: "/draco/draco_wasm_wrapper_gltf.js",
    wasmBinaryUrl: "/draco/draco_decoder_gltf.wasm",
    fallbackUrl: "/draco/draco_decoder_gltf.wasm",
  },
};

const canvas = document.getElementById("canvas");

if (!canvas) {
  throw new Error("Canvas not found");
} else if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error(
    '"#canvas" element was found but is not instance of HTMLCanvasElement'
  );
}

const engine = new Engine(canvas, true, {});

const physicsPlugin = new CannonJSPlugin();
const gravityVector = new Vector3(0, -9.81, 0);

const scene = new Scene(engine);
scene.enablePhysics(gravityVector, physicsPlugin);
scene.clearColor = new Color4(0, 0, 0, 1);

const camera = new FreeCamera(
  "camera",
  new Vector3(3, 1.65, 3),
  scene
);
camera.target = new Vector3(0, 1, 0);
camera.attachControl(canvas, false);
camera.speed = 0.2;

const box = CreateBox(
  'Test Box',
  { faceColors: Array.from({ length: 6 }).map(() => new Color4(0.4, 0, 0, 0)) },
  scene
);
box.physicsImpostor = new PhysicsImpostor(
  box,
  PhysicsImpostor.BoxImpostor,
  { mass: 1, restitution: 0.9 });
box.scaling.x = 2;
box.position.set(-2, 2, -2);
box.rotation.y = Tools.ToRadians(45);

const { spotLight } = createLights(scene);

const table = await createPoolTable(scene);
const ground = await createGround(scene);

// shadows
const shadowGenerator = new ShadowGenerator(2048, spotLight, true);
shadowGenerator.addShadowCaster(table, true /* check if this parameter changes anything */);
shadowGenerator.usePoissonSampling = true;

// create gizmos
if (process.env.NODE_ENV === 'development') {
  Promise.all([import('@babylonjs/core/Gizmos/gizmoManager'), import('@babylonjs/core/Gizmos/lightGizmo')]).then(([{ GizmoManager }, { LightGizmo }]) => {
    const gizmoLight = new LightGizmo();
    gizmoLight.light = spotLight;
    gizmoLight.scaleRatio = 2;

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(gizmoLight.attachedMesh);
  })
}

WebXRDefaultExperience.CreateAsync(scene, {
  floorMeshes: [ground],
  optionalFeatures: true,
}).then((xrExperience) => {

  console.log(xrExperience)

  // run the loop
  engine.runRenderLoop(() => {
    scene.render()
  });

  window.addEventListener("resize", () => engine.resize());

  // add background music
  new Sound(
    "Mark Woollard - My Heart Is Home",
    myHeartIsHome,
    scene,
    null,
    { loop: true, autoplay: true }
  );

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
