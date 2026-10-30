import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy } from 'lucide-react';
import { MODES } from '../utils/oddsConverter';

export default function OddsResult({ mode, conversion, onCopy, copied }) {
  const isDecimalInput = mode === MODES.DECIMAL_TO_AMERICAN;
  const label = isDecimalInput ? 'Momio americano' : 'Momio decimal';
  const ok = conversion.status === 'ok';

  return (
    <div className="rounded-2xl border border-line bg-ink/40 p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
          {label}
        </span>

        <button
          type="button"
          onClick={onCopy}
          disabled={!ok}
          aria-label="Copiar momio convertido"
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line px-2.5 text-xs font-medium text-muted transition-all duration-200 hover:border-line-2 hover:bg-card-2 hover:text-white active:scale-95 disabled:pointer-events-none disabled:opacity-30"
        >
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.span
                key="ok"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <Check size={14} className="text-accent" />
              </motion.span>
            ) : (
              <motion.span
                key="copy"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.15 }}
              >
                <Copy size={14} />
              </motion.span>
            )}
          </AnimatePresence>
          {copied ? 'Copiado' : 'Copiar'}
        </button>
      </div>

      <div className="relative mt-3 flex h-[64px] items-center overflow-hidden sm:h-[76px]" aria-live="polite">
        <AnimatePresence mode="popLayout" initial={false}>
          {ok ? (
            <motion.output
              key={`${mode}-${conversion.result}`}
              htmlFor="odds-input"
              initial={{ opacity: 0, y: 14, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="tabular block font-mono text-[52px] font-semibold leading-none tracking-tight text-accent sm:text-[64px]"
            >
              {conversion.result}
            </motion.output>
          ) : (
            <motion.div
              key={`empty-${conversion.status}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-4"
            >
              <span className="font-mono text-[52px] font-semibold leading-none text-line-2 sm:text-[64px]">
                —
              </span>
              <span className="max-w-[180px] text-xs leading-relaxed text-subtle">
                {conversion.status === 'error'
                  ? 'Corrige el valor para ver la conversión.'
                  : isDecimalInput
                    ? 'Escribe un momio decimal o elige un ejemplo.'
                    : 'Escribe un momio americano, p. ej. −110.'}
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 border-t border-line pt-4">
        <Stat label="Probabilidad implícita" value={ok ? `${conversion.probability.toFixed(2)}%` : '—'} />
        <Stat
          label={isDecimalInput ? 'Ganancia por $100' : 'Pago por $100'}
          value={ok ? payoutLabel(mode, conversion) : '—'}
          align="right"
        />
      </div>
    </div>
  );
}

function payoutLabel(mode, conversion) {
  // Ganancia neta apostando $100 (decimal → americano) o pago total (americano → decimal)
  if (mode === MODES.DECIMAL_TO_AMERICAN) {
    return `$${((conversion.input - 1) * 100).toFixed(2)}`;
  }
  return `$${(Number(conversion.result) * 100).toFixed(2)}`;
}

function Stat({ label, value, align = 'left' }) {
  return (
    <div className={align === 'right' ? 'text-right' : ''}>
      <div className="text-[11px] text-subtle">{label}</div>
      <div className="tabular mt-0.5 font-mono text-sm font-medium text-white/90">{value}</div>
    </div>
  );
}
