import * as THREE from "three";
import { buildScene, streetPath } from "./SceneBuilder";
import { LightingManager } from "./LightingManager";
import { CameraController } from "./CameraController";
import type { SceneManagerOptions } from "../types";

/**
 * Manages the Three.js renderer, scene, camera, lighting, and animation loop.
 * Owns the full lifecycle: initialization, resize handling, and disposal.
 */
export class ThreeSceneManager {
  private readonly _renderer: THREE.WebGLRenderer;
  private readonly _scene: THREE.Scene;
  private readonly _camera: THREE.PerspectiveCamera;
  private readonly _lightingManager: LightingManager;
  private readonly _cameraController: CameraController;
  private readonly _resizeObserver: ResizeObserver;

  private _animationFrameId: number | null = null;

  constructor(options: SceneManagerOptions) {
    const { canvas, onReady } = options;

    // --- Renderer ---
    this._renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.setClearColor("#E8E8E8");

    // --- Camera ---
    const aspect = canvas.clientWidth / canvas.clientHeight || 1;
    this._camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);

    // --- Scene ---
    this._scene = new THREE.Scene();

    // --- Build scene objects ---
    const { roadMesh, buildingGroupLeft, buildingGroupRight } = buildScene();
    this._scene.add(roadMesh);
    this._scene.add(buildingGroupLeft);
    this._scene.add(buildingGroupRight);

    // --- Lighting ---
    this._lightingManager = new LightingManager(this._scene);

    // --- Camera controller ---
    this._cameraController = new CameraController(this._camera, streetPath);

    // --- Initialize camera ---
    this._cameraController.setStreetPosition(0);
    this._cameraController.setHRotation(0);
    this._cameraController.setVTilt(10);

    // --- Resize observer ---
    const container = canvas.parentElement ?? canvas;
    this._resizeObserver = new ResizeObserver(() => {
      this.handleResize();
    });
    this._resizeObserver.observe(container);

    // Initial size sync
    this.handleResize();

    // --- Start render loop ---
    this._startRenderLoop();

    onReady?.();
  }

  // -------------------------------------------------------------------------
  // Public API
  // -------------------------------------------------------------------------

  setStreetPosition(t: number): void {
    this._cameraController.setStreetPosition(t);
  }

  setCameraHRotation(deg: number): void {
    this._cameraController.setHRotation(deg);
  }

  setCameraVTilt(deg: number): void {
    this._cameraController.setVTilt(deg);
  }

  setSunAzimuth(deg: number): void {
    this._lightingManager.setAzimuth(deg);
  }

  setSunElevation(deg: number): void {
    this._lightingManager.setElevation(deg);
  }

  handleResize(): void {
    const canvas = this._renderer.domElement;
    const container = canvas.parentElement ?? canvas;
    const { width, height } = container.getBoundingClientRect();

    if (width > 0 && height > 0) {
      this._renderer.setSize(width, height, false);
      this._camera.aspect = width / height;
      this._camera.updateProjectionMatrix();
    }
  }

  dispose(): void {
    // Cancel animation loop
    if (this._animationFrameId !== null) {
      cancelAnimationFrame(this._animationFrameId);
      this._animationFrameId = null;
    }

    // Disconnect resize observer
    this._resizeObserver.disconnect();

    // Dispose all geometries and materials in the scene
    this._scene.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        object.geometry?.dispose();
        if (Array.isArray(object.material)) {
          object.material.forEach((m) => m.dispose());
        } else {
          object.material?.dispose();
        }
      }
    });

    // Dispose renderer
    this._renderer.dispose();
  }

  // -------------------------------------------------------------------------
  // Private helpers
  // -------------------------------------------------------------------------

  private _startRenderLoop(): void {
    const loop = () => {
      this._animationFrameId = requestAnimationFrame(loop);
      this._renderer.render(this._scene, this._camera);
    };
    loop();
  }

  // Expose internals for testing
  get renderer(): THREE.WebGLRenderer {
    return this._renderer;
  }

  get camera(): THREE.PerspectiveCamera {
    return this._camera;
  }

  get scene(): THREE.Scene {
    return this._scene;
  }
}
