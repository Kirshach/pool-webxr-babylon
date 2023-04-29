import {
  PhysicsBody,
  MeshBuilder,
  PhysicsMotionType,
  PhysicsShapeSphere,
  Vector3,
  type Scene,
} from "@babylonjs/core";

const createBall = (scene: Scene, count: number, shape: PhysicsShapeSphere) => {
  const ball = MeshBuilder.CreateSphere(`ball_${count}`, {
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
  ballBody.shape = shape;

  return ball;
};

export const createBalls = (scene: Scene) => {
  const ballPhysicsShape = new PhysicsShapeSphere(Vector3.Zero(), 0.035, scene);
  ballPhysicsShape.material = { friction: 0.75, restitution: 0.75 };

  let ballsCount = 0;

  return Array.from({ length: 20 }).map(() =>
    createBall(scene, ++ballsCount, ballPhysicsShape)
  );
};