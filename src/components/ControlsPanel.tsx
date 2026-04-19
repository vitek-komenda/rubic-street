'use client';

import React from 'react';
import type { ControlsPanelProps } from '../types';

interface SliderRowProps {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  onChange: (value: number) => void;
}

function SliderRow({ id, label, min, max, step, defaultValue, onChange }: SliderRowProps) {
  return (
    <div style={styles.row}>
      <label htmlFor={id} style={styles.label}>
        {label}
      </label>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={styles.slider}
      />
    </div>
  );
}

export function ControlsPanel({
  onStreetPositionChange,
  onCameraHRotationChange,
  onCameraVTiltChange,
  onSunAzimuthChange,
  onSunElevationChange,
}: ControlsPanelProps) {
  return (
    <div style={styles.panel} aria-label="Scene controls">
      <SliderRow
        id="street-position"
        label="Street Position"
        min={0}
        max={1}
        step={0.01}
        defaultValue={0}
        onChange={onStreetPositionChange}
      />
      <SliderRow
        id="camera-h-rotation"
        label="Camera H Rotation"
        min={0}
        max={360}
        step={1}
        defaultValue={0}
        onChange={onCameraHRotationChange}
      />
      <SliderRow
        id="camera-v-tilt"
        label="Camera V Tilt"
        min={-20}
        max={60}
        step={1}
        defaultValue={10}
        onChange={onCameraVTiltChange}
      />
      <SliderRow
        id="sun-azimuth"
        label="Sun Azimuth"
        min={0}
        max={360}
        step={1}
        defaultValue={135}
        onChange={onSunAzimuthChange}
      />
      <SliderRow
        id="sun-elevation"
        label="Sun Elevation"
        min={0}
        max={90}
        step={1}
        defaultValue={45}
        onChange={onSunElevationChange}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  panel: {
    position: 'absolute',
    bottom: '1.5rem',
    left: '1.5rem',
    backgroundColor: 'var(--bg, #F5F5F5)',
    color: 'var(--text, #111111)',
    border: '1px solid var(--accent, #555555)',
    borderRadius: '6px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minWidth: '220px',
    zIndex: 10,
    opacity: 0.92,
  },
  row: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  label: {
    fontSize: '0.75rem',
    color: 'var(--text, #111111)',
    fontFamily: 'sans-serif',
    letterSpacing: '0.03em',
  },
  slider: {
    width: '100%',
    accentColor: 'var(--accent, #555555)',
    cursor: 'pointer',
  },
};

export default ControlsPanel;
