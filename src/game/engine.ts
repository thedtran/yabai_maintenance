import {
  GRAZE_POINTS,
  INVULN_ON_HIT,
  MAX_HEARTS,
  PALETTE,
  PICKUP_POINTS,
  PLAYER_Y_NORM,
  RUSH_COMBO_THRESHOLD,
  SECRET_UNLOCK_SCORE,
} from './constants';
import type {
  GameEntity,
  GamePhase,
  GameWorld,
  HazardKind,
  LaneIndex,
  NearMissFeedback,
  PickupKind,
  RunSnapshot,
} from './types';

export function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

export function createInitialPlayer() {
  return {
    lane: 1 as LaneIndex,
    visualLane: 1,
    y: PLAYER_Y_NORM,
    hearts: MAX_HEARTS,
    maxHearts: MAX_HEARTS,
    invulnTimer: 0,
    squashX: 1,
    squashY: 1,
    animDist: 0,
  };
}

export function createWorld(options: {
  phase?: GamePhase;
  bestScore?: number;
  codeUnlockedEver?: boolean;
}): GameWorld {
  const best = Math.max(0, Math.floor(options.bestScore ?? 0));
  const unlockedEver = Boolean(options.codeUnlockedEver) || best >= SECRET_UNLOCK_SCORE;

  return {
    phase: options.phase ?? 'title',
    player: createInitialPlayer(),
    entities: [],
    nextEntityId: 1,
    score: 0,
    previousBest: best,
    bestScore: best,
    combo: 0,
    maxCombo: 0,
    itemsPacked: 0,
    closeCalls: 0,
    elapsed: 0,
    scrollOffset: 0,
    spawnTimer: 0.2,
    hitstopTimer: 0,
    shakeTrauma: 0,
    hitFlashTimer: 0,
    unlockBannerTimer: 0,
    unlockedSecretThisRun: false,
    codeUnlockedEver: unlockedEver,
    gameOverTimestamp: 0,
    lastSnapshot: null,
    soundQueue: [],
    popups: [],
    bursts: [],
  };
}

export function startNewRun(world: GameWorld): GameWorld {
  const preservedBest = Math.max(world.bestScore, world.previousBest);
  const preservedUnlock = world.codeUnlockedEver || preservedBest >= SECRET_UNLOCK_SCORE;

  const fresh = createWorld({
    phase: 'playing',
    bestScore: preservedBest,
    codeUnlockedEver: preservedUnlock,
  });

  // Seed welcoming early pickups so action starts immediately
  fresh.entities.push(
    makePickup(fresh.nextEntityId++, 'donut', 1, 0.22),
    makePickup(fresh.nextEntityId++, 'milk', 0, -0.05)
  );
  fresh.spawnTimer = 0.38;
  return fresh;
}

export function movePlayerLane(world: GameWorld, delta: -1 | 1): boolean {
  if (world.phase !== 'playing') return false;
  const nextLane = clamp(world.player.lane + delta, 0, 2) as LaneIndex;
  if (nextLane === world.player.lane) return false;

  world.player.lane = nextLane;
  world.player.squashX = 0.84;
  world.player.squashY = 1.16;
  world.soundQueue.push('move');
  return true;
}

export function setPlayerLane(world: GameWorld, lane: LaneIndex): boolean {
  if (world.phase !== 'playing') return false;
  if (world.player.lane === lane) return false;
  world.player.lane = lane;
  world.player.squashX = 0.84;
  world.player.squashY = 1.16;
  world.soundQueue.push('move');
  return true;
}

export interface DifficultyProfile {
  conveyorSpeed: number; // Normalized screen heights per second
  spawnInterval: number; // Seconds between wave rows
  hazardChance: number; // 0..1 probability of hazard in wave
  maxHazardsPerRow: 1 | 2;
}

/**
 * +15% increased difficulty ramp across conveyor speed, wave cadence, and hazard density.
 */
export function getDifficultyProfile(elapsed: number, score: number): DifficultyProfile {
  const timeT = clamp(elapsed / 24, 0, 1.3);
  const scoreT = clamp(score / SECRET_UNLOCK_SCORE, 0, 1.35);
  const intensity = clamp(timeT * 0.55 + scoreT * 0.45, 0, 1.3);

  return {
    conveyorSpeed: 0.6 + intensity * 0.55, // ~+15% faster: 0.60 -> 1.315 screen/s
    spawnInterval: Math.max(0.2, 0.48 - intensity * 0.24), // ~15% tighter: 0.48s -> 0.20s
    hazardChance: elapsed < 0.9 ? 0 : clamp(0.42 + intensity * 0.36, 0, 0.88),
    maxHazardsPerRow: elapsed >= 3.5 || score >= 9 ? 2 : 1,
  };
}

export function makePickup(id: number, kind: PickupKind, lane: LaneIndex, y = -0.08): GameEntity {
  return {
    id,
    kind,
    category: 'pickup',
    lane,
    baseLane: lane,
    targetLane: lane,
    y,
    speedMul: kind === 'star' ? 1.12 : 1.0,
    points: PICKUP_POINTS[kind],
    collected: false,
    grazed: false,
    hitPlayer: false,
    telegraphTimer: 0,
    hasLunged: false,
    oscPhase: 0,
    oscAmp: 0,
  };
}

export function makeHazard(
  id: number,
  kind: HazardKind,
  lane: LaneIndex,
  y = -0.08,
  rng: () => number = Math.random
): GameEntity {
  const dir = lane === 0 ? 1 : lane === 2 ? -1 : rng() < 0.5 ? -1 : 1;
  const targetLane = clamp(lane + dir, 0, 2) as LaneIndex;

  return {
    id,
    kind,
    category: 'hazard',
    lane,
    baseLane: lane,
    targetLane,
    y,
    speedMul: kind === 'heatpress' ? 1.12 : kind === 'spool' ? 1.0 : 1.04,
    points: 0,
    collected: false,
    grazed: false,
    hitPlayer: false,
    telegraphTimer: kind === 'heatpress' ? 0.3 : 0,
    hasLunged: false,
    oscPhase: rng() * Math.PI * 2,
    oscAmp: kind === 'spool' ? 0.48 : 0,
  };
}

function pickPickupKind(score: number, rng: () => number): PickupKind {
  const roll = rng();
  if (roll < (score >= 25 ? 0.1 : 0.07)) return 'star';
  if (roll < 0.38) return 'milk';
  if (roll < 0.7) return 'donut';
  return 'tee';
}

function pickHazardKind(elapsed: number, rng: () => number): HazardKind {
  const roll = rng();
  if (elapsed < 3.0) return 'crate';
  if (elapsed < 7.5) return roll < 0.55 ? 'crate' : 'spool';
  if (roll < 0.38) return 'crate';
  if (roll < 0.68) return 'spool';
  return 'heatpress';
}

export function spawnWaveRow(world: GameWorld, rng: () => number = Math.random): void {
  const diff = getDifficultyProfile(world.elapsed, world.score);
  const lanes: LaneIndex[] = [0, 1, 2];

  for (let i = lanes.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [lanes[i], lanes[j]] = [lanes[j], lanes[i]];
  }

  // Always guarantee at least 1 passable lane
  const safeLane = lanes[0];
  const slotA = lanes[1];
  const slotB = lanes[2];

  if (rng() < 0.84) {
    world.entities.push(makePickup(world.nextEntityId++, pickPickupKind(world.score, rng), safeLane));
  }

  let hazardsSpawned = 0;
  if (rng() < diff.hazardChance) {
    const kind = pickHazardKind(world.elapsed, rng);
    world.entities.push(makeHazard(world.nextEntityId++, kind, slotA, -0.08, rng));
    hazardsSpawned++;
  } else if (rng() < 0.32) {
    world.entities.push(makePickup(world.nextEntityId++, pickPickupKind(world.score, rng), slotA));
  }

  if (hazardsSpawned < diff.maxHazardsPerRow && rng() < diff.hazardChance * 0.82) {
    const secondKind: HazardKind = rng() < 0.64 ? 'crate' : 'spool';
    world.entities.push(makeHazard(world.nextEntityId++, secondKind, slotB, -0.08, rng));
  } else if (rng() < 0.18) {
    world.entities.push(makePickup(world.nextEntityId++, pickPickupKind(world.score, rng), slotB));
  }
}

export function computeNearMissFeedback(params: {
  score: number;
  previousBest: number;
  unlockedSecretThisRun: boolean;
}): NearMissFeedback {
  const { score, previousBest, unlockedSecretThisRun } = params;
  const gapToBest = previousBest > 0 ? previousBest - score : null;

  if (score >= SECRET_UNLOCK_SCORE) {
    return {
      headline: unlockedSecretThisRun ? 'SECRET EPISODE DROPPED!' : 'OVERTIME MASTERED!',
      subline: 'You stunned Yuu with an unreal shift — secret Big Cartel code unlocked!',
      tone: 'victory',
      gapToBest,
    };
  }

  if (previousBest > 0 && gapToBest !== null && gapToBest > 0 && gapToBest <= 10) {
    return {
      headline: `SO CLOSE! ${gapToBest} AWAY FROM BEST`,
      subline: `Your record is ${previousBest} — you almost beat it!`,
      tone: 'nearmiss',
      gapToBest,
    };
  }

  if (score > previousBest && previousBest > 0) {
    return {
      headline: `NEW PERSONAL BEST: ${score}!`,
      subline: 'Yuu is finishing shifts faster! Keep pushing your streak.',
      tone: 'newbest',
      gapToBest: 0,
    };
  }

  return {
    headline: previousBest > 0 ? `BEAT YOUR BEST (${previousBest})` : 'SHIFT INTERRUPTED',
    subline: 'Chain 8 pickups for 2x Rush & grab 4-point stars!',
    tone: 'retry',
    gapToBest,
  };
}

export function buildRunSnapshot(world: GameWorld): RunSnapshot {
  const finalBest = Math.max(world.bestScore, world.score);
  return {
    score: world.score,
    previousBest: world.previousBest,
    bestScore: finalBest,
    itemsPacked: world.itemsPacked,
    closeCalls: world.closeCalls,
    elapsedSeconds: Math.round(world.elapsed),
    unlockedSecretThisRun: world.unlockedSecretThisRun,
    codeUnlockedEver: world.codeUnlockedEver || world.score >= SECRET_UNLOCK_SCORE,
    nearMiss: computeNearMissFeedback({
      score: world.score,
      previousBest: world.previousBest,
      unlockedSecretThisRun: world.unlockedSecretThisRun,
    }),
  };
}

export function addScore(world: GameWorld, basePoints: number): number {
  const rushMultiplier = world.combo >= RUSH_COMBO_THRESHOLD ? 2 : 1;
  const gained = basePoints * rushMultiplier;
  world.score += gained;

  if (world.score > world.bestScore) {
    world.bestScore = world.score;
  }

  if (!world.unlockedSecretThisRun && world.score >= SECRET_UNLOCK_SCORE) {
    world.unlockedSecretThisRun = true;
    world.codeUnlockedEver = true;
    world.unlockBannerTimer = 3.0;
    world.hitstopTimer = Math.max(world.hitstopTimer, 0.07);
    world.shakeTrauma = Math.min(1, world.shakeTrauma + 0.42);
    world.soundQueue.push('unlockSecret');
    world.popups.push({
      lane: 1,
      y: 0.4,
      text: 'SECRET DROP!',
      color: PALETTE.gold,
    });
  }

  return gained;
}

export function stepWorld(
  world: GameWorld,
  rawDt: number,
  rng: () => number = Math.random,
  nowMs: number = Date.now()
): void {
  const dt = Math.min(Math.max(rawDt, 0), 0.05);
  if (dt <= 0) return;

  world.shakeTrauma = Math.max(0, world.shakeTrauma - dt * 2.2);
  world.hitFlashTimer = Math.max(0, world.hitFlashTimer - dt);
  world.unlockBannerTimer = Math.max(0, world.unlockBannerTimer - dt);

  const p = world.player;
  const laneLerp = 1 - Math.exp(-26 * dt);
  p.visualLane += (p.lane - p.visualLane) * laneLerp;
  const squashLerp = 1 - Math.exp(-16 * dt);
  p.squashX += (1 - p.squashX) * squashLerp;
  p.squashY += (1 - p.squashY) * squashLerp;

  if (world.phase === 'paused' || world.phase === 'gameover') {
    return;
  }

  if (world.phase === 'title') {
    world.scrollOffset = (world.scrollOffset + dt * 0.36) % 1;
    p.animDist += dt * 4.8;
    world.spawnTimer -= dt;
    if (world.spawnTimer <= 0) {
      world.spawnTimer = 0.65;
      const lane = Math.floor(rng() * 3) as LaneIndex;
      world.entities.push(makePickup(world.nextEntityId++, pickPickupKind(0, rng), lane, -0.08));
    }
    for (const ent of world.entities) {
      ent.y += dt * 0.36;
    }
    world.entities = world.entities.filter((e) => e.y < 1.15);
    return;
  }

  if (world.hitstopTimer > 0) {
    world.hitstopTimer = Math.max(0, world.hitstopTimer - dt);
    return;
  }

  world.elapsed += dt;
  p.invulnTimer = Math.max(0, p.invulnTimer - dt);

  const diff = getDifficultyProfile(world.elapsed, world.score);
  const beltSpeed = diff.conveyorSpeed;

  world.scrollOffset = (world.scrollOffset + beltSpeed * dt) % 1;
  p.animDist += beltSpeed * dt * 14;

  world.spawnTimer -= dt;
  if (world.spawnTimer <= 0) {
    world.spawnTimer = diff.spawnInterval;
    spawnWaveRow(world, rng);
  }

  const playerLanePos = p.visualLane;
  const pickupLaneThreshold = 0.44;
  const pickupYThreshold = 0.075;
  const hazardLaneThreshold = 0.39;
  const hazardYThreshold = 0.062;
  const grazeLaneThreshold = 0.74;
  const grazeYThreshold = 0.078;

  for (const ent of world.entities) {
    ent.y += beltSpeed * ent.speedMul * dt;

    if (ent.category === 'hazard') {
      if (ent.kind === 'heatpress') {
        if (!ent.hasLunged && ent.y > 0.2) {
          if (ent.telegraphTimer > 0) {
            ent.telegraphTimer -= dt;
          } else {
            ent.hasLunged = true;
          }
        }
        if (ent.hasLunged) {
          ent.lane += (ent.targetLane - ent.lane) * (1 - Math.exp(-18 * dt));
        }
      } else if (ent.kind === 'spool') {
        ent.oscPhase += dt * 6.0;
        const offset = Math.sin(ent.oscPhase) * ent.oscAmp;
        ent.lane = clamp(ent.baseLane + offset, 0, 2);
      }
    }

    const dy = Math.abs(ent.y - p.y);
    const dl = Math.abs(ent.lane - playerLanePos);

    if (ent.category === 'pickup' && !ent.collected) {
      if (dl <= pickupLaneThreshold && dy <= pickupYThreshold) {
        ent.collected = true;
        world.itemsPacked += 1;
        world.combo += 1;
        world.maxCombo = Math.max(world.maxCombo, world.combo);
        p.squashX = 1.18;
        p.squashY = 0.86;

        const gained = addScore(world, ent.points);
        const isStar = ent.kind === 'star';
        world.soundQueue.push(isStar ? 'star' : 'pickup');
        world.popups.push({
          lane: ent.lane,
          y: p.y - 0.06,
          text: world.combo >= RUSH_COMBO_THRESHOLD ? `+${gained} x2` : `+${gained}`,
          color: isStar ? PALETTE.gold : ent.kind === 'donut' ? PALETTE.pink : PALETTE.mint,
        });
        world.bursts.push({
          lane: ent.lane,
          y: ent.y,
          color: isStar ? PALETTE.gold : ent.kind === 'donut' ? PALETTE.pink : PALETTE.mint,
          count: isStar ? 18 : 7,
          heavy: isStar,
        });
      }
    } else if (ent.category === 'hazard' && !ent.hitPlayer) {
      if (p.invulnTimer <= 0 && dl <= hazardLaneThreshold && dy <= hazardYThreshold) {
        ent.hitPlayer = true;
        ent.grazed = true;
        p.hearts = Math.max(0, p.hearts - 1);
        p.invulnTimer = INVULN_ON_HIT;
        world.combo = 0;
        world.hitstopTimer = 0.065;
        world.hitFlashTimer = 0.09;
        world.shakeTrauma = 0.85;
        p.squashX = 1.28;
        p.squashY = 0.72;

        world.bursts.push({
          lane: p.visualLane,
          y: p.y,
          color: PALETTE.vermilion,
          count: 20,
          heavy: true,
        });

        if (p.hearts <= 0) {
          world.phase = 'gameover';
          world.gameOverTimestamp = nowMs;
          world.lastSnapshot = buildRunSnapshot(world);
          world.bestScore = world.lastSnapshot.bestScore;
          world.soundQueue.push('gameover');
          return;
        } else {
          world.soundQueue.push('hit');
          world.popups.push({
            lane: p.visualLane,
            y: p.y - 0.07,
            text: '1 HEART LEFT!',
            color: PALETTE.vermilion,
          });
        }
      } else if (
        !ent.grazed &&
        ent.y >= p.y - 0.02 &&
        dy <= grazeYThreshold &&
        dl > hazardLaneThreshold &&
        dl <= grazeLaneThreshold
      ) {
        ent.grazed = true;
        world.closeCalls += 1;
        const gained = addScore(world, GRAZE_POINTS);
        world.soundQueue.push('graze');
        world.popups.push({
          lane: p.visualLane,
          y: p.y - 0.08,
          text: `CLOSE! +${gained}`,
          color: PALETTE.gold,
        });
        world.bursts.push({
          lane: (p.visualLane + ent.lane) * 0.5,
          y: p.y,
          color: PALETTE.gold,
          count: 6,
        });
      }
    }
  }

  world.entities = world.entities.filter((e) => !e.collected && !e.hitPlayer && e.y < 1.15);
}
