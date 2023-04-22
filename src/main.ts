import {
  AxesViewer,
  DracoCompression,
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  ShadowGenerator,
  Sound,
  WebXRDefaultExperience,
} from "@babylonjs/core";

import "@babylonjs/loaders/glTF"; // TODO: 667kB, need to tree-shake it

import myHeartIsHome from "./assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3?url";

import { createGround } from "./entities/ground";
import { createPoolTable } from "./entities/pool-table";
import { createSpotLight } from "./entities/spot-light";
import { configureExperience } from "./features/configure-experience/configure-experience";

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

const { scene, engine } = await configureExperience(canvas);
const { spotLight } = createSpotLight(scene);

const { table } = await createPoolTable(scene);
const { ground } = await createGround(scene);

// shadows
const shadowGenerator = new ShadowGenerator(2048, spotLight, true);
shadowGenerator.addShadowCaster(
  table,
  true /* check if this parameter changes anything */
);
shadowGenerator.usePoissonSampling = true;

// create gizmos
if (process.env.NODE_ENV === "development") {
  Promise.all([
    import("@babylonjs/core/Gizmos/gizmoManager"),
    import("@babylonjs/core/Gizmos/lightGizmo"),
  ]).then(([{ GizmoManager }, { LightGizmo }]) => {
    const gizmoLight = new LightGizmo();
    gizmoLight.light = spotLight;
    gizmoLight.scaleRatio = 2;

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true;
    gizmoManager.rotationGizmoEnabled = true;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManager.attachToMesh(gizmoLight.attachedMesh);
  });
}

var sphere = MeshBuilder.CreateSphere(
  "sphere",
  { diameter: 0.05, segments: 32 },
  scene
);
sphere.position.set(1.3, 1.5, 0.6);

var sphereAggregate = new PhysicsAggregate(
  sphere,
  PhysicsShapeType.SPHERE,
  { mass: 1, restitution: 0.75 },
  scene
);

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
