import {
  PhysicsRaycastResult,
  Ray,
  Scene,
  Vector3,
  WebXRInputSource,
} from "@babylonjs/core";

export const applyForceOnInteraction = (
  scene: Scene,
  controller?: WebXRInputSource
) => {
  const directionRay = new Ray(Vector3.Zero(), Vector3.Zero());

  if (!controller) {
    // Get the ray from the center of the screen
    const pickInfo = scene.pick(
      scene.getEngine().getRenderWidth() / 2,
      scene.getEngine().getRenderHeight() / 2
    );
    if (!pickInfo.ray) {
      return console.log("no ray");
    }
    if (pickInfo) {
      directionRay.origin = pickInfo.ray!.origin;
      directionRay.direction = pickInfo.ray!.direction;
    }
  } else {
    // Use the controller's direction for the ray
    controller.getWorldPointerRayToRef(directionRay);
  }

  const controllerDirection = directionRay.direction;
  const startPosition = directionRay.origin;
  const endPosition = startPosition.add(controllerDirection.scale(100));
  const raycastResult = new PhysicsRaycastResult();

  scene
    .getPhysicsEngine()!
    // @ts-ignore
    .raycastToRef(startPosition, endPosition, raycastResult);

  if (raycastResult.hasHit) {
    const forceMagnitude = 20;
    const force = controllerDirection.scale(forceMagnitude);
    raycastResult.body?.applyImpulse(force, raycastResult.hitPointWorld);
  }
};
