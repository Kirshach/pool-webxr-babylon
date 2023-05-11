import {
  MeshBuilder,
  SceneLoader,
  PhysicsAggregate,
  PhysicsShapeType,
  VertexBuffer,
  Scene,
  Vector3,
  TransformNode,
  Quaternion,
} from "@babylonjs/core";

import {
  supportsAvif,
  supportsWebP,
} from "../../shared/lib/is-image-format-supported";

const getTableFolder = () => {
  if (supportsAvif) {
    return "/assets/pooltable-avif/";
  }
  if (supportsWebP) {
    return "/assets/pooltable-webp/";
  }
  return "/assets/pooltable-jpg/";
};

export const createPoolTable = (scene: Scene) =>
  SceneLoader.ImportMeshAsync(
    "SM_PoolTable01_M_PoolTable01_0",
    getTableFolder(),
    "scene.gltf",
    scene
  ).then(({ meshes: [, table] }) => {
    // remove mesh from root node
    table.setParent(null);
    table.receiveShadows = true;

    // scale down
    const vertexData = table.getVerticesData(VertexBuffer.PositionKind)!;

    for (let i = 0; i < vertexData.length; i++) {
      vertexData[i] *= 0.01;
    }

    table.setVerticesData(VertexBuffer.PositionKind, vertexData);

    // Create a parent node for the table
    const tableParent = new TransformNode("tableParent", scene);
    table.setParent(tableParent);

    // Calculate the bounding box center in local space
    table.refreshBoundingInfo();
    const boundingBox = table.getBoundingInfo().boundingBox;
    const localCenter = boundingBox.center.clone();

    table.rotate(new Vector3(1, 0, 0), Math.PI / 2);
    table.position.set(localCenter.x, 0, -0.0275);

    // Center the table in the scene by adjusting the parent node's position
    tableParent.position.set(0, localCenter.y, -0.00449 * 2);

    // Add physics
    // main block
    createBlock(
      {
        depth: 1.1,
        width: 2.56,
        height: 0.1,
        position: { x: 0, y: 0.746138, z: 0 },
      },
      scene
    );

    // main block side additions
    createBlock(
      {
        depth: 0.11,
        width: 2.38,
        height: 0.1,
        position: { x: 0, y: 0.746138, z: 0.56 },
      },
      scene,
      "z"
    );

    // // nearer longer side blocks
    createBlock(
      {
        depth: 0.15,
        width: 1.086,
        height: 0.1,
        position: { x: 0.6435, y: 0.78719, z: 0.69178 },
      },
      scene,
      "z"
    );

    // further longer side blocks
    createBlock(
      {
        depth: 0.15,
        width: 1.086,
        height: 0.1,
        position: { x: -0.6435, y: 0.78719, z: 0.69178 },
      },
      scene,
      "z"
    );

    // shorter side blocks
    createBlock(
      {
        depth: 1.04,
        width: 0.15,
        height: 0.1,
        position: { x: 1.35611, y: 0.78719, z: 0 },
      },
      scene,
      "x"
    );

    // near corner blocks
    createBlock(
      {
        depth: 0.175,
        width: 0.05,
        height: 0.1,
        position: { x: 1.3605, y: 0.78719, z: 0.5625 },
        rotation: [new Vector3(0, 1, 0), Math.PI / 4],
      },
      scene,
      "z"
    );

    createBlock(
      {
        depth: 0.175,
        width: 0.05,
        height: 0.1,
        position: { x: 1.2341, y: 0.78719, z: 0.6969 },
        rotation: [new Vector3(0, 1, 0), Math.PI / 4],
      },
      scene,
      "z"
    );

    // far corner blocks
    createBlock(
      {
        depth: 0.175,
        width: 0.05,
        height: 0.1,
        position: { x: -1.3605, y: 0.78719, z: 0.5625 },
        rotation: [new Vector3(0, 1, 0), (Math.PI * 3) / 4],
      },
      scene,
      "z"
    );

    createBlock(
      {
        depth: 0.175,
        width: 0.05,
        height: 0.1,
        position: { x: -1.2341, y: 0.78719, z: 0.6969 },
        rotation: [new Vector3(0, 1, 0), (Math.PI * 3) / 4],
      },
      scene,
      "z"
    );
    return {
      table,
    };
  });

const createBlock = (
  {
    depth,
    width,
    height,
    position,
    rotation,
  }: {
    depth: number;
    width: number;
    height: number;
    position: { x: number; y: number; z: number };
    rotation?: [Vector3, number];
  },
  scene: Scene,
  symmetric: "x" | "y" | "z" | undefined = undefined
) => {
  const blockMesh = MeshBuilder.CreateTiledBox(
    "boxMesh",
    {
      depth,
      width,
      height,
    },
    scene
  );
  blockMesh.position.set(position.x, position.y, position.z);

  if (rotation) {
    blockMesh.rotate(...rotation);
  }

  new PhysicsAggregate(
    blockMesh,
    PhysicsShapeType.BOX,
    { mass: 0, friction: 100 },
    scene
  );
  blockMesh.checkCollisions = true;

  if (symmetric) {
    if (symmetric === "z") {
      createBlock(
        {
          depth,
          width,
          height,
          position: { ...position, z: -position.z },
          rotation: rotation ? [rotation[0], -rotation[1]] : undefined,
        },
        scene
      );
    } else {
      createBlock(
        {
          depth,
          width,
          height,
          position: Object.assign(position, {
            [symmetric]: -position[symmetric],
          }),
          rotation: rotation ? [rotation[0], -rotation[1]] : undefined,
        },
        scene
      );
    }
  }
  // blockMesh.isVisible = false;
  blockMesh.collisionMask = 1;
};