export type GamePhase = 'title' | 'playing' | 'paused' | 'gameover';

export type LaneIndex = 0 | 1 | 2;

export type PickupKind = 'tee' | 'milk' | 'donut' | 'star';
export type HazardKind = 'crate' | 'heatpress' | 'spool';
export type EntityKind = PickupKind | HazardKind;

export interface GameEntity {
  id: number;
  kind: EntityKind;
  category: 'pickup' | 'hazard';
  lane: number; // Continuous lane position (0..2)
  baseLane: LaneIndex;
  targetLane: LaneIndex;
  y: number; // Normalized vertical position: -0.15 (top) to 1.15 (bottom)
  speedMul: number;
  points: number;
  collected: boolean;
  grazed: boolean;
  hitPlayer: boolean;
  telegraphTimer: number;
  hasLunged: boolean;
  oscPhase: number;
  oscAmp: number;
}

export interface PlayerState {
  lane: LaneIndex;
  visualLane: number;
  y: number;
  hearts: number;
  maxHearts: number;
  invulnTimer: number;
  squashX: number;
  squashY: number;
  animDist: number;
}

export type GameSoundEvent =
  | 'move'
  | 'pickup'
  | 'star'
  | 'graze'
  | 'hit'
  | 'unlockSecret'
  | 'gameover';

export interface SimPopupEvent {
  lane: number;
  y: number;
  text: string;
  color: string;
}

export interface SimParticleBurst {
  lane: number;
  y: number;
  color: string;
  count: number;
  heavy?: boolean;
}

export interface NearMissFeedback {
  headline: string;
  subline: string;
  tone: 'victory' | 'nearmiss' | 'newbest' | 'retry';
  gapToBest: number | null;
}

export interface RunSnapshot {
  score: number;
  previousBest: number;
  bestScore: number;
  itemsPacked: number;
  closeCalls: number;
  elapsedSeconds: number;
  unlockedSecretThisRun: boolean;
  codeUnlockedEver: boolean;
  nearMiss: NearMissFeedback;
}

export interface GameWorld {
  phase: GamePhase;
  player: PlayerState;
  entities: GameEntity[];
  nextEntityId: number;
  score: number;
  previousBest: number;
  bestScore: number;
  combo: number;
  maxCombo: number;
  itemsPacked: number;
  closeCalls: number;
  elapsed: number;
  scrollOffset: number;
  spawnTimer: number;
  hitstopTimer: number;
  shakeTrauma: number;
  hitFlashTimer: number;
  unlockBannerTimer: number;
  unlockedSecretThisRun: boolean;
  codeUnlockedEver: boolean;
  gameOverTimestamp: number;
  lastSnapshot: RunSnapshot | null;
  soundQueue: GameSoundEvent[];
  popups: SimPopupEvent[];
  bursts: SimParticleBurst[];
}

export interface HudSnapshot {
  phase: GamePhase;
  score: number;
  bestScore: number;
  hearts: number;
  maxHearts: number;
  combo: number;
  unlockedSecretThisRun: boolean;
  codeUnlockedEver: boolean;
  unlockBannerActive: boolean;
  runSnapshot: RunSnapshot | null;
}
