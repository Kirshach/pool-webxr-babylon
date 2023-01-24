import { ArcRotateCamera, AxesViewer, DracoCompression, Engine, HemisphericLight, Scene, Vector3 } from 'babylonjs';
import 'babylonjs-loaders'; // TODO: 667kB, need to tree-shake it

import { getPoolTable } from './pool-table';

DracoCompression.Configuration = {
  decoder: {
    wasmUrl: '/draco/draco_wasm_wrapper_gltf.js',
    wasmBinaryUrl: '/draco/draco_decoder_gltf.wasm',
    fallbackUrl: '/draco/draco_decoder_gltf.wasm',
  },
};

const canvas = document.getElementById('canvas');

if (!canvas) {
  throw new Error('Canvas not found');
} else if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error('"#canvas" element was found but is not instance of HTMLCanvasElement');
}

const engine = new Engine(canvas, true, {});

const scene = new Scene(engine);
const camera = new ArcRotateCamera(
  'camera',
  Math.PI / 2 - Math.PI / 4,
  Math.PI * 0.4,
  50,
  new Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvas, false);

new HemisphericLight('light', new Vector3(1, 1, 0), scene);

const table = await getPoolTable(scene);
console.log(table);

new AxesViewer(scene, 5);

// TODO: move to a dev-time button
Object.defineProperty(window, 'debug', {
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
  }
});

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());
