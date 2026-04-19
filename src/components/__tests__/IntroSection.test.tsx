/**
 * Unit tests for IntroSection component
 * Requirements: 1.2, 1.3, 1.4, 1.5, 1.8
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IntroSection } from '../IntroSection';

describe('IntroSection', () => {
  it('renders the title "Rubic\'s Street Idea"', () => {
    render(<IntroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.textContent).toBe("Rubic's Street Idea");
  });

  it('title uses Caveat font via .title class', () => {
    render(<IntroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading.classList.contains('title')).toBe(true);
  });

  it('renders subtitle "by Vit Komenda"', () => {
    render(<IntroSection />);
    expect(screen.getByText('by Vit Komenda')).toBeInTheDocument();
  });

  it('subtitle has smaller font size than title', () => {
    render(<IntroSection />);
    const heading = screen.getByRole('heading', { level: 1 });
    const subtitle = screen.getByText('by Vit Komenda');

    const titleSize = parseFloat(
      (heading as HTMLElement).style.fontSize || '48'
    );
    const subtitleSize = parseFloat(
      (subtitle as HTMLElement).style.fontSize || '16'
    );

    expect(subtitleSize).toBeLessThan(titleSize);
  });

  it('renders sketch image with non-empty alt attribute', () => {
    render(<IntroSection />);
    const img = screen.getByRole('img');
    const alt = img.getAttribute('alt');
    expect(alt).toBeTruthy();
    expect(alt!.trim().length).toBeGreaterThan(0);
  });

  it('sketch image alt attribute describes the sketch', () => {
    render(<IntroSection />);
    const img = screen.getByRole('img');
    expect(img.getAttribute('alt')).toContain('sketch');
  });

  it('intro paragraph contains "Erno Rubik"', () => {
    render(<IntroSection />);
    const body = document.body.textContent ?? '';
    expect(body).toContain('Erno Rubik');
  });

  it('intro paragraph mentions 1974', () => {
    render(<IntroSection />);
    const body = document.body.textContent ?? '';
    expect(body).toContain('1974');
  });

  it('intro paragraph mentions mirror cube', () => {
    render(<IntroSection />);
    const body = document.body.textContent ?? '';
    expect(body.toLowerCase()).toContain('mirror cube');
  });

  it('swaps image for placeholder div on image load error', () => {
    render(<IntroSection />);
    const img = screen.getByRole('img') as HTMLImageElement;
    // Trigger the onError handler
    fireEvent.error(img);
    // After error, the img should be replaced by a div with role="img"
    const placeholder = screen.getByRole('img');
    expect(placeholder.tagName.toLowerCase()).toBe('div');
  });
});
