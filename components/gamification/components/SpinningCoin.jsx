/**
 * SpinningCoin — pure display primitive.
 * Renders a single SVG coin with CSS 3D spin animation.
 */

import React from 'react';

// Unique gradient IDs per size to avoid SVG defs collision
const gradientId = (size) => `coin-grad-${size}`;

export function SpinningCoin({ size = 26, delay = 0, dim = false }) {
  const gId = gradientId(size);

  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        animation: `coinSpin 1.4s linear ${delay}s infinite`,
        opacity: dim ? 0.22 : 1,
        filter: dim
          ? 'grayscale(0.9)'
          : 'drop-shadow(0 0 5px rgba(255,210,0,0.85))',
        willChange: 'transform',
      }}
    >
      <svg viewBox="0 0 28 28" width={size} height={size}>
        <defs>
          <radialGradient id={gId} cx="38%" cy="32%" r="65%">
            <stop offset="0%"   stopColor="#ffe566" />
            <stop offset="55%"  stopColor="#f5a800" />
            <stop offset="100%" stopColor="#b86000" />
          </radialGradient>
        </defs>
        <ellipse cx="14" cy="14" rx="13" ry="13" fill={`url(#${gId})`} />
        <ellipse
          cx="14" cy="14" rx="9" ry="9"
          fill="none" stroke="#ffe566" strokeWidth="1.2" opacity="0.6"
        />
        <text
          x="14" y="18.5"
          textAnchor="middle"
          fontSize="10"
          fill="#7a3d00"
          fontWeight="bold"
          fontFamily="serif"
        >
          $
        </text>
      </svg>
    </div>
  );
}
