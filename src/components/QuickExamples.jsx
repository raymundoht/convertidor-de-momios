import { MODES, normalizeInput } from '../utils/oddsConverter';

const QUICK_VALUES = ['1.50', '1.80', '2.00', '2.50', '3.00'];

export default function QuickExamples({ mode, value, onSelect }) {
  const current =
    mode === MODES.DECIMAL_TO_AMERICAN ? Number(normalizeInput(value)) : NaN;

  return (
    <div>
      <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-subtle">
        Ejemplos rápidos
      </div>
      <div className="grid grid-cols-5 gap-2">
        {QUICK_VALUES.map((v) => {
          const active = current === Number(v);
          return (
            <button
              key={v}
              id={`quick-${v}`}
              type="button"
              onClick={() => onSelect(v)}
              aria-pressed={active}
              className={`tabular h-10 rounded-lg border font-mono text-[13px] font-medium transition-all duration-200 active:scale-95 sm:text-sm ${
                active
                  ? 'border-accent/60 bg-accent/10 text-accent'
                  : 'border-line bg-ink/40 text-muted hover:-translate-y-px hover:border-line-2 hover:bg-card-2 hover:text-white'
              }`}
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}
