import React, { useState } from 'react';
import { User, Lock } from 'lucide-react';

export type InfoModalTopic =
  | 'drop-open'
  | 'shop'
  | 'about'
  | 'archive'
  | 'help'
  | 'sizing'
  | 'preorder-policy'
  | 'timeline'
  | 'contact'
  | null;

interface TopBarProps {
  currency: 'USD' | 'JPY';
  onToggleCurrency: (currency: 'USD' | 'JPY') => void;
  bagCount: number;
  isUnlocked: boolean;
  onOpenPasscodeModal: () => void;
  onLockStorefront: () => void;
  onOpenTopic: (topic: InfoModalTopic) => void;
}

const YABAI_LOGO_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuDuf4IskA1no-RtPZe6FxnMXGrBzwtA00ieXZXo204OXdI8ymUL5JMd_8zkZ-DHvPF5ayxqPeqhShta8LjWU_Q3AyrST0HSYMHpUZsHR1QNg-VQfERoXlWR-oknqvA_6AiGlQqYE0iJYdJRYgrOv4E-EsO-ZHPWNfv8FKivmJFV2Dgk8Ge8RpQXnSxJ_eMhLHgym5518614vRZ1Ix3ivVaCBiQBHXw-KHq4Xea0muuWAqy5_s4IjqeHVQ';

export const TopBar: React.FC<TopBarProps> = ({
  currency,
  onToggleCurrency,
  bagCount,
  isUnlocked,
  onOpenPasscodeModal,
  onLockStorefront,
  onOpenTopic,
}) => {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 bg-[#FBF7EE]/95 backdrop-blur-md">
      {/* Top Announcement Bar */}
      <div className="bg-[#0A0908] text-[#FBF7EE] py-1.5 px-4 lg:px-10 text-center font-mono-tech text-[11px] tracking-widest uppercase flex items-center justify-between border-b border-[#0A0908]">
        <span className="hidden md:inline-block font-display text-[11px] font-extrabold tracking-[0.18em] text-[#F58778] whitespace-nowrap">
          TOKYO // EDITION NO. 08
        </span>
        <span className="mx-auto font-mono-tech text-[11px] font-medium tracking-wide truncate">
          Something to look forward to • Chihiro &amp; Haku Jersey • Made gently for ordinary life
        </span>
        <span className="hidden md:inline-block font-mono-tech text-[11px] text-[#aaf0e5] whitespace-nowrap">
          LIMITED PREORDER
        </span>
      </div>

      {/* Main Navigation Header */}
      <div className="h-20 max-w-7xl mx-auto px-4 lg:px-10 flex items-center justify-between gap-4 border-b border-[#0A0908]/16">
        {/* Brand Lockup */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2.5 shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#AD3F32]"
        >
          {!logoFailed ? (
            <img
              src={YABAI_LOGO_URL}
              alt="Yabai Society crest"
              referrerPolicy="no-referrer"
              onError={() => setLogoFailed(true)}
              className="h-8 w-auto object-contain"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center bg-[#AD3F32] text-[#FBF7EE] font-display text-lg font-extrabold">
              ヤ
            </span>
          )}
          <div className="flex flex-col">
            <span className="font-display text-[22px] font-bold tracking-tight leading-none uppercase text-[#8d281d] whitespace-nowrap">
              Yabai Society
            </span>
            <span className="font-mono-tech text-[11px] text-[#57423e] font-medium whitespace-nowrap hidden sm:block">
              ヤバイ・ソサエティ · Everyday Anime Apparel
            </span>
          </div>
        </a>

        {/* Center Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-5">
          <button
            type="button"
            onClick={() => onOpenTopic('drop-open')}
            className="inline-flex items-center gap-1.5 py-1 px-2 font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#0A0908] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <span className="inline-block w-2 h-2 hanko-seal bg-[#387D75]" aria-hidden="true" />
            <span>Chihiro &amp; Haku [Open]</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenTopic('shop')}
            className="py-1 px-2 font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#0A0908] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => onOpenTopic('about')}
            className="py-1 px-2 font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#0A0908] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            About
          </button>
          <button
            type="button"
            onClick={() => onOpenTopic('archive')}
            className="py-1 px-2 font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#0A0908] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Archive
          </button>
          <button
            type="button"
            onClick={() => onOpenTopic('help')}
            className="py-1 px-2 font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#0A0908] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Help
          </button>
        </nav>

        {/* Right Utility Controls */}
        <div className="flex items-center gap-3 md:gap-4 shrink-0">
          {/* Currency Switcher */}
          <div
            role="group"
            aria-label="Select display currency"
            className="hidden sm:flex items-center gap-1 font-mono-tech text-[11px] text-[#57423e] px-1.5 py-0.5 bg-[#ece7e5] border border-[#0A0908]/20"
          >
            <button
              type="button"
              onClick={() => onToggleCurrency('USD')}
              aria-pressed={currency === 'USD'}
              className={`cursor-pointer px-1 ${
                currency === 'USD' ? 'text-[#0A0908] font-bold' : 'text-[#57423e] hover:text-[#0A0908]'
              }`}
            >
              USD
            </button>
            <span className="text-[#8b716d]" aria-hidden="true">
              /
            </span>
            <button
              type="button"
              onClick={() => onToggleCurrency('JPY')}
              aria-pressed={currency === 'JPY'}
              className={`cursor-pointer px-1 ${
                currency === 'JPY' ? 'text-[#0A0908] font-bold' : 'text-[#57423e] hover:text-[#0A0908]'
              }`}
            >
              JPY
            </button>
          </div>

          <button
            type="button"
            onClick={() => onOpenTopic('preorder-policy')}
            className="hidden sm:inline-block font-display text-[14px] font-bold uppercase tracking-[0.12em] text-[#57423e] hover:text-[#AD3F32] transition-colors whitespace-nowrap cursor-pointer"
          >
            Preorder Status
          </button>

          <button
            type="button"
            onClick={() => {
              if (isUnlocked) {
                onLockStorefront();
              } else {
                onOpenPasscodeModal();
              }
            }}
            className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-[#EEE5BC] border border-[#0A0908] text-[#0A0908] font-display text-[14px] font-bold uppercase tracking-wider hover:bg-[#E3D8A8] transition-colors whitespace-nowrap cursor-pointer"
          >
            <span>Bag</span>
            <span className="inline-flex items-center justify-center px-1.5 h-4 hanko-seal bg-[#0A0908] text-[#FBF7EE] font-mono-tech text-[10px] font-bold tabular-nums">
              {bagCount}
            </span>
          </button>

          {isUnlocked ? (
            <button
              type="button"
              onClick={onLockStorefront}
              aria-label="Lock staging vault"
              title="Return to Maintenance Lock Screen"
              className="w-8 h-8 hanko-seal bg-[#0A0908] text-[#FBF7EE] flex items-center justify-center hover:bg-[#AD3F32] transition-colors cursor-pointer"
            >
              <Lock className="w-4 h-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenPasscodeModal}
              aria-label="Open patron passcode unlock"
              title="Enter Patron Passcode"
              className="w-8 h-8 hanko-seal bg-[#8d281d] text-[#ffffff] flex items-center justify-center hover:bg-[#AD3F32] transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
