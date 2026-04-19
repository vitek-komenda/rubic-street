'use client';

import React, { useState } from 'react';

const INTRO_TEXT =
  'Erno Rubik, a Hungarian architect and professor, invented the Rubik\u2019s Cube in 1974 as a ' +
  'teaching tool to help his students understand three-dimensional space. What began as a ' +
  'structural puzzle became one of the best-selling toys in history, with over 450 million ' +
  'cubes sold worldwide. The mirror cube is a fascinating variant \u2014 instead of colored ' +
  'stickers, each piece has a unique size, so an unsolved cube becomes a chaotic, irregular ' +
  'sculpture, while a solved cube snaps back into a perfect rectangular prism. This duality ' +
  'of order and chaos inspired Rubic\u2019s Street: a city where buildings are mirror cubes, ' +
  'and the street itself tells the story of solving.';

export function IntroSection() {
  const [imgError, setImgError] = useState(false);

  return (
    <section
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '3rem 1.5rem',
        maxWidth: '600px',
        margin: '0 auto',
        color: 'var(--text, #111111)',
        fontFamily: 'sans-serif',
      }}
    >
      <h1
        className="title"
        style={{
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '0.5rem',
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        Rubic&apos;s Street Idea
      </h1>

      <p
        style={{
          fontSize: '1rem',
          marginBottom: '2rem',
          color: 'var(--accent, #555555)',
          textAlign: 'center',
        }}
      >
        by Vit Komenda
      </p>

      {imgError ? (
        <div
          aria-label="A paper sketch drawing of the Rubic's Street concept"
          role="img"
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '280px',
            backgroundColor: '#CCCCCC',
            borderRadius: '4px',
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#555555',
            fontSize: '0.875rem',
            fontFamily: 'sans-serif',
          }}
        >
          Sketch placeholder
        </div>
      ) : (
        <img
          src="/sketch-placeholder.png"
          alt="A paper sketch drawing of the Rubic's Street concept"
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: 'auto',
            marginBottom: '2rem',
            borderRadius: '4px',
            filter: 'grayscale(100%)',
          }}
        />
      )}

      <p
        style={{
          fontSize: '1rem',
          lineHeight: 1.7,
          textAlign: 'left',
          color: 'var(--text, #111111)',
        }}
      >
        {INTRO_TEXT}
      </p>
    </section>
  );
}

export default IntroSection;
