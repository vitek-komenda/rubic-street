/**
 * Unit tests for ThreeSceneManager
 * Requirements: 2.1, 2.2, 2.3, 3.2, 6.6, 7.1, 7.3
 */
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as THREE from "three";

// Polyfill ResizeObserver for jsdom
if (typeof ResizeObserver === "undefined") {
  (global as unknown as Record<string, unknown>).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock THREE.WebGLRenderer to avoid needing a real WebGL context
vi.mock("three", async (importOriginal) => {
  const actual = await importOriginal<typeof THREE>();

  class MockWebGLRenderer {
    domElement: HTMLCanvasElement;

    constructor(params: { canvas?: HTMLCanvasElement; antialias?: boolean } = {}) {
      this.domElement = params.canvas ?? document.createElement("canvas");
    }

    setPixelRatio(_ratio: number) {}
    setClearColor(_color: string) {}
    setSize(_w: number, _h: number, _updateStyle?: boolean) {}
    render(_scene: unknown, _camera: unknown) {}
    dispose() {}
  }

  return {
    ...actual,
    WebGLRenderer: MockWebGLRenderer,
  };
});

import { ThreeSceneManager } from "../ThreeSceneManager";

function createMockCanvas(): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = 800;
  canvas.height = 600;
  const div = document.createElement("div");
  div.style.width = "800px";
  div.style.height = "600px";
  div.appendChild(canvas);
  document.body.appendChild(div);
  return canvas;
}

describe("ThreeSceneManager", () => {
  let manager: ThreeSceneManager;
  let canvas: HTMLCanvasElement;

  beforeEach(() => {
    canvas = createMockCanvas();
    manager = new ThreeSceneManager({ canvas });
  });

  afterEach(() => {
    manager?.dispose();
    canvas.parentElement?.remove();
  });

  it("creates a renderer bound to the canvas", () => {
    expect(manager.renderer).toBeDefined();
    expect(manager.renderer.domElement).toBe(canvas);
  });

  it("creates a PerspectiveCamera (not OrthographicCamera)", () => {
    expect(manager.camera).toBeInstanceOf(THREE.PerspectiveCamera);
  });

  it("camera FOV is between 45 and 75 degrees", () => {
    expect(manager.camera.fov).toBeGreaterThanOrEqual(45);
    expect(manager.camera.fov).toBeLessThanOrEqual(75);
  });

  it("scene contains exactly 12 building meshes after initialization", () => {
    let buildingMeshCount = 0;
    manager.scene.children.forEach((child) => {
      if (child instanceof THREE.Group) {
        child.traverse((obj) => {
          if (obj instanceof THREE.Mesh) {
            buildingMeshCount++;
          }
        });
      }
    });
    expect(buildingMeshCount).toBe(12);
  });

  it("scene contains AmbientLight", () => {
    let hasAmbient = false;
    manager.scene.traverse((obj) => {
      if (obj instanceof THREE.AmbientLight) hasAmbient = true;
    });
    expect(hasAmbient).toBe(true);
  });

  it("scene contains DirectionalLight", () => {
    let hasDirectional = false;
    manager.scene.traverse((obj) => {
      if (obj instanceof THREE.DirectionalLight) hasDirectional = true;
    });
    expect(hasDirectional).toBe(true);
  });

  it("AmbientLight and DirectionalLight have positive intensity", () => {
    let ambientIntensity = 0;
    let directionalIntensity = 0;
    manager.scene.traverse((obj) => {
      if (obj instanceof THREE.AmbientLight) ambientIntensity = obj.intensity;
      if (obj instanceof THREE.DirectionalLight) directionalIntensity = obj.intensity;
    });
    expect(ambientIntensity).toBeGreaterThan(0);
    expect(directionalIntensity).toBeGreaterThan(0);
  });

  it("handleResize updates camera aspect ratio", () => {
    const container = canvas.parentElement!;
    Object.defineProperty(container, "getBoundingClientRect", {
      value: () => ({ width: 1280, height: 720, top: 0, left: 0, right: 1280, bottom: 720 }),
      configurable: true,
    });

    manager.handleResize();

    expect(manager.camera.aspect).toBeCloseTo(1280 / 720, 5);
  });

  it("dispose does not throw", () => {
    expect(() => manager.dispose()).not.toThrow();
  });
});
