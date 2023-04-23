import {
  Mesh,
  MeshBuilder,
  SceneLoader,
  PhysicsAggregate,
  PhysicsShapeType,
  VertexBuffer,
  Scene,
  Vector3,
  TransformNode,
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
    table.position.set(localCenter.x, 0, 0);

    // Center the table in the scene by adjusting the parent node's position
    tableParent.position.set(0, localCenter.y, 0);

    // Add physics
    const tableAggregate = new PhysicsAggregate(
      table,
      PhysicsShapeType.MESH,
      { mass: 0, friction: 1, mesh: table as Mesh },
      scene
    );

    // Check camera collisions
    const boxMesh = MeshBuilder.CreateTiledBox(
      "boxMesh",
      { height: 1.7, width: 2.8, depth: 1.5, tileSize: 100 },
      scene
    );
    boxMesh.position.set(0, 0, 0.03);
    boxMesh.checkCollisions = true;
    boxMesh.isVisible = false;
    boxMesh.collisionMask = 2;

    return {
      table,
      tableAggregate,
    };
  });
