import React from 'react';
export function CoinBar({ totalCoins, multiplier }) {
  return (
    <div style={{ padding: '10px', background: 'rgba(255, 215, 0, 0.2)', borderTop: '1px solid var(--border)', textAlign: 'center', color: 'var(--text)' }}>
      Coins: {totalCoins} 🪙 (x{multiplier} multiplier)
    </div>
  );
}
