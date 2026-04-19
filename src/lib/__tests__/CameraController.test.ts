import { describe, it, expect } from "vitest";
import * as THREE from "three";
import * as fc from "fast-check";
import { CameraController } from "../CameraController";

// Feature: rubics-street, Property 8: Camera Position Follows Street Path
// Feature: rubics-street, Property 9: Camera Orientation Matches Slider Values

const DEG2RAD = Math.PI / 180;
const TOLERANCE = 1e-5;

/** Build the canonical street path used throughout the app. */
function makeStreetPath(): THREE.CatmullRomCurve3 {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 2, -20),
    new THREE.Vector3(0, 5, -50),
  ]);
}

function makeCamera(): THREE.PerspectiveCamera {
  return new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
}

describe("CameraController — Property 8: Camera Position Follows Street Path", () => {
  /**
   * Validates: Requirements 9.4
   *
   * For any t in [0, 1], after setStreetPosition(t), the camera world position
   * shall equal streetPath.getPoint(t) within floating-point tolerance.
   */
  it("camera position equals streetPath.getPoint(t) for any t in [0,1]", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        (t) => {
          const camera = makeCamera();
          const path = makeStreetPath();
          const controller = new CameraController(camera, path);

          controller.setStreetPosition(t);

          const expected = path.getPoint(t);
          expect(camera.position.x).toBeCloseTo(expected.x, 5);
          expect(camera.position.y).toBeCloseTo(expected.y, 5);
          expect(camera.position.z).toBeCloseTo(expected.z, 5);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("clamps t below 0 to 0", () => {
    const camera = makeCamera();
    const path = makeStreetPath();
    const controller = new CameraController(camera, path);
    controller.setStreetPosition(-0.5);
    const expected = path.getPoint(0);
    expect(camera.position.x).toBeCloseTo(expected.x, 5);
    expect(camera.position.y).toBeCloseTo(expected.y, 5);
    expect(camera.position.z).toBeCloseTo(expected.z, 5);
  });

  it("clamps t above 1 to 1", () => {
    const camera = makeCamera();
    const path = makeStreetPath();
    const controller = new CameraController(camera, path);
    controller.setStreetPosition(1.5);
    const expected = path.getPoint(1);
    expect(camera.position.x).toBeCloseTo(expected.x, 5);
    expect(camera.position.y).toBeCloseTo(expected.y, 5);
    expect(camera.position.z).toBeCloseTo(expected.z, 5);
  });
});

describe("CameraController — Property 9: Camera Orientation Matches Slider Values", () => {
  /**
   * Validates: Requirements 9.5, 9.7
   *
   * For any h in [0, 360] and v in [-20, 60], after setHRotation(h) and setVTilt(v),
   * the camera look direction shall correspond to the correct yaw and pitch from the
   * base street-tangent direction, within floating-point tolerance.
   */
  it("camera look direction matches yaw and pitch from street tangent", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 360, noNaN: true }),
        fc.float({ min: -20, max: 60, noNaN: true }),
        (h, v) => {
          const camera = makeCamera();
          const path = makeStreetPath();
          const controller = new CameraController(camera, path);

          // Fix position at t=0 for a deterministic tangent
          controller.setStreetPosition(0);
          controller.setHRotation(h);
          controller.setVTilt(v);

          // Reconstruct expected look direction using the same algorithm
          const tangent = path.getTangent(0).normalize();

          const yawQuat = new THREE.Quaternion();
          yawQuat.setFromAxisAngle(new THREE.Vector3(0, 1, 0), h * DEG2RAD);
          const yawedForward = tangent.clone().applyQuaternion(yawQuat);

          const worldUp = new THREE.Vector3(0, 1, 0);
          const right = new THREE.Vector3().crossVectors(yawedForward, worldUp).normalize();

          const pitchQuat = new THREE.Quaternion();
          pitchQuat.setFromAxisAngle(right, v * DEG2RAD);
          const expectedLookDir = yawedForward.clone().applyQuaternion(pitchQuat).normalize();

          // Extract actual look direction from camera matrix
          // camera.getWorldDirection returns the normalized -Z direction in world space
          const actualLookDir = new THREE.Vector3();
          camera.getWorldDirection(actualLookDir);

          expect(actualLookDir.x).toBeCloseTo(expectedLookDir.x, 4);
          expect(actualLookDir.y).toBeCloseTo(expectedLookDir.y, 4);
          expect(actualLookDir.z).toBeCloseTo(expectedLookDir.z, 4);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("vTilt is clamped to [-20, 60]", () => {
    const camera = makeCamera();
    const path = makeStreetPath();
    const controller = new CameraController(camera, path);
    controller.setVTilt(-90);
    expect(controller.vDeg).toBe(-20);
    controller.setVTilt(90);
    expect(controller.vDeg).toBe(60);
  });

  it("hDeg is stored as deg % 360", () => {
    const camera = makeCamera();
    const path = makeStreetPath();
    const controller = new CameraController(camera, path);
    controller.setHRotation(400);
    expect(controller.hDeg).toBeCloseTo(40, 5);
  });
});
