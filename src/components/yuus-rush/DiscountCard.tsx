import { useState } from 'react';
import { BIG_CARTEL_STORE_URL, DISCOUNT_CODE } from '../../game/constants';

interface DiscountCardProps {
  compact?: boolean;
}

export function DiscountCard({ compact = false }: DiscountCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCOUNT_CODE);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      const el = document.createElement('textarea');
      el.value = DISCOUNT_CODE;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  return (
    <div
      className={`bg-[#141522] border-2 border-[#ffd147] ${compact ? 'p-3' : 'p-4'} text-left`}
      style={{ boxShadow: '0 4px 0 0 #090a12' }}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-pixel text-[11px] text-[#ffd147] tracking-wide">
          SECRET BIG CARTEL CODE
        </span>
        <span className="font-pixel text-[10px] text-[#38e59b]">UNLOCKED</span>
      </div>
      <div className="flex items-center gap-2">
        <div
          className="flex-1 bg-[#25283d] border-2 border-[#3c4166] px-3 py-2 font-mono-code text-sm sm:text-base font-bold text-[#f5f0e1] tracking-widest select-all truncate"
          data-testid="discount-code"
        >
          {DISCOUNT_CODE}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="pixel-btn bg-[#ffd147] text-[#141522] px-3 min-h-[44px] text-xs font-bold whitespace-nowrap shrink-0 cursor-pointer"
        >
          {copied ? 'COPIED!' : 'COPY'}
        </button>
      </div>
      {!compact && (
        <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#b8bdd9]">
          <span>Use code MUGEN at Big Cartel checkout.</span>
          <a
            href={BIG_CARTEL_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-pixel text-[11px] text-[#56c2ff] hover:text-[#f5f0e1] underline underline-offset-4 whitespace-nowrap shrink-0"
          >
            SHOP NOW
          </a>
        </div>
      )}
    </div>
  );
}
