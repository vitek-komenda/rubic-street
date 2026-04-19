import * as THREE from "three";

const DEG2RAD = Math.PI / 180;

/**
 * Controls the camera's position and orientation along a street path.
 *
 * - Street position (t ∈ [0,1]) maps to a world position on the CatmullRomCurve3.
 * - H rotation (yaw) offsets the look direction around the world Y axis.
 * - V tilt (pitch) offsets the look direction up/down.
 */
export class CameraController {
  private readonly _camera: THREE.PerspectiveCamera;
  private readonly _streetPath: THREE.CatmullRomCurve3;

  private _t: number = 0;
  private _hDeg: number = 0;
  private _vDeg: number = 10;

  constructor(camera: THREE.PerspectiveCamera, streetPath: THREE.CatmullRomCurve3) {
    this._camera = camera;
    this._streetPath = streetPath;
    this._updateOrientation();
  }

  /**
   * Move the camera to the point on the street path at parameter t.
   * t is clamped to [0, 1].
   */
  setStreetPosition(t: number): void {
    this._t = Math.max(0, Math.min(1, t));
    const pos = this._streetPath.getPoint(this._t);
    this._camera.position.copy(pos);
    this._updateOrientation();
  }

  /**
   * Set the horizontal (yaw) rotation offset in degrees.
   * Stored as deg % 360 to keep it in [0, 360).
   */
  setHRotation(deg: number): void {
    this._hDeg = deg % 360;
    this._updateOrientation();
  }

  /**
   * Set the vertical (pitch) tilt in degrees.
   * Clamped to [-20, 60].
   */
  setVTilt(deg: number): void {
    this._vDeg = Math.max(-20, Math.min(60, deg));
    this._updateOrientation();
  }

  /**
   * Recompute the camera look direction from the current state.
   *
   * 1. Get the street tangent at _t (base forward direction).
   * 2. Apply yaw (_hDeg) around world Y axis.
   * 3. Apply pitch (_vDeg) around the camera's local right axis.
   * 4. Call camera.lookAt with the resulting direction.
   */
  private _updateOrientation(): void {
    // Base forward: street tangent at current t
    const tangent = this._streetPath.getTangent(this._t).normalize();

    // Apply yaw around world Y axis
    const yawQuat = new THREE.Quaternion();
    yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), this._hDeg * DEG2RAD);
    const yawedForward = tangent.clone().applyQuaternion(yawQuat);

    // Compute the right vector (perpendicular to yawed forward and world up)
    const worldUp = new THREE.Vector3(0, 1, 0);
    const right = new THREE.Vector3().crossVectors(yawedForward, worldUp).normalize();

    // Apply pitch around the right axis
    const pitchQuat = new THREE.Quaternion();
    pitchQuat.setFromAxisAngle(right, this._vDeg * DEG2RAD);
    const lookDir = yawedForward.clone().applyQuaternion(pitchQuat).normalize();

    // Point the camera in the computed direction
    const target = this._camera.position.clone().add(lookDir.multiplyScalar(10));
    this._camera.lookAt(target);
  }

  get t(): number {
    return this._t;
  }

  get hDeg(): number {
    return this._hDeg;
  }

  get vDeg(): number {
    return this._vDeg;
  }
}
