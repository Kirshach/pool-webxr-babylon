// TODO: tree-shake
import {
  type Scene,
  StandardMaterial,
  Texture,
  PhysicsImpostor
} from "@babylonjs/core";
import { CreateGround } from "@babylonjs/core/Meshes/Builders/groundBuilder";

export const createGround = async (scene: Scene) => {
  const ground = CreateGround("ground", { width: 12.5, height: 12.5 }, scene);
  const groundMaterial = new StandardMaterial('ground_material', scene);

  [
    groundMaterial.diffuseTexture = new Texture('/assets/ground-textures/diff.png', scene),
    groundMaterial.ambientTexture = new Texture('/assets/ground-textures/ao.png', scene),
    groundMaterial.bumpTexture = new Texture('/assets/ground-textures/normal.png', scene)
  ].forEach((texture) => {
    texture.uScale = 8;
    texture.vScale = 8;
  });

  ground.material = groundMaterial;

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9 },
    scene
  );

  return ground;
};
