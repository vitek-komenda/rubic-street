import * as THREE from "three";
import { buildMirrorCubeGeometry } from "./MirrorCubeGeometry";
import type { BuildingOptions } from "@/types";

/** Total bounding box side length for buildings in world units. */
const TOTAL_SIZE = 4;

/** Unsolved building color: mid-gray */
const COLOR_UNSOLVED = 0x888888;
/** Solved building color: light gray */
const COLOR_SOLVED = 0xcccccc;

/**
 * Lerp a single 8-bit color channel from unsolved to solved by t.
 */
function lerpChannel(from: number, to: number, t: number): number {
  return Math.round(from + (to - from) * t);
}

/**
 * Compute the interpolated grayscale hex color string for a given solveProgress.
 * At t=0: #888888 (mid-gray, unsolved)
 * At t=1: #CCCCCC (light gray, solved)
 */
function computeMaterialColor(solveProgress: number): number {
  const fromR = (COLOR_UNSOLVED >> 16) & 0xff;
  const fromG = (COLOR_UNSOLVED >> 8) & 0xff;
  const fromB = COLOR_UNSOLVED & 0xff;

  const toR = (COLOR_SOLVED >> 16) & 0xff;
  const toG = (COLOR_SOLVED >> 8) & 0xff;
  const toB = COLOR_SOLVED & 0xff;

  const r = lerpChannel(fromR, toR, solveProgress);
  const g = lerpChannel(fromG, toG, solveProgress);
  const b = lerpChannel(fromB, toB, solveProgress);

  return (r << 16) | (g << 8) | b;
}

/**
 * Create a single building mesh at the given solve progress.
 * The geometry is a merged mirror cube; the material is a grayscale
 * MeshLambertMaterial interpolated between #888888 (unsolved) and #CCCCCC (solved).
 */
export function createBuilding(options: BuildingOptions): THREE.Mesh {
  const { solveProgress } = options;

  const geometry = buildMirrorCubeGeometry({ solveProgress, totalSize: TOTAL_SIZE });
  const colorHex = computeMaterialColor(solveProgress);
  const material = new THREE.MeshLambertMaterial({ color: colorHex });

  return new THREE.Mesh(geometry, material);
}
