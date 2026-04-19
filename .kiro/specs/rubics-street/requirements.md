# Requirements Document

## Introduction

Rubic's Street is an interactive 3D website built with Next.js and Three.js, deployed on Vercel. The page opens with an introductory section dedicated to Erno Rubik, the inventor of the Rubik's Cube, featuring a handwritten-style title, a sketch/paper drawing image, and a short biographical text. Below the introduction, the main experience presents a street viewed in perspective, lined on both sides with buildings shaped like mirror cubes (the Rubik's Cube variant where pieces have non-uniform sizes). The street runs uphill, and the buildings along it tell a visual story: at the bottom of the street, buildings resemble unsolved mirror cubes — irregular, complex, asymmetric shapes. As the viewer looks uphill, the buildings progressively become more "solved," transitioning toward simple, uniform, symmetric cube shapes at the top. Approximately 6 buildings line each side of the street, creating a gradient from complexity to simplicity.

### Page Layout (top to bottom)

1. Title: "Rubic's Street Idea" — handwritten font
2. Subtitle: "by Vit Komenda" — small font
3. Sketch/paper drawing image (placeholder PNG until final asset is provided)
4. Introduction text dedicated to Erno Rubik
5. 3D visualization — the Three.js street scene

## Glossary

- **Website**: The Next.js web application deployed on Vercel.
- **Intro_Section**: The introductory section at the top of the page, containing the title, subtitle, sketch image, and Erno Rubik introduction text.
- **Handwritten_Font**: The "Caveat" typeface loaded from Google Fonts CDN, used for the page title to produce a handwritten appearance.
- **Google_Fonts_CDN**: The Google Fonts content delivery network, used to load web fonts via a `<link>` element in the page `<head>`.
- **Sketch_Image**: A placeholder PNG image representing a paper/sketch drawing, displayed in the Intro_Section.
- **Scene**: The Three.js 3D environment rendered in the browser.
- **Street**: The central perspective corridor flanked by buildings on both sides.
- **Building**: A 3D structure shaped like a mirror cube, placed along the Street.
- **Mirror_Cube**: A Rubik's Cube variant where each piece has a distinct, non-uniform size, making an unsolved state visually irregular and asymmetric, while a solved state forms a perfect rectangular prism.
- **E_Ink_Aesthetic**: A visual style that evokes an e-ink display: grayscale-only palette, high contrast, slightly cool/neutral tones, minimal gradients, near-white or light-gray background, and near-black text.
- **Grayscale_Palette**: A color scheme restricted to shades of gray (no hue), ranging from near-white (#F5F5F5 or equivalent) to near-black (#111111 or equivalent).
- **Solved_State**: A Mirror_Cube configuration where all pieces are aligned, producing a uniform rectangular prism shape.
- **Unsolved_State**: A Mirror_Cube configuration where pieces are rotated out of alignment, producing an irregular, asymmetric shape.
- **Solve_Progress**: A value from 0.0 (fully unsolved) to 1.0 (fully solved) representing how close a Building's shape is to a Solved_State.
- **Uphill_Direction**: The direction along the Street toward the top, where buildings have higher Solve_Progress values.
- **Downhill_Direction**: The direction along the Street toward the bottom, where buildings have lower Solve_Progress values.
- **Renderer**: The Three.js WebGL renderer responsible for drawing the Scene.
- **Camera**: The Three.js perspective camera through which the user views the Scene.
- **Controls_Panel**: The overlay UI panel containing all interactive sliders for scene control, rendered within or adjacent to the 3D visualization section.
- **Camera_Position**: A normalized value from 0.0 to 1.0 representing the Camera's location along the Street, where 0.0 is the Downhill_Direction end and 1.0 is the Uphill_Direction end.
- **Camera_H_Rotation**: The horizontal rotation angle of the Camera around the vertical axis, measured in degrees from 0° to 360°.
- **Camera_V_Tilt**: The vertical tilt angle of the Camera above or below the horizon, measured in degrees, where positive values tilt upward and negative values tilt downward.
- **Sun_Azimuth**: The horizontal angle of the directional light (sun) around the Scene, measured in degrees from 0° to 360°, determining the direction shadows fall.
- **Sun_Elevation**: The vertical angle of the directional light (sun) above the horizon, measured in degrees from 0° (horizon) to 90° (zenith).

## Requirements

### Requirement 1: Introductory Section

**User Story:** As a visitor, I want to see a dedicated introduction at the top of the page, so that I understand the inspiration behind Rubic's Street before experiencing the 3D scene.

#### Acceptance Criteria

1. THE Website SHALL render an Intro_Section as the first visible content on the page, above the 3D visualization.
2. THE Intro_Section SHALL display the text "Rubic's Street Idea" as the page title, rendered in a Handwritten_Font.
3. THE Intro_Section SHALL display the text "by Vit Komenda" directly below the title, in a font size visually smaller than the title.
4. THE Intro_Section SHALL display a Sketch_Image below the subtitle, using a placeholder PNG until the final asset is provided by the author.
5. THE Intro_Section SHALL display a paragraph of introduction text about Erno Rubik below the Sketch_Image, covering the following topics in 4–5 sentences: Erno Rubik as a Hungarian architect and professor; the invention of the Rubik's Cube in 1974 as a teaching tool; the Rubik's Cube becoming one of the best-selling toys in history; the Mirror_Cube as a variant where pieces have non-uniform sizes so an unsolved state is an irregular sculpture and a solved state is a perfect rectangular prism; and how this duality of order and chaos inspired Rubic's Street.
6. THE Website SHALL load the Handwritten_Font ("Caveat") from the Google_Fonts_CDN via a `<link>` element in the page `<head>`, so that it renders consistently across all supported browsers.
7. IF the Handwritten_Font fails to load, THEN THE Website SHALL fall back to a cursive system font for the title.
8. IF the Sketch_Image fails to load, THEN THE Website SHALL display an accessible alternative text description in place of the image.

---

### Requirement 2: Scene Rendering

**User Story:** As a visitor, I want to see a 3D street rendered in my browser, so that I can experience the Rubic's Street visual concept.

#### Acceptance Criteria

1. THE Website SHALL render a three-dimensional Scene using Three.js within a full-viewport canvas element.
2. THE Renderer SHALL use WebGL to display the Scene at the browser window's native resolution.
3. WHEN the browser window is resized, THE Renderer SHALL update the canvas dimensions and Camera aspect ratio to match the new viewport size.
4. IF the user's browser does not support WebGL, THEN THE Website SHALL display a fallback message informing the user that a WebGL-capable browser is required.

---

### Requirement 3: Street Layout

**User Story:** As a visitor, I want to see a street with buildings on both sides, so that I can perceive the spatial layout of the scene.

#### Acceptance Criteria

1. THE Scene SHALL contain a Street composed of a road surface extending from the foreground (Downhill_Direction) to the background (Uphill_Direction).
2. THE Scene SHALL place exactly 6 Buildings on the left side of the Street and exactly 6 Buildings on the right side of the Street.
3. THE Scene SHALL position Buildings at evenly spaced intervals along the length of the Street on each side.
4. THE Camera SHALL be positioned at street level at the Downhill_Direction end of the Street, oriented toward the Uphill_Direction, to create a perspective view of the scene.

---

### Requirement 4: Mirror Cube Building Shapes

**User Story:** As a visitor, I want each building to look like a mirror cube, so that the architectural concept is visually communicated.

#### Acceptance Criteria

1. THE Scene SHALL render each Building as a 3D mesh whose geometry is derived from a Mirror_Cube structure.
2. THE Scene SHALL represent each Building's geometry using a 3×3×3 grid of cuboid pieces, where each piece has distinct, non-uniform dimensions consistent with the Mirror_Cube design.
3. WHEN a Building has a Solve_Progress of 1.0, THE Scene SHALL render that Building as a uniform rectangular prism (Solved_State).
4. WHEN a Building has a Solve_Progress of 0.0, THE Scene SHALL render that Building with maximally irregular, asymmetric geometry (Unsolved_State).
5. WHEN a Building has a Solve_Progress between 0.0 and 1.0, THE Scene SHALL render that Building with geometry interpolated between the Unsolved_State and Solved_State proportionally to the Solve_Progress value.

---

### Requirement 5: Progressive Solve Gradient Along the Street

**User Story:** As a visitor, I want buildings to become progressively more "solved" as I look uphill, so that the street tells a visual story of order emerging from chaos.

#### Acceptance Criteria

1. THE Scene SHALL assign each Building a Solve_Progress value based on its position along the Street, where buildings closer to the Uphill_Direction end receive higher Solve_Progress values.
2. THE Scene SHALL assign the Building at the furthest Downhill_Direction position a Solve_Progress of 0.0.
3. THE Scene SHALL assign the Building at the furthest Uphill_Direction position a Solve_Progress of 1.0.
4. THE Scene SHALL distribute Solve_Progress values across the 6 Buildings on each side of the Street in a monotonically increasing sequence from Downhill_Direction to Uphill_Direction.
5. THE Scene SHALL apply the same Solve_Progress distribution symmetrically to both the left and right sides of the Street, so that opposing Buildings share the same Solve_Progress value.

---

### Requirement 6: Visual Style and Materials

**User Story:** As a visitor, I want the buildings and street to have a coherent visual style, so that the scene feels like a unified artistic work.

#### Acceptance Criteria

1. THE Website SHALL apply the E_Ink_Aesthetic throughout all page elements, using only the Grayscale_Palette with no color (hue) anywhere on the page.
2. THE Website SHALL render the page background in near-white or light gray (no darker than #DDDDDD), and all body text in near-black (no lighter than #222222).
3. THE Scene SHALL apply grayscale-only materials to all Building meshes, road surface, and any other geometry — no colored materials shall be used in the 3D scene.
4. THE Scene SHALL apply a consistent material style to all Building meshes that visually distinguishes the irregular faces of unsolved geometry from the flat faces of solved geometry through grayscale shading contrast alone.
5. THE Scene SHALL render the road surface of the Street with a grayscale material visually distinct from the Building materials.
6. THE Scene SHALL include ambient and directional lighting configured to maximize the legibility of three-dimensional geometry through grayscale shading, ensuring depth and surface detail are clearly readable without color cues.
7. WHERE a Building is in Solved_State, THE Scene SHALL render that Building with a visually simpler, more uniform grayscale appearance compared to Buildings in Unsolved_State.

---

### Requirement 7: Uphill Perspective

**User Story:** As a visitor, I want the street to appear to recede uphill into the distance, so that the spatial gradient from complex to simple is immediately readable.

#### Acceptance Criteria

1. THE Camera SHALL use a perspective projection with a field of view between 45 and 75 degrees to produce natural depth perception.
2. THE Scene SHALL position the Street geometry so that it rises in elevation from the Camera position toward the Uphill_Direction end, creating a visible uphill slope.
3. THE Scene SHALL scale or position Buildings so that buildings farther from the Camera appear smaller, reinforcing the perspective depth cue.

---

### Requirement 8: Performance and Deployment

**User Story:** As a visitor, I want the website to load and run smoothly, so that I can enjoy the experience without technical interruptions.

#### Acceptance Criteria

1. THE Website SHALL be deployable as a Next.js application on the Vercel platform without additional server-side infrastructure.

2. THE Renderer SHALL target a minimum of 30 frames per second on a device with a mid-range GPU when rendering the full Scene.
3. WHEN the Scene is first loaded, THE Website SHALL display the rendered Scene within 5 seconds on a broadband connection.
4. THE Website SHALL serve all static 3D assets and scripts in a format compatible with modern evergreen browsers (Chrome, Firefox, Safari, Edge).

---

### Requirement 9: Interactive Scene Controls

**User Story:** As a visitor, I want to adjust the camera position, camera orientation, and sun lighting via sliders, so that I can explore the street scene from different viewpoints and lighting conditions.

#### Acceptance Criteria

1. THE Website SHALL render a Controls_Panel as an overlay or panel within or directly adjacent to the 3D visualization section, not within the Intro_Section.
2. THE Controls_Panel SHALL contain exactly 5 labeled sliders: Street Position, Camera Horizontal Rotation, Camera Vertical Tilt, Sun Horizontal (Azimuth), and Sun Vertical (Elevation).
3. THE Controls_Panel SHALL apply the E_Ink_Aesthetic to all slider elements, using only the Grayscale_Palette with no color (hue).
4. WHEN the Street Position slider is adjusted, THE Scene SHALL move the Camera along the Street between Camera_Position 0.0 (Downhill_Direction end) and Camera_Position 1.0 (Uphill_Direction end) in real time, with no submit action required.
5. WHEN the Camera Horizontal Rotation slider is adjusted, THE Scene SHALL rotate the Camera around the vertical axis across the full Camera_H_Rotation range of 0° to 360° in real time.
6. THE Controls_Panel SHALL initialize the Camera Horizontal Rotation slider at the value corresponding to the Camera facing the Uphill_Direction.
7. WHEN the Camera Vertical Tilt slider is adjusted, THE Scene SHALL tilt the Camera between Camera_V_Tilt −20° (slightly below horizon) and +60° (well above horizon) in real time.
8. THE Controls_Panel SHALL initialize the Camera Vertical Tilt slider at Camera_V_Tilt 10° (slightly upward, natural street-level view).
9. WHEN the Sun Horizontal (Azimuth) slider is adjusted, THE Scene SHALL rotate the directional light to the corresponding Sun_Azimuth between 0° and 360° in real time, updating shadow directions accordingly.
10. WHEN the Sun Vertical (Elevation) slider is adjusted, THE Scene SHALL set the directional light to the corresponding Sun_Elevation between 0° (horizon) and 90° (zenith) in real time.
11. THE Controls_Panel SHALL initialize the Sun Vertical (Elevation) slider at Sun_Elevation 45°.
12. THE Controls_Panel SHALL display a visible text label identifying each slider's purpose directly adjacent to the slider control.
13. WHEN any slider value changes, THE Scene SHALL update the corresponding scene property within the same rendered frame, with no perceptible lag between slider movement and scene response.
