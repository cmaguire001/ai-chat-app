import React from 'react';
import { THEMES } from './gamification/constants/gamification';

export default function ThemeSelector({ theme, setTheme, totalMessages = 0 }) {
  const isUnlocked = (t) => !t.locked || totalMessages >= t.unlockMessages;
  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
      {THEMES.map((t) => {
        const unlocked = isUnlocked(t);
        return (
          <button
            key={t.id}
            onClick={() => unlocked && setTheme(t.id)}
            style={{
              opacity: unlocked ? 1 : 0.5,
              cursor: unlocked ? 'pointer' : 'not-allowed',
              background: theme === t.id ? 'var(--accent)' : 'var(--surface2)',
              color: theme === t.id ? '#fff' : 'var(--text)',
              border: '1px solid var(--border)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '600'
            }}
          >
            {!unlocked && <span style={{ marginRight: '4px' }}>🔒</span>}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
