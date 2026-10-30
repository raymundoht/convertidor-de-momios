import { forwardRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, Delete, PlusCircle, MinusCircle } from 'lucide-react';
import { MODES } from '../utils/oddsConverter';

const OddsInput = forwardRef(function OddsInput(
  { mode, value, onChange, onClear, onToggleSign, error },
  ref,
) {
  const [focused, setFocused] = useState(false);
  const isDecimal = mode === MODES.DECIMAL_TO_AMERICAN;
  const label = isDecimal ? 'Momio decimal' : 'Momio americano';
  const placeholder = isDecimal ? '1.85' : '+150';
  const hasError = Boolean(error);
  const isNegative = value.trim().startsWith('-');

  const borderClass = hasError
    ? 'border-red-500/50'
    : focused
      ? 'border-accent/70 ring-4 ring-accent/10'
      : 'border-line hover:border-line-2';

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <label
          htmlFor="odds-input"
          className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted"
        >
          {label}
        </label>
        <span className="text-[11px] text-subtle">
          {isDecimal ? 'Mayor que 1.00' : '≥ +100 o ≤ −100'}
        </span>
      </div>

      <div
        className={`group relative flex items-center rounded-2xl border bg-ink/70 transition-all duration-200 ${borderClass}`}
      >
        {!isDecimal && (
          <button
            type="button"
            onClick={onToggleSign}
            aria-label={isNegative ? 'Cambiar a positivo' : 'Cambiar a negativo'}
            title="Cambiar signo (+/−)"
            className="ml-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-subtle transition-colors hover:bg-card-2 hover:text-white"
          >
            {isNegative ? <MinusCircle size={20} /> : <PlusCircle size={20} />}
          </button>
        )}

        <input
          ref={ref}
          id="odds-input"
          type="text"
          inputMode={isDecimal ? 'decimal' : 'text'}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          enterKeyHint="done"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          aria-invalid={hasError}
          aria-describedby="odds-input-hint"
          className={`tabular h-[76px] w-full min-w-0 bg-transparent font-mono text-[34px] font-semibold tracking-tight text-white outline-none sm:h-[84px] sm:text-[40px] ${
            isDecimal ? 'pl-5 sm:pl-6' : 'pl-2'
          } pr-14`}
        />

        <AnimatePresence>
          {value && (
            <motion.button
              type="button"
              onClick={onClear}
              aria-label="Borrar valor"
              title="Borrar (Esc)"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="absolute right-3 flex h-9 w-9 items-center justify-center rounded-lg text-subtle transition-colors hover:bg-card-2 hover:text-white"
            >
              <Delete size={18} />
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div id="odds-input-hint" className="min-h-[22px] pt-2" aria-live="polite">
        <AnimatePresence mode="wait">
          {hasError && (
            <motion.p
              key={error}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="flex items-center gap-1.5 text-xs text-red-400/90"
            >
              <AlertCircle size={13} className="shrink-0" />
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
});

export default OddsInput;
