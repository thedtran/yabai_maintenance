import { PALETTE, RUSH_COMBO_THRESHOLD } from './constants';
import { getPixelSprite, type SpriteKey } from './sprites';
import type { GameWorld } from './types';

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingPopup {
  active: boolean;
  x: number;
  y: number;
  vy: number;
  text: string;
  color: string;
  life: number;
  maxLife: number;
}

const MAX_PARTICLES = 96;
const MAX_POPUPS = 24;

export class StudioCanvasRenderer {
  private particles: Particle[];
  private popups: FloatingPopup[];
  private particleHead = 0;
  private popupHead = 0;
  private skyTimer = 0;
  private skyCache: HTMLCanvasElement | null = null;
  private skyCacheW = 0;
  private skyCacheH = 0;
  private skyCacheBeltLeft = 0;
  private skyCacheBeltWidth = 0;

  constructor() {
    this.particles = Array.from({ length: MAX_PARTICLES }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 4,
      color: PALETTE.cream,
      life: 0,
      maxLife: 0.4,
    }));

    this.popups = Array.from({ length: MAX_POPUPS }, () => ({
      active: false,
      x: 0,
      y: 0,
      vy: -40,
      text: '',
      color: PALETTE.gold,
      life: 0,
      maxLife: 0.7,
    }));
  }

  resetEffects(): void {
    for (const p of this.particles) p.active = false;
    for (const pop of this.popups) pop.active = false;
  }

  /** Computes the playable 3-lane conveyor belt rectangle inside any viewport */
  getBeltLayout(width: number, height: number) {
    const isCompact = width < 640;
    const beltWidth = isCompact ? Math.min(width - 28, 380) : Math.min(460, Math.max(350, width * 0.36));
    const beltLeft = Math.round((width - beltWidth) / 2);
    const laneWidth = beltWidth / 3;
    return { beltLeft, beltWidth, laneWidth, height, isCompact };
  }

  laneToX(lane: number, beltLeft: number, laneWidth: number): number {
    return beltLeft + (lane + 0.5) * laneWidth;
  }

  private spawnParticle(x: number, y: number, color: string, heavy = false): void {
    const p = this.particles[this.particleHead];
    this.particleHead = (this.particleHead + 1) % MAX_PARTICLES;

    const angle = Math.random() * Math.PI * 2;
    const speed = (heavy ? 110 : 65) + Math.random() * (heavy ? 180 : 115);
    p.active = true;
    p.x = x;
    p.y = y;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed - 35;
    p.size = heavy ? 6 : 4;
    p.color = color;
    p.life = heavy ? 0.52 : 0.34;
    p.maxLife = p.life;
  }

  private spawnPopup(x: number, y: number, text: string, color: string): void {
    const pop = this.popups[this.popupHead];
    this.popupHead = (this.popupHead + 1) % MAX_POPUPS;

    pop.active = true;
    pop.x = x;
    pop.y = y;
    pop.vy = -54;
    pop.text = text;
    pop.color = color;
    pop.life = 0.74;
    pop.maxLife = 0.74;
  }

  render(
    ctx: CanvasRenderingContext2D,
    world: GameWorld,
    width: number,
    height: number,
    dt: number
  ): void {
    this.skyTimer += dt;
    const { beltLeft, beltWidth, laneWidth, isCompact } = this.getBeltLayout(width, height);

    while (world.bursts.length > 0) {
      const b = world.bursts.shift()!;
      const bx = this.laneToX(b.lane, beltLeft, laneWidth);
      const by = b.y * height;
      for (let i = 0; i < b.count; i++) {
        this.spawnParticle(bx, by, b.color, b.heavy);
      }
    }

    while (world.popups.length > 0) {
      const pop = world.popups.shift()!;
      const px = this.laneToX(pop.lane, beltLeft, laneWidth);
      const py = pop.y * height;
      this.spawnPopup(px, py, pop.text, pop.color);
    }

    for (const p of this.particles) {
      if (!p.active) continue;
      p.life -= dt;
      if (p.life <= 0) {
        p.active = false;
        continue;
      }
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 260 * dt;
    }

    for (const pop of this.popups) {
      if (!pop.active) continue;
      pop.life -= dt;
      if (pop.life <= 0) {
        pop.active = false;
        continue;
      }
      pop.y += pop.vy * dt;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = false;

    if (world.shakeTrauma > 0.005) {
      const shake = world.shakeTrauma * world.shakeTrauma * 12;
      ctx.translate((Math.random() * 2 - 1) * shake, (Math.random() * 2 - 1) * shake);
    }

    // 1. Coded 8-bit Osaka / Tokyo Night Cityscape Backdrop
    this.drawTokyoOsakaSkyline(ctx, width, height, beltLeft, beltWidth, isCompact, world);

    // 2. Main 3-lane rooftop studio conveyor floor
    const overtimeMode = world.unlockedSecretThisRun && world.phase === 'playing';
    ctx.fillStyle = overtimeMode ? 'rgba(30, 23, 52, 0.94)' : 'rgba(24, 26, 44, 0.93)';
    ctx.fillRect(beltLeft, 0, beltWidth, height);

    // Conveyor rails
    ctx.fillStyle = '#3c4166';
    ctx.fillRect(beltLeft - 6, 0, 6, height);
    ctx.fillRect(beltLeft + beltWidth, 0, 6, height);
    ctx.fillStyle = '#090a12';
    ctx.fillRect(beltLeft - 9, 0, 3, height);
    ctx.fillRect(beltLeft + beltWidth + 6, 0, 3, height);

    // Scrolling conveyor slats
    const slatSpacing = 44;
    const slatYOffset = (world.scrollOffset * height * 0.4) % slatSpacing;
    ctx.fillStyle = overtimeMode ? '#332854' : PALETTE.beltTrack;
    for (let y = slatYOffset - slatSpacing; y < height + slatSpacing; y += slatSpacing) {
      ctx.fillRect(beltLeft + 4, Math.round(y), beltWidth - 8, 6);
    }

    // Lane dividers
    ctx.fillStyle = overtimeMode ? '#7459ad' : PALETTE.beltDivider;
    for (let i = 1; i < 3; i++) {
      const lx = Math.round(beltLeft + i * laneWidth);
      for (let y = slatYOffset - slatSpacing; y < height + slatSpacing; y += slatSpacing) {
        ctx.fillRect(lx - 2, Math.round(y + 10), 4, 20);
      }
    }

    // Active lane highlight
    if (world.phase === 'playing') {
      const activeLaneX = beltLeft + world.player.lane * laneWidth;
      ctx.fillStyle = 'rgba(245, 240, 225, 0.04)';
      ctx.fillRect(activeLaneX, 0, laneWidth, height);
    }

    // 3. In-world Personal Best Finish Tape (no 88 spoiler!)
    if (world.phase === 'playing') {
      this.drawBestTapeMarker(ctx, world, beltLeft, beltWidth, height);
    }

    // 4. Heat-press telegraph laser lines
    for (const ent of world.entities) {
      if (ent.kind === 'heatpress' && !ent.hasLunged && ent.y > 0.08) {
        const fromX = this.laneToX(ent.lane, beltLeft, laneWidth);
        const toX = this.laneToX(ent.targetLane, beltLeft, laneWidth);
        const ey = ent.y * height;
        const pulse = Math.sin(this.skyTimer * 30) > 0;
        ctx.save();
        ctx.strokeStyle = pulse ? PALETTE.gold : PALETTE.vermilion;
        ctx.lineWidth = 3;
        ctx.setLineDash([6, 5]);
        ctx.beginPath();
        ctx.moveTo(fromX, ey);
        ctx.lineTo(toX, ey + 45);
        ctx.stroke();

        ctx.fillStyle = pulse ? PALETTE.gold : PALETTE.vermilion;
        ctx.fillRect(Math.round(toX - 6), Math.round(ey + 39), 12, 12);
        ctx.restore();
      }
    }

    // 5. Entities: obvious BAD hazard framing & dazzling 4-point STAR aura
    const spriteSize = isCompact ? 48 : 54;
    for (const ent of world.entities) {
      const ex = Math.round(this.laneToX(ent.lane, beltLeft, laneWidth));
      const bob = ent.category === 'pickup' ? Math.sin(this.skyTimer * 6 + ent.id) * 3 : 0;
      const ey = Math.round(ent.y * height + bob);

      // Obvious BAD pickup framing: pulsing crimson danger tile + corner brackets
      if (ent.category === 'hazard') {
        const flash = Math.sin(this.skyTimer * 18 + ent.id) > 0;
        const box = spriteSize + 10;
        const bx = ex - Math.round(box / 2);
        const by = Math.round(ent.y * height) - Math.round(box / 2);

        ctx.fillStyle = flash ? 'rgba(255, 61, 54, 0.24)' : 'rgba(255, 61, 54, 0.13)';
        ctx.fillRect(bx, by, box, box);

        // Caution corner brackets
        ctx.fillStyle = flash ? PALETTE.vermilion : PALETTE.gold;
        const bLen = 8;
        ctx.fillRect(bx, by, bLen, 3);
        ctx.fillRect(bx, by, 3, bLen);
        ctx.fillRect(bx + box - bLen, by, bLen, 3);
        ctx.fillRect(bx + box - 3, by, 3, bLen);
        ctx.fillRect(bx, by + box - 3, bLen, 3);
        ctx.fillRect(bx, by + box - bLen, 3, bLen);
        ctx.fillRect(bx + box - bLen, by + box - 3, bLen, 3);
        ctx.fillRect(bx + box - 3, by + box - bLen, 3, bLen);
      } else if (ent.kind === 'star') {
        // AMAZING 4-point star pickup: dazzling golden sparkle rays + pulsing halo box!
        const pulse = 0.5 + 0.5 * Math.sin(this.skyTimer * 10 + ent.id);
        const halo = spriteSize + 16 + Math.round(pulse * 6);
        ctx.fillStyle = `rgba(255, 209, 71, ${0.16 + pulse * 0.16})`;
        ctx.fillRect(ex - Math.round(halo / 2), ey - Math.round(halo / 2), halo, halo);

        // Orbiting 4-point mini pixel sparkles
        ctx.fillStyle = PALETTE.cream;
        const r = Math.round(spriteSize * 0.58);
        const sOffset = Math.round(Math.sin(this.skyTimer * 7) * 4);
        ctx.fillRect(ex - 2, ey - r - sOffset, 4, 4);
        ctx.fillRect(ex - 2, ey + r + sOffset - 4, 4, 4);
        ctx.fillRect(ex - r - sOffset, ey - 2, 4, 4);
        ctx.fillRect(ex + r + sOffset - 4, ey - 2, 4, 4);
      }

      // Floor shadow
      ctx.fillStyle = 'rgba(9, 10, 18, 0.45)';
      ctx.fillRect(
        ex - Math.round(spriteSize * 0.34),
        Math.round(ent.y * height + spriteSize * 0.36),
        Math.round(spriteSize * 0.68),
        8
      );

      const drawSize = ent.kind === 'star' ? spriteSize + 6 : spriteSize;
      const sprite = getPixelSprite(ent.kind as SpriteKey);
      if (sprite) {
        ctx.drawImage(
          sprite,
          ex - Math.round(drawSize / 2),
          ey - Math.round(drawSize / 2),
          drawSize,
          drawSize
        );
      }
    }

    // 6. Player (Faithful 8-bit Yuu!)
    const p = world.player;
    const px = Math.round(this.laneToX(p.visualLane, beltLeft, laneWidth));
    const runBob = Math.abs(Math.sin(p.animDist)) * 3;
    const py = Math.round(p.y * height - runBob);
    const pW = isCompact ? 58 : 66;
    const pH = isCompact ? 68 : 78;

    const blinkHide = p.invulnTimer > 0 && Math.floor(p.invulnTimer * 16) % 2 === 0;

    ctx.fillStyle = 'rgba(9, 10, 18, 0.55)';
    ctx.fillRect(px - 22, Math.round(p.y * height + pH * 0.36), 44, 10);

    if (!blinkHide) {
      const frame: SpriteKey = Math.floor(p.animDist) % 2 === 0 ? 'yuu1' : 'yuu2';
      const yuuSprite = getPixelSprite(frame);
      if (yuuSprite) {
        ctx.save();
        ctx.translate(px, py);
        const tilt = (p.lane - p.visualLane) * 0.16;
        ctx.rotate(tilt);
        ctx.scale(p.squashX, p.squashY);
        ctx.drawImage(yuuSprite, -pW / 2, -pH / 2, pW, pH);
        ctx.restore();
      }
    }

    // 7. Pooled Pixel Particles
    for (const pt of this.particles) {
      if (!pt.active) continue;
      const alpha = Math.max(0, pt.life / pt.maxLife);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = pt.color;
      ctx.fillRect(Math.round(pt.x - pt.size / 2), Math.round(pt.y - pt.size / 2), pt.size, pt.size);
    }
    ctx.globalAlpha = 1;

    // 8. Pooled Floating Pixel Popups
    ctx.font = '700 14px "Silkscreen", monospace';
    ctx.textAlign = 'center';
    for (const pop of this.popups) {
      if (!pop.active) continue;
      const alpha = Math.min(1, (pop.life / pop.maxLife) * 1.4);
      ctx.globalAlpha = alpha;
      ctx.fillStyle = PALETTE.ink;
      ctx.fillText(pop.text, Math.round(pop.x) + 2, Math.round(pop.y) + 2);
      ctx.fillStyle = pop.color;
      ctx.fillText(pop.text, Math.round(pop.x), Math.round(pop.y));
    }
    ctx.globalAlpha = 1;

    // 9. Brief hit flash overlay
    if (world.hitFlashTimer > 0) {
      ctx.fillStyle = 'rgba(255, 77, 61, 0.25)';
      ctx.fillRect(0, 0, width, height);
    }

    ctx.restore();
  }

  private ensureSkyCache(
    width: number,
    height: number,
    beltLeft: number,
    beltWidth: number,
    isCompact: boolean
  ): HTMLCanvasElement | null {
    if (typeof document === 'undefined') return null;
    if (
      this.skyCache &&
      this.skyCacheW === width &&
      this.skyCacheH === height &&
      this.skyCacheBeltLeft === beltLeft &&
      this.skyCacheBeltWidth === beltWidth
    ) {
      return this.skyCache;
    }

    const canvas = this.skyCache ?? document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const sctx = canvas.getContext('2d');
    if (!sctx) return null;

    // Twilight night sky gradient (stepped retro bands)
    const skyBands = ['#0b0c19', '#111226', '#181834', '#211c3d', '#2b1e42'];
    const bandH = Math.ceil(height / skyBands.length);
    skyBands.forEach((col, i) => {
      sctx.fillStyle = col;
      sctx.fillRect(0, i * bandH, width, bandH + 2);
    });

    // Pixel Moon in upper-left sky
    const moonX = isCompact ? 38 : Math.max(64, beltLeft * 0.22);
    const moonY = Math.round(height * 0.14);
    sctx.fillStyle = 'rgba(255, 209, 71, 0.14)';
    sctx.fillRect(moonX - 24, moonY - 24, 48, 48);
    sctx.fillStyle = '#ffeab0';
    sctx.fillRect(moonX - 14, moonY - 14, 28, 28);
    sctx.fillStyle = '#181834';
    sctx.fillRect(moonX - 4, moonY - 14, 18, 18);

    const horizonY = height;

    // Distant silhouette skyscrapers
    const farBuildings = [
      { x: 0.0, w: 0.08, h: 0.42 },
      { x: 0.07, w: 0.07, h: 0.56 },
      { x: 0.13, w: 0.09, h: 0.48 },
      { x: 0.21, w: 0.07, h: 0.62 },
      { x: 0.71, w: 0.08, h: 0.58 },
      { x: 0.78, w: 0.08, h: 0.46 },
      { x: 0.85, w: 0.09, h: 0.64 },
      { x: 0.93, w: 0.08, h: 0.50 },
    ];
    sctx.fillStyle = '#13152b';
    for (const b of farBuildings) {
      const bx = Math.round(b.x * width);
      const bw = Math.max(24, Math.round(b.w * width));
      const bh = Math.round(b.h * height);
      sctx.fillRect(bx, horizonY - bh, bw, bh);
    }

    // Tokyo Tower / Tsutenkaku Landmark on Left Wing
    if (!isCompact && beltLeft > 120) {
      const towerX = Math.round(beltLeft * 0.32);
      const towerBaseY = horizonY;
      const towerH = Math.round(height * 0.62);
      const towerTopY = towerBaseY - towerH;

      sctx.fillStyle = '#251a36';
      sctx.beginPath();
      sctx.moveTo(towerX - 42, towerBaseY);
      sctx.lineTo(towerX - 6, towerTopY + 50);
      sctx.lineTo(towerX + 6, towerTopY + 50);
      sctx.lineTo(towerX + 42, towerBaseY);
      sctx.closePath();
      sctx.fill();

      sctx.fillStyle = '#ff4d3d';
      sctx.fillRect(towerX - 24, towerBaseY - Math.round(towerH * 0.38), 48, 8);
      sctx.fillRect(towerX - 14, towerBaseY - Math.round(towerH * 0.64), 28, 8);
      sctx.fillStyle = '#f5f0e1';
      sctx.fillRect(towerX - 18, towerBaseY - Math.round(towerH * 0.5), 36, 6);
      sctx.fillStyle = '#ff4d3d';
      sctx.fillRect(towerX - 2, towerTopY, 4, 52);
    }

    // Osaka / Dotonbori Neon Skyscrapers & Signboards on Right Wing
    if (!isCompact && width - (beltLeft + beltWidth) > 120) {
      const rightX = beltLeft + beltWidth;
      const rightW = width - rightX;

      const osakaTowers = [
        { rx: 0.14, w: 68, h: 0.54, signColor: '#ff4d3d', signY: 0.42 },
        { rx: 0.42, w: 84, h: 0.66, signColor: '#56c2ff', signY: 0.28 },
        { rx: 0.72, w: 72, h: 0.48, signColor: '#ffd147', signY: 0.50 },
      ];

      for (const t of osakaTowers) {
        const bx = Math.round(rightX + t.rx * rightW);
        const bh = Math.round(t.h * height);
        const by = horizonY - bh;

        sctx.fillStyle = '#181b35';
        sctx.fillRect(bx, by, t.w, bh);
        sctx.fillStyle = '#25294d';
        sctx.fillRect(bx, by, t.w, 6);

        for (let wy = by + 18; wy < horizonY - 24; wy += 16) {
          for (let wx = bx + 10; wx < bx + t.w - 14; wx += 14) {
            const lit = (wx * 13 + wy * 7) % 11 > 3;
            if (lit) {
              sctx.fillStyle = (wx + wy) % 5 === 0 ? '#56c2ff' : '#ffd147';
              sctx.fillRect(wx, wy, 6, 8);
            }
          }
        }

        const sy = Math.round(t.signY * height);
        sctx.fillStyle = '#090a12';
        sctx.fillRect(bx - 10, sy, 16, 74);
        sctx.strokeStyle = t.signColor;
        sctx.lineWidth = 2;
        sctx.strokeRect(bx - 10, sy, 16, 74);
        sctx.fillStyle = t.signColor;
        for (let gy = sy + 8; gy < sy + 64; gy += 14) {
          sctx.fillRect(bx - 6, gy, 8, 3);
          sctx.fillRect(bx - 4, gy + 4, 4, 5);
        }
      }
    }

    // Elevated Shinkansen / Commuter Train Viaduct track
    const viaductY = Math.round(height * 0.74);
    sctx.fillStyle = '#101223';
    sctx.fillRect(0, viaductY, width, 12);
    sctx.fillStyle = '#252947';
    sctx.fillRect(0, viaductY, width, 3);

    this.skyCache = canvas;
    this.skyCacheW = width;
    this.skyCacheH = height;
    this.skyCacheBeltLeft = beltLeft;
    this.skyCacheBeltWidth = beltWidth;
    return canvas;
  }

  private drawTokyoOsakaSkyline(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    beltLeft: number,
    beltWidth: number,
    isCompact: boolean,
    world: GameWorld
  ): void {
    ctx.fillStyle = '#0b0c19';
    ctx.fillRect(-16, -16, width + 32, height + 32);

    const cached = this.ensureSkyCache(width, height, beltLeft, beltWidth, isCompact);
    if (cached) {
      ctx.drawImage(cached, 0, 0);
    }

    // Dynamic twinkling pixel stars (10 tiny rects)
    const starSeeds = [
      [0.08, 0.08], [0.16, 0.22], [0.24, 0.11], [0.31, 0.27],
      [0.68, 0.12], [0.76, 0.21], [0.85, 0.09], [0.92, 0.25],
      [0.12, 0.36], [0.89, 0.34],
    ];
    starSeeds.forEach(([sx, sy], idx) => {
      const twinkle = Math.sin(this.skyTimer * 3 + idx * 1.7) > 0.2;
      ctx.fillStyle = twinkle ? '#f7f3e8' : '#58608a';
      ctx.fillRect(Math.round(sx * width), Math.round(sy * height), twinkle ? 3 : 2, twinkle ? 3 : 2);
    });

    // Blinking Tokyo Tower spire beacon
    if (!isCompact && beltLeft > 120) {
      const towerX = Math.round(beltLeft * 0.32);
      const towerTopY = height - Math.round(height * 0.62);
      const blink = Math.sin(this.skyTimer * 5) > 0;
      ctx.fillStyle = blink ? '#ffd147' : '#ff4d3d';
      ctx.fillRect(towerX - 4, towerTopY - 6, 8, 6);
    }

    // Moving Shinkansen pixel train across viaduct
    const viaductY = Math.round(height * 0.74);
    const trainX = Math.round(((this.skyTimer * 180) % (width + 420)) - 220);
    ctx.fillStyle = '#e6e2d8';
    ctx.fillRect(trainX, viaductY - 12, 160, 12);
    ctx.fillStyle = '#56c2ff';
    ctx.fillRect(trainX, viaductY - 5, 160, 3);
    ctx.fillStyle = '#ffd147';
    for (let wx = trainX + 12; wx < trainX + 148; wx += 16) {
      ctx.fillRect(wx, viaductY - 10, 8, 4);
    }

    if (!isCompact && (world.phase === 'playing' || world.phase === 'paused')) {
      this.drawStudioSideAtmosphere(ctx, beltLeft, beltWidth, width, height, world);
    }
  }

  private drawBestTapeMarker(
    ctx: CanvasRenderingContext2D,
    world: GameWorld,
    beltLeft: number,
    beltWidth: number,
    height: number
  ): void {
    const prevBest = world.previousBest;
    if (prevBest >= 10) {
      const delta = prevBest - world.score;
      if (delta > -4 && delta <= 14) {
        const progress = 1 - (delta + 4) / 18;
        const ty = Math.round(progress * height);
        this.drawTapeBanner(ctx, beltLeft, beltWidth, ty, `BEST · ${prevBest}`, PALETTE.sky);
      }
    }
  }

  private drawTapeBanner(
    ctx: CanvasRenderingContext2D,
    beltLeft: number,
    beltWidth: number,
    y: number,
    label: string,
    color: string
  ): void {
    ctx.save();
    ctx.fillStyle = 'rgba(9, 10, 18, 0.78)';
    ctx.fillRect(beltLeft + 4, y - 11, beltWidth - 8, 22);
    ctx.fillStyle = color;
    for (let x = beltLeft + 6; x < beltLeft + beltWidth - 10; x += 16) {
      ctx.fillRect(x, y - 11, 8, 3);
      ctx.fillRect(x + 8, y + 8, 8, 3);
    }
    ctx.font = '700 11px "Silkscreen", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = color;
    ctx.fillText(label, beltLeft + beltWidth / 2, y + 4);
    ctx.restore();
  }

  private drawStudioSideAtmosphere(
    ctx: CanvasRenderingContext2D,
    beltLeft: number,
    beltWidth: number,
    width: number,
    height: number,
    world: GameWorld
  ): void {
    const rightStart = beltLeft + beltWidth + 32;
    const leftEnd = beltLeft - 32;

    // Left monitor: 8-Streak 2X Rush Meter + Packed count
    if (leftEnd > 190) {
      const boxW = Math.min(196, leftEnd - 32);
      const boxX = leftEnd - boxW;
      const boxY = Math.round(height * 0.24);

      ctx.fillStyle = '#16182c';
      ctx.fillRect(boxX, boxY, boxW, 126);
      ctx.strokeStyle = world.combo >= RUSH_COMBO_THRESHOLD ? PALETTE.gold : '#363b5c';
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, 126);

      ctx.fillStyle = '#8b92b8';
      ctx.font = '700 10px "Silkscreen", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('RUSH STREAK', boxX + 14, boxY + 24);

      ctx.fillStyle = world.combo >= RUSH_COMBO_THRESHOLD ? PALETTE.gold : PALETTE.cream;
      ctx.font = '700 18px "Silkscreen", monospace';
      ctx.fillText(
        world.combo >= RUSH_COMBO_THRESHOLD ? '2X RUSH!' : `${world.combo} / ${RUSH_COMBO_THRESHOLD}`,
        boxX + 14,
        boxY + 50
      );

      // 8 segmented combo blocks
      const segW = Math.floor((boxW - 42) / RUSH_COMBO_THRESHOLD);
      for (let i = 0; i < RUSH_COMBO_THRESHOLD; i++) {
        const filled = i < world.combo;
        ctx.fillStyle = filled ? (world.combo >= RUSH_COMBO_THRESHOLD ? PALETTE.gold : PALETTE.mint) : '#090a12';
        ctx.fillRect(boxX + 14 + i * (segW + 2), boxY + 64, segW, 10);
      }

      ctx.fillStyle = '#b8bdd9';
      ctx.font = '700 10px "Silkscreen", monospace';
      ctx.fillText(`PACKED ${world.itemsPacked}`, boxX + 14, boxY + 100);
    }

    // Right panel: Drop Legend with 4-Point Star & Hazard Warning
    if (width - rightStart > 190) {
      const boxW = Math.min(196, width - rightStart - 32);
      const boxX = rightStart;
      const boxY = Math.round(height * 0.24);

      ctx.fillStyle = '#16182c';
      ctx.fillRect(boxX, boxY, boxW, 146);
      ctx.strokeStyle = '#363b5c';
      ctx.lineWidth = 3;
      ctx.strokeRect(boxX, boxY, boxW, 146);

      ctx.fillStyle = '#8b92b8';
      ctx.font = '700 10px "Silkscreen", monospace';
      ctx.textAlign = 'left';
      ctx.fillText('SHIFT GUIDE', boxX + 14, boxY + 24);

      const items: Array<{ key: SpriteKey; label: string; color: string }> = [
        { key: 'donut', label: 'DONUT / TEE +1', color: PALETTE.pink },
        { key: 'milk', label: 'CHOC MILK +2', color: PALETTE.cream },
        { key: 'star', label: 'STAR +5', color: PALETTE.gold },
        { key: 'crate', label: 'AVOID HAZARDS', color: PALETTE.vermilion },
      ];

      items.forEach((item, idx) => {
        const iy = boxY + 38 + idx * 25;
        const sp = getPixelSprite(item.key);
        if (sp) {
          ctx.drawImage(sp, boxX + 14, iy, 18, 18);
        }
        ctx.fillStyle = item.color;
        ctx.font = '700 10px "Silkscreen", monospace';
        ctx.fillText(item.label, boxX + 40, iy + 13);
      });
    }
  }
}
