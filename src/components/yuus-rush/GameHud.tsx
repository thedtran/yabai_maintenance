import { DISCOUNT_CODE, RUSH_COMBO_THRESHOLD } from '../../game/constants';
import type { HudSnapshot, LaneIndex } from '../../game/types';

interface GameHudProps {
  hud: HudSnapshot;
  muted: boolean;
  onToggleMute: () => void;
  onPause: () => void;
  onRestart: () => void;
  onSelectLane: (lane: LaneIndex) => void;
}

export function GameHud({
  hud,
  muted,
  onToggleMute,
  onPause,
  onRestart,
  onSelectLane,
}: GameHudProps) {
  const bestTarget = hud.bestScore > 0 ? hud.bestScore : Math.max(hud.score, 20);
  const progressPct = Math.min(100, Math.round((hud.score / bestTarget) * 100));
  const isRush = hud.combo >= RUSH_COMBO_THRESHOLD;

  return (
    <div className="fixed inset-0 z-10 pointer-events-none flex flex-col justify-between p-2 sm:p-4">
      {/* Top Perimeter HUD Bar */}
      <div className="w-full max-w-4xl mx-auto flex items-start justify-between gap-1.5 sm:gap-4">
        {/* Top-Left: Pixel Hearts & 8-Streak Counter */}
        <div className="flex flex-col gap-1 bg-[#141522]/92 border-2 border-[#3c4166] px-2 py-2 sm:px-2.5 sm:py-2.5 shrink-0">
          <div className="flex items-center gap-1.5" aria-label={`Hearts ${hud.hearts} of ${hud.maxHearts}`}>
            {Array.from({ length: hud.maxHearts }).map((_, idx) => {
              const full = idx < hud.hearts;
              return (
                <svg
                  key={idx}
                  viewBox="0 0 16 16"
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  aria-hidden="true"
                >
                  <path
                    d="M3 2h3v1h2V2h3v1h2v4h-1v2h-2v2H9v2H7v-2H5V9H3V7H2V3h1V2z"
                    fill={full ? '#ff3d36' : '#25283d'}
                    stroke="#090a12"
                    strokeWidth="1.2"
                  />
                  {full && <rect x="4" y="4" width="2" height="2" fill="#ffd147" />}
                </svg>
              );
            })}
            <span
              className={`font-pixel text-[10px] sm:text-[11px] ml-0.5 whitespace-nowrap ${
                isRush ? 'text-[#ffd147]' : 'text-[#b8bdd9]'
              }`}
            >
              {isRush ? '2X' : `${hud.combo}/${RUSH_COMBO_THRESHOLD}`}
            </span>
          </div>
        </div>

        {/* Top-Center: Score, Best & Personal Best Progress Bar */}
        <div className="flex-1 min-w-0 max-w-xs sm:max-w-sm bg-[#141522]/92 border-2 border-[#3c4166] px-2 py-1.5 sm:px-3 sm:py-2">
          <div className="flex items-baseline justify-between gap-1.5 whitespace-nowrap">
            <div className="flex items-baseline gap-1">
              <span className="font-pixel text-[9px] sm:text-[11px] text-[#b8bdd9] hidden sm:inline">SCORE</span>
              <span
                className="font-pixel text-base sm:text-2xl font-bold tabular-nums text-[#f5f0e1]"
                data-testid="hud-score"
              >
                {String(Math.round(hud.score)).padStart(2, '0')}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5 font-pixel text-[9px] sm:text-[11px] tabular-nums">
              <span className="text-[#56c2ff]">BEST {String(Math.round(hud.bestScore)).padStart(2, '0')}</span>
            </div>
          </div>
          <div className="relative mt-1.5 h-2.5 bg-[#090a12] border border-[#3c4166]">
            <div
              className="h-full transition-transform duration-100 origin-left"
              style={{
                width: '100%',
                transform: `scaleX(${progressPct / 100})`,
                backgroundColor: hud.unlockedSecretThisRun
                  ? '#ffd147'
                  : isRush
                    ? '#56c2ff'
                    : '#38e59b',
              }}
            />
          </div>
        </div>

        {/* Top-Right: Square Utility Buttons */}
        <div className="flex items-center gap-1 sm:gap-1.5 pointer-events-auto shrink-0">
          <button
            type="button"
            tabIndex={-1}
            aria-label={muted ? 'Unmute audio (M)' : 'Mute audio (M)'}
            onClick={(e) => {
              e.currentTarget.blur();
              onToggleMute();
            }}
            className="pixel-btn min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-[#1c1e30] text-[#f5f0e1] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M11 5L6 9H3v6h3l5 4V5z" fill="currentColor" />
              {muted ? (
                <path d="M16 9l5 6m0-6l-5 6" stroke="#ff3d36" strokeLinecap="square" />
              ) : (
                <path d="M15.5 8.5a5 5 0 010 7m3-9.5a8.5 8.5 0 010 12" stroke="#38e59b" strokeLinecap="square" />
              )}
            </svg>
          </button>

          <button
            type="button"
            tabIndex={-1}
            aria-label="Restart shift (R)"
            onClick={(e) => {
              e.currentTarget.blur();
              onRestart();
            }}
            className="pixel-btn min-w-[44px] min-h-[44px] w-11 h-11 hidden sm:flex items-center justify-center bg-[#1c1e30] text-[#f5f0e1] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M4 12a8 8 0 0114-5.3L20 9M20 4v5h-5" strokeLinecap="square" />
              <path d="M20 12a8 8 0 01-14 5.3" strokeLinecap="square" />
            </svg>
          </button>

          <button
            type="button"
            tabIndex={-1}
            aria-label="Pause game (P or Esc)"
            onClick={(e) => {
              e.currentTarget.blur();
              onPause();
            }}
            className="pixel-btn min-w-[44px] min-h-[44px] w-11 h-11 flex items-center justify-center bg-[#1c1e30] text-[#f5f0e1] cursor-pointer"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
              <rect x="6" y="5" width="4" height="14" />
              <rect x="14" y="5" width="4" height="14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Surprise Celebration Banner (only shown AFTER hitting 88+) */}
      {hud.unlockBannerActive && (
        <div className="mx-auto bg-[#ffd147] text-[#141522] border-3 border-[#090a12] px-4 py-2 font-pixel text-xs sm:text-sm font-bold shadow-[0_4px_0_0_#090a12]">
          SURPRISE DROP! SECRET CODE UNLOCKED: {DISCOUNT_CODE}
        </div>
      )}

      {/* Bottom Mobile Thumb-Zone Lane Controls */}
      <div className="md:hidden w-full max-w-xs mx-auto grid grid-cols-3 gap-2 pb-1 pointer-events-auto">
        <button
          type="button"
          tabIndex={-1}
          aria-label="Lane Left"
          onClick={() => onSelectLane(0)}
          className="pixel-btn min-h-[48px] px-3 bg-[#1c1e30]/95 text-[#f5f0e1] text-sm font-bold"
        >
          ◀
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Lane Center"
          onClick={() => onSelectLane(1)}
          className="pixel-btn min-h-[48px] px-3 bg-[#1c1e30]/95 text-[#f5f0e1] text-xs font-bold"
        >
          MID
        </button>
        <button
          type="button"
          tabIndex={-1}
          aria-label="Lane Right"
          onClick={() => onSelectLane(2)}
          className="pixel-btn min-h-[48px] px-3 bg-[#1c1e30]/95 text-[#f5f0e1] text-sm font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
