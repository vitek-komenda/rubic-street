import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import StreetScene with SSR disabled to prevent
// Three.js from running during server-side rendering.
const StreetScene = dynamic(() => import('./StreetScene'), { ssr: false });

export function SceneSection() {
  return (
    <section aria-label="3D street scene">
      <StreetScene />
    </section>
  );
}

export default SceneSection;
