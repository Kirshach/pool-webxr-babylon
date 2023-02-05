import {
  ArcRotateCamera,
  AxesViewer,
  CannonJSPlugin,
  Color3,
  Color4,
  DracoCompression,
  Engine,
  HemisphericLight,
  MeshBuilder,
  PhysicsImpostor,
  ShadowGenerator,
  Scene,
  Sound,
  SpotLight,
  Tools,
  Vector3,
} from "@babylonjs/core";
import "@babylonjs/loaders"; // TODO: 667kB, need to tree-shake it
import * as CANNON_ES_NS from 'cannon-es';

import myHeartIsHome from "./assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3?url";

import { createPoolTable } from "./entities/pool-table";
import { createGround } from './entities/ground';

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
scene.ambientColor = new Color3(0, 0, 0);

const camera = new ArcRotateCamera(
  "camera",
  Math.PI / 2 - Math.PI / 4,
  Math.PI * 0.4,
  5,
  new Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvas, false);

const box = MeshBuilder.CreateBox(
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

// add lights
const hemisphericLight = new HemisphericLight("hemispheric_light", new Vector3(0.1, 0.1, 0), scene);
hemisphericLight.intensity = 0.01;

const spotLight = new SpotLight(
  "spot_light",
  new Vector3(0, 2, 0),
  Vector3.Zero(),
  Math.PI,
  10,
  scene
);
spotLight.intensity = 500;
spotLight.diffuse = new Color3(1, 1, 0.9);
// const pointLight = new PointLight("pointLight", new Vector3(0, 2, 0), scene);
// pointLight.intensity = 0.1;
// pointLight.range = 1;

Promise.all([createPoolTable(scene), createGround(scene)]).then(([table, ground]) => {
  // shadows
  const shadowGenerator = new ShadowGenerator(1024, spotLight);
  shadowGenerator.addShadowCaster(table, true /* check if this parameter changes anything */);

  scene.createDefaultXRExperienceAsync({
    floorMeshes: [ground]
  }).then((xrExperience) => {
    console.log(xrExperience)
    // run the loop
    engine.runRenderLoop(() => scene.render());
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
});




