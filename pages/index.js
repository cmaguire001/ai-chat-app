import React, { useState, useEffect, useRef, useCallback } from 'react';
import Bubbles from '../components/Bubbles';
import UnderwaterAudio, { playMessageSend, playReply } from '../components/UnderwaterAudio';
import ThemeSelector from '../components/ThemeSelector';

import {
  useGameStats,
  CoinBar,
  CoinBurst,
  BadgeButton,
  BadgePanel,
  BadgeToast,
  FARMER_THEME_UNLOCK_AT,
} from '../components/gamification';

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: '12px',
    }}>
      <div style={{
        maxWidth: '75%',
        padding: '10px 14px',
        borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
        background: isUser ? 'var(--accent)' : 'var(--surface2)',
        color: isUser ? '#fff' : 'var(--text)',
        border: isUser ? 'none' : '1px solid var(--border)',
        fontSize: '14px',
        lineHeight: 1.5,
        wordBreak: 'break-word',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '10px 14px', background: 'var(--surface2)', borderRadius: '18px 18px 18px 4px', width: 'fit-content', marginBottom: '12px' }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--text-muted)' }} />
      ))}
    </div>
  );
}

const INITIAL_MESSAGES = [
  { role: 'assistant', content: "Hey! 👋 I'm your AI assistant. Ask me anything and earn coins! 🪙" },
];

export default function Home() {
  const [theme, setThemeRaw] = useState('light');
  const [badgePanelOpen, setBadgePanelOpen] = useState(false);
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const { stats, multiplier, coinBurst, badgeToast, onMessageSent } = useGameStats();

  useEffect(() => {
    const saved = localStorage.getItem('chat-theme');
    if (saved) setThemeRaw(saved);
  }, []);

  const setTheme = (t) => {
    setThemeRaw(t);
    localStorage.setItem('chat-theme', t);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async () => {
    const text = textareaRef.current?.value?.trim();
    if (!text || isLoading) return;
    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    textareaRef.current.value = '';
    setIsLoading(true);
    onMessageSent(theme === 'farmer');
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.error || 'Error' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const isUnderwater = theme === 'underwater';

  return (
    <div className={`theme-${theme}`} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'var(--bg)' }}>
      {isUnderwater && <Bubbles />}
      <CoinBurst coins={coinBurst.amount} visible={coinBurst.visible} />
      <BadgeToast badge={badgeToast.badge} visible={badgeToast.visible} />
      <BadgePanel stats={stats} open={badgePanelOpen} onClose={() => setBadgePanelOpen(false)} />
      
      <div style={{ width: '100%', maxWidth: '600px', flex: 1, display: 'flex', flexDirection: 'column', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
          <BadgeButton stats={stats} onClick={() => setBadgePanelOpen(true)} />
          <ThemeSelector theme={theme} setTheme={setTheme} totalMessages={stats.totalMessages} />
        </div>

        <div style={{ flex: 1, overflowY: 'auto', background: 'var(--surface)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
          {messages.map((msg, i) => <Message key={i} msg={msg} />)}
          {isLoading && <TypingDots />}
          <div ref={bottomRef} />
        </div>

        <CoinBar totalCoins={stats.totalCoins} multiplier={multiplier} />

        <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          <textarea ref={textareaRef} style={{ flex: 1, padding: '10px', borderRadius: '8px' }} placeholder="Message..." />
          <button onClick={sendMessage} disabled={isLoading} style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px' }}>Send</button>
        </div>
      </div>
    </div>
  );
}
