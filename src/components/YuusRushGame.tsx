import { useCallback, useEffect, useRef, useState } from 'react';
import { GameHud } from './yuus-rush/GameHud';
import { GameOverModal } from './yuus-rush/GameOverModal';
import { PauseModal } from './yuus-rush/PauseModal';
import { TitleScreen } from './yuus-rush/TitleScreen';
import { chiptuneAudio } from '../game/audio';
import { RESTART_INPUT_GUARD_MS, SECRET_UNLOCK_SCORE, STORAGE_KEYS } from '../game/constants';
import {
  createWorld,
  movePlayerLane,
  setPlayerLane,
  startNewRun,
  stepWorld,
} from '../game/engine';
import { StudioCanvasRenderer } from '../game/renderer';
import type { GameWorld, HudSnapshot, LaneIndex } from '../game/types';

export interface YuusRushGameProps {
  onClose: () => void;
}

function readStoredBest(): number {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.bestScore);
    const parsed = raw ? parseInt(raw, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function readStoredUnlock(best: number): boolean {
  if (best >= SECRET_UNLOCK_SCORE) return true;
  try {
    return window.localStorage.getItem(STORAGE_KEYS.unlockedCode) === '1';
  } catch {
    return false;
  }
}

function readStoredMuted(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEYS.muted) === '1';
  } catch {
    return false;
  }
}

function toHudSnapshot(world: GameWorld): HudSnapshot {
  return {
    phase: world.phase,
    score: world.score,
    bestScore: world.bestScore,
    hearts: world.player.hearts,
    maxHearts: world.player.maxHearts,
    combo: world.combo,
    unlockedSecretThisRun: world.unlockedSecretThisRun,
    codeUnlockedEver: world.codeUnlockedEver,
    unlockBannerActive: world.unlockBannerTimer > 0,
    runSnapshot: world.lastSnapshot,
  };
}

function hudChanged(a: HudSnapshot, b: HudSnapshot): boolean {
  return (
    a.phase !== b.phase ||
    a.score !== b.score ||
    a.bestScore !== b.bestScore ||
    a.hearts !== b.hearts ||
    a.combo !== b.combo ||
    a.unlockedSecretThisRun !== b.unlockedSecretThisRun ||
    a.codeUnlockedEver !== b.codeUnlockedEver ||
    a.unlockBannerActive !== b.unlockBannerActive ||
    a.runSnapshot !== b.runSnapshot
  );
}

export default function YuusRushGame({ onClose }: YuusRushGameProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<StudioCanvasRenderer | null>(null);

  const initialBest = typeof window !== 'undefined' ? readStoredBest() : 0;
  const initialUnlocked = typeof window !== 'undefined' ? readStoredUnlock(initialBest) : false;

  const initialWorld = createWorld({
    phase: 'title',
    bestScore: initialBest,
    codeUnlockedEver: initialUnlocked,
  });

  const worldRef = useRef<GameWorld>(initialWorld);
  const lastHudRef = useRef<HudSnapshot>(toHudSnapshot(initialWorld));
  const [hud, setHud] = useState<HudSnapshot>(() => lastHudRef.current);
  const [muted, setMuted] = useState<boolean>(() => {
    const m = typeof window !== 'undefined' ? readStoredMuted() : false;
    chiptuneAudio.setMuted(m);
    return m;
  });

  const touchStartRef = useRef<{ x: number; y: number; t: number } | null>(null);

  const syncHudAndStorage = useCallback((world: GameWorld) => {
    try {
      const storedBest = readStoredBest();
      if (world.bestScore > storedBest) {
        window.localStorage.setItem(STORAGE_KEYS.bestScore, String(world.bestScore));
      }
      if (world.codeUnlockedEver) {
        window.localStorage.setItem(STORAGE_KEYS.unlockedCode, '1');
      }
    } catch {
      // Ignore storage quota / private mode restrictions
    }
    const next = toHudSnapshot(world);
    if (hudChanged(lastHudRef.current, next)) {
      lastHudRef.current = next;
      setHud(next);
    }
  }, []);

  const handleClose = useCallback(() => {
    chiptuneAudio.suspend();
    onClose();
  }, [onClose]);

  const handleStartOrRestart = useCallback(() => {
    chiptuneAudio.unlock();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    rendererRef.current?.resetEffects();
    worldRef.current = startNewRun(worldRef.current);
    syncHudAndStorage(worldRef.current);
    canvasRef.current?.focus();
  }, [syncHudAndStorage]);

  const handlePauseToggle = useCallback(() => {
    const world = worldRef.current;
    if (world.phase === 'playing') {
      world.phase = 'paused';
      chiptuneAudio.suspend();
      syncHudAndStorage(world);
    } else if (world.phase === 'paused') {
      world.phase = 'playing';
      chiptuneAudio.unlock();
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      syncHudAndStorage(world);
      canvasRef.current?.focus();
    }
  }, [syncHudAndStorage]);

  const handleGoTitle = useCallback(() => {
    const world = worldRef.current;
    const best = Math.max(world.bestScore, world.previousBest);
    const unlocked = world.codeUnlockedEver || best >= SECRET_UNLOCK_SCORE;
    rendererRef.current?.resetEffects();
    worldRef.current = createWorld({
      phase: 'title',
      bestScore: best,
      codeUnlockedEver: unlocked,
    });
    chiptuneAudio.suspend();
    syncHudAndStorage(worldRef.current);
  }, [syncHudAndStorage]);

  const handleToggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev;
      chiptuneAudio.setMuted(next);
      try {
        window.localStorage.setItem(STORAGE_KEYS.muted, next ? '1' : '0');
      } catch {
        // ignore
      }
      if (!next) chiptuneAudio.unlock();
      return next;
    });
  }, []);

  const handleSelectLane = useCallback((lane: LaneIndex) => {
    chiptuneAudio.unlock();
    setPlayerLane(worldRef.current, lane);
  }, []);

  // Suspend audio cleanly when modal unmounts
  useEffect(() => {
    return () => {
      chiptuneAudio.suspend();
    };
  }, []);

  // Main isolated 60fps Canvas loop + ResizeObserver
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!rendererRef.current) {
      rendererRef.current = new StudioCanvasRenderer();
    }
    const renderer = rendererRef.current;

    let cssWidth = container.clientWidth || window.innerWidth;
    let cssHeight = container.clientHeight || window.innerHeight;

    const updateCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      cssWidth = Math.max(320, Math.round(rect.width));
      cssHeight = Math.max(320, Math.round(rect.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(cssWidth * dpr);
      canvas.height = Math.round(cssHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    updateCanvasSize();
    const ro = new ResizeObserver(updateCanvasSize);
    ro.observe(container);

    let rafId = 0;
    let lastTime = performance.now();

    const frame = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      const world = worldRef.current;

      stepWorld(world, dt, Math.random, Date.now());

      while (world.soundQueue.length > 0) {
        const sfx = world.soundQueue.shift()!;
        chiptuneAudio.play(sfx, world.combo);
      }

      renderer.render(ctx, world, cssWidth, cssHeight, dt);
      syncHudAndStorage(world);
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
    };
  }, [syncHudAndStorage]);

  // Unified Keyboard Input & Focus-Loss Hygiene
  useEffect(() => {
    const heldKeys = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key;
      const lower = key.toLowerCase();
      const world = worldRef.current;

      if (lower === 'm') {
        e.preventDefault();
        handleToggleMute();
        return;
      }

      if (key === 'Escape' && world.phase === 'title') {
        e.preventDefault();
        handleClose();
        return;
      }

      if (key === 'Escape' || lower === 'p') {
        if (world.phase === 'playing' || world.phase === 'paused') {
          e.preventDefault();
          handlePauseToggle();
        }
        return;
      }

      if (lower === 'r' && !e.repeat) {
        if (world.phase === 'playing' || world.phase === 'paused' || world.phase === 'gameover') {
          e.preventDefault();
          handleStartOrRestart();
        }
        return;
      }

      if (world.phase === 'title') {
        if ((key === 'Enter' || key === ' ') && !e.repeat) {
          e.preventDefault();
          handleStartOrRestart();
        }
        return;
      }

      if (world.phase === 'gameover') {
        if ((key === 'Enter' || key === ' ') && !e.repeat) {
          if (Date.now() - world.gameOverTimestamp >= RESTART_INPUT_GUARD_MS) {
            e.preventDefault();
            handleStartOrRestart();
          }
        }
        return;
      }

      if (world.phase !== 'playing') return;
      if (heldKeys.has(lower)) return;
      heldKeys.add(lower);

      chiptuneAudio.unlock();

      if (key === 'ArrowLeft' || lower === 'a') {
        e.preventDefault();
        movePlayerLane(world, -1);
      } else if (key === 'ArrowRight' || lower === 'd') {
        e.preventDefault();
        movePlayerLane(world, 1);
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      heldKeys.delete(e.key.toLowerCase());
    };

    const clearHeld = () => {
      heldKeys.clear();
    };

    const onVisibility = () => {
      if (document.hidden) clearHeld();
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('blur', clearHeld);
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('blur', clearHeld);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [handleClose, handlePauseToggle, handleStartOrRestart, handleToggleMute]);

  // Direct Canvas Pointer & Touch Swipe / Tap-Lane Controls
  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const world = worldRef.current;
    if (world.phase !== 'playing') return;
    chiptuneAudio.unlock();
    touchStartRef.current = { x: e.clientX, y: e.clientY, t: performance.now() };
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const world = worldRef.current;
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    if (world.phase !== 'playing' || !canvas || !renderer) return;

    const start = touchStartRef.current;
    touchStartRef.current = null;

    if (start) {
      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;
      if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) {
        movePlayerLane(world, dx < 0 ? -1 : 1);
        return;
      }
    }

    const rect = canvas.getBoundingClientRect();
    const localX = e.clientX - rect.left;
    const { beltLeft, beltWidth, laneWidth } = renderer.getBeltLayout(rect.width, rect.height);
    if (localX < beltLeft) {
      movePlayerLane(world, -1);
    } else if (localX > beltLeft + beltWidth) {
      movePlayerLane(world, 1);
    } else {
      const tappedLane = Math.max(0, Math.min(2, Math.floor((localX - beltLeft) / laneWidth))) as LaneIndex;
      setPlayerLane(world, tappedLane);
    }
  };

  return (
    <div
      className="yuus-rush-shell z-50"
      data-state={hud.phase}
      role="dialog"
      aria-modal="true"
      aria-label="Yuu's Rush 8-Bit Arcade"
    >
      {/* Isolated Full-Viewport Canvas Layer */}
      <div ref={containerRef} className="absolute inset-0">
        <canvas
          ref={canvasRef}
          tabIndex={0}
          data-testid="game-canvas"
          aria-label="Yuu's Rush 3-lane arcade playfield"
          onPointerDown={handleCanvasPointerDown}
          onPointerUp={handleCanvasPointerUp}
          className="block w-full h-full outline-none cursor-pointer touch-none"
        />
      </div>

      {/* Subtle retro CRT scanlines */}
      <div className="crt-scanlines fixed inset-0 pointer-events-none opacity-35" aria-hidden="true" />

      {/* Title Screen Overlay */}
      {hud.phase === 'title' && (
        <TitleScreen
          bestScore={hud.bestScore}
          codeUnlockedEver={hud.codeUnlockedEver}
          onStart={handleStartOrRestart}
          onClose={handleClose}
        />
      )}

      {/* Active HUD */}
      {(hud.phase === 'playing' || hud.phase === 'paused') && (
        <GameHud
          hud={hud}
          muted={muted}
          onToggleMute={handleToggleMute}
          onPause={handlePauseToggle}
          onRestart={handleStartOrRestart}
          onSelectLane={handleSelectLane}
        />
      )}

      {/* Pause Modal */}
      {hud.phase === 'paused' && (
        <PauseModal
          score={hud.score}
          bestScore={hud.bestScore}
          codeUnlockedEver={hud.codeUnlockedEver}
          onResume={handlePauseToggle}
          onRestart={handleStartOrRestart}
          onTitle={handleGoTitle}
          onClose={handleClose}
        />
      )}

      {/* Game Over / Near-Miss & Instant Restart Modal */}
      {hud.phase === 'gameover' && hud.runSnapshot && (
        <GameOverModal
          snapshot={hud.runSnapshot}
          onRestart={handleStartOrRestart}
          onTitle={handleGoTitle}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
