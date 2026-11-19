import { useState } from 'react';
import { X } from 'lucide-react';
import { DiscountCard } from './DiscountCard';

interface TitleScreenProps {
  bestScore: number;
  codeUnlockedEver: boolean;
  onStart: () => void;
  onClose: () => void;
}

export function TitleScreen({
  bestScore,
  codeUnlockedEver,
  onStart,
  onClose,
}: TitleScreenProps) {
  const [showReward, setShowReward] = useState(false);

  return (
    <div className="fixed inset-0 z-20 flex flex-col justify-between p-4 sm:p-8 pointer-events-none">
      {/* Top quiet strip without spoilers + >=44px Close / Back button */}
      <div className="flex items-center justify-between gap-3 text-xs sm:text-sm font-pixel text-[#b8bdd9] pixel-text-shadow">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close game"
            className="pixel-btn min-h-[44px] min-w-[44px] bg-[#25283d] hover:bg-[#313552] text-[#f5f0e1] px-3 py-2 text-xs font-bold flex items-center justify-center gap-1.5 pointer-events-auto cursor-pointer shrink-0"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            <span>BACK</span>
          </button>
          <span className="truncate hidden sm:inline">STUDIO SHIFT · TOKYO / OSAKA</span>
        </div>
        <span className="tabular-nums text-[#f5f0e1] shrink-0">
          {bestScore > 0 ? `BEST ${String(bestScore).padStart(2, '0')}` : 'ENDLESS RUSH'}
        </span>
      </div>

      {/* Center Title Lockup & Primary CTA */}
      <div className="mx-auto w-full max-w-md flex flex-col items-center text-center pointer-events-auto">
        <div className="pixel-panel px-5 py-6 sm:px-7 sm:py-7 w-full">
          {/* Yuu-chan Emblem */}
          <div className="flex justify-center mb-4">
            <svg
              viewBox="0 0 310 88"
              className="w-76 sm:w-84 max-w-full h-auto"
              role="img"
              aria-label="Yuu's Rush 8-Bit Arcade"
            >
              <rect x="4" y="4" width="302" height="80" fill="#141522" stroke="#ffd147" strokeWidth="4" />
              <rect x="9" y="9" width="292" height="70" fill="none" stroke="#ff3d36" strokeWidth="2" />

              {/* Framed Mini Portrait */}
              <g transform="translate(15, 13)">
                <rect x="0" y="0" width="64" height="62" fill="#1d2038" stroke="#3c4166" strokeWidth="2" />
                {/* Split Golden Halo */}
                <path
                  d="M17 17 C16 9, 24 7, 27 7 M47 17 C48 9, 40 7, 37 7"
                  fill="none"
                  stroke="#f2cf66"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                />
                {/* 3 Golden 4-Point Diamond Stars */}
                <polygon points="27,4 28.4,7 27,10 25.6,7" fill="#ffd147" />
                <polygon points="32,2 34,7.5 32,13 30,7.5" fill="#ffe680" stroke="#a67417" strokeWidth="0.6" />
                <polygon points="37,4 38.4,7 37,10 35.6,7" fill="#ffd147" />

                {/* Curved Dark Brown Horns + Gold Band Wraps */}
                <path
                  d="M16 30 C10 27, 8 18, 12 12 C10 17, 15 19, 19 25 Z"
                  fill="#5a2d22"
                  stroke="#2a120f"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M48 30 C54 27, 56 18, 52 12 C54 17, 49 19, 45 25 Z"
                  fill="#5a2d22"
                  stroke="#2a120f"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path d="M12 22 L17 28 M14 21 L18 26" stroke="#f2cf66" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M52 22 L47 28 M50 21 L46 26" stroke="#f2cf66" strokeWidth="1.5" strokeLinecap="round" />

                {/* Back Blond Hair + Flared Side Tufts */}
                <path
                  d="M13 42 L8 39 L12 35 L10 31 L16 25 C21 15, 43 15, 48 25 L54 31 L52 35 L56 39 L51 42 L48 51 L16 51 Z"
                  fill="#f7dc88"
                  stroke="#4a271b"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Top Ahoge Curl */}
                <path
                  d="M32 18 C30 13, 35 12, 35 15"
                  fill="none"
                  stroke="#4a271b"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M32 18 C31 14, 34.5 13, 34.5 15"
                  fill="none"
                  stroke="#f7dc88"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
                {/* Face */}
                <path
                  d="M19 30 Q32 28 45 30 L45 43 Q32 50 19 43 Z"
                  fill="#ffe5d9"
                />
                {/* Jagged Blond Bangs */}
                <path
                  d="M17 31 L20 23 L44 23 L47 31 L42 33 L39 29 L35 34 L31 29 L27 34 L23 29 Z"
                  fill="#f7dc88"
                  stroke="#4a271b"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                {/* Big Round Black Doe Eyes */}
                <ellipse cx="25" cy="36.2" rx="3.4" ry="3.7" fill="#140c0a" />
                <circle cx="23.8" cy="34.9" r="1.25" fill="#ffffff" />
                <circle cx="26.1" cy="37.6" r="0.6" fill="#ffffff" opacity="0.85" />
                <ellipse cx="39" cy="36.2" rx="3.4" ry="3.7" fill="#140c0a" />
                <circle cx="37.8" cy="34.9" r="1.25" fill="#ffffff" />
                <circle cx="40.1" cy="37.6" r="0.6" fill="#ffffff" opacity="0.85" />
                {/* Blush + Smug :3 / w Cat-Smile */}
                <ellipse cx="22.5" cy="41.5" rx="2.5" ry="1.1" fill="#f4b5b8" opacity="0.8" />
                <ellipse cx="41.5" cy="41.5" rx="2.5" ry="1.1" fill="#f4b5b8" opacity="0.8" />
                <path
                  d="M28.5 41.8 Q30.2 43.3 32 41.8 Q33.8 43.3 35.5 41.8"
                  fill="none"
                  stroke="#7c3229"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                {/* Red Jacket & Cream Shirt */}
                <path d="M16 49 L48 49 L52 60 L12 60 Z" fill="#ff3d36" stroke="#2a120f" strokeWidth="1.2" />
                <polygon points="27,49 37,49 35,60 29,60" fill="#f7f3e8" />
              </g>

              {/* Title Typography inside SVG plaque */}
              <text
                x="89"
                y="42"
                fill="#f5f0e1"
                fontFamily="Silkscreen, monospace"
                fontWeight="700"
                fontSize="21"
                letterSpacing="0.5"
              >
                YUU&apos;S RUSH
              </text>
              <text
                x="89"
                y="60"
                fill="#ffd147"
                fontFamily="Silkscreen, monospace"
                fontWeight="700"
                fontSize="9"
                letterSpacing="0.2"
              >
                PACK FAST · DROP SOONER
              </text>
            </svg>
          </div>

          <p className="text-sm sm:text-base text-[#e3dcc8] leading-snug mb-5 max-w-[34ch] mx-auto">
            Help Yuu-chan pack orders faster so your episode drops sooner! Grab snacks &amp; 4-point stars.
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              data-start="true"
              onClick={onStart}
              className="pixel-btn w-full min-h-[48px] bg-[#ff3d36] hover:bg-[#ff564f] text-[#f5f0e1] text-base sm:text-lg font-bold tracking-wider px-6 py-3 cursor-pointer whitespace-nowrap"
            >
              START SHIFT
            </button>

            {codeUnlockedEver && (
              <button
                type="button"
                onClick={() => setShowReward((prev) => !prev)}
                className="pixel-btn w-full min-h-[44px] bg-[#25283d] hover:bg-[#313552] text-[#ffd147] text-xs font-bold tracking-wide px-4 py-2 cursor-pointer whitespace-nowrap"
              >
                {showReward ? 'HIDE SECRET CODE' : 'VIEW SECRET CODE'}
              </button>
            )}
          </div>

          {showReward && codeUnlockedEver && (
            <div className="mt-4">
              <DiscountCard compact />
            </div>
          )}
        </div>
      </div>

      {/* Bottom single-line flat control hint */}
      <div className="text-center font-pixel text-[10px] sm:text-xs text-[#b8bdd9] pixel-text-shadow">
        A/D or Tap Lanes to Move · Esc Pause
      </div>
    </div>
  );
}
