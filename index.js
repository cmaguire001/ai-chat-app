import { useState, useEffect, useCallback } from 'react';
import ChatBox from '../components/ChatBox';
import ThemeSelector from '../components/ThemeSelector';
import Bubbles from '../components/Bubbles';

const SAMPLE_CONVERSATION = [
  { role: 'assistant', content: "Hey there! 👋 I'm your AI assistant. Try switching themes above — especially the Underwater one! Ask me anything." },
];

export default function Home() {
  const [theme, setThemeState] = useState('light');
  const [messages, setMessages] = useState(SAMPLE_CONVERSATION);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('chat-theme');
    if (saved) setThemeState(saved);
  }, []);

  const setTheme = useCallback((t) => {
    setThemeState(t);
    localStorage.setItem('chat-theme', t);
  }, []);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    const newMessages = [...messages, { role: 'user', content: text }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply || data.error || 'Something went wrong.',
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Network error. Please check your connection.',
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [input, messages, isLoading]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isUnderwater = theme === 'underwater';

  return (
    <div
      className={`theme-${theme} app-bg min-h-screen flex flex-col items-center justify-center p-4 relative ${isUnderwater ? 'underwater-bg' : ''}`}
      style={{ minHeight: '100dvh' }}
    >
      {isUnderwater && <Bubbles />}

      <div
        className={`w-full max-w-2xl flex flex-col relative z-10 ${isUnderwater ? 'wave-container' : ''}`}
        style={{ height: 'min(720px, 92dvh)' }}
      >
        <div
          className={`app-surface app-border border-b px-5 py-4 rounded-t-2xl flex flex-col gap-3 ${isUnderwater ? 'glass' : ''}`}
          style={{ borderBottom: '1px solid var(--border)', background: isUnderwater ? 'var(--surface)' : undefined }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                style={{ background: 'var(--accent)', boxShadow: '0 2px 12px var(--shadow)' }}>
                {isUnderwater ? '🐠' : '✦'}
              </div>
              <div>
                <h1 className="font-display font-700 text-base leading-tight" style={{ color: 'var(--text)' }}>AI Chat</h1>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {isUnderwater ? 'Deep sea edition 🌊' : 'Powered by Mistral'}
                </p>
              </div>
            </div>
            <ThemeSelector theme={theme} setTheme={setTheme} />
          </div>
        </div>

        <div className={`flex-1 overflow-hidden ${isUnderwater ? 'glass' : 'app-surface'}`}
          style={{ background: isUnderwater ? 'var(--surface)' : undefined }}>
          <ChatBox messages={messages} isLoading={isLoading} />
        </div>

        <div
          className={`app-surface app-border border-t px-4 py-3 rounded-b-2xl ${isUnderwater ? 'glass' : ''}`}
          style={{ borderTop: '1px solid var(--border)', background: isUnderwater ? 'var(--surface)' : undefined }}
        >
          <div className="flex gap-2 items-end">
            <textarea
              className="app-input flex-1 rounded-xl px-4 py-2.5 text-sm resize-none border"
              style={{ borderWidth: '1.5px', minHeight: '44px', maxHeight: '120px', lineHeight: '1.5' }}
              placeholder={isUnderwater ? '🐟 Send a message from the deep...' : 'Send a message…'}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="btn-accent rounded-xl px-4 py-2.5 text-sm font-display font-600 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
              style={{ minHeight: '44px' }}
            >
              {isLoading ? '...' : isUnderwater ? '🌊' : 'Send'}
            </button>
          </div>
          <p className="text-xs mt-2 text-center" style={{ color: 'var(--text-muted)' }}>
            Press Enter to send · Shift+Enter for new line
          </p>
        </div>
      </div>

      <p className="text-xs mt-3 text-center z-10" style={{ color: 'var(--text-muted)', opacity: 0.7 }}>
        Add <code style={{ color: 'var(--accent)' }}>HUGGINGFACE_API_KEY</code> to your environment for live AI responses
      </p>
    </div>
  );
}

