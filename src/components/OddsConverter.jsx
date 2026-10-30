import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpDown, Check, Info } from 'lucide-react';
import ConversionToggle from './ConversionToggle';
import OddsInput from './OddsInput';
import OddsResult from './OddsResult';
import QuickExamples from './QuickExamples';
import { MODES, convert, normalizeInput, sanitizeTyping } from '../utils/oddsConverter';

const otherMode = (m) =>
  m === MODES.DECIMAL_TO_AMERICAN ? MODES.AMERICAN_TO_DECIMAL : MODES.DECIMAL_TO_AMERICAN;

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback abajo */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(ta);
    return ok;
  } catch {
    return false;
  }
}

export default function OddsConverter() {
  const [mode, setMode] = useState(MODES.DECIMAL_TO_AMERICAN);
  const [value, setValue] = useState('');
  const [swapTurns, setSwapTurns] = useState(0);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const toastTimer = useRef(null);

  const conversion = useMemo(() => convert(value, mode), [value, mode]);

  // Comprobación de ida y vuelta para avisar de diferencias por redondeo
  const roundTrip = useMemo(() => {
    if (conversion.status !== 'ok') return null;
    const back = convert(conversion.result, otherMode(mode));
    if (back.status !== 'ok') return null;
    const original =
      mode === MODES.DECIMAL_TO_AMERICAN
        ? Number(normalizeInput(value)).toFixed(2)
        : String(conversion.input > 0 ? `+${conversion.input}` : conversion.input);
    return back.result !== original ? back.result : null;
  }, [conversion, mode, value]);

  const focusInput = () => requestAnimationFrame(() => inputRef.current?.focus());

  const showToast = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast(null);
      setCopied(false);
    }, 1800);
  }, []);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const handleChange = (raw) => setValue(sanitizeTyping(raw, mode));

  const handleModeChange = (next) => {
    if (next === mode) return;
    handleSwap();
  };

  const handleSwap = () => {
    const next = otherMode(mode);
    // Si el resultado es válido, se convierte en la nueva entrada
    const nextValue = conversion.status === 'ok' ? conversion.result : sanitizeTyping(value, next);
    setMode(next);
    setValue(nextValue);
    setSwapTurns((t) => t + 1);
    setCopied(false);
  };

  const handleToggleSign = () => {
    setValue((v) => {
      const digits = v.replace(/^[+-]/, '');
      return v.startsWith('-') ? `+${digits}` : `-${digits}`;
    });
    focusInput();
  };

  const handleQuick = (v) => {
    setMode(MODES.DECIMAL_TO_AMERICAN);
    setValue(v);
    setCopied(false);
  };

  const handleCopy = async () => {
    if (conversion.status !== 'ok') return;
    const ok = await copyToClipboard(conversion.result);
    if (ok) {
      setCopied(true);
      showToast('Momio copiado');
    } else {
      showToast('No se pudo copiar');
    }
  };

  // Atajos: Esc limpia, Ctrl/⌘+Enter copia (solo con el input enfocado)
  const handleKeyDown = (e) => {
    if (e.target.id !== 'odds-input') return;
    if (e.key === 'Escape') {
      setValue('');
    } else if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleCopy();
    } else if (e.key === 'Enter') {
      inputRef.current?.blur();
    }
  };

  return (
    <>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
        onKeyDown={handleKeyDown}
        aria-label="Conversor de momios"
        className="w-full rounded-3xl border border-line bg-card p-4 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset,0_24px_60px_-20px_rgba(0,0,0,0.7)] sm:p-7"
      >
        <ConversionToggle mode={mode} onChange={handleModeChange} />

        <div className="mt-6">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: mode === MODES.DECIMAL_TO_AMERICAN ? -10 : 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: mode === MODES.DECIMAL_TO_AMERICAN ? 10 : -10 }}
              transition={{ duration: 0.16 }}
            >
              <OddsInput
                ref={inputRef}
                mode={mode}
                value={value}
                onChange={handleChange}
                onClear={() => {
                  setValue('');
                  focusInput();
                }}
                onToggleSign={handleToggleSign}
                error={conversion.status === 'error' ? conversion.error : null}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Separador con botón de intercambio */}
        <div className="relative my-1 flex items-center justify-center">
          <div className="absolute inset-x-0 top-1/2 h-px bg-line" aria-hidden />
          <motion.button
            id="swap-button"
            type="button"
            onClick={handleSwap}
            aria-label="Intercambiar formatos"
            title="Intercambiar formatos"
            whileTap={{ scale: 0.92 }}
            className="group relative z-10 flex h-11 w-11 items-center justify-center rounded-full border border-line-2 bg-card text-muted shadow-[0_4px_14px_rgba(0,0,0,0.45)] transition-colors duration-200 hover:border-accent/60 hover:text-accent"
          >
            <motion.span
              animate={{ rotate: swapTurns * 180 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
              className="flex"
            >
              <ArrowUpDown size={18} />
            </motion.span>
          </motion.button>
        </div>

        <div className="mt-5">
          <OddsResult mode={mode} conversion={conversion} onCopy={handleCopy} copied={copied} />
        </div>

        <AnimatePresence initial={false}>
          {roundTrip && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <span className="flex items-start gap-2 pt-3 text-xs leading-relaxed text-subtle">
                <Info size={13} className="mt-0.5 shrink-0" />
                <span>
                  Al convertir de regreso se obtiene{' '}
                  <span className="font-mono text-muted">{roundTrip}</span> por el redondeo.
                </span>
              </span>
            </motion.p>
          )}
        </AnimatePresence>

        <div className="mt-6">
          <QuickExamples mode={mode} value={value} onSelect={handleQuick} />
        </div>
      </motion.section>

      {/* Notificación discreta */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.div
              role="status"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2 rounded-xl border border-line-2 bg-card-2/95 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.7)] backdrop-blur"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent/15 text-accent">
                <Check size={12} strokeWidth={3} />
              </span>
              {toast}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
