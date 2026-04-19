import { describe, it, expect } from "vitest";
import * as fc from "fast-check";
import * as THREE from "three";
import { streetPath, buildScene } from "../SceneBuilder";

// Feature: rubics-street, Property 7: Street Path Rises Monotonically
describe("Property 7: Street Path Rises Monotonically", () => {
  it("streetPath.getPoint(t1).y <= streetPath.getPoint(t2).y for all t1 < t2", () => {
    fc.assert(
      fc.property(
        fc
          .tuple(
            fc.float({ min: 0, max: 1, noNaN: true }),
            fc.float({ min: 0, max: 1, noNaN: true })
          )
          .filter(([t1, t2]) => t1 < t2),
        ([t1, t2]) => {
          const y1 = streetPath.getPoint(t1).y;
          const y2 = streetPath.getPoint(t2).y;
          return y1 <= y2;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// Feature: rubics-street, Property 3: Even Building Spacing
describe("Property 3: Even Building Spacing", () => {
  it("consecutive left building distances along the street are equal within tolerance", () => {
    const { buildingGroupLeft } = buildScene();

    // Extract world positions of the 6 left buildings (in order)
    const positions: THREE.Vector3[] = [];
    buildingGroupLeft.children.forEach((child) => {
      const mesh = child as THREE.Mesh;
      positions.push(mesh.position.clone());
    });

    expect(positions).toHaveLength(6);

    // Compute consecutive distances
    const distances: number[] = [];
    for (let i = 1; i < positions.length; i++) {
      distances.push(positions[i].distanceTo(positions[i - 1]));
    }

    // All consecutive distances should be equal within tolerance 0.01
    const firstDist = distances[0];
    for (const d of distances) {
      expect(Math.abs(d - firstDist)).toBeLessThanOrEqual(0.01);
    }
  });
});

// Feature: rubics-street, Property 4: Monotonically Increasing Solve Progress
describe("Property 4: Monotonically Increasing Solve Progress", () => {
  it("left building solveProgress values are strictly increasing from 0.0 to 1.0", () => {
    const { buildingGroupLeft } = buildScene();

    const progressValues: number[] = buildingGroupLeft.children.map(
      (child) => (child as THREE.Mesh).userData.solveProgress as number
    );

    expect(progressValues).toHaveLength(6);

    // Check exact values: 0.0, 0.2, 0.4, 0.6, 0.8, 1.0
    expect(progressValues[0]).toBeCloseTo(0.0, 5);
    expect(progressValues[1]).toBeCloseTo(0.2, 5);
    expect(progressValues[2]).toBeCloseTo(0.4, 5);
    expect(progressValues[3]).toBeCloseTo(0.6, 5);
    expect(progressValues[4]).toBeCloseTo(0.8, 5);
    expect(progressValues[5]).toBeCloseTo(1.0, 5);

    // Strictly increasing
    for (let i = 0; i < progressValues.length - 1; i++) {
      expect(progressValues[i]).toBeLessThan(progressValues[i + 1]);
    }
  });
});

// Feature: rubics-street, Property 5: Left-Right Solve Progress Symmetry
describe("Property 5: Left-Right Solve Progress Symmetry", () => {
  it("left and right buildings at the same index share identical solveProgress", () => {
    const { buildingGroupLeft, buildingGroupRight } = buildScene();

    expect(buildingGroupLeft.children).toHaveLength(6);
    expect(buildingGroupRight.children).toHaveLength(6);

    for (let i = 0; i < 6; i++) {
      const leftProgress = (buildingGroupLeft.children[i] as THREE.Mesh).userData
        .solveProgress as number;
      const rightProgress = (buildingGroupRight.children[i] as THREE.Mesh).userData
        .solveProgress as number;
      expect(leftProgress).toBeCloseTo(rightProgress, 10);
    }
  });
});
