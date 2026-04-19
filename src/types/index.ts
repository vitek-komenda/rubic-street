import type * as THREE from "three";

/**
 * Configuration for a single slider control in the ControlsPanel.
 */
export interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
}

/**
 * Props for the ControlsPanel React component.
 * Each callback receives the new numeric value from the corresponding slider.
 */
export interface ControlsPanelProps {
  /** Street position along the path: 0.0 (downhill) – 1.0 (uphill) */
  onStreetPositionChange: (value: number) => void;
  /** Camera horizontal rotation: 0° – 360° */
  onCameraHRotationChange: (value: number) => void;
  /** Camera vertical tilt: −20° – +60° */
  onCameraVTiltChange: (value: number) => void;
  /** Sun azimuth (horizontal angle): 0° – 360° */
  onSunAzimuthChange: (value: number) => void;
  /** Sun elevation (vertical angle): 0° – 90° */
  onSunElevationChange: (value: number) => void;
}

/**
 * Options passed to ThreeSceneManager on construction.
 */
export interface SceneManagerOptions {
  /** The HTMLCanvasElement to render into. */
  canvas: HTMLCanvasElement;
  /** Optional callback invoked once the scene is ready to render. */
  onReady?: () => void;
}

/**
 * Configuration for generating a mirror cube geometry.
 */
export interface MirrorCubeConfig {
  /** Solve progress from 0.0 (fully unsolved) to 1.0 (fully solved). */
  solveProgress: number;
  /** Overall bounding box side length in world units. */
  totalSize: number;
}

/**
 * Options for creating a single building mesh.
 */
export interface BuildingOptions {
  /** Solve progress from 0.0 (fully unsolved) to 1.0 (fully solved). */
  solveProgress: number;
  /** Which side of the street the building is on. */
  side: "left" | "right";
  /** Building index: 0 = downhill end, 5 = uphill end. */
  index: number;
}

/**
 * Dimensions of a single mirror cube piece along each axis.
 */
export interface PieceSize {
  x: number;
  y: number;
  z: number;
}
