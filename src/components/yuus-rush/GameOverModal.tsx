import { X } from 'lucide-react';
import type { RunSnapshot } from '../../game/types';
import { DiscountCard } from './DiscountCard';

interface GameOverModalProps {
  snapshot: RunSnapshot;
  onRestart: () => void;
  onTitle: () => void;
  onClose: () => void;
}

export function GameOverModal({
  snapshot,
  onRestart,
  onTitle,
  onClose,
}: GameOverModalProps) {
  const { score, bestScore, itemsPacked, closeCalls, codeUnlockedEver, nearMiss } = snapshot;

  const toneStyle =
    nearMiss.tone === 'victory'
      ? 'text-[#ffd147]'
      : nearMiss.tone === 'nearmiss'
        ? 'text-[#ff3d36]'
        : nearMiss.tone === 'newbest'
          ? 'text-[#38e59b]'
          : 'text-[#f5f0e1]';

  const bestDenominator = Math.max(bestScore, 1);
  const progressPct = Math.min(100, Math.round((score / bestDenominator) * 100));

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center p-4 bg-[#090a12]/78"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-heading"
    >
      <div className="pixel-panel w-full max-w-md p-5 sm:p-6 text-center">
        {/* Top bar with >=44px Close game button */}
        <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b-2 border-[#2b2f4a]">
          <span className="font-pixel text-[10px] tracking-wider text-[#8b92b8]">
            SHIFT REPORT
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="pixel-btn min-h-[44px] min-w-[44px] bg-[#25283d] hover:bg-[#313552] text-[#f5f0e1] px-2.5 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>EXIT</span>
          </button>
        </div>

        {/* Near-Miss or Secret Surprise Headline */}
        <h2
          id="gameover-heading"
          className={`font-pixel text-lg sm:text-xl leading-tight mb-1.5 ${toneStyle}`}
        >
          {nearMiss.headline}
        </h2>
        <p className="text-xs sm:text-sm text-[#d4d8eb] mb-4">{nearMiss.subline}</p>

        {/* Visible Progress Bar toward Personal Best (never spoils 88) */}
        <div className="mb-4 text-left">
          <div className="flex justify-between font-pixel text-[10px] tabular-nums text-[#b8bdd9] mb-1">
            <span>SHIFT {score}</span>
            <span className="text-[#56c2ff]">BEST {bestScore}</span>
          </div>
          <div className="h-3 bg-[#090a12] border-2 border-[#3c4166]">
            <div
              className="h-full"
              style={{
                width: `${progressPct}%`,
                backgroundColor:
                  nearMiss.tone === 'victory'
                    ? '#ffd147'
                    : score >= bestScore
                      ? '#38e59b'
                      : '#ff3d36',
              }}
            />
          </div>
        </div>

        {/* 3 Tabular Run Stat Tiles */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-[#141522] border-2 border-[#3c4166] py-2 px-2">
            <div className="font-pixel text-[9px] text-[#8b92b8]">SCORE</div>
            <div className="font-pixel text-lg sm:text-xl tabular-nums text-[#f5f0e1]" data-testid="final-score">
              {score}
            </div>
          </div>
          <div className="bg-[#141522] border-2 border-[#3c4166] py-2 px-2">
            <div className="font-pixel text-[9px] text-[#8b92b8]">BEST</div>
            <div className="font-pixel text-lg sm:text-xl tabular-nums text-[#56c2ff]">
              {bestScore}
            </div>
          </div>
          <div className="bg-[#141522] border-2 border-[#3c4166] py-2 px-2">
            <div className="font-pixel text-[9px] text-[#8b92b8]">PACKED</div>
            <div className="font-pixel text-lg sm:text-xl tabular-nums text-[#38e59b]">
              {itemsPacked}
            </div>
          </div>
        </div>

        {closeCalls > 0 && (
          <p className="font-pixel text-[10px] text-[#ffd147] mb-3">
            CLOSE-CALL GRAZES: {closeCalls} (+{closeCalls} PTS)
          </p>
        )}

        {/* Secret Big Cartel Reward Card (only visible once 88 has been unlocked!) */}
        {codeUnlockedEver && (
          <div className="mb-4">
            <DiscountCard />
          </div>
        )}

        {/* Instant <1s Restart Primary CTA */}
        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            type="button"
            data-start="true"
            onClick={onRestart}
            className="pixel-btn flex-1 min-h-[48px] bg-[#ff3d36] hover:bg-[#ff564f] text-[#f5f0e1] text-sm sm:text-base font-bold px-5 py-3 cursor-pointer whitespace-nowrap"
          >
            PLAY AGAIN
          </button>
          <button
            type="button"
            onClick={onTitle}
            className="pixel-btn min-h-[48px] bg-[#25283d] hover:bg-[#313552] text-[#f5f0e1] text-xs font-bold px-4 py-3 cursor-pointer whitespace-nowrap"
          >
            TITLE
          </button>
        </div>
        <p className="mt-3 font-pixel text-[10px] text-[#8b92b8]">
          PRESS SPACE OR ENTER FOR INSTANT RETRY
        </p>
      </div>
    </div>
  );
}
