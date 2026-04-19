/**
 * Unit tests for ControlsPanel component
 * Requirements: 9.2, 9.6, 9.8, 9.11, 9.12, 9.13
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ControlsPanel } from '../ControlsPanel';
import type { ControlsPanelProps } from '../../types';

function makeProps(overrides: Partial<ControlsPanelProps> = {}): ControlsPanelProps {
  return {
    onStreetPositionChange: vi.fn(),
    onCameraHRotationChange: vi.fn(),
    onCameraVTiltChange: vi.fn(),
    onSunAzimuthChange: vi.fn(),
    onSunElevationChange: vi.fn(),
    ...overrides,
  };
}

describe('ControlsPanel', () => {
  it('renders exactly 5 slider inputs', () => {
    render(<ControlsPanel {...makeProps()} />);
    const sliders = screen.getAllByRole('slider');
    expect(sliders).toHaveLength(5);
  });

  it('each slider has an adjacent label element', () => {
    render(<ControlsPanel {...makeProps()} />);
    const labels = screen.getAllByRole('slider').map((slider) => {
      const id = slider.getAttribute('id');
      return document.querySelector(`label[for="${id}"]`);
    });
    labels.forEach((label) => {
      expect(label).not.toBeNull();
      expect(label?.textContent?.trim().length).toBeGreaterThan(0);
    });
  });

  it('Street Position slider has correct range and default', () => {
    render(<ControlsPanel {...makeProps()} />);
    const slider = document.getElementById('street-position') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(slider.min).toBe('0');
    expect(slider.max).toBe('1');
    expect(slider.step).toBe('0.01');
    expect(parseFloat(slider.defaultValue)).toBe(0);
  });

  it('Camera H Rotation slider initializes at 0', () => {
    render(<ControlsPanel {...makeProps()} />);
    const slider = document.getElementById('camera-h-rotation') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(parseFloat(slider.defaultValue)).toBe(0);
  });

  it('Camera V Tilt slider initializes at 10°', () => {
    render(<ControlsPanel {...makeProps()} />);
    const slider = document.getElementById('camera-v-tilt') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(parseFloat(slider.defaultValue)).toBe(10);
  });

  it('Sun Elevation slider initializes at 45°', () => {
    render(<ControlsPanel {...makeProps()} />);
    const slider = document.getElementById('sun-elevation') as HTMLInputElement;
    expect(slider).not.toBeNull();
    expect(parseFloat(slider.defaultValue)).toBe(45);
  });

  it('onChange on Street Position slider calls onStreetPositionChange', () => {
    const props = makeProps();
    render(<ControlsPanel {...props} />);
    const slider = document.getElementById('street-position') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '0.5' } });
    expect(props.onStreetPositionChange).toHaveBeenCalledWith(0.5);
  });

  it('onChange on Camera H Rotation slider calls onCameraHRotationChange', () => {
    const props = makeProps();
    render(<ControlsPanel {...props} />);
    const slider = document.getElementById('camera-h-rotation') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '180' } });
    expect(props.onCameraHRotationChange).toHaveBeenCalledWith(180);
  });

  it('onChange on Camera V Tilt slider calls onCameraVTiltChange', () => {
    const props = makeProps();
    render(<ControlsPanel {...props} />);
    const slider = document.getElementById('camera-v-tilt') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '30' } });
    expect(props.onCameraVTiltChange).toHaveBeenCalledWith(30);
  });

  it('onChange on Sun Azimuth slider calls onSunAzimuthChange', () => {
    const props = makeProps();
    render(<ControlsPanel {...props} />);
    const slider = document.getElementById('sun-azimuth') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '270' } });
    expect(props.onSunAzimuthChange).toHaveBeenCalledWith(270);
  });

  it('onChange on Sun Elevation slider calls onSunElevationChange', () => {
    const props = makeProps();
    render(<ControlsPanel {...props} />);
    const slider = document.getElementById('sun-elevation') as HTMLInputElement;
    fireEvent.change(slider, { target: { value: '60' } });
    expect(props.onSunElevationChange).toHaveBeenCalledWith(60);
  });
});
