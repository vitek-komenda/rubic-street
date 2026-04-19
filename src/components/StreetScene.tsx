'use client';

import React, { useRef, useEffect, useState } from 'react';
import { ControlsPanel } from './ControlsPanel';
import type { ThreeSceneManager } from '../lib/ThreeSceneManager';

const FALLBACK_MESSAGE =
  'This experience requires a WebGL-capable browser. Please try Chrome, Firefox, Safari, or Edge.';

export function StreetScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneManagerRef = useRef<ThreeSceneManager | null>(null);
  const [webGLError, setWebGLError] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    let manager: ThreeSceneManager | null = null;

    try {
      // Dynamic import to keep Three.js out of SSR bundle
      import('../lib/ThreeSceneManager').then(({ ThreeSceneManager }) => {
        try {
          manager = new ThreeSceneManager({ canvas: canvasRef.current! });
          sceneManagerRef.current = manager;
        } catch {
          setWebGLError(true);
        }
      });
    } catch {
      setWebGLError(true);
    }

    return () => {
      sceneManagerRef.current?.dispose();
      sceneManagerRef.current = null;
    };
  }, []);

  if (webGLError) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100vh',
          backgroundColor: 'var(--bg, #F5F5F5)',
          color: 'var(--text, #111111)',
          fontFamily: 'sans-serif',
          padding: '2rem',
          textAlign: 'center',
        }}
        role="alert"
      >
        {FALLBACK_MESSAGE}
      </div>
    );
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        backgroundColor: 'var(--canvas-bg, #E8E8E8)',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-label="Rubic's Street 3D scene"
      />
      <ControlsPanel
        onStreetPositionChange={(v) => sceneManagerRef.current?.setStreetPosition(v)}
        onCameraHRotationChange={(v) => sceneManagerRef.current?.setCameraHRotation(v)}
        onCameraVTiltChange={(v) => sceneManagerRef.current?.setCameraVTilt(v)}
        onSunAzimuthChange={(v) => sceneManagerRef.current?.setSunAzimuth(v)}
        onSunElevationChange={(v) => sceneManagerRef.current?.setSunElevation(v)}
      />
    </div>
  );
}

export default StreetScene;
