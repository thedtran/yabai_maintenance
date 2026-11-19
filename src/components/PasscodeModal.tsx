import React, { useState } from 'react';
import { X, KeyRound, ArrowRight } from 'lucide-react';
import { validatePasscode } from '../utils/lockPageLogic';

interface PasscodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlockSuccess: (codeUsed: string) => void;
}

export const PasscodeModal: React.FC<PasscodeModalProps> = ({
  isOpen,
  onClose,
  onUnlockSuccess,
}) => {
  const [passcodeInput, setPasscodeInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validatePasscode(passcodeInput);
    if (!res.unlocked) {
      setError(res.error ?? 'Passcode not recognized.');
      return;
    }
    setError(null);
    const normalized = passcodeInput.trim().toUpperCase();
    setPasscodeInput('');
    onUnlockSuccess(normalized);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="passcode-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0908]/65 p-4"
    >
      <div className="w-full max-w-md border-2 border-[#0A0908] bg-[#FBF7EE] p-6 shadow-[6px_6px_0px_#0A0908]">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#0A0908] pb-3">
          <div>
            <span className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-[#AD3F32]">
              Protocol 08 // Staging Entry
            </span>
            <h2
              id="passcode-modal-title"
              className="mt-1 font-display text-3xl font-extrabold uppercase leading-none text-[#0A0908]"
            >
              Patron Vault Key
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close patron passcode modal"
            onClick={onClose}
            className="border border-[#0A0908] bg-[#EEE5BC] p-1.5 text-[#0A0908] hover:bg-[#0A0908] hover:text-[#FBF7EE] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-[#57423E]">
          Have an early atelier staging key? Enter it below to bypass maintenance calibration and
          preview the Chihiro &amp; Haku Jersey drop.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-5 space-y-4">
          <div>
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="modal-patron-passcode"
                className="font-display text-xs font-bold uppercase tracking-[0.14em] text-[#0A0908]"
              >
                Enter Vault Passcode
              </label>
              <span className="font-mono-tech text-[11px] text-[#57423E]">
                Preview key: YABAI04
              </span>
            </div>
            <div className="relative mt-1.5">
              <input
                id="modal-patron-passcode"
                type="text"
                autoFocus
                value={passcodeInput}
                onChange={(e) => {
                  setPasscodeInput(e.target.value);
                  if (error) setError(null);
                }}
                placeholder="ENTER KEY // YABAI04"
                aria-invalid={error ? 'true' : 'false'}
                className="w-full h-11 px-3.5 bg-[#FFFFFF] border-2 border-[#0A0908] font-mono-tech text-sm uppercase tracking-widest text-[#0A0908] placeholder:text-[#8b716d] focus:outline-none focus:border-[#AD3F32]"
              />
            </div>
            {error && (
              <p role="alert" className="mt-1.5 font-mono-tech text-xs font-bold text-[#ba1a1a]">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 border-2 border-[#0A0908] bg-[#AD3F32] px-5 py-3 font-display text-lg font-bold uppercase tracking-wider text-[#FBF7EE] drop-stamp drop-stamp-interactive cursor-pointer"
          >
            <KeyRound className="w-4 h-4" aria-hidden="true" />
            <span>Unlock Staging Vault</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
};
