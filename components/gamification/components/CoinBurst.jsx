import React from 'react';
export function CoinBurst({ coins, visible }) {
  if (!visible) return null;
  return (
    <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '32px', zIndex: 2000, pointerEvents: 'none' }}>
      +{coins} 🪙
    </div>
  );
}
