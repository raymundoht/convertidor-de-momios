import assert from 'node:assert/strict';
import { convert, MODES, sanitizeTyping } from '../src/utils/oddsConverter.js';

const D = MODES.DECIMAL_TO_AMERICAN;
const A = MODES.AMERICAN_TO_DECIMAL;

const d2a = { '1.50': '-200', '1.80': '-125', '1.91': '-110', '2.00': '+100', '2.50': '+150', '3.00': '+200', '1,85': '-118', '1.01': '-10000', '11': '+1000' };
const a2d = { '+100': '2.00', '+150': '2.50', '+200': '3.00', '-110': '1.91', '-125': '1.80', '-200': '1.50', '100': '2.00', '-100': '2.00', '-10000': '1.01' };

for (const [i, o] of Object.entries(d2a)) assert.equal(convert(i, D).result, o, `D ${i}`);
for (const [i, o] of Object.entries(a2d)) assert.equal(convert(i, A).result, o, `A ${i}`);

for (const bad of ['1', '1.00', '0.5', '0', 'abc', '1..2']) assert.equal(convert(bad, D).status, 'error', `D bad ${bad}`);
for (const bad of ['0', '50', '-99', '+1.5', 'abc']) assert.equal(convert(bad, A).status, 'error', `A bad ${bad}`);
assert.equal(convert('', D).status, 'empty');
assert.equal(convert('-', A).status, 'partial');

// Nunca NaN/Infinity
for (let x = 1.001; x < 50; x += 0.013) {
  const r = convert(x.toFixed(3), D).result;
  assert.ok(r && !/NaN|Infinity/.test(r), `D ${x}`);
}

assert.equal(sanitizeTyping('1,8.5a', D), '1,85');
assert.equal(sanitizeTyping('-1a10', A), '-110');
console.log('✓ Todas las pruebas de conversión pasaron');
