import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { MirrorCubeConfig } from "@/types";

// Unsolved slice ratios — each axis sums to 1.0
export const UNSOLVED_SLICES_X: [number, number, number] = [0.20, 0.45, 0.35];
export const UNSOLVED_SLICES_Y: [number, number, number] = [0.15, 0.55, 0.30];
export const UNSOLVED_SLICES_Z: [number, number, number] = [0.25, 0.40, 0.35];

// Solved slice ratios — uniform thirds
const SOLVED_SLICE: [number, number, number] = [1 / 3, 1 / 3, 1 / 3];

/**
 * Linearly interpolate between a and b by t.
 */
function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * Compute the three interpolated slice widths (in world units) for one axis.
 */
function computeSliceWidths(
  unsolvedRatios: [number, number, number],
  solveProgress: number,
  totalSize: number
): [number, number, number] {
  return [
    lerp(unsolvedRatios[0], SOLVED_SLICE[0], solveProgress) * totalSize,
    lerp(unsolvedRatios[1], SOLVED_SLICE[1], solveProgress) * totalSize,
    lerp(unsolvedRatios[2], SOLVED_SLICE[2], solveProgress) * totalSize,
  ];
}

/**
 * Compute the center positions of the three slices along one axis,
 * given their widths. The overall span is centered at 0.
 */
function computeCenters(widths: [number, number, number]): [number, number, number] {
  const total = widths[0] + widths[1] + widths[2];
  const half = total / 2;
  // cumulative start positions
  const start0 = 0;
  const start1 = widths[0];
  const start2 = widths[0] + widths[1];
  return [
    -half + start0 + widths[0] / 2,
    -half + start1 + widths[1] / 2,
    -half + start2 + widths[2] / 2,
  ];
}

/**
 * Build a merged BufferGeometry representing a mirror cube at the given solve progress.
 * The cube is composed of 27 cuboid pieces arranged in a 3×3×3 grid.
 */
export function buildMirrorCubeGeometry(config: MirrorCubeConfig): THREE.BufferGeometry {
  const { solveProgress, totalSize } = config;

  const widthsX = computeSliceWidths(UNSOLVED_SLICES_X, solveProgress, totalSize);
  const widthsY = computeSliceWidths(UNSOLVED_SLICES_Y, solveProgress, totalSize);
  const widthsZ = computeSliceWidths(UNSOLVED_SLICES_Z, solveProgress, totalSize);

  const centersX = computeCenters(widthsX);
  const centersY = computeCenters(widthsY);
  const centersZ = computeCenters(widthsZ);

  const geometries: THREE.BufferGeometry[] = [];

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      for (let k = 0; k < 3; k++) {
        const w = widthsX[i];
        const h = widthsY[j];
        const d = widthsZ[k];

        const geo = new THREE.BoxGeometry(w, h, d);

        // Translate the geometry to its center position
        const matrix = new THREE.Matrix4();
        matrix.makeTranslation(centersX[i], centersY[j], centersZ[k]);
        geo.applyMatrix4(matrix);

        geometries.push(geo);
      }
    }
  }

  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  if (!merged) {
    throw new Error("BufferGeometryUtils.mergeGeometries returned null");
  }
  return merged;
}
