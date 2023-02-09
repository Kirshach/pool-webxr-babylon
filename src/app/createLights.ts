import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js'
import { PointLight } from '@babylonjs/core/Lights/pointLight.js'
// import { SpotLight } from '@babylonjs/core/Lights/spotLight.js'
import { type Scene } from '@babylonjs/core/scene.js';

export const createLights = (scene: Scene) => {
  // Hemispheric Light
  const hemisphericLight = new HemisphericLight("hemispheric_light", new Vector3(0.1, 0.1, 0), scene);
  hemisphericLight.intensity = 0.05;

  // Spot Light
  // const spotLight = new SpotLight(
  //   "spot_light",
  //   new Vector3(0, 2, 0),
  //   Vector3.Zero(),
  //   Math.PI,
  //   10,
  //   scene
  // );
  // spotLight.intensity = 500;
  // spotLight.diffuse = new Color3(1, 1, 0.9);
  // const pointLight = new PointLight("pointLight", new Vector3(0, 2, 0), scene);
  // pointLight.intensity = 0.1;
  // pointLight.range = 1;
  const spotLight = new PointLight('point_light', new Vector3(0, 2, 0), scene);
  spotLight.intensity = 2;
  return { spotLight, hemisphericLight };
};
