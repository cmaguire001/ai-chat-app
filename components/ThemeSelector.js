export default function ThemeSelector({ theme, setTheme }) {
  const themes = [
    { id: 'light', label: '☀️ Light' },
    { id: 'dark',  label: '🌙 Dark'  },
    { id: 'underwater', label: '🌊 Underwater' },
  ];

  return (
    <div className="flex gap-2 flex-wrap">
      {themes.map(t => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className={`theme-btn px-3 py-1.5 rounded-full text-xs font-display font-600 tracking-wide ${
            theme === t.id ? 'active' : ''
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
