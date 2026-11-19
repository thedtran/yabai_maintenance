import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCountdown,
  validateEmail,
  validatePasscode,
  calculateReadinessPercentage,
  generateTicketCode,
  getSizeSpecs,
} from './lockPageLogic';

test('calculateCountdown formats remaining days, hours, minutes, and seconds', () => {
  const now = 1_700_000_000_000;
  const target = now + ((2 * 86400 + 5 * 3600 + 9 * 60 + 4) * 1000);
  const result = calculateCountdown(target, now);
  assert.deepEqual(result, {
    days: '02',
    hours: '05',
    minutes: '09',
    seconds: '04',
    isExpired: false,
  });
});

test('calculateCountdown clamps expired timestamps to zero', () => {
  const result = calculateCountdown(1000, 5000);
  assert.deepEqual(result, {
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isExpired: true,
  });
});

test('validateEmail rejects empty and malformed emails and accepts valid addresses', () => {
  assert.equal(validateEmail('').valid, false);
  assert.equal(validateEmail('not-an-email').valid, false);
  assert.equal(validateEmail('patron@yabaisociety.jp').valid, true);
});

test('validatePasscode matches case-insensitively and rejects invalid keys', () => {
  assert.equal(validatePasscode('').unlocked, false);
  assert.equal(validatePasscode('wrongkey').unlocked, false);
  assert.equal(validatePasscode(' yabai04 ').unlocked, true);
  assert.equal(validatePasscode('SPIRIT26').unlocked, true);
});

test('calculateReadinessPercentage bounds output between 0 and 100', () => {
  assert.equal(calculateReadinessPercentage(62, 67), 93);
  assert.equal(calculateReadinessPercentage(80, 67), 100);
  assert.equal(calculateReadinessPercentage(0, 0), 0);
});

test('generateTicketCode produces deterministic formatted serial codes', () => {
  const first = generateTicketCode('collector@yabaisociety.jp');
  const second = generateTicketCode('  COLLECTOR@YABAISOCIETY.JP ');
  assert.equal(first, second);
  assert.match(first, /^YS-04-\d{4}$/);
});

test('getSizeSpecs returns accurate measurements and availability status', () => {
  const m = getSizeSpecs('M');
  assert.equal(m.chestCm, 120);
  assert.equal(m.available, true);

  const xxl = getSizeSpecs('2XL');
  assert.equal(xxl.available, false);
});
