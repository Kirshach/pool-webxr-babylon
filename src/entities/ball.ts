import {
  PhysicsBody,
  MeshBuilder,
  PhysicsMotionType,
  PhysicsShapeSphere,
  Vector3,
  type Scene,
} from "@babylonjs/core";

let ballsCount = 0;
let ballPhysicsShape: PhysicsShapeSphere;

export const createBall = (scene: Scene) => {
  if (!ballPhysicsShape) {
    ballPhysicsShape = new PhysicsShapeSphere(Vector3.Zero(), 0.035, scene);
    ballPhysicsShape.material = { friction: 0.75, restitution: 0.75 };
  }

  const ball = MeshBuilder.CreateSphere(`ball_${++ballsCount}`, {
    diameter: 0.061,
    segments: 32,
  });

  ball.position.set(Math.random() * 1.5 - 0.5, 1, Math.random() - 0.5);

  const ballBody = new PhysicsBody(
    ball,
    PhysicsMotionType.DYNAMIC,
    false,
    scene
  );
  ballBody.shape = ballPhysicsShape;

  return ball;
};
