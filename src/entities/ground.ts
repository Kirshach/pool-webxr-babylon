import {
  MeshBuilder,
  PhysicsImpostor,
  type Scene,
  StandardMaterial,
  Texture
} from "@babylonjs/core";

export const createGround = async (scene: Scene) => {
  const ground = MeshBuilder.CreateGround("ground", { width: 100, height: 100 }, scene);
  const groundMaterial = new StandardMaterial('ground_material', scene);
  groundMaterial.diffuseTexture = new Texture('/assets/ground-textures/al.jpg', scene);
  groundMaterial.ambientTexture = new Texture('/assets/ground-textures/ao.jpg', scene);
  // groundMaterial.bumpTexture = new Texture('/assets/ground-textures/he.jpg', scene); // this one has a weird effect, don't use it
  // groundMaterial.specularTexture = new Texture('/assets/ground-textures/no.jpg', scene); // not sure about this one either
  // groundMaterial.emissiveTexture = new Texture('/assets/ground-textures/ro.jpg', scene); // not sure about this one either
  ground.material = groundMaterial;

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9 },
    scene
  );

  return ground;
};
