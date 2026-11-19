import test from 'node:test';
import assert from 'node:assert/strict';
import {
  addScore,
  computeNearMissFeedback,
  createWorld,
  getDifficultyProfile,
  makeHazard,
  makePickup,
  movePlayerLane,
  startNewRun,
  stepWorld,
} from './engine';
import { PLAYER_Y_NORM, RUSH_COMBO_THRESHOLD, SECRET_UNLOCK_SCORE } from './constants';

test('startNewRun initializes playing state cleanly while preserving bestScore', () => {
  const titleWorld = createWorld({ phase: 'title', bestScore: 64, codeUnlockedEver: false });
  const active = startNewRun(titleWorld);

  assert.equal(active.phase, 'playing');
  assert.equal(active.score, 0);
  assert.equal(active.bestScore, 64);
  assert.equal(active.player.hearts, 2);
  assert.equal(active.player.lane, 1);
  assert.equal(active.unlockedSecretThisRun, false);
  assert.ok(active.entities.length >= 1, 'seeds initial welcoming pickups');
});

test('game survives opening second without input', () => {
  const world = startNewRun(createWorld({ phase: 'title' }));
  for (let i = 0; i < 42; i++) {
    stepWorld(world, 0.03, () => 0.5);
  }
  assert.equal(world.phase, 'playing');
  assert.equal(world.player.hearts, 2);
  assert.ok(world.score > 0, 'opening lane pickup should be collected naturally');
});

test('movePlayerLane clamps cleanly within 0..2', () => {
  const world = startNewRun(createWorld({ phase: 'title' }));
  assert.equal(world.player.lane, 1);
  assert.equal(movePlayerLane(world, -1), true);
  assert.equal(world.player.lane, 0);
  assert.equal(movePlayerLane(world, -1), false);
  assert.equal(world.player.lane, 0);
  assert.equal(movePlayerLane(world, 1), true);
  assert.equal(world.player.lane, 1);
  assert.equal(movePlayerLane(world, 1), true);
  assert.equal(world.player.lane, 2);
  assert.equal(movePlayerLane(world, 1), false);
});

test('milk (+2), donut (+1), tee (+1), and 4-point star (+5) score accurately', () => {
  const world = startNewRun(createWorld({ phase: 'title' }));
  world.entities = [
    makePickup(1, 'donut', 1, PLAYER_Y_NORM),
    makePickup(2, 'milk', 1, PLAYER_Y_NORM),
    makePickup(3, 'star', 1, PLAYER_Y_NORM),
  ];
  stepWorld(world, 0.016, () => 0.5);
  assert.equal(world.score, 8);
});

test('reaching 88 unlocks secret MUGEN reward once without prior spoilers', () => {
  const world = startNewRun(createWorld({ phase: 'title', bestScore: 50 }));
  world.score = 86;
  addScore(world, 2);

  assert.equal(world.score, SECRET_UNLOCK_SCORE);
  assert.equal(world.unlockedSecretThisRun, true);
  assert.equal(world.codeUnlockedEver, true);
  assert.equal(world.bestScore, 88);
  assert.ok(world.soundQueue.includes('unlockSecret'));

  world.soundQueue = [];
  addScore(world, 1);
  assert.equal(world.score, 89);
  assert.equal(world.soundQueue.includes('unlockSecret'), false);
});

test('2x Rush streak only activates at 8 consecutive pickups', () => {
  const world = startNewRun(createWorld({ phase: 'title' }));
  assert.equal(RUSH_COMBO_THRESHOLD, 8);

  world.combo = 6;
  assert.equal(addScore(world, 2), 2);
  world.combo = 7;
  assert.equal(addScore(world, 2), 2);
  world.combo = 8;
  assert.equal(addScore(world, 2), 4);
});

test('hazard direct collision removes 1 heart and second hit triggers gameover', () => {
  const world = startNewRun(createWorld({ phase: 'title', bestScore: 70 }));
  world.entities = [makeHazard(99, 'crate', 1, PLAYER_Y_NORM - 0.01)];

  stepWorld(world, 0.02, () => 0.5, 1000);
  assert.equal(world.player.hearts, 1);
  assert.equal(world.phase, 'playing');
  assert.ok(world.player.invulnTimer > 0);

  world.player.invulnTimer = 0;
  world.hitstopTimer = 0;
  world.entities = [makeHazard(100, 'crate', 1, PLAYER_Y_NORM - 0.01)];
  stepWorld(world, 0.02, () => 0.5, 2500);

  assert.equal(world.player.hearts, 0);
  assert.equal(world.phase, 'gameover');
  assert.ok(world.lastSnapshot);
  assert.equal(world.lastSnapshot?.score, 0);
});

test('close-call graze awards +1 without losing hearts', () => {
  const world = startNewRun(createWorld({ phase: 'title' }));
  world.entities = [
    {
      ...makeHazard(101, 'crate', 0, PLAYER_Y_NORM),
      lane: 0.48,
    },
  ];

  stepWorld(world, 0.016, () => 0.5);
  assert.equal(world.player.hearts, 2);
  assert.equal(world.closeCalls, 1);
  assert.equal(world.score, 1);
  assert.ok(world.soundQueue.includes('graze'));
});

test('near-miss feedback never spoils 88 before reaching 88', () => {
  const near88ButSecret = computeNearMissFeedback({
    score: 84,
    previousBest: 86,
    unlockedSecretThisRun: false,
  });
  assert.equal(near88ButSecret.tone, 'nearmiss');
  assert.equal(near88ButSecret.headline.includes('88'), false);
  assert.equal(near88ButSecret.subline.includes('88'), false);

  const cleared = computeNearMissFeedback({
    score: 88,
    previousBest: 80,
    unlockedSecretThisRun: true,
  });
  assert.equal(cleared.tone, 'victory');
});

test('difficulty profile reflects +15% faster & denser ramp', () => {
  const early = getDifficultyProfile(0.5, 2);
  const mid = getDifficultyProfile(10.0, 25);
  const late = getDifficultyProfile(24.0, 75);

  assert.equal(early.hazardChance, 0);
  assert.ok(early.conveyorSpeed >= 0.6);
  assert.ok(mid.conveyorSpeed > early.conveyorSpeed);
  assert.ok(late.conveyorSpeed > 1.1);
  assert.ok(late.spawnInterval <= 0.27);
  assert.equal(late.maxHazardsPerRow, 2);
});
