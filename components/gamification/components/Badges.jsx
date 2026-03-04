import React from 'react';
import { BADGES } from '../constants/gamification';

function getUnlockedBadges(stats) {
  return BADGES.filter(b => b.condition(stats));
}

export function BadgeItem({ badge, earned }) {
  return (
    <div style={{ opacity: earned ? 1 : 0.3, textAlign: 'center' }}>
      <span style={{ fontSize: '24px' }}>{badge.icon}</span>
    </div>
  );
}

export function BadgeButton({ stats, onClick }) {
  const unlocked = getUnlockedBadges(stats);
  return <button onClick={onClick}>🎖️ {unlocked.length}/{BADGES.length}</button>;
}

export function BadgePanel({ stats, open, onClose }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
       <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', color: '#000' }}>
         <button onClick={onClose}>Close</button>
         <div style={{ marginTop: '10px' }}>Badges Unlocked</div>
       </div>
    </div>
  );
}

export function BadgeToast({ badge, visible }) {
  if (!visible || !badge) return null;
  return (
    <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: '#333', color: '#fff', padding: '10px 20px', borderRadius: '20px', zIndex: 1000 }}>
      Unlocked: {badge.name}
    </div>
  );
}
