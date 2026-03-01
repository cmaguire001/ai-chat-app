import { useEffect, useRef } from 'react';

function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center px-4 py-3">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  );
}

function Message({ msg, index }) {
  const isUser = msg.role === 'user';
  return (
    <div
      className={`flex msg-enter ${isUser ? 'justify-end' : 'justify-start'}`}
      style={{ animationDelay: `${index * 0.03}s` }}
    >
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 mt-1 flex-shrink-0 text-xs font-display font-700"
          style={{ background: 'var(--accent)', color: 'var(--bubble-user-text)' }}>
          AI
        </div>
      )}
      <div
        className={`
          max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed
          ${isUser
            ? 'bubble-user rounded-br-md'
            : 'bubble-ai rounded-bl-md app-shadow'}
        `}
        style={{ wordBreak: 'break-word' }}
      >
        {msg.content}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center ml-2 mt-1 flex-shrink-0 text-xs font-display font-700"
          style={{ background: 'var(--surface2)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
          U
        </div>
      )}
    </div>
  );
}

export default function ChatBox({ messages, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="chat-scroll flex flex-col gap-4 overflow-y-auto h-full px-2 py-4">
      {messages.map((msg, i) => (
        <Message key={i} msg={msg} index={i} />
      ))}
      {isLoading && (
        <div className="flex justify-start">
          <div className="w-7 h-7 rounded-full flex items-center justify-center mr-2 flex-shrink-0 text-xs font-display"
            style={{ background: 'var(--accent)', color: 'var(--bubble-user-text)' }}>
            AI
          </div>
          <div className="bubble-ai rounded-2xl rounded-bl-md app-shadow">
            <TypingIndicator />
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  );
}
