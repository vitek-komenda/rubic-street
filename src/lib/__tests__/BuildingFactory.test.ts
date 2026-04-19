import { describe, it, expect } from "vitest";
import * as THREE from "three";
import { createBuilding } from "../BuildingFactory";

describe("BuildingFactory", () => {
  it("returns a THREE.Mesh with non-null geometry", () => {
    const mesh = createBuilding({ solveProgress: 0.5, side: "left", index: 2 });
    expect(mesh).toBeInstanceOf(THREE.Mesh);
    expect(mesh.geometry).not.toBeNull();
  });

  it("material color at solveProgress=0 matches #888888", () => {
    const mesh = createBuilding({ solveProgress: 0, side: "left", index: 0 });
    const material = mesh.material as THREE.MeshLambertMaterial;
    // THREE.Color stores components as 0–1 floats; #888888 = 0x88/0xff ≈ 0.5333
    const expected = new THREE.Color(0x888888);
    expect(material.color.r).toBeCloseTo(expected.r, 4);
    expect(material.color.g).toBeCloseTo(expected.g, 4);
    expect(material.color.b).toBeCloseTo(expected.b, 4);
  });

  it("material color at solveProgress=1 matches #CCCCCC", () => {
    const mesh = createBuilding({ solveProgress: 1, side: "right", index: 5 });
    const material = mesh.material as THREE.MeshLambertMaterial;
    const expected = new THREE.Color(0xcccccc);
    expect(material.color.r).toBeCloseTo(expected.r, 4);
    expect(material.color.g).toBeCloseTo(expected.g, 4);
    expect(material.color.b).toBeCloseTo(expected.b, 4);
  });

  it("material color at solveProgress=0 differs from solveProgress=1", () => {
    const meshUnsolved = createBuilding({ solveProgress: 0, side: "left", index: 0 });
    const meshSolved = createBuilding({ solveProgress: 1, side: "left", index: 5 });
    const matUnsolved = meshUnsolved.material as THREE.MeshLambertMaterial;
    const matSolved = meshSolved.material as THREE.MeshLambertMaterial;
    // The colors should differ — solved is lighter than unsolved
    expect(matUnsolved.color.r).not.toBeCloseTo(matSolved.color.r, 2);
  });
});
