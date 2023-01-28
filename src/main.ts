import {
  ArcRotateCamera,
  AxesViewer,
  DracoCompression,
  Engine,
  HemisphericLight,
  MeshBuilder,
  Scene,
  Sound,
  Vector3,
} from "@babylonjs/core";

import "@babylonjs/loaders"; // TODO: 667kB, need to tree-shake it

import { getPoolTable } from "./pool-table";

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

const scene = new Scene(engine);
const camera = new ArcRotateCamera(
  "camera",
  Math.PI / 2 - Math.PI / 4,
  Math.PI * 0.4,
  5,
  new Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvas, false);

// add lights
new HemisphericLight("light", new Vector3(0.1, 0.1, 0), scene);
// add ground
MeshBuilder.CreateGround("ground", { width: 10, height: 10 });
// add table
await getPoolTable(scene);

// add background music
new Sound(
  "Mark Woollard - My Heart Is Home",
  "/assets/music/melodyloops-preview-my-heart-is-home-1m27s.mp3",
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

// run the loop
engine.runRenderLoop(() => scene.render());
window.addEventListener("resize", () => engine.resize());
