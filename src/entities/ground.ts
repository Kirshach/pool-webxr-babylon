import {
  CreateGround,
  PBRMaterial,
  PhysicsImpostor,
  Texture,
  type Scene
} from "@babylonjs/core"

export const createGround = async (scene: Scene) => {
  const ground = CreateGround("ground", { width: 12.5, height: 12.5 }, scene);
  const groundMaterial = new PBRMaterial('ground_material', scene);

  [
    groundMaterial.albedoTexture = new Texture('/assets/ground-textures/diff.jpg', scene),
    groundMaterial.metallicTexture = new Texture('/assets/ground-textures/arm.jpg', scene),
    groundMaterial.bumpTexture = new Texture('/assets/ground-textures/normal.jpg', scene),
  ].forEach((texture) => {
    texture.uScale = 8;
    texture.vScale = 8;
  });

  groundMaterial.useAmbientOcclusionFromMetallicTextureRed = true;
  groundMaterial.useRoughnessFromMetallicTextureGreen = true;
  groundMaterial.useMetallnessFromMetallicTextureBlue = true;

  groundMaterial.invertNormalMapX = true;
  groundMaterial.invertNormalMapY = true;

  ground.material = groundMaterial;
  ground.receiveShadows = true;

  ground.physicsImpostor = new PhysicsImpostor(
    ground,
    PhysicsImpostor.BoxImpostor,
    { mass: 0, restitution: 0.9 },
    scene
  );

  return ground;
};
