import { Color3 } from '@babylonjs/core/Maths/math.color';
import { SpotLight } from '@babylonjs/core/Lights/spotLight'
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { type Scene } from '@babylonjs/core/scene';

export const createLights = (scene: Scene) => {
  const spotLight = new SpotLight(
    "spot_light",
    new Vector3(0, 2, 0),
    Vector3.Zero(),
    Math.PI * 2,
    0.5,
    scene
  );
  spotLight.intensity = 20;
  spotLight.diffuse = new Color3(1, 1, 0.9);
  return { spotLight };
};
