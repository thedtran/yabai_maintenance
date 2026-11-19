export const SECRET_UNLOCK_SCORE = 88;
export const RUSH_COMBO_THRESHOLD = 8;

export const DISCOUNT_CODE = 'MUGEN';
export const BIG_CARTEL_STORE_URL = 'https://bigcartel.com';

export const STORAGE_KEYS = {
  bestScore: 'yuus_rush_best_score_v2',
  unlockedCode: 'yuus_rush_unlocked_mugen_v1',
  muted: 'yuus_rush_muted_v1',
} as const;

export const PLAYER_Y_NORM = 0.81;
export const MAX_HEARTS = 2;
export const INVULN_ON_HIT = 0.9;
export const RESTART_INPUT_GUARD_MS = 260;

export const PICKUP_POINTS = {
  tee: 1,
  milk: 2,
  donut: 1,
  star: 5,
} as const;

export const GRAZE_POINTS = 1;

export const PALETTE = {
  cabinetBg: '#0d0f1c',
  beltBase: '#1b1d2e',
  beltTrack: '#24273e',
  beltDivider: '#343856',
  cream: '#f5f0e1',
  vermilion: '#ff3d36',
  gold: '#ffd147',
  mint: '#38e59b',
  sky: '#56c2ff',
  plum: '#b066ff',
  pink: '#ff77a8',
  ink: '#090a12',
} as const;
