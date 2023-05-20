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
      return console.log("no ray present");
    }
    if (pickInfo) {
      directionRay.origin = pickInfo.ray.origin;
      directionRay.direction = pickInfo.ray.direction;
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
    // @ts-expect-error
    .raycastToRef(startPosition, endPosition, raycastResult);

  if (raycastResult.hasHit) {
    // Calculate the contact point on the surface of the ball
    const contactPoint = raycastResult.hitPointWorld;
    const ballCenter = raycastResult.body?.getObjectCenterWorld();

    if (ballCenter) {
      // Calculate force direction based on the contact point
      const forceDirection = ballCenter.subtract(contactPoint).normalize();
      // Apply force
      const forceMagnitude = 0.6;
      const force = forceDirection.scale(forceMagnitude);
      raycastResult.body?.applyImpulse(force, contactPoint);
    }
  }
};
