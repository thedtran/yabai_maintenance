import React, { useState } from 'react';
import {
  BellRing,
  Check,
  ExternalLink,
  Mail,
  MailCheck,
  Timer,
  Truck,
  AtSign,
  KeyRound,
  Wrench,
  Gamepad2,
} from 'lucide-react';
import {
  CountdownParts,
  validateEmail,
  generateTicketCode,
} from '../utils/lockPageLogic';

interface AtelierPosterBoardProps {
  countdown: CountdownParts;
  currency: 'USD' | 'JPY';
  registeredEmail: string | null;
  ticketCode: string | null;
  onRegisterEmail: (email: string, code: string) => void;
  onClearEmail: () => void;
  onOpenPasscodeModal: () => void;
  onOpenGame: () => void;
}

const YUUCHAN_MECHANIC_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuA8bTialnQwbBHxWtPcg8j63Y5Sf_0biQpV8k89EuFQw5jYZvJi0ZnzV7yezARyfJR-qxgy34zyMB3yS58hZ3M8VW9gGtJl_VYG9g2_rixhr9dkOEldi_YIRacRB-K91voMeJJ1IbEqNaqfWTLjD0DB14E6-3TCoP83yq0qo8ynSJ9UtFOHPwcFbpEkDrSZcuD2z1lVC8yxjiNJOX975nD6o7lyGc1anSqQo2U7f7PFBbihpJasEEZqHQ';

export const AtelierPosterBoard: React.FC<AtelierPosterBoardProps> = ({
  countdown,
  currency,
  registeredEmail,
  ticketCode,
  onRegisterEmail,
  onClearEmail,
  onOpenPasscodeModal,
  onOpenGame,
}) => {
  const [emailInput, setEmailInput] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [mascotImgError, setMascotImgError] = useState(false);

  const handleNotifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateEmail(emailInput);
    if (!result.valid) {
      setEmailError(result.error ?? 'Enter a valid email address.');
      return;
    }
    setEmailError(null);
    const clean = emailInput.trim();
    const code = generateTicketCode(clean);
    onRegisterEmail(clean, code);
    setEmailInput('');
  };

  const runbookItems = [
    {
      id: 'cat-sensors',
      text: 'Calibrating the sewing machine cat sensors (Batch -1)',
      status: 'DONE',
      state: 'done' as const,
    },
    {
      id: 'daifuku',
      text: 'Bribing Yuu-chan with 8 strawberry daifuku',
      status: 'IN PROGRESS',
      state: 'progress' as const,
    },
    {
      id: 'elder',
      text: 'Consulting at least 1 anime elder for optimal drop fortune',
      status: 'PENDING',
      state: 'pending' as const,
    },
    {
      id: 'thread',
      text: 'Untangling 714 miles of rainbow thread',
      status: 'PENDING',
      state: 'pending' as const,
    },
    {
      id: 'launch-btn',
      text: 'Pressing big shiny launch button (Protocol 08)',
      status: 'LOCKED',
      state: 'locked' as const,
    },
  ];

  const dropPriceLabel = currency === 'JPY' ? '¥14,800 JPY' : '$98 USD';

  return (
    <div id="top" className="relative w-full px-4 lg:px-10 py-6 lg:py-10">
      {/* Top Meta Strip / Registration Marks */}
      <div className="max-w-7xl mx-auto mb-5 flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#0A0908]/16">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-5 h-5 hanko-seal bg-[#AD3F32] text-[#FBF7EE] font-mono-tech text-[11px] font-bold leading-none">
            ヤ
          </span>
          <span className="font-mono-tech text-[11px] tracking-widest text-[#0A0908] uppercase">
            SYSTEM REVISION: 2026.08 // LOS ANGELES ATELIER &amp; TOKYO DISTRIBUTION
          </span>
        </div>
        <div className="flex items-center gap-4 font-mono-tech text-[11px] text-[#57423e]">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 hanko-seal bg-[#AD3F32]" aria-hidden="true" />
            <span>CALIBRATION IN PROGRESS</span>
          </span>
          <span className="hidden sm:inline">SERIES PROTOCOL: 08-VAULT</span>
        </div>
      </div>

      {/* Main Editorial Poster Board (Outer Frame) */}
      <div className="max-w-7xl mx-auto bg-[#FBF7EE] border-2 border-[#0A0908] shadow-[6px_6px_0px_#0A0908] relative">
        {/* Poster Header Band */}
        <div className="bg-[#0A0908] text-[#FBF7EE] px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#0A0908]">
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 bg-[#AD3F32] text-[#FBF7EE] font-display text-[11px] font-extrabold tracking-[0.18em] uppercase">
              DISPATCH MEMO
            </span>
            <span className="font-mono-tech text-[11px] tracking-wider uppercase text-[#EEE5BC]">
              TEMPORARY DOWNTIME NOTICE // PRE-DROP SYNCHRONIZATION
            </span>
          </div>
          <div className="font-mono-tech text-[11px] text-[#F58778] tracking-widest uppercase flex items-center gap-1.5">
            <span>SCHEDULED RE-ENTRY: TODAY @ 08:00 PST</span>
            <span className="text-[#FBF7EE]">(TOKYO 08:00 JST)</span>
          </div>
        </div>

        {/* Asymmetrical 12-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left Column: Typography, Progress, Countdown & Runbook (7 Cols) */}
          <div className="lg:col-span-7 p-5 lg:p-10 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#0A0908]">
            <div className="space-y-5">
              {/* Category & Bilingual Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 font-display text-[14px] font-bold uppercase tracking-[0.14em] text-[#AD3F32] bg-[#AD3F32]/10 px-2.5 py-1">
                  <span className="w-1.5 h-1.5 hanko-seal bg-[#AD3F32]" aria-hidden="true" />
                  <span>ATELIER STATUS // 工房調整中</span>
                </div>

                <h1 className="font-display text-6xl sm:text-7xl lg:text-[92px] font-extrabold text-[#0A0908] uppercase tracking-[-0.02em] leading-[0.9] mt-3">
                  ATELIER
                  <br />
                  <span className="text-[#AD3F32]">CALIBRATION</span>
                </h1>

                <div className="flex flex-wrap items-baseline gap-2.5 mt-2 text-[#161514]">
                  <span className="font-display text-[28px] font-bold tracking-tight">工房準備中</span>
                  <span className="font-mono-tech text-[11px] text-[#57423e] uppercase tracking-wider">
                    — Episode Airing Soon // CD Procured ({dropPriceLabel})
                  </span>
                </div>
              </div>

              {/* Subtitle Statement */}
              <p className="text-[16px] lg:text-[18px] text-[#57423e] max-w-xl leading-relaxed">
                Bribing Yuu-chan with choccy milk, untangling X+67 yards of magical embroidery
                thread, teaching the sewing machines how to behave, and doing ritual stretches
                before the curtains open.
              </p>

              {/* Progress Meter & Calibration Status */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-end font-mono-tech text-[11px] text-[#0A0908]">
                  <span className="font-bold tracking-wider uppercase">
                    CALIBRATION PROTOCOL COMPLETION
                  </span>
                  <span className="font-bold text-[#AD3F32] tracking-widest tabular-nums">
                    88% READY
                  </span>
                </div>

                {/* Brutalist Physical Meter */}
                <div
                  role="progressbar"
                  aria-valuenow={88}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Atelier calibration completion"
                  className="w-full h-4 bg-[#EEE5BC] border-2 border-[#0A0908] relative overflow-hidden flex"
                >
                  <div className="h-full bg-[#AD3F32] w-[88%] border-r-2 border-[#0A0908]" />
                  <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-40">
                    <div className="w-px h-full bg-[#0A0908]" />
                    <div className="w-px h-full bg-[#0A0908]" />
                    <div className="w-px h-full bg-[#0A0908]" />
                  </div>
                </div>

                <div className="flex justify-between font-mono-tech text-[10px] text-[#57423e] uppercase tracking-widest pt-0.5">
                  <span>08. INVENTORY</span>
                  <span>08. MESH INK</span>
                  <span>08. SERIAL SYNC</span>
                  <span>08. GATES OPEN</span>
                </div>
              </div>

              {/* Dynamic Running Countdown Timer Component */}
              <div className="bg-[#EEE5BC] border-2 border-[#0A0908] p-3 shadow-[3px_3px_0px_#0A0908]">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-1.5 border-b border-[#0A0908] font-mono-tech text-[11px] uppercase tracking-wider text-[#0A0908] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Timer className="w-4 h-4 text-[#AD3F32]" aria-hidden="true" />
                    <span>WORLD PREMIERE COUNTDOWN // 開門カウントダウン</span>
                  </span>
                  <span className="text-[#AD3F32] flex items-center gap-1.5">
                    <span className="w-2 h-2 hanko-seal bg-[#AD3F32]" aria-hidden="true" />
                    <span>LIVE ATELIER CLOCK</span>
                  </span>
                </div>

                <div
                  aria-label="Countdown to storefront reopening"
                  className="grid grid-cols-4 gap-2 pt-2.5 text-center"
                >
                  <div className="bg-[#FBF7EE] border border-[#0A0908] py-2 px-1 flex flex-col items-center">
                    <span className="font-display text-4xl lg:text-[56px] font-bold text-[#0A0908] leading-none tracking-tight tabular-nums">
                      {countdown.days}
                    </span>
                    <span className="font-display text-[11px] font-extrabold text-[#57423e] tracking-wider uppercase mt-1">
                      DAYS / 日
                    </span>
                  </div>
                  <div className="bg-[#FBF7EE] border border-[#0A0908] py-2 px-1 flex flex-col items-center">
                    <span className="font-display text-4xl lg:text-[56px] font-bold text-[#AD3F32] leading-none tracking-tight tabular-nums">
                      {countdown.hours}
                    </span>
                    <span className="font-display text-[11px] font-extrabold text-[#57423e] tracking-wider uppercase mt-1">
                      HRS / 時
                    </span>
                  </div>
                  <div className="bg-[#FBF7EE] border border-[#0A0908] py-2 px-1 flex flex-col items-center">
                    <span className="font-display text-4xl lg:text-[56px] font-bold text-[#0A0908] leading-none tracking-tight tabular-nums">
                      {countdown.minutes}
                    </span>
                    <span className="font-display text-[11px] font-extrabold text-[#57423e] tracking-wider uppercase mt-1">
                      MIN / 分
                    </span>
                  </div>
                  <div className="bg-[#FBF7EE] border border-[#0A0908] py-2 px-1 flex flex-col items-center">
                    <span className="font-display text-4xl lg:text-[56px] font-bold text-[#387D75] leading-none tracking-tight tabular-nums">
                      {countdown.seconds}
                    </span>
                    <span className="font-display text-[11px] font-extrabold text-[#57423e] tracking-wider uppercase mt-1">
                      SEC / 秒
                    </span>
                  </div>
                </div>
              </div>

              {/* 5-Stage Calibration Runbook */}
              <div className="bg-[#f8f2f0] border border-[#0A0908]/20 p-4 space-y-1.5">
                <div className="font-display text-[14px] font-bold uppercase tracking-wider text-[#0A0908] border-b border-[#0A0908]/16 pb-1.5 mb-2 flex items-center justify-between">
                  <span>SYSTEM LOGS // CALIBRATION RUNBOOK</span>
                  <span className="font-mono-tech text-[11px] text-[#387D75] font-bold">
                    NODE: LA-STUDIO-08
                  </span>
                </div>

                {runbookItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between gap-2 py-1.5 font-mono-tech text-[12px] ${
                      idx < runbookItems.length - 1 ? 'border-b border-[#0A0908]/10' : ''
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 ${
                        item.state === 'done'
                          ? 'text-[#0A0908]'
                          : item.state === 'progress'
                            ? 'text-[#AD3F32] font-medium'
                            : 'text-[#57423e]'
                      }`}
                    >
                      {item.state === 'done' && (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-[#387D75] text-[#FBF7EE] text-[10px] font-bold shrink-0">
                          ✓
                        </span>
                      )}
                      {item.state === 'progress' && (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-[#AD3F32] text-[#FBF7EE] text-[10px] font-bold shrink-0">
                          ●
                        </span>
                      )}
                      {(item.state === 'pending' || item.state === 'locked') && (
                        <span className="inline-flex items-center justify-center w-4 h-4 bg-[#dec0bb] text-[#0A0908] text-[10px] font-bold shrink-0">
                          ○
                        </span>
                      )}
                      <span>{item.text}</span>
                    </div>

                    <span
                      className={`font-display text-[11px] uppercase font-bold tracking-wider whitespace-nowrap shrink-0 ${
                        item.state === 'done'
                          ? 'text-[#387D75]'
                          : item.state === 'progress'
                            ? 'text-[#AD3F32]'
                            : 'text-[#57423e]'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Micro Note */}
            <div className="mt-6 pt-3 border-t border-[#0A0908]/16 flex flex-wrap items-center justify-between gap-2 text-[#57423e] font-mono-tech text-[11px]">
              <span>TOKYO DESIGN LAB // CALIFORNIA ATELIER CUT &amp; SEW [BAY 08]</span>
              <span className="text-[#0A0908] font-bold">NO REPRINTS ONCE ARCHIVED</span>
            </div>
          </div>

          {/* Right Column: Yuu-chan Mascot Frame & Director Memo (5 Cols) */}
          <div className="lg:col-span-5 bg-[#EEE5BC] flex flex-col justify-between p-5 lg:p-7 relative overflow-hidden">
            {/* Decorative Japanese Hanko Seal (Floating Top Right) */}
            <div
              aria-hidden="true"
              className="absolute top-4 right-4 z-10 select-none pointer-events-none transform rotate-3"
            >
              <div className="w-16 h-16 border-2 border-[#AD3F32] flex flex-col items-center justify-center text-[#AD3F32] bg-[#EEE5BC]/90 p-1 shadow-[2px_2px_0px_#AD3F32]">
                <span className="font-display text-[10px] tracking-widest font-extrabold uppercase leading-none">
                  YABAI
                </span>
                <span className="font-display text-[22px] font-extrabold leading-none my-0.5">
                  検印
                </span>
                <span className="font-display text-[9px] font-bold tracking-tight uppercase leading-none">
                  APPROVED
                </span>
              </div>
            </div>

            {/* Top Status Tag */}
            <div className="flex items-center gap-2 z-10">
              <span className="px-2.5 py-1 bg-[#0A0908] text-[#FBF7EE] font-display text-[11px] font-extrabold uppercase tracking-[0.18em]">
                ATELIER MASCOT // YUU-CHAN
              </span>
            </div>

            {/* Central Mascot Illustration in Museum Framing */}
            <div className="my-6 relative flex flex-col items-center justify-center">
              <div className="relative bg-[#FBF7EE] border-2 border-[#0A0908] p-2.5 shadow-[4px_4px_0px_#0A0908] max-w-xs sm:max-w-sm w-full mx-auto">
                {/* Paper tape accent over the frame */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#E3D8A8] border border-[#0A0908] px-4 py-0.5 font-mono-tech text-[10px] uppercase font-bold tracking-wider text-[#0A0908] -rotate-1 whitespace-nowrap">
                  LIVE CAM // WAR ROOM 08
                </div>

                {/* Passe-Partout Border */}
                <div className="border border-[#0A0908]/88 p-1 bg-white overflow-hidden">
                  {!mascotImgError ? (
                    <img
                      src={YUUCHAN_MECHANIC_URL}
                      alt="Frazzled Chibi Mechanic Yuu-chan in Action"
                      referrerPolicy="no-referrer"
                      onError={() => setMascotImgError(true)}
                      className="w-full h-auto object-cover max-h-[340px] mx-auto"
                    />
                  ) : (
                    <svg
                      viewBox="0 0 320 320"
                      role="img"
                      aria-label="Yuu-chan atelier mechanic illustration"
                      className="w-full h-auto max-h-[340px] bg-[#FBF7EE]"
                    >
                      <circle cx="160" cy="160" r="120" fill="#EEE5BC" stroke="#0A0908" strokeWidth="3" />
                      <path d="M90 120 L70 55 L125 90 Z" fill="#AD3F32" stroke="#0A0908" strokeWidth="3" />
                      <path d="M230 120 L250 55 L195 90 Z" fill="#AD3F32" stroke="#0A0908" strokeWidth="3" />
                      <circle cx="160" cy="155" r="72" fill="#FBF7EE" stroke="#0A0908" strokeWidth="3" />
                      <circle cx="138" cy="155" r="6" fill="#0A0908" />
                      <circle cx="182" cy="155" r="6" fill="#0A0908" />
                      <path d="M145 182 Q160 194 175 182" fill="none" stroke="#0A0908" strokeWidth="3" />
                      <text
                        x="160"
                        y="265"
                        textAnchor="middle"
                        fill="#0A0908"
                        fontFamily="Barlow Condensed, sans-serif"
                        fontWeight="800"
                        fontSize="24"
                      >
                        YUU-CHAN · WAR ROOM 08
                      </text>
                    </svg>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between font-mono-tech text-[10px] text-[#0A0908] px-1 uppercase tracking-wider">
                  <span>WAR ROOM CHIBI MECHANIC</span>
                  <span>STATUS: BUSY CALIBRATING</span>
                </div>
              </div>

              {/* Interactive Mini-Game Trigger Button directly under Live Cam */}
              <div className="w-full max-w-xs sm:max-w-sm mx-auto mt-3 space-y-2">
                <button
                  id="open-minigame-btn"
                  type="button"
                  onClick={onOpenGame}
                  className="group relative w-full bg-[#AD3F32] hover:bg-[#C84B3D] text-[#FBF7EE] border-2 border-[#0A0908] p-2.5 drop-stamp drop-stamp-interactive flex flex-col items-center justify-center text-center cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Wrench
                      className="w-5 h-5 text-[#E3D8A8] group-hover:rotate-45 transition-transform"
                      aria-hidden="true"
                    />
                    <span className="font-display text-[26px] leading-none uppercase tracking-wider font-extrabold text-[#FBF7EE]">
                      HELP YUU // HELP YOU
                    </span>
                    <Gamepad2
                      className="w-5 h-5 text-[#E3D8A8] group-hover:-rotate-12 transition-transform"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="flex items-center gap-2 text-[#EEE5BC]/95 font-mono-tech text-[11px] uppercase tracking-widest mt-1">
                    <span>工房アシストミニゲーム</span>
                    <span aria-hidden="true">•</span>
                    <span className="underline decoration-[#E3D8A8] underline-offset-2">
                      TAP TO PLAY
                    </span>
                  </div>
                </button>

                <p className="font-mono-tech text-[11px] text-[#57423e] text-center leading-snug px-1">
                  Yuu-chan is overloaded with stray bolts &amp; thread spools! Tap to catch workshop
                  items. Workshop legend whispers that reaching a secret score unlocks a secret
                  atelier blessing...
                </p>
              </div>
            </div>

            {/* Yuu-chan Memo / Speech Bubble Card */}
            <div className="bg-[#FBF7EE] border-2 border-[#0A0908] p-4 shadow-[3px_3px_0px_#0A0908] relative z-10">
              <div className="absolute -top-2.5 left-4 bg-[#E3D8A8] border border-[#0A0908] px-2.5 py-0.5 font-display text-[10px] font-extrabold uppercase tracking-wider text-[#0A0908]">
                MEMO FROM THE TEAM
              </div>
              <p className="text-[15px] text-[#0A0908] leading-relaxed italic mt-1">
                “Hold onto your hats! We’re making sure every seam is cozy, double-checking the
                snack reserves, and hyping up the atelier. The next drop is going to be so
                special!”
              </p>
              <div className="mt-3 pt-2 border-t border-[#0A0908]/16 flex flex-wrap items-center justify-between gap-2">
                <span className="font-display text-[20px] uppercase text-[#AD3F32] font-bold tracking-wide">
                  — Yuu-chan (ユウちゃん)
                </span>
                <span className="font-mono-tech text-[11px] text-[#57423e] uppercase">
                  Studio Mascot &amp; Guide
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Actionable Notification & Dispatch Module (Bottom Band) */}
        <div className="border-t-2 border-[#0A0908] bg-[#f8f2f0]">
          <div className="p-5 lg:p-8 bg-[#EEE5BC] border-b-2 border-[#0A0908]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
              <div className="lg:col-span-5 space-y-2">
                <div className="inline-flex items-center gap-1.5 font-display text-[11px] font-extrabold text-[#FBF7EE] bg-[#AD3F32] px-2.5 py-0.5 tracking-widest uppercase">
                  <BellRing className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>PRIORITY DISPATCH // DIRECT GATE PASS</span>
                </div>
                <h2 className="font-display text-3xl lg:text-[42px] font-bold uppercase text-[#0A0908] leading-[0.95] tracking-tight">
                  WANT AN IMMEDIATE PING WHEN DOORS OPEN?
                </h2>
                <p className="text-[13px] text-[#57423e] max-w-md leading-normal">
                  Enter your dispatch email below. The instant serial numbers go live, you’ll
                  receive priority access before general social announcement.
                </p>
              </div>

              <div className="lg:col-span-7 flex flex-col space-y-3">
                {registeredEmail && ticketCode ? (
                  <div
                    data-testid="dispatch-confirmed"
                    className="p-3.5 bg-[#387D75] text-[#FBF7EE] border-2 border-[#0A0908] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono-tech text-[13px]"
                  >
                    <div className="flex items-start sm:items-center gap-2">
                      <MailCheck className="w-5 h-5 shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
                      <span>
                        ENTRY REGISTERED ({registeredEmail}). You will be pinged the moment our
                        vault gates unlock.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="font-bold uppercase tracking-widest text-[#aaf0e5]">
                        #{ticketCode}
                      </span>
                      <button
                        type="button"
                        onClick={onClearEmail}
                        className="border border-[#FBF7EE] px-2 py-0.5 text-[11px] uppercase hover:bg-[#FBF7EE] hover:text-[#0A0908] transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleNotifySubmit} noValidate className="space-y-1.5">
                    <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                      <div className="relative flex-grow">
                        <label htmlFor="dispatch-email-input" className="sr-only">
                          Dispatch Email Address
                        </label>
                        <input
                          id="dispatch-email-input"
                          type="email"
                          value={emailInput}
                          onChange={(e) => {
                            setEmailInput(e.target.value);
                            if (emailError) setEmailError(null);
                          }}
                          placeholder="ENTER DISPATCH EMAIL // EMAIL@DOMAIN.COM"
                          aria-invalid={emailError ? 'true' : 'false'}
                          className="w-full h-12 px-4 bg-[#FBF7EE] border-2 border-[#0A0908] text-[#0A0908] font-mono-tech text-[13px] placeholder:text-[#57423e]/65 focus:outline-none focus:border-[#AD3F32] shadow-[2px_2px_0px_#0A0908]"
                        />
                      </div>
                      <button
                        type="submit"
                        className="h-12 px-5 bg-[#AD3F32] text-[#FBF7EE] font-display text-[22px] font-bold uppercase tracking-wider border-2 border-[#0A0908] drop-stamp drop-stamp-interactive flex items-center justify-center gap-2 whitespace-nowrap cursor-pointer"
                      >
                        <span>NOTIFY ME AT LAUNCH</span>
                        <span className="text-[13px] text-[#EEE5BC] font-bold">// 通知登録</span>
                      </button>
                    </div>
                    {emailError && (
                      <p role="alert" className="font-mono-tech text-xs font-bold text-[#ba1a1a]">
                        {emailError}
                      </p>
                    )}
                  </form>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[#57423e] font-mono-tech text-[11px]">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#387D75]" aria-hidden="true" />
                    <span>DOMESTIC DISPATCH: Strictly all 88 Atelier Hubs &amp; United States</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={onOpenPasscodeModal}
                      className="inline-flex items-center gap-1 font-bold text-[#AD3F32] hover:underline underline-offset-4 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Patron Key</span>
                    </button>
                    <a
                      href="mailto:hello@yabaisociety.com"
                      className="hover:text-[#8d281d] transition-colors flex items-center gap-1 font-bold text-[#0A0908]"
                    >
                      <Mail className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>hello@yabaisociety.com</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Instagram Story Strip */}
          <div className="bg-[#0A0908] text-[#FBF7EE] p-4 lg:px-8 lg:py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 hanko-seal bg-[#AD3F32] text-[#FBF7EE] shrink-0">
                <AtSign className="w-4 h-4" aria-hidden="true" />
              </span>
              <div>
                <div className="font-display text-[14px] font-bold uppercase tracking-wider text-[#EEE5BC]">
                  FOLLOW OUR LIVE ATELIER STORY ON INSTAGRAM
                </div>
                <div className="font-mono-tech text-[11px] text-[#FBF7EE]/80">
                  Behind-the-scenes cutting, stitch tests, and real-time drop warnings.
                </div>
              </div>
            </div>

            <a
              href="https://instagram.com/yabaisociety"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#FBF7EE] text-[#0A0908] px-5 py-2 border-2 border-[#EEE5BC] font-display text-[14px] font-bold uppercase tracking-wider shadow-[3px_3px_0px_#AD3F32] hover:bg-[#E3D8A8] hover:translate-x-[2px] hover:translate-y-[2px] transition-all whitespace-nowrap"
            >
              <span>FOLLOW @yabaisociety.official</span>
              <ExternalLink className="w-4 h-4 text-[#AD3F32]" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      {/* Editorial Footer Notes & Studio Coordinates */}
      <div className="max-w-7xl mx-auto mt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-[#57423e] font-mono-tech text-[11px] border-t border-[#0A0908]/16 pt-4">
        <div className="flex flex-wrap items-center justify-center gap-3 uppercase tracking-wider">
          <span>YABAI SOCIETY // 工房メンテナンス</span>
          <span aria-hidden="true">•</span>
          <span>EDITION: CHIHIRO &amp; HAKU PREPARATION // PROTOCOL 08</span>
        </div>
        <div className="text-center md:text-right uppercase tracking-widest">
          CAREFULLY CRAFTED IN TOKYO &amp; LOS ANGELES • BE REMARKABLE
        </div>
      </div>
    </div>
  );
};
