import {
  Mesh,
  SceneLoader,
  PhysicsAggregate,
  PhysicsShapeType,
  VertexBuffer,
  Scene,
  Vector3,
} from "@babylonjs/core";

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

    // update the bounding info after scaling the mesh
    table.refreshBoundingInfo();

    // calculate the bounding box center in local space
    const boundingBox = table.getBoundingInfo().boundingBox;
    const localCenter = boundingBox.center.clone();

    // update the mesh's geometry to be centered around the local origin
    const positions = table.getVerticesData(VertexBuffer.PositionKind)!;

    for (let i = 0; i < positions.length; i += 3) {
      positions[i] -= localCenter.x;
      positions[i + 1] -= localCenter.y;
      positions[i + 2] -= localCenter.z;
    }

    table.updateVerticesData(VertexBuffer.PositionKind, positions);
    table.refreshBoundingInfo();

    table.position.set(0.62, 0, 0);
    table.rotate(new Vector3(1, 0, 0), Math.PI / 2);

    // add physics
    const tableAggregate = new PhysicsAggregate(
      table,
      PhysicsShapeType.MESH,
      { mass: 0, friction: 1, mesh: table },
      scene
    );

    return {
      table,
      tableAggregate,
    };
  });
