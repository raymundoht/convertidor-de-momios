import { motion } from 'framer-motion';
import { MODES } from '../utils/oddsConverter';

const OPTIONS = [
  { id: MODES.DECIMAL_TO_AMERICAN, from: 'Decimal', to: 'Americano' },
  { id: MODES.AMERICAN_TO_DECIMAL, from: 'Americano', to: 'Decimal' },
];

export default function ConversionToggle({ mode, onChange }) {
  const handleKeyDown = (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    e.preventDefault();
    const idx = OPTIONS.findIndex((o) => o.id === mode);
    const next = OPTIONS[(idx + (e.key === 'ArrowRight' ? 1 : -1) + OPTIONS.length) % OPTIONS.length];
    onChange(next.id);
    document.getElementById(`mode-${next.id}`)?.focus();
  };

  return (
    <div
      role="tablist"
      aria-label="Dirección de conversión"
      onKeyDown={handleKeyDown}
      className="relative grid grid-cols-2 gap-1 rounded-xl border border-line bg-ink/60 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = opt.id === mode;
        return (
          <button
            key={opt.id}
            id={`mode-${opt.id}`}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.id)}
            className={`relative z-10 flex h-10 items-center justify-center gap-1.5 rounded-lg px-2 text-[13px] font-medium transition-colors duration-200 sm:text-sm ${
              active ? 'text-white' : 'text-subtle hover:text-muted'
            }`}
          >
            {active && (
              <motion.span
                layoutId="toggle-pill"
                className="absolute inset-0 -z-10 rounded-lg border border-line-2 bg-card-2 shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
                transition={{ type: 'spring', stiffness: 500, damping: 38 }}
              />
            )}
            <span>{opt.from}</span>
            <span className={active ? 'text-accent' : 'text-subtle/70'} aria-hidden>
              →
            </span>
            <span>{opt.to}</span>
          </button>
        );
      })}
    </div>
  );
}
