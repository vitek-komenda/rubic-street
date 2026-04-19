import React from 'react';
import { IntroSection } from '../components/IntroSection';
import { SceneSection } from '../components/SceneSection';

export default function Home() {
  return (
    <main
      style={{
        backgroundColor: 'var(--bg, #F5F5F5)',
        color: 'var(--text, #111111)',
        minHeight: '100vh',
      }}
    >
      <IntroSection />
      <SceneSection />
    </main>
  );
}
