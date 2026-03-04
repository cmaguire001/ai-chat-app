import { useState, useEffect, useRef } from 'react';
import ThemeSelector from '../components/ThemeSelector';
import Bubbles from '../components/Bubbles';
import UnderwaterAudio, { playMessageSend, playReply } from '../components/UnderwaterAudio';
import { XPBar, BadgeButton, BadgePanel, XPBurst, BadgeToast, BADGES, getLevelInfo } from '../components/Gamification';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '12px' }}>
      <div style={{
        maxWidth: '75%', padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--accent)' : 'var(--surface2)',
        color: isUser ? '#fff' : 'var(--text)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: 'var(--surface2)', borderRadius: '18px 18px 18px 4px', width: 'fit-content', marginBottom: '12px' }}>
      {[0,1,2].map(i => (
        <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)', animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.2}s` }} />
      ))}
    </div>
  );
}

const initialStats = { totalXP: 0, totalMessages: 0, level: 1, unlockedBadges: [] };

export default function Home() {
  const [theme, setThemeRaw] = useState('light');
  const [badgeOpen, setBadgeOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! 👋 I'm your AI assistant. Ask me anything and earn XP! 🎮" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState(initialStats);
  const [xpBurst, setXpBurst] = useState({ visible: false, amount: 0 });
  const [badgeToast, setBadgeToast] = useState({ visible: false, badge: null });
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('chat-theme');
    if (saved) setThemeRaw(saved);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  function setTheme(t) {
    setThemeRaw(t);
    localStorage.setItem('chat-theme', t);
  }

  function awardXP(amount, newStats) {
    setXpBurst({ visible: true, amount });
    setTimeout(() => setXpBurst({ visible: false, amount }), 1800);

    const prevBadges = newStats.unlockedBadges || [];
    const newBadges = BADGES.filter(b => b.condition(newStats) && !prevBadges.includes(b.id));
    if (newBadges.length > 0) {
      const badge = newBadges[0];
      setTimeout(() => {
        setBadgeToast({ visible: true, badge });
        setTimeout(() => setBadgeToast({ visible: false, badge }), 3000);
      }, 600);
      return [...prevBadges, ...newBadges.map(b => b.id)];
    }
    return prevBadges;
  }

  async function sendMessage() {
    const text = textareaRef.current?.value?.trim();
    if (!text || isLoading) return;

    if (theme === 'underwater') playMessageSend();

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    if (textareaRef.current) textareaRef.current.value = '';
    setIsLoading(true);

    const xpGained = Math.floor(Math.random() * 10) + 10;
    const newStats = {
      ...stats,
      totalXP: stats.totalXP + xpGained,
      totalMessages: stats.totalMessages + 1,
      level: getLevelInfo(stats.totalXP + xpGained).current.level,
    };
    const updatedBadges = awardXP(xpGained, newStats);
    newStats.unlockedBadges = updatedBadges;
    setStats(newStats);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      if (theme === 'underwater') playReply();
      setMessages(m => [...m, { role: 'assistant', content: data.reply || data.error || 'Something went wrong.' }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', content: 'Network error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  const isUnderwater = theme === 'underwater';

  return (
    <div
      className={`theme-${theme} ${isUnderwater ? 'underwater-bg' : ''}`}
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'var(--bg)' }}
    >
      {isUnderwater && <Bubbles />}
      {isUnderwater && <UnderwaterAudio active={isUnderwater} />}

      {/* Fixed overlays at root level — outside any backdrop-filter context */}
      <XPBurst xp={xpBurst.amount} visible={xpBurst.visible} />
      <BadgeToast badge={badgeToast.badge} visible={badgeToast.visible} />
      <BadgePanel stats={stats} open={badgeOpen} onClose={() => setBadgeOpen(false)} />

      <div style={{ width: '100%', maxWidth: '680px', height: 'min(720px, 92vh)', display: 'flex', flexDirection: 'column', position: 'relative' }}>

        {/* Header */}
        <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', padding: '16px 20px', borderRadius: '16px 16px 0 0', backdropFilter: isUnderwater ? 'blur(16px)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                {isUnderwater ? '🐠' : '✦'}
              </div>
              <div>
                <div style={{ fontWeight: 'bold', color: 'var(--text)', fontSize: '15px' }}>AI Chat</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {isUnderwater ? 'Deep sea edition 🌊' : 'Powered by Llama'}
                </div>
              </div>
            </div>
            {/* BadgeButton sits inline with ThemeSelector — panel renders at root level above */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BadgeButton stats={stats} onClick={() => setBadgeOpen(o => !o)} />
              <ThemeSelector theme={theme} setTheme={setTheme} />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: isUnderwater ? 'rgba(0,15,40,0.6)' : 'var(--surface)', backdropFilter: isUnderwater ? 'blur(12px)' : 'none' }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {isLoading && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        {/* XP Bar */}
        <XPBar stats={stats} />

        {/* Input */}
        <div style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '12px 16px', borderRadius: '0 0 16px 16px', backdropFilter: isUnderwater ? 'blur(16px)' : 'none' }}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-end' }}>
            <textarea
              ref={textareaRef}
              defaultValue=""
              onKeyDown={handleKeyDown}
              rows={1}
              placeholder={isUnderwater ? '🐟 Message from the deep...' : 'Send a message… (Enter to send)'}
              style={{ flex: 1, minHeight: '44px', maxHeight: '120px', padding: '10px 14px', borderRadius: '12px', border: '1.5px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '14px', resize: 'none', fontFamily: 'inherit', outline: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              style={{ minHeight: '44px', padding: '10px 20px', borderRadius: '12px', background: 'var(--accent)', color: 'white', border: 'none', cursor: isLoading ? 'not-allowed' : 'pointer', fontWeight: 'bold', opacity: isLoading ? 0.5 : 1, fontSize: '14px' }}
            >
              {isLoading ? '...' : isUnderwater ? '🌊' : 'Send'}
            </button>
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '6px' }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>

      </div>
    </div>
  );
}