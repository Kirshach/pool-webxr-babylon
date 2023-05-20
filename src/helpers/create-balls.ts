import {
  PhysicsBody,
  MeshBuilder,
  PhysicsMotionType,
  PhysicsShapeSphere,
  Vector3,
  type Scene,
} from "@babylonjs/core";

const createBall = (
  scene: Scene,
  count: number,
  shape: PhysicsShapeSphere,
  diameter: number
) => {
  const ball = MeshBuilder.CreateSphere(`ball_${count}`, {
    diameter,
    segments: 32,
  });

  ball.position.set(Math.random() * 1.5 - 0.5, 0.8275, Math.random() - 0.5);

  const ballBody = new PhysicsBody(
    ball,
    PhysicsMotionType.DYNAMIC,
    false,
    scene
  );
  ballBody.shape = shape;
  ballBody.setMassProperties({ mass: 10 });

  return ball;
};

export const createBalls = (scene: Scene) => {
  const radius = 0.0305;
  const ballPhysicsShape = new PhysicsShapeSphere(
    Vector3.Zero(),
    radius,
    scene
  );
  ballPhysicsShape.material = { friction: 0.05, restitution: 0.1 };

  let ballsCount = 0;

  return Array.from({ length: 20 }).map(() =>
    createBall(scene, ++ballsCount, ballPhysicsShape, radius * 2)
  );
};
