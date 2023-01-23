import { ArcRotateCamera, DracoCompression, Engine, HemisphericLight, Scene, Vector3 } from 'babylonjs';
import 'babylonjs-loaders'; // TODO: tree-shake

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
  -Math.PI / 2,
  Math.PI / 2.5,
  15,
  new Vector3(0, 0, 0),
  scene
);
camera.attachControl(canvas, false);

new HemisphericLight('light', new Vector3(1, 1, 0), scene);

const table = await getPoolTable(scene);
console.log(table);

engine.runRenderLoop(() => scene.render());
window.addEventListener('resize', () => engine.resize());

