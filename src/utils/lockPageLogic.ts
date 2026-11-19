export type GarmentSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | '2XL';

export type ArtworkView = 'front' | 'back' | 'blueprint';

export interface CountdownParts {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
  isExpired: boolean;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export interface PasscodeResult {
  unlocked: boolean;
  error?: string;
}

export interface SizeMeasurement {
  size: GarmentSize;
  chestCm: number;
  lengthCm: number;
  shoulderCm: number;
  fitNote: string;
  available: boolean;
}

export const VALID_PATRON_CODES = ['YABAI04', 'SPIRIT26', 'YUUCHAN'];

export const GARMENT_SIZES: SizeMeasurement[] = [
  { size: 'XS', chestCm: 108, lengthCm: 66, shoulderCm: 48, fitNote: 'Cropped boxy', available: true },
  { size: 'S', chestCm: 114, lengthCm: 69, shoulderCm: 51, fitNote: 'Standard relaxed', available: true },
  { size: 'M', chestCm: 120, lengthCm: 72, shoulderCm: 54, fitNote: 'Signature drop shoulder', available: true },
  { size: 'L', chestCm: 126, lengthCm: 75, shoulderCm: 57, fitNote: 'Oversized studio cut', available: true },
  { size: 'XL', chestCm: 132, lengthCm: 78, shoulderCm: 60, fitNote: 'Wide street drape', available: true },
  { size: '2XL', chestCm: 138, lengthCm: 80, shoulderCm: 62, fitNote: 'Archive hold only', available: false },
];

export function calculateCountdown(targetMs: number, nowMs: number): CountdownParts {
  const diff = Math.max(0, targetMs - nowMs);
  if (diff === 0) {
    return {
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isExpired: true,
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days: String(days).padStart(2, '0'),
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    isExpired: false,
  };
}

export function validateEmail(email: string): ValidationResult {
  const trimmed = email.trim();
  if (!trimmed) {
    return { valid: false, error: 'Enter an email address to receive the dispatch link.' };
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailPattern.test(trimmed)) {
    return { valid: false, error: 'Use a valid email format (for example, name@domain.com).' };
  }
  return { valid: true };
}

export function validatePasscode(input: string, validCodes: string[] = VALID_PATRON_CODES): PasscodeResult {
  const normalized = input.trim().toUpperCase();
  if (!normalized) {
    return { unlocked: false, error: 'Enter your patron passcode to open staging access.' };
  }
  if (!validCodes.includes(normalized)) {
    return { unlocked: false, error: 'Passcode not recognized for Drop 04 staging.' };
  }
  return { unlocked: true };
}

export function calculateReadinessPercentage(passed: number, total: number): number {
  if (total <= 0) return 0;
  const clamped = Math.max(0, Math.min(passed, total));
  return Math.round((clamped / total) * 100);
}

export function generateTicketCode(email: string): string {
  const clean = email.trim().toLowerCase();
  let hash = 0;
  for (let i = 0; i < clean.length; i += 1) {
    hash = (hash * 31 + clean.charCodeAt(i)) % 9000;
  }
  const num = String(1000 + hash).padStart(4, '0');
  return `YS-04-${num}`;
}

export function getSizeSpecs(size: GarmentSize): SizeMeasurement {
  return GARMENT_SIZES.find((item) => item.size === size) ?? GARMENT_SIZES[2];
}
