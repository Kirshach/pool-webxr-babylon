import {
  MeshBuilder,
  PhysicsAggregate,
  PhysicsShapeType,
  type Scene,
} from "@babylonjs/core";

let ballsCount = 0;

export const createBall = (scene: Scene) => {
  const ball = MeshBuilder.CreateSphere(`ball_${++ballsCount}`, {
    diameter: 0.061,
    segments: 32,
  });
  ball.checkCollisions = true;

  ball.position.set(Math.random() * 1.5 - 0.5, 1, Math.random() - 0.5);

  new PhysicsAggregate(
    ball,
    PhysicsShapeType.SPHERE,
    {
      mass: 1,
      restitution: 0.75,
      radius: 0.035,
    },
    scene
  );

  return ball;
};
