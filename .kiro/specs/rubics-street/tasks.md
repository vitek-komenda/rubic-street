# Implementation Plan: Rubic's Street

## Overview

Build a Next.js (TypeScript, App Router) page that combines a static introductory section with an interactive Three.js 3D street scene. Implementation proceeds bottom-up: core geometry utilities first, then scene management, then React integration, then controls wiring.

## Tasks

- [x] 1. Project setup and core type definitions
  - Install and configure Vitest with `vitest-canvas-mock` (or `jest-canvas-mock`) and `@testing-library/react`
  - Install `fast-check` for property-based testing
  - Install `three` and `@types/three`
  - Create `lib/` directory with placeholder barrel exports
  - Define shared TypeScript interfaces: `SliderConfig`, `ControlsPanelProps`, `SceneManagerOptions`, `MirrorCubeConfig`, `BuildingOptions`, `PieceSize`
  - Add Google Fonts `<link>` for Caveat in `app/layout.tsx` (or `pages/_document.tsx`)
  - Configure global CSS custom properties (`--bg`, `--text`, `--accent`, `--canvas-bg`) and Caveat font-family fallback
  - _Requirements: 1.6, 1.7, 6.1, 6.2_

- [x] 2. Implement `MirrorCubeGeometry`
  - [x] 2.1 Implement `buildMirrorCubeGeometry` in `lib/MirrorCubeGeometry.ts`
    - Hardcode unsolved slice ratios for X, Y, Z axes (e.g. `[0.20, 0.45, 0.35]`, `[0.15, 0.55, 0.30]`, `[0.25, 0.40, 0.35]`)
    - For each of the 27 pieces `(i, j, k)`, compute interpolated slice widths via `lerp(unsolvedWidth, solvedWidth, t)`
    - Compute each piece's center position from cumulative slice sums, centered at origin
    - Create `THREE.BoxGeometry(w, h, d)` per piece, apply `Matrix4` translation, collect all 27
    - Merge with `BufferGeometryUtils.mergeGeometries` and return the single `BufferGeometry`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_

  - [x]* 2.2 Write property test: Mirror cube has exactly 27 pieces (Property 1)
    - **Property 1: Mirror Cube Geometry Piece Count**
    - **Validates: Requirements 4.2**
    - Use `fc.float({ min: 0, max: 1 })` as generator; assert vertex count equals 27 × single `BoxGeometry` vertex count
    - Tag: `// Feature: rubics-street, Property 1: Mirror Cube Geometry Piece Count`

  - [x]* 2.3 Write property test: Piece dimensions interpolate correctly (Property 2)
    - **Property 2: Piece Dimension Interpolation**
    - **Validates: Requirements 4.3, 4.4, 4.5**
    - Use `fc.float({ min: 0, max: 1 })` and `fc.integer({ min: 0, max: 2 })` generators; assert each axis slice equals `lerp(unsolved, solved, t)` within tolerance; assert `t=0` matches unsolved ratios and `t=1` produces uniform `totalSize/3`
    - Tag: `// Feature: rubics-street, Property 2: Piece Dimension Interpolation`

- [x] 3. Implement `BuildingFactory`
  - [x] 3.1 Implement `createBuilding` in `lib/BuildingFactory.ts`
    - Call `buildMirrorCubeGeometry({ solveProgress, totalSize })` to get geometry
    - Compute material color by lerping hex `#888888` → `#CCCCCC` by `solveProgress`
    - Create `THREE.MeshLambertMaterial` with the interpolated grayscale color
    - Return `new THREE.Mesh(geometry, material)`
    - _Requirements: 4.1, 4.2, 6.3, 6.4, 6.7_

  - [x]* 3.2 Write unit tests for `BuildingFactory`
    - Assert returned value is a `THREE.Mesh` with non-null geometry
    - Assert `solveProgress=0` material color matches `#888888`; `solveProgress=1` matches `#CCCCCC`
    - Assert material color at `solveProgress=0` differs from `solveProgress=1`
    - _Requirements: 4.1, 6.4_

- [x] 4. Implement `LightingManager`
  - [x] 4.1 Implement `LightingManager` class in `lib/LightingManager.ts`
    - Constructor accepts `THREE.Scene`; creates `AmbientLight('#FFFFFF', 0.4)` and `DirectionalLight('#FFFFFF', 0.8)`; adds both to scene
    - `setAzimuth(deg)` and `setElevation(deg)` update `DirectionalLight.position` using spherical-to-Cartesian: `x = cos(el) * sin(az)`, `y = sin(el)`, `z = cos(el) * cos(az)` (angles in radians)
    - _Requirements: 6.6, 9.9, 9.10_

  - [x]* 4.2 Write property test: Sun position matches azimuth and elevation (Property 10)
    - **Property 10: Sun Position Matches Azimuth and Elevation**
    - **Validates: Requirements 9.9, 9.10**
    - Use `fc.float({ min: 0, max: 360 })` and `fc.float({ min: 0, max: 90 })` generators; assert `DirectionalLight.position` matches spherical-to-Cartesian formula within floating-point tolerance
    - Tag: `// Feature: rubics-street, Property 10: Sun Position Matches Azimuth and Elevation`

  - [x]* 4.3 Write unit tests for `LightingManager`
    - Assert scene contains `AmbientLight` and `DirectionalLight` after construction
    - Assert both lights have positive intensity
    - _Requirements: 6.6_

- [x] 5. Implement `CameraController`
  - [x] 5.1 Implement `CameraController` class in `lib/CameraController.ts`
    - Constructor accepts `THREE.PerspectiveCamera` and `THREE.CatmullRomCurve3`
    - `setStreetPosition(t)`: set camera world position to `streetPath.getPoint(t)`
    - `setHRotation(deg)`: apply yaw offset around world Y axis from base street-tangent direction
    - `setVTilt(deg)`: apply pitch offset from base look direction
    - _Requirements: 9.4, 9.5, 9.7_

  - [x]* 5.2 Write property test: Camera position follows street path (Property 8)
    - **Property 8: Camera Position Follows Street Path**
    - **Validates: Requirements 9.4**
    - Use `fc.float({ min: 0, max: 1 })` generator; after `setStreetPosition(t)`, assert camera world position equals `streetPath.getPoint(t)` within tolerance
    - Tag: `// Feature: rubics-street, Property 8: Camera Position Follows Street Path`

  - [x]* 5.3 Write property test: Camera orientation matches slider values (Property 9)
    - **Property 9: Camera Orientation Matches Slider Values**
    - **Validates: Requirements 9.5, 9.7**
    - Use `fc.float({ min: 0, max: 360 })` and `fc.float({ min: -20, max: 60 })` generators; assert look direction corresponds to correct yaw and pitch within tolerance
    - Tag: `// Feature: rubics-street, Property 9: Camera Orientation Matches Slider Values`

- [x] 6. Implement `SceneBuilder` and street geometry
  - [x] 6.1 Implement street path and road mesh in `lib/SceneBuilder.ts`
    - Define `CatmullRomCurve3` with control points `(0,0,0)`, `(0,2,-20)`, `(0,5,-50)`
    - Create subdivided `PlaneGeometry` for road surface; displace vertices in Y to follow curve
    - Apply `MeshLambertMaterial({ color: '#444444' })` to road mesh
    - Export `streetPath` for use by `CameraController` and `BuildingFactory`
    - _Requirements: 3.1, 6.5, 7.2_

  - [x]* 6.2 Write property test: Street path rises monotonically (Property 7)
    - **Property 7: Street Path Rises Monotonically**
    - **Validates: Requirements 7.2**
    - Use pairs `fc.tuple(fc.float({ min: 0, max: 1 }), fc.float({ min: 0, max: 1 }))` filtered so `t1 < t2`; assert `streetPath.getPoint(t1).y <= streetPath.getPoint(t2).y`
    - Tag: `// Feature: rubics-street, Property 7: Street Path Rises Monotonically`

  - [x] 6.3 Place 12 buildings in `SceneBuilder`
    - Compute `buildingTs = [1/12, 3/12, 5/12, 7/12, 9/12, 11/12]`
    - For each `t` at index `i`, compute `solveProgress = i / 5`
    - Call `createBuilding({ solveProgress, side: 'left', index: i })` and `createBuilding({ solveProgress, side: 'right', index: i })`
    - Offset each building laterally (±X) from path center by `streetWidth / 2 + buildingOffset`
    - Add buildings to `BuildingGroup_Left` and `BuildingGroup_Right` `THREE.Group` objects
    - _Requirements: 3.2, 3.3, 5.1, 5.2, 5.3, 5.4, 5.5_

  - [x]* 6.4 Write property test: Even building spacing (Property 3)
    - **Property 3: Even Building Spacing**
    - **Validates: Requirements 3.3**
    - Build scene; extract world positions of all 6 buildings per side; assert consecutive distances are equal within tolerance
    - Tag: `// Feature: rubics-street, Property 3: Even Building Spacing`

  - [x]* 6.5 Write property test: Monotonically increasing solve progress (Property 4)
    - **Property 4: Monotonically Increasing Solve Progress**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4**
    - Build scene; extract `solveProgress` values for buildings index 0–5; assert strictly increasing sequence with `[0]=0.0` and `[5]=1.0`
    - Tag: `// Feature: rubics-street, Property 4: Monotonically Increasing Solve Progress`

  - [x]* 6.6 Write property test: Left-right solve progress symmetry (Property 5)
    - **Property 5: Left-Right Solve Progress Symmetry**
    - **Validates: Requirements 5.5**
    - Build scene; for each index `i`, assert `solveProgress` of left building equals `solveProgress` of right building
    - Tag: `// Feature: rubics-street, Property 5: Left-Right Solve Progress Symmetry`

- [x] 7. Checkpoint — core geometry and scene logic
  - Ensure all tests pass, ask the user if questions arise.

- [x] 8. Implement `ThreeSceneManager`
  - [x] 8.1 Implement `ThreeSceneManager` class in `lib/ThreeSceneManager.ts`
    - Constructor: create `WebGLRenderer`, `PerspectiveCamera` (FOV 60°), `Scene`; call `SceneBuilder` to populate scene; instantiate `LightingManager` and `CameraController`
    - Initialize camera at `streetPosition=0.0`, `hRotation` facing uphill, `vTilt=10°`
    - Attach `ResizeObserver` to canvas container; on resize call `renderer.setSize` and update `camera.aspect` + `updateProjectionMatrix()`
    - Start `requestAnimationFrame` render loop
    - Expose `setStreetPosition`, `setCameraHRotation`, `setCameraVTilt`, `setSunAzimuth`, `setSunElevation`, `handleResize`, `dispose`
    - `dispose()`: cancel animation frame, dispose all geometries and materials, disconnect `ResizeObserver`
    - _Requirements: 2.1, 2.2, 2.3, 7.1, 7.3, 9.4, 9.5, 9.7, 9.9, 9.10, 9.13_

  - [x]* 8.2 Write unit tests for `ThreeSceneManager`
    - Assert canvas element exists and renderer is `WebGLRenderer`
    - Assert camera is `PerspectiveCamera` with FOV between 45 and 75
    - Assert scene contains exactly 12 building meshes after initialization
    - Assert scene contains `AmbientLight` and `DirectionalLight`
    - Assert resize handler updates canvas size and camera aspect ratio
    - _Requirements: 2.1, 2.2, 2.3, 3.2, 6.6, 7.1, 7.3_

- [x] 9. Implement `ControlsPanel` React component
  - [x] 9.1 Implement `ControlsPanel` in `components/ControlsPanel.tsx`
    - Render exactly 5 `<input type="range">` sliders with adjacent `<label>` elements: Street Position (0–1, step 0.01, default 0.0), Camera H Rotation (0–360, step 1, default uphill-facing value), Camera V Tilt (−20–60, step 1, default 10), Sun Azimuth (0–360, step 1, default 135), Sun Elevation (0–90, step 1, default 45)
    - Wire each slider's `onChange` to the corresponding prop callback
    - Apply grayscale-only CSS (no hue) to all slider and label elements
    - _Requirements: 9.1, 9.2, 9.3, 9.6, 9.8, 9.11, 9.12, 9.13_

  - [x]* 9.2 Write unit tests for `ControlsPanel`
    - Assert component renders exactly 5 slider inputs
    - Assert each slider has an adjacent label element
    - Assert `onChange` on each slider calls the corresponding prop callback synchronously
    - Assert H rotation slider initializes at uphill-facing value; V tilt at 10°; sun elevation at 45°
    - _Requirements: 9.2, 9.6, 9.8, 9.11, 9.12, 9.13_

  - [ ]* 9.3 Write property test: All slider and control colors are grayscale (Property 6, controls portion)
    - **Property 6: Grayscale Invariant (controls)**
    - **Validates: Requirements 9.3, 6.1**
    - Render `ControlsPanel`; extract all computed CSS color values; assert R = G = B for each
    - Tag: `// Feature: rubics-street, Property 6: Grayscale Invariant`

- [x] 10. Implement `StreetScene` dynamic component
  - [x] 10.1 Implement `StreetScene` in `components/StreetScene.tsx`
    - Use `useRef` for canvas element; use `useRef` for `ThreeSceneManager` instance
    - In `useEffect`, wrap `ThreeSceneManager` construction in try/catch; on error set `webGLError` state to `true`
    - If `webGLError`, render fallback `<div>` with message: *"This experience requires a WebGL-capable browser. Please try Chrome, Firefox, Safari, or Edge."*
    - Render `<canvas>` filling the container and `<ControlsPanel>` as an overlay
    - Wire each `ControlsPanel` callback to the corresponding `ThreeSceneManager` setter
    - Return cleanup function from `useEffect` that calls `sceneManager.dispose()`
    - _Requirements: 2.1, 2.4, 9.1, 9.13_

  - [x]* 10.2 Write unit tests for `StreetScene`
    - Assert canvas element is present in the DOM after mount
    - Assert `ControlsPanel` is rendered within `StreetScene`, not outside it
    - Assert WebGL error state renders the fallback message
    - _Requirements: 2.1, 2.4, 9.1_

- [x] 11. Implement `IntroSection` React component
  - [x] 11.1 Implement `IntroSection` in `components/IntroSection.tsx`
    - Render title "Rubic's Street Idea" with `font-family: 'Caveat', cursive`
    - Render subtitle "by Vit Komenda" at a visually smaller font size
    - Render `<img>` for `Sketch_Image` with a descriptive non-empty `alt` attribute; add `onError` handler to swap in a styled placeholder `<div>`
    - Render intro paragraph covering: Erno Rubik as Hungarian architect/professor; invention of Rubik's Cube in 1974 as teaching tool; best-selling toy; Mirror Cube variant; duality inspiring Rubic's Street
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 1.8_

  - [x]* 11.2 Write unit tests for `IntroSection`
    - Assert title text is "Rubic's Street Idea" with Caveat font-family
    - Assert subtitle text is "by Vit Komenda" with smaller font size than title
    - Assert sketch image element is present with non-empty `alt`
    - Assert intro paragraph contains key phrases about Erno Rubik
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.8_

- [x] 12. Assemble page and wire everything together
  - [x] 12.1 Implement `components/SceneSection.tsx`
    - `position: relative` container; dynamically import `StreetScene` with `next/dynamic` and `{ ssr: false }`
    - _Requirements: 2.1, 8.1_

  - [x] 12.2 Implement `app/page.tsx` (or `pages/index.tsx`)
    - Render `<IntroSection />` first, then `<SceneSection />` below it
    - Ensure `IntroSection` appears above `SceneSection` in DOM order
    - _Requirements: 1.1, 2.1_

  - [x]* 12.3 Write smoke tests
    - Assert `IntroSection` renders before `SceneSection` in DOM
    - Assert document `<head>` contains Google Fonts link for Caveat
    - Assert `ControlsPanel` is present in `SceneSection`, not in `IntroSection`
    - Assert Next.js build succeeds with no server-side Three.js import errors
    - _Requirements: 1.1, 1.6, 8.1, 9.1_

- [x] 13. Final checkpoint — full integration
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for a faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at logical boundaries
- Property tests validate universal correctness invariants (Properties 1–10 from design)
- Unit tests validate specific examples and edge cases
- The unsolved slice ratios are deterministic/hardcoded — every user sees the same buildings
- Three.js is never imported at the module level in SSR-executed code; always behind `useEffect` or `next/dynamic` with `ssr: false`
