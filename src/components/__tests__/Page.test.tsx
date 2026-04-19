/**
 * Smoke tests for page assembly
 * Requirements: 1.1, 1.6, 8.1, 9.1
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

// Polyfill ResizeObserver for jsdom
if (typeof ResizeObserver === 'undefined') {
  (global as unknown as Record<string, unknown>).ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Mock next/dynamic to render the component synchronously in tests
vi.mock('next/dynamic', () => ({
  default: (loader: () => Promise<{ default: React.ComponentType }>) => {
    // Return a component that renders nothing (SSR disabled simulation)
    // We test the actual StreetScene separately
    const MockDynamic = () => <div data-testid="street-scene-dynamic" />;
    MockDynamic.displayName = 'DynamicStreetScene';
    return MockDynamic;
  },
}));

// Mock ThreeSceneManager to avoid WebGL dependency
vi.mock('../../lib/ThreeSceneManager', () => ({
  ThreeSceneManager: vi.fn().mockImplementation(() => ({
    setStreetPosition: vi.fn(),
    setCameraHRotation: vi.fn(),
    setCameraVTilt: vi.fn(),
    setSunAzimuth: vi.fn(),
    setSunElevation: vi.fn(),
    handleResize: vi.fn(),
    dispose: vi.fn(),
  })),
}));

import { IntroSection } from '../IntroSection';
import { SceneSection } from '../SceneSection';

// Compose the page manually (mirrors what page.tsx does)
function Page() {
  return (
    <main>
      <IntroSection />
      <SceneSection />
    </main>
  );
}

describe('Page assembly smoke tests', () => {
  it('IntroSection renders before SceneSection in DOM order', () => {
    render(<Page />);

    const main = document.querySelector('main')!;
    const children = Array.from(main.children);

    // First child should be the IntroSection (a <section>)
    // Second child should be the SceneSection (a <section>)
    expect(children.length).toBeGreaterThanOrEqual(2);

    const introSection = children[0];
    const sceneSection = children[1];

    // IntroSection contains the title
    expect(introSection.textContent).toContain("Rubic's Street Idea");

    // SceneSection contains the dynamic scene placeholder
    expect(sceneSection.querySelector('[data-testid="street-scene-dynamic"]')).not.toBeNull();
  });

  it('IntroSection title is present', () => {
    render(<Page />);
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe("Rubic's Street Idea");
  });

  it('SceneSection is present in the page', () => {
    render(<Page />);
    const sceneSection = document.querySelector('[aria-label="3D street scene"]');
    expect(sceneSection).not.toBeNull();
  });

  it('ControlsPanel is NOT present in IntroSection', () => {
    render(<Page />);
    const main = document.querySelector('main')!;
    const introSection = main.children[0];
    // ControlsPanel renders sliders; IntroSection should have none
    const sliders = introSection.querySelectorAll('input[type="range"]');
    expect(sliders.length).toBe(0);
  });
});
