import React, { useState } from 'react';
import { Check, Lock, ArrowLeft } from 'lucide-react';
import { ArtworkView, GARMENT_SIZES, GarmentSize, getSizeSpecs } from '../utils/lockPageLogic';
import { ExhibitionArtwork } from './ExhibitionArtwork';

interface UnlockedStagingViewProps {
  unlockedCode: string;
  activeView: ArtworkView;
  onSelectView: (view: ArtworkView) => void;
  selectedSize: GarmentSize;
  onSelectSize: (size: GarmentSize) => void;
  onLockVault: () => void;
}

export const UnlockedStagingView: React.FC<UnlockedStagingViewProps> = ({
  unlockedCode,
  activeView,
  onSelectView,
  selectedSize,
  onSelectSize,
  onLockVault,
}) => {
  const [reservedSize, setReservedSize] = useState<GarmentSize | null>(null);
  const activeMeasure = getSizeSpecs(selectedSize);

  const handleReserveHold = () => {
    if (!activeMeasure.available) return;
    setReservedSize(selectedSize);
  };

  return (
    <section
      aria-labelledby="staging-unlocked-title"
      className="mx-auto max-w-[1360px] px-4 py-8 md:px-10 md:py-12"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-2 border-[#0A0908] bg-[#EEE5BC] px-5 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="border border-[#0A0908] bg-[#387D75] px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-widest text-[#FBF7EE]">
            Vault Unlocked
          </span>
          <span className="font-mono-tech text-xs font-medium text-[#0A0908]">
            Patron Access Active · Key: {unlockedCode}
          </span>
        </div>

        <button
          type="button"
          onClick={onLockVault}
          className="flex items-center gap-1.5 border border-[#0A0908] bg-[#FBF7EE] px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wider text-[#0A0908] hover:bg-[#0A0908] hover:text-[#FBF7EE] transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Return To Lock Screen</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-stretch">
        <div className="lg:col-span-7">
          <ExhibitionArtwork activeView={activeView} onSelectView={onSelectView} />
        </div>

        <div className="lg:col-span-5 flex flex-col justify-between border-2 border-[#0A0908] bg-[#FBF7EE] p-6 md:p-7">
          <div>
            <p className="font-mono-tech text-xs font-medium tracking-[0.2em] text-[#AD3F32]">
              先行アクセス · STAGING RELEASE
            </p>
            <h1
              id="staging-unlocked-title"
              className="mt-2 font-display text-5xl font-extrabold uppercase leading-[0.95] text-[#0A0908]"
            >
              Bathhouse River Jersey
            </h1>
            <div className="mt-3 flex items-baseline gap-4 border-b border-[#0A0908]/20 pb-4">
              <span className="font-display text-3xl font-bold tabular-nums text-[#0A0908]">
                $98 USD
              </span>
              <span className="font-mono-tech text-xs text-[#57423E]">
                Numbered Edition of 67 · Ships in 3–5 Days
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-[#57423E]">
              Your patron key unlocks early staging reservation for the Drop 04 centerpiece. Select
              your size below to place a 24-hour studio hold ahead of public checkout.
            </p>

            {/* Size Selector */}
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold uppercase tracking-[0.12em] text-[#0A0908]">
                  Select Reservation Size
                </span>
                <span className="font-mono-tech text-xs tabular-nums text-[#57423E]">
                  Chest {activeMeasure.chestCm}cm · Length {activeMeasure.lengthCm}cm
                </span>
              </div>

              <div
                role="radiogroup"
                aria-label="Choose staging reservation size"
                className="mt-3 grid grid-cols-6 gap-2"
              >
                {GARMENT_SIZES.map((item) => {
                  const isSelected = selectedSize === item.size;
                  return (
                    <button
                      key={item.size}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      disabled={!item.available}
                      onClick={() => {
                        onSelectSize(item.size);
                        setReservedSize(null);
                      }}
                      className={`flex h-12 items-center justify-center border-[1.5px] border-[#0A0908] font-display text-base font-bold uppercase transition-colors ${
                        !item.available
                          ? 'size-slash bg-[#EEE5BC]/60 text-[#0A0908]/45 cursor-not-allowed'
                          : isSelected
                            ? 'bg-[#0A0908] text-[#FBF7EE] cursor-pointer'
                            : 'bg-[#FBF7EE] text-[#0A0908] hover:bg-[#EEE5BC] cursor-pointer'
                      }`}
                    >
                      {item.size}
                    </button>
                  );
                })}
              </div>

              <dl className="mt-5 divide-y divide-[#0A0908]/16 border-y border-[#0A0908]/20">
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="font-mono-tech uppercase tracking-wider text-[#57423E]">
                    Fit Profile
                  </dt>
                  <dd className="font-medium text-[#0A0908]">{activeMeasure.fitNote}</dd>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="font-mono-tech uppercase tracking-wider text-[#57423E]">
                    Drop Shoulder
                  </dt>
                  <dd className="font-mono-tech font-medium tabular-nums text-[#0A0908]">
                    {activeMeasure.shoulderCm} cm
                  </dd>
                </div>
                <div className="flex items-center justify-between py-2 text-xs">
                  <dt className="font-mono-tech uppercase tracking-wider text-[#57423E]">
                    Hold Window
                  </dt>
                  <dd className="font-medium text-[#0A0908]">24 Hours · Refundable</dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="mt-8 border-t-2 border-[#0A0908] pt-5">
            {reservedSize ? (
              <div
                data-testid="staging-hold-confirmed"
                className="border-2 border-[#0A0908] bg-[#EEE5BC] p-4"
              >
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center border border-[#0A0908] bg-[#387D75] text-[#FBF7EE]">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  </span>
                  <span className="font-display text-lg font-bold uppercase tracking-wider text-[#0A0908]">
                    Size {reservedSize} Hold Confirmed
                  </span>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#57423E]">
                  Your studio reservation for 1× River Spirit Jersey (Size {reservedSize}) is locked
                  under key <strong className="text-[#0A0908]">{unlockedCode}</strong>.
                </p>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleReserveHold}
                className="flex w-full items-center justify-center gap-2 border-2 border-[#0A0908] bg-[#AD3F32] px-5 py-3.5 font-display text-lg font-bold uppercase tracking-[0.1em] text-[#FBF7EE] drop-stamp drop-stamp-interactive cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0A0908]"
              >
                <Lock className="h-4 w-4" aria-hidden="true" />
                <span>Hold Size {selectedSize} · $98</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
