import { useEffect, useState } from 'react';

export const LEVELS = [
  { level: 1,  name: 'Sea Cadet',      xpRequired: 0    },
  { level: 2,  name: 'Coral Scout',    xpRequired: 50   },
  { level: 3,  name: 'Tide Walker',    xpRequired: 120  },
  { level: 4,  name: 'Reef Ranger',    xpRequired: 220  },
  { level: 5,  name: 'Wave Rider',     xpRequired: 350  },
  { level: 6,  name: 'Deep Diver',     xpRequired: 520  },
  { level: 7,  name: 'Pearl Hunter',   xpRequired: 730  },
  { level: 8,  name: 'Shark Tamer',    xpRequired: 990  },
  { level: 9,  name: 'Kraken Caller',  xpRequired: 1300 },
  { level: 10, name: 'Ocean Master',   xpRequired: 1700 },
];

export const BADGES = [
  { id: 'first_message', icon: '💬', name: 'First Words',   desc: 'Send your first message',   condition: (s) => s.totalMessages >= 1  },
  { id: 'five_messages', icon: '🐠', name: 'Chatty Fish',   desc: 'Send 5 messages',            condition: (s) => s.totalMessages >= 5  },
  { id: 'ten_messages',  icon: '🌊', name: 'Wave Maker',    desc: 'Send 10 messages',           condition: (s) => s.totalMessages >= 10 },
  { id: 'twenty_five',   icon: '🐙', name: 'Octopus Mind',  desc: 'Send 25 messages',           condition: (s) => s.totalMessages >= 25 },
  { id: 'fifty',         icon: '🦈', name: 'Shark Mode',    desc: 'Send 50 messages',           condition: (s) => s.totalMessages >= 50 },
  { id: 'level_5',       icon: '⭐', name: 'Rising Star',   desc: 'Reach Level 5',              condition: (s) => s.level >= 5         },
  { id: 'level_10',      icon: '🏆', name: 'Ocean Master',  desc: 'Reach Level 10',             condition: (s) => s.level >= 10        },
  { id: 'big_xp',        icon: '⚡', name: 'XP Surge',      desc: 'Earn 500 XP total',          condition: (s) => s.totalXP >= 500     },
];

export function getLevelInfo(xp) {
  let current = LEVELS[0];
  let next = LEVELS[1];
  for (let i = 0; i < LEVELS.length; i++) {
    if (xp >= LEVELS[i].xpRequired) {
      current = LEVELS[i];
      next = LEVELS[i + 1] || null;
    }
  }
  const xpIntoLevel = xp - current.xpRequired;
  const xpNeeded = next ? next.xpRequired - current.xpRequired : 1;
  const progress = next ? Math.min((xpIntoLevel / xpNeeded) * 100, 100) : 100;
  return { current, next, progress, xpIntoLevel, xpNeeded };
}

export function XPBar({ stats }) {
  const { current, next, progress, xpIntoLevel, xpNeeded } = getLevelInfo(stats.totalXP);
  const [animPct, setAnimPct] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setAnimPct(progress), 100);
    return () => clearTimeout(t);
  }, [progress]);

  return (
    <div style={{ padding: '10px 16px', background: 'var(--surface2)', borderTop: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '16px' }}>⚡</span>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent)' }}>
            Lv.{current.level} {current.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            {next ? `${xpIntoLevel}/${xpNeeded} XP` : 'MAX'}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            💬 {stats.totalMessages}
          </span>
        </div>
      </div>
      <div style={{ height: '8px', background: 'var(--border)', borderRadius: '4px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          width: `${animPct}%`,
          background: 'linear-gradient(90deg, #00c8e0, #0080cc)',
          borderRadius: '4px',
          transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
          boxShadow: '0 0 8px #00c8e0',
        }} />
      </div>
    </div>
  );
}

// Button only — place this in the header alongside ThemeSelector
export function BadgeButton({ stats, onClick }) {
  const unlocked = BADGES.filter(b => b.condition(stats));
  return (
    <button
      onClick={onClick}
      className="theme-btn px-3 py-1.5 rounded-full text-xs font-display font-600 tracking-wide"
    >
      🎖️ {unlocked.length}/{BADGES.length}
    </button>
  );
}

// Panel only — place this at root level, outside any backdrop-filter parent
export function BadgePanel({ stats, open, onClose }) {
  const unlocked = BADGES.filter(b => b.condition(stats));
  if (!open) return null;
  return (
    <>
      <div
        onClick={onClose}
        style={{ position: 'fixed', inset: 0, zIndex: 2147483645, background: 'rgba(0,0,0,0.6)' }}
      />
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '24px',
        width: '280px',
        background: '#0d3348',
        border: '2px solid #00c8e0',
        borderRadius: '16px',
        padding: '16px',
        zIndex: 2147483647,
        boxShadow: '0 0 0 1px #00c8e0, 0 0 40px rgba(0,200,224,0.6), 0 16px 60px rgba(0,0,0,0.9)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#ffffff' }}>🎖️ Badges</span>
          <span style={{ fontSize: '11px', color: '#00c8e0' }}>{unlocked.length}/{BADGES.length} unlocked</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {BADGES.map(badge => {
            const earned = badge.condition(stats);
            return (
              <div
                key={badge.id}
                title={`${badge.name}: ${badge.desc}`}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  padding: '10px 4px', borderRadius: '10px',
                  background: earned ? 'rgba(0,200,224,0.25)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${earned ? '#00c8e0' : 'rgba(255,255,255,0.12)'}`,
                  opacity: earned ? 1 : 0.4,
                  filter: earned ? 'none' : 'grayscale(1)',
                  transition: 'all 0.2s',
                  boxShadow: earned ? '0 0 10px rgba(0,200,224,0.3)' : 'none',
                }}
              >
                <span style={{ fontSize: '22px' }}>{badge.icon}</span>
                <span style={{ fontSize: '8px', textAlign: 'center', color: earned ? '#a8e4f0' : '#6a9aaf', lineHeight: '1.3', fontWeight: earned ? 'bold' : 'normal' }}>
                  {badge.name}
                </span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid rgba(0,200,224,0.2)', fontSize: '10px', color: '#5aaabf', textAlign: 'center' }}>
          Hover badges to see unlock conditions
        </div>
      </div>
    </>
  );
}

// Keep BadgeGrid as a convenience wrapper if used elsewhere
export function BadgeGrid({ stats }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <BadgeButton stats={stats} onClick={() => setOpen(o => !o)} />
      <BadgePanel stats={stats} open={open} onClose={() => setOpen(false)} />
    </>
  );
}

export function XPBurst({ xp, visible }) {
  return (
    <div style={{
      position: 'fixed', bottom: '100px', right: '24px', zIndex: 2147483647,
      background: 'linear-gradient(135deg, #00c8e0, #0080cc)', color: 'white',
      padding: '6px 14px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0px) scale(1)' : 'translateY(10px) scale(0.9)',
      transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      pointerEvents: 'none', boxShadow: '0 4px 16px rgba(0,200,224,0.5)',
    }}>
      +{xp} XP ⚡
    </div>
  );
}

export function BadgeToast({ badge, visible }) {
  if (!badge) return null;
  return (
    <div style={{
      position: 'fixed', top: '24px', left: '50%', zIndex: 2147483647,
      transform: `translateX(-50%) translateY(${visible ? '0px' : '-80px'})`,
      background: '#0d3348', border: '2px solid #00c8e0', borderRadius: '16px',
      padding: '14px 22px', display: 'flex', alignItems: 'center', gap: '12px',
      opacity: visible ? 1 : 0,
      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 0 30px rgba(0,200,224,0.5), 0 8px 32px rgba(0,0,0,0.9)',
      pointerEvents: 'none',
    }}>
      <span style={{ fontSize: '32px' }}>{badge.icon}</span>
      <div>
        <div style={{ fontSize: '10px', color: '#00c8e0', fontWeight: 'bold', letterSpacing: '1px' }}>BADGE UNLOCKED</div>
        <div style={{ fontSize: '15px', color: '#ffffff', fontWeight: 'bold' }}>{badge.name}</div>
        <div style={{ fontSize: '11px', color: '#a8e4f0' }}>{badge.desc}</div>
      </div>
    </div>
  );
}