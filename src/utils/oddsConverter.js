/**
 * Lógica pura de conversión de momios.
 * Sin dependencias de React: fácil de testear y reutilizar.
 */

export const MODES = {
  DECIMAL_TO_AMERICAN: 'decimal-to-american',
  AMERICAN_TO_DECIMAL: 'american-to-decimal',
};

/** Normaliza la entrada: quita espacios, acepta coma como separador decimal. */
export function normalizeInput(raw) {
  if (raw == null) return '';
  return String(raw).trim().replace(/\s+/g, '').replace(',', '.');
}

/**
 * Sanitiza lo que el usuario escribe en tiempo real.
 * - Decimal: solo dígitos y un separador (punto o coma).
 * - Americano: signo opcional al inicio (+/-) y dígitos.
 */
export function sanitizeTyping(raw, mode) {
  let value = String(raw ?? '');
  if (mode === MODES.DECIMAL_TO_AMERICAN) {
    value = value.replace(/[^\d.,]/g, '');
    const firstSep = value.search(/[.,]/);
    if (firstSep !== -1) {
      value =
        value.slice(0, firstSep + 1) +
        value.slice(firstSep + 1).replace(/[.,]/g, '');
    }
    return value.slice(0, 10);
  }
  // Americano
  const sign = /^[+-]/.test(value.trim()) ? value.trim()[0] : '';
  const digits = value.replace(/[^\d]/g, '').slice(0, 7);
  return sign + digits;
}

const DECIMAL_PATTERN = /^\d+(\.\d+)?$|^\d+\.$|^\.\d+$/;
const AMERICAN_PATTERN = /^[+-]?\d+$/;

/** Valida un momio decimal. Devuelve { ok, value?, error? } */
export function parseDecimal(raw) {
  const v = normalizeInput(raw);
  if (v === '') return { ok: false, empty: true };
  if (!DECIMAL_PATTERN.test(v)) {
    return { ok: false, error: 'Introduce un número válido, p. ej. 1.85' };
  }
  const n = Number(v);
  if (!Number.isFinite(n)) return { ok: false, error: 'Número no válido' };
  if (n <= 1) {
    return { ok: false, error: 'El momio decimal debe ser mayor que 1.00' };
  }
  if (n > 100000) return { ok: false, error: 'Valor demasiado alto' };
  return { ok: true, value: n };
}

/** Valida un momio americano. Devuelve { ok, value?, error? } */
export function parseAmerican(raw) {
  const v = normalizeInput(raw);
  if (v === '') return { ok: false, empty: true };
  if (v === '+' || v === '-') return { ok: false, partial: true };
  if (!AMERICAN_PATTERN.test(v)) {
    return { ok: false, error: 'Introduce un número entero, p. ej. +150 o -110' };
  }
  const n = Number(v);
  if (!Number.isFinite(n)) return { ok: false, error: 'Número no válido' };
  if (n === 0) return { ok: false, error: 'El momio americano no puede ser 0' };
  if (Math.abs(n) < 100) {
    return { ok: false, error: 'El valor absoluto debe ser al menos 100' };
  }
  return { ok: true, value: n };
}

/** Decimal → Americano (sin redondear). */
export function decimalToAmerican(decimal) {
  if (!Number.isFinite(decimal) || decimal <= 1) return null;
  if (decimal >= 2) return (decimal - 1) * 100;
  return -100 / (decimal - 1);
}

/** Americano → Decimal (sin redondear). */
export function americanToDecimal(american) {
  if (!Number.isFinite(american) || Math.abs(american) < 100) return null;
  if (american > 0) return 1 + american / 100;
  return 1 + 100 / Math.abs(american);
}

/** Formatea un americano: entero redondeado con signo + en positivos. */
export function formatAmerican(value) {
  if (!Number.isFinite(value)) return '';
  let rounded = Math.round(value);
  // Evita "-0" y valores en la zona inválida por redondeo
  if (Object.is(rounded, -0)) rounded = 0;
  return rounded > 0 ? `+${rounded}` : `${rounded}`;
}

/** Formatea un decimal con dos cifras. */
export function formatDecimal(value) {
  if (!Number.isFinite(value)) return '';
  // Corrige errores de coma flotante (p. ej. 1.005)
  return (Math.round((value + Number.EPSILON) * 100) / 100).toFixed(2);
}

/** Probabilidad implícita (%) a partir del decimal. */
export function impliedProbability(decimal) {
  if (!Number.isFinite(decimal) || decimal <= 1) return null;
  return 100 / decimal;
}

/**
 * Conversión completa según el modo.
 * Devuelve { status: 'empty' | 'partial' | 'error' | 'ok', ... }
 */
export function convert(raw, mode) {
  if (mode === MODES.DECIMAL_TO_AMERICAN) {
    const parsed = parseDecimal(raw);
    if (parsed.empty) return { status: 'empty' };
    if (!parsed.ok) return { status: 'error', error: parsed.error };
    const american = decimalToAmerican(parsed.value);
    if (american == null || !Number.isFinite(american)) {
      return { status: 'error', error: 'No se pudo convertir este valor' };
    }
    return {
      status: 'ok',
      input: parsed.value,
      result: formatAmerican(american),
      probability: impliedProbability(parsed.value),
    };
  }

  const parsed = parseAmerican(raw);
  if (parsed.empty) return { status: 'empty' };
  if (parsed.partial) return { status: 'partial' };
  if (!parsed.ok) return { status: 'error', error: parsed.error };
  const decimal = americanToDecimal(parsed.value);
  if (decimal == null || !Number.isFinite(decimal)) {
    return { status: 'error', error: 'No se pudo convertir este valor' };
  }
  return {
    status: 'ok',
    input: parsed.value,
    result: formatDecimal(decimal),
    probability: impliedProbability(decimal),
  };
}
