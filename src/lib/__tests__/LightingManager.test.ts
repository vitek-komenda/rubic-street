import { describe, it, expect } from "vitest";
import * as THREE from "three";
import * as fc from "fast-check";
import { LightingManager } from "../LightingManager";

// Feature: rubics-street, Property 10: Sun Position Matches Azimuth and Elevation

const LIGHT_RADIUS = 100;
const TOLERANCE = 1e-5;

describe("LightingManager — unit tests", () => {
  it("adds AmbientLight to the scene after construction", () => {
    const scene = new THREE.Scene();
    new LightingManager(scene);
    const ambient = scene.children.find((c) => c instanceof THREE.AmbientLight);
    expect(ambient).toBeDefined();
  });

  it("adds DirectionalLight to the scene after construction", () => {
    const scene = new THREE.Scene();
    new LightingManager(scene);
    const dir = scene.children.find((c) => c instanceof THREE.DirectionalLight);
    expect(dir).toBeDefined();
  });

  it("AmbientLight has positive intensity", () => {
    const scene = new THREE.Scene();
    const lm = new LightingManager(scene);
    expect(lm.ambientLight.intensity).toBeGreaterThan(0);
  });

  it("DirectionalLight has positive intensity", () => {
    const scene = new THREE.Scene();
    const lm = new LightingManager(scene);
    expect(lm.directionalLight.intensity).toBeGreaterThan(0);
  });
});

describe("LightingManager — Property 10: Sun Position Matches Azimuth and Elevation", () => {
  /**
   * Validates: Requirements 9.9, 9.10
   *
   * For any azimuth in [0, 360] and elevation in [0, 90], after calling
   * setAzimuth and setElevation, the directional light's position vector
   * (normalized) shall match the spherical-to-Cartesian formula within tolerance.
   */
  it("directional light position matches spherical-to-Cartesian formula", () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 360, noNaN: true }),
        fc.float({ min: 0, max: 90, noNaN: true }),
        (azimuth, elevation) => {
          const scene = new THREE.Scene();
          const lm = new LightingManager(scene);
          lm.setAzimuth(azimuth);
          lm.setElevation(elevation);

          const az = azimuth * (Math.PI / 180);
          const el = elevation * (Math.PI / 180);

          const expectedX = Math.cos(el) * Math.sin(az);
          const expectedY = Math.sin(el);
          const expectedZ = Math.cos(el) * Math.cos(az);

          const pos = lm.directionalLight.position;

          // Compare normalized direction (divide by LIGHT_RADIUS)
          expect(pos.x / LIGHT_RADIUS).toBeCloseTo(expectedX, 5);
          expect(pos.y / LIGHT_RADIUS).toBeCloseTo(expectedY, 5);
          expect(pos.z / LIGHT_RADIUS).toBeCloseTo(expectedZ, 5);
        }
      ),
      { numRuns: 100 }
    );
  });
});
