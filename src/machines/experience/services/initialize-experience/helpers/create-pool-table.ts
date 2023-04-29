import {
  MeshBuilder,
  SceneLoader,
  PhysicsAggregate,
  PhysicsShapeType,
  VertexBuffer,
  Scene,
  Vector3,
  TransformNode,
  StandardMaterial,
  PBRMaterial,
} from "@babylonjs/core";

const zDelta = 0.00898;

import {
  supportsAvif,
  supportsWebP,
} from "../../../../../shared/lib/is-image-format-supported";

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

    // Rotate the table mesh
    table.rotate(new Vector3(1, 0, 0), Math.PI / 2);
    table.position.set(localCenter.x, 0, -0.0275);

    // Center the table in the scene by adjusting the parent node's position
    tableParent.position.set(0, localCenter.y, 0);

    // Add physics
    createBlock(
      {
        depth: 1.1,
        width: 2.56,
        height: 0.1,
        position: { x: 0, y: 0.746138, z: zDelta },
      },
      scene
    );

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

    createBlock(
      {
        depth: 0.15,
        width: 1.086,
        height: 0.1,
        position: { x: 0.6435, y: 0.78719, z: 0.70076 },
      },
      scene,
      "z"
    );

    createBlock(
      {
        depth: 0.15,
        width: 1.086,
        height: 0.1,
        position: { x: -0.6435, y: 0.78719, z: 0.70076 },
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
  }: {
    depth: number;
    width: number;
    height: number;
    position: { x: number; y: number; z: number };
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
          position: { ...position, z: -position.z + zDelta * 2 },
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
        },
        scene
      );
    }
  }
  // blockMesh.isVisible = false;
  blockMesh.collisionMask = 1;
};
