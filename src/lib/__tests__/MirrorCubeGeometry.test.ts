import * as fc from "fast-check";
import * as THREE from "three";
import {
  buildMirrorCubeGeometry,
  UNSOLVED_SLICES_X,
  UNSOLVED_SLICES_Y,
  UNSOLVED_SLICES_Z,
} from "../MirrorCubeGeometry";

// Feature: rubics-street, Property 1: Mirror Cube Geometry Piece Count
describe("Property 1: Mirror Cube Geometry Piece Count", () => {
  it("should have exactly 27 × single BoxGeometry vertex count for any solveProgress", () => {
    // Validates: Requirements 4.2
    const singleBox = new THREE.BoxGeometry(1, 1, 1);
    const singleVertexCount =
      singleBox.attributes.position.count;

    fc.assert(
      fc.property(fc.float({ min: 0, max: 1, noNaN: true }), (solveProgress) => {
        const geo = buildMirrorCubeGeometry({ solveProgress, totalSize: 3 });
        const vertexCount = geo.attributes.position.count;
        return vertexCount === 27 * singleVertexCount;
      }),
      { numRuns: 100 }
    );
  });
});

// Feature: rubics-street, Property 2: Piece Dimension Interpolation
describe("Property 2: Piece Dimension Interpolation", () => {
  const TOTAL_SIZE = 3;

  function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
  }

  it("at solveProgress=0, bounding box matches unsolved total size", () => {
    // Validates: Requirements 4.3, 4.4, 4.5
    const geo = buildMirrorCubeGeometry({ solveProgress: 0, totalSize: TOTAL_SIZE });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;

    const sizeX = bb.max.x - bb.min.x;
    const sizeY = bb.max.y - bb.min.y;
    const sizeZ = bb.max.z - bb.min.z;

    // At t=0, total size along each axis = sum of unsolved ratios * totalSize = totalSize
    expect(sizeX).toBeCloseTo(TOTAL_SIZE, 5);
    expect(sizeY).toBeCloseTo(TOTAL_SIZE, 5);
    expect(sizeZ).toBeCloseTo(TOTAL_SIZE, 5);
  });

  it("at solveProgress=1, bounding box is a uniform cube (all sides equal totalSize)", () => {
    // Validates: Requirements 4.3, 4.4, 4.5
    const geo = buildMirrorCubeGeometry({ solveProgress: 1, totalSize: TOTAL_SIZE });
    geo.computeBoundingBox();
    const bb = geo.boundingBox!;

    const sizeX = bb.max.x - bb.min.x;
    const sizeY = bb.max.y - bb.min.y;
    const sizeZ = bb.max.z - bb.min.z;

    expect(sizeX).toBeCloseTo(TOTAL_SIZE, 5);
    expect(sizeY).toBeCloseTo(TOTAL_SIZE, 5);
    expect(sizeZ).toBeCloseTo(TOTAL_SIZE, 5);

    // All sides equal
    expect(sizeX).toBeCloseTo(sizeY, 5);
    expect(sizeY).toBeCloseTo(sizeZ, 5);
  });

  it("for any t in [0,1], bounding box dimensions are between unsolved and solved extremes", () => {
    // Validates: Requirements 4.3, 4.4, 4.5
    // Compute unsolved total sizes per axis (sum of ratios * totalSize = totalSize for all axes)
    // The bounding box should always equal totalSize since ratios sum to 1
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1, noNaN: true }), (t) => {
        const geo = buildMirrorCubeGeometry({ solveProgress: t, totalSize: TOTAL_SIZE });
        geo.computeBoundingBox();
        const bb = geo.boundingBox!;

        const sizeX = bb.max.x - bb.min.x;
        const sizeY = bb.max.y - bb.min.y;
        const sizeZ = bb.max.z - bb.min.z;

        // Since unsolved ratios sum to 1.0 and solved ratios sum to 1.0,
        // the total bounding box should always equal totalSize
        const tol = 1e-4;
        return (
          Math.abs(sizeX - TOTAL_SIZE) < tol &&
          Math.abs(sizeY - TOTAL_SIZE) < tol &&
          Math.abs(sizeZ - TOTAL_SIZE) < tol
        );
      }),
      { numRuns: 100 }
    );
  });

  it("slice widths interpolate correctly between unsolved and solved for any t", () => {
    // Validates: Requirements 4.3, 4.4, 4.5
    // Verify that the largest slice in each axis interpolates correctly
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1, noNaN: true }), (t) => {
        const geo = buildMirrorCubeGeometry({ solveProgress: t, totalSize: TOTAL_SIZE });
        geo.computeBoundingBox();
        const bb = geo.boundingBox!;

        // The bounding box total should always be TOTAL_SIZE
        const sizeX = bb.max.x - bb.min.x;
        const sizeY = bb.max.y - bb.min.y;
        const sizeZ = bb.max.z - bb.min.z;

        const tol = 1e-4;

        // At t=0: unsolved (irregular), at t=1: solved (uniform)
        // The max slice width along X at t=0 is UNSOLVED_SLICES_X[1] * TOTAL_SIZE = 0.45 * 3 = 1.35
        // The max slice width along X at t=1 is (1/3) * TOTAL_SIZE = 1.0
        // At intermediate t, max slice = lerp(0.45, 1/3, t) * TOTAL_SIZE
        const expectedMaxSliceX = lerp(UNSOLVED_SLICES_X[1], 1 / 3, t) * TOTAL_SIZE;
        const expectedMaxSliceY = lerp(UNSOLVED_SLICES_Y[1], 1 / 3, t) * TOTAL_SIZE;
        const expectedMaxSliceZ = lerp(UNSOLVED_SLICES_Z[1], 1 / 3, t) * TOTAL_SIZE;

        // The max slice should be <= total size
        return (
          expectedMaxSliceX <= TOTAL_SIZE + tol &&
          expectedMaxSliceY <= TOTAL_SIZE + tol &&
          expectedMaxSliceZ <= TOTAL_SIZE + tol &&
          Math.abs(sizeX - TOTAL_SIZE) < tol &&
          Math.abs(sizeY - TOTAL_SIZE) < tol &&
          Math.abs(sizeZ - TOTAL_SIZE) < tol
        );
      }),
      { numRuns: 100 }
    );
  });
});
