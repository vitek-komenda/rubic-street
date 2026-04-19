import * as THREE from "three";

/** Radius used to scale the directional light position vector. */
const LIGHT_RADIUS = 100;

/**
 * Manages ambient and directional lighting for the scene.
 * Exposes an API to control the sun's azimuth and elevation angles.
 */
export class LightingManager {
  private readonly _ambientLight: THREE.AmbientLight;
  private readonly _directionalLight: THREE.DirectionalLight;

  private _azimuth: number = 135; // degrees
  private _elevation: number = 45; // degrees

  constructor(scene: THREE.Scene) {
    this._ambientLight = new THREE.AmbientLight("#FFFFFF", 0.4);
    this._directionalLight = new THREE.DirectionalLight("#FFFFFF", 0.8);

    scene.add(this._ambientLight);
    scene.add(this._directionalLight);

    // Apply default position
    this._updatePosition();
  }

  /**
   * Set the sun's horizontal angle in degrees (0–360).
   */
  setAzimuth(deg: number): void {
    this._azimuth = deg;
    this._updatePosition();
  }

  /**
   * Set the sun's vertical angle in degrees (0–90).
   */
  setElevation(deg: number): void {
    this._elevation = deg;
    this._updatePosition();
  }

  /**
   * Recompute the directional light position from the current azimuth and elevation
   * using spherical-to-Cartesian conversion.
   *
   *   x = cos(el) * sin(az)
   *   y = sin(el)
   *   z = cos(el) * cos(az)
   */
  private _updatePosition(): void {
    const az = this._azimuth * (Math.PI / 180);
    const el = this._elevation * (Math.PI / 180);

    const x = Math.cos(el) * Math.sin(az);
    const y = Math.sin(el);
    const z = Math.cos(el) * Math.cos(az);

    this._directionalLight.position.set(
      x * LIGHT_RADIUS,
      y * LIGHT_RADIUS,
      z * LIGHT_RADIUS
    );
  }

  get ambientLight(): THREE.AmbientLight {
    return this._ambientLight;
  }

  get directionalLight(): THREE.DirectionalLight {
    return this._directionalLight;
  }
}
