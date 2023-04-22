import {
  type Mesh,
  SceneLoader,
  PhysicsAggregate,
  PhysicsShapeType,
  VertexBuffer,
  type Scene,
  Vector3,
} from "@babylonjs/core";

// TODO: utilize lightweight texture
export const createPoolTable = (scene: Scene) =>
  SceneLoader.ImportMeshAsync(
    "SM_PoolTable01_M_PoolTable01_0",
    "/assets/pooltable/",
    "scene.gltf",
    scene
  ).then(({ meshes: [, table] }) => {
    // remove mesh from root node
    table.setParent(null);

    // scale down
    const vertexData = table.getVerticesData(VertexBuffer.PositionKind)!;

    for (let i = 0; i < vertexData.length; i++) {
      vertexData[i] *= 0.01;
    }

    table.setVerticesData(VertexBuffer.PositionKind, vertexData);
    table.checkCollisions = true;

    table.position.set(0.62, 0, 0);
    table.rotate(new Vector3(1, 0, 0), Math.PI / 2);

    // add physics
    const tableAggregate = new PhysicsAggregate(
      table,
      PhysicsShapeType.MESH,
      { mass: 0, friction: 1, mesh: table as Mesh },
      scene
    );

    return {
      table,
      tableAggregate,
    };
  });
