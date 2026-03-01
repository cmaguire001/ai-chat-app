import { useMemo } from 'react';

export default function Bubbles() {
  const bubbles = useMemo(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 96 + 2}%`,
      size: Math.random() * 24 + 8,
      duration: Math.random() * 10 + 8,
      delay: Math.random() * 12,
      opacity: Math.random() * 0.4 + 0.1,
    }));
  }, []);

  return (
    <>
      {bubbles.map(b => (
        <div
          key={b.id}
          className="bubble"
          style={{
            left: b.left,
            width: b.size,
            height: b.size,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`,
            opacity: b.opacity,
          }}
        />
      ))}
    </>
  );
}
