import * as THREE from "three";
import { createBuilding } from "./BuildingFactory";

/** Total bounding box side length for buildings in world units. */
const TOTAL_SIZE = 4;

/**
 * The street path rises from the camera end (downhill) to the far end (uphill).
 * Control points: (0,0,0) → (0,2,-20) → (0,5,-50)
 */
export const streetPath = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(0, 2, -20),
  new THREE.Vector3(0, 5, -50),
]);

/** t values for the 6 building positions along the street path */
const BUILDING_TS = [1 / 12, 3 / 12, 5 / 12, 7 / 12, 9 / 12, 11 / 12];

/** Half of the road width (road is 8 units wide) */
const STREET_HALF_WIDTH = 4;

/** Extra lateral offset from road edge to building center */
const BUILDING_OFFSET = 3;

export interface SceneObjects {
  roadMesh: THREE.Mesh;
  buildingGroupLeft: THREE.Group;
  buildingGroupRight: THREE.Group;
  streetPath: THREE.CatmullRomCurve3;
}

/**
 * Build the road mesh: a PlaneGeometry displaced in Y to follow the street path curve.
 */
function buildRoadMesh(): THREE.Mesh {
  // width=8, length=60, 1 segment along width, 20 segments along length
  const geometry = new THREE.PlaneGeometry(8, 60, 1, 20);

  // Rotate -90° around X so the plane lies flat (normal pointing up)
  geometry.applyMatrix4(new THREE.Matrix4().makeRotationX(-Math.PI / 2));

  // Displace each vertex in Y to follow the street path curve.
  // After rotation, the plane extends from z=-30 to z=+30 (centered at origin).
  // We map z ∈ [-30, 30] → t ∈ [0, 1] and sample Y from the street path.
  const posAttr = geometry.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < posAttr.count; i++) {
    const z = posAttr.getZ(i);
    // Map z from [-30, 30] to t in [0, 1]
    const t = (z + 30) / 60;
    const tClamped = Math.max(0, Math.min(1, t));
    const pathPoint = streetPath.getPoint(tClamped);
    posAttr.setY(i, pathPoint.y);
  }
  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();

  const material = new THREE.MeshLambertMaterial({ color: "#444444" });
  return new THREE.Mesh(geometry, material);
}

/**
 * Construct the full scene: road mesh + 12 buildings (6 left, 6 right).
 */
export function buildScene(): SceneObjects {
  const roadMesh = buildRoadMesh();

  const buildingGroupLeft = new THREE.Group();
  const buildingGroupRight = new THREE.Group();

  for (let i = 0; i < BUILDING_TS.length; i++) {
    const t = BUILDING_TS[i];
    const solveProgress = i / 5; // 0.0, 0.2, 0.4, 0.6, 0.8, 1.0

    // Use arc-length parameterization so evenly-spaced t values produce
    // evenly-spaced world positions (Property 3: Even Building Spacing).
    const pathPoint = streetPath.getPointAt(t);
    const roadY = pathPoint.y;
    // Building center Y: base sits on the road surface
    const buildingCenterY = roadY + TOTAL_SIZE / 2;

    // Left building: negative X offset
    const leftMesh = createBuilding({ solveProgress, side: "left", index: i });
    leftMesh.position.set(
      pathPoint.x - (STREET_HALF_WIDTH + BUILDING_OFFSET),
      buildingCenterY,
      pathPoint.z
    );
    leftMesh.userData.solveProgress = solveProgress;
    buildingGroupLeft.add(leftMesh);

    // Right building: positive X offset
    const rightMesh = createBuilding({ solveProgress, side: "right", index: i });
    rightMesh.position.set(
      pathPoint.x + (STREET_HALF_WIDTH + BUILDING_OFFSET),
      buildingCenterY,
      pathPoint.z
    );
    rightMesh.userData.solveProgress = solveProgress;
    buildingGroupRight.add(rightMesh);
  }

  return {
    roadMesh,
    buildingGroupLeft,
    buildingGroupRight,
    streetPath,
  };
}
