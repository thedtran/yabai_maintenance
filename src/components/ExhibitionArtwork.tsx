import React from 'react';
import { ArtworkView } from '../utils/lockPageLogic';

interface ExhibitionArtworkProps {
  activeView: ArtworkView;
  onSelectView: (view: ArtworkView) => void;
}

export const ExhibitionArtwork: React.FC<ExhibitionArtworkProps> = ({
  activeView,
  onSelectView,
}) => {
  const viewCaptions: Record<ArtworkView, { title: string; subtitle: string; code: string }> = {
    front: {
      title: 'Bathhouse River Jersey · Front Crest',
      subtitle: '320 GSM heavyweight eyelet mesh with woven vermilion collar piping',
      code: 'PLATE 01 · FRONT',
    },
    back: {
      title: 'Spirit Dragon Woodblock · Back Screenprint',
      subtitle: '6-screen waterbased discharge & puff-ink architectural print',
      code: 'PLATE 02 · BACK',
    },
    blueprint: {
      title: 'Pattern Block YS-04 · Garment Architecture',
      subtitle: 'Boxy Tokyo drop-shoulder block with reinforced side gusset panels',
      code: 'PLATE 03 · SPEC',
    },
  };

  const currentCaption = viewCaptions[activeView];

  return (
    <div className="flex h-full flex-col justify-between border-2 border-[#0A0908] bg-[#EEE5BC] p-3 md:p-5">
      {/* Top Frame Controls & Registration */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#0A0908]/20 pb-3">
        <div className="flex items-center gap-1.5 font-mono-tech text-[11px] font-medium uppercase tracking-wider text-[#0A0908]">
          <span>Archive Exhibit 04</span>
          <span aria-hidden="true">·</span>
          <span>Edition of 67</span>
        </div>

        <div role="tablist" aria-label="Garment artwork views" className="flex items-center gap-1">
          {(
            [
              { id: 'front', label: 'Front Print' },
              { id: 'back', label: 'Back Graphic' },
              { id: 'blueprint', label: 'Spec Blueprint' },
            ] as const
          ).map((tab) => {
            const isSelected = activeView === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => onSelectView(tab.id)}
                className={`border border-[#0A0908] px-2.5 py-1.5 font-display text-xs font-bold uppercase tracking-wider whitespace-nowrap shrink-0 cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#AD3F32] ${
                  isSelected
                    ? 'bg-[#0A0908] text-[#FBF7EE]'
                    : 'bg-[#FBF7EE] text-[#0A0908] hover:bg-[#E3D8A8]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Museum Double-Line Frame */}
      <div className="relative flex-1 border-2 border-[#0A0908] bg-[#FBF7EE] p-2">
        <div className="relative flex h-full min-h-[340px] md:min-h-[430px] items-center justify-center border border-[#0A0908]/80 bg-[#FBF7EE] p-4 overflow-hidden">
          {/* Corner Print Registration Marks */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 left-2 h-3 w-3 border-t-2 border-l-2 border-[#0A0908]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-2 right-2 h-3 w-3 border-t-2 border-r-2 border-[#0A0908]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b-2 border-l-2 border-[#0A0908]"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b-2 border-r-2 border-[#0A0908]"
          />

          {/* Vertical Katakana Margin Anchor */}
          <div
            aria-hidden="true"
            className="vertical-katakana pointer-events-none absolute top-6 left-3 hidden sm:flex items-center gap-2 font-mono-tech text-[10px] font-bold tracking-[0.25em] text-[#0A0908]/60"
          >
            <span>ヤバイ・ソサエティ</span>
            <span>限定アーカイブ</span>
          </div>

          {/* Right Edition Number */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-4 right-4 font-mono-tech text-[11px] font-medium tracking-widest text-[#AD3F32]"
          >
            {currentCaption.code}
          </div>

          {/* Bespoke Editorial Vector Plates */}
          {activeView === 'front' && (
            <svg
              viewBox="0 0 460 420"
              role="img"
              aria-label="Illustration of the Yabai Society Drop 04 River Spirit Jersey front design"
              className="h-full w-full max-h-[380px] object-contain"
            >
              {/* Washi sun disk backdrop */}
              <circle cx="230" cy="195" r="145" fill="#EEE5BC" stroke="#0A0908" strokeWidth="2" />
              <circle
                cx="230"
                cy="195"
                r="134"
                fill="none"
                stroke="#AD3F32"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />

              {/* Jersey silhouette */}
              <path
                d="M145 78 L185 62 C202 78, 258 78, 275 62 L315 78 L372 135 L335 178 L308 154 L308 352 L152 352 L152 154 L125 178 L88 135 Z"
                fill="#161514"
                stroke="#0A0908"
                strokeWidth="3"
              />
              {/* Collar & V-neck piping */}
              <path
                d="M185 62 C202 88, 258 88, 275 62 L264 56 C250 74, 210 74, 196 56 Z"
                fill="#AD3F32"
                stroke="#0A0908"
                strokeWidth="2"
              />
              {/* Sleeve coral/vermilion racing stripes */}
              <path d="M104 120 L139 156 L132 164 L97 128 Z" fill="#F58778" />
              <path d="M356 120 L321 156 L328 164 L363 128 Z" fill="#F58778" />

              {/* Center Teal Spirit Wave Band */}
              <rect
                x="154"
                y="175"
                width="152"
                height="64"
                fill="#387D75"
                stroke="#FBF7EE"
                strokeWidth="1.5"
              />
              {/* Wave pattern */}
              <path
                d="M154 206 Q173 190 192 206 T230 206 T268 206 T306 206"
                fill="none"
                stroke="#EEE5BC"
                strokeWidth="2.5"
              />
              <path
                d="M154 221 Q173 205 192 221 T230 221 T268 221 T306 221"
                fill="none"
                stroke="#FBF7EE"
                strokeWidth="1.5"
              />

              {/* Front Crest Typography */}
              <text
                x="230"
                y="148"
                textAnchor="middle"
                fill="#FBF7EE"
                fontFamily="Barlow Condensed, sans-serif"
                fontWeight="800"
                fontSize="24"
                letterSpacing="3"
              >
                YABAI SOCIETY
              </text>
              <text
                x="230"
                y="272"
                textAnchor="middle"
                fill="#EEE5BC"
                fontFamily="Barlow Condensed, sans-serif"
                fontWeight="700"
                fontSize="44"
                letterSpacing="2"
              >
                04
              </text>
              <text
                x="230"
                y="296"
                textAnchor="middle"
                fill="#9F87AF"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="10"
                letterSpacing="2"
              >
                BATHHOUSE ARCHIVE
              </text>

              {/* Woven Hem Tag */}
              <rect
                x="166"
                y="324"
                width="36"
                height="20"
                fill="#FBF7EE"
                stroke="#AD3F32"
                strokeWidth="1.5"
              />
              <text
                x="184"
                y="337"
                textAnchor="middle"
                fill="#AD3F32"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="8"
              >
                ヤバイ
              </text>
            </svg>
          )}

          {activeView === 'back' && (
            <svg
              viewBox="0 0 460 420"
              role="img"
              aria-label="Illustration of the Yabai Society Drop 04 River Dragon Woodblock Back Print"
              className="h-full w-full max-h-[380px] object-contain"
            >
              {/* Woodblock Poster Frame */}
              <rect
                x="75"
                y="32"
                width="310"
                height="356"
                fill="#161514"
                stroke="#0A0908"
                strokeWidth="3"
              />
              <rect
                x="87"
                y="44"
                width="286"
                height="332"
                fill="#FBF7EE"
                stroke="#AD3F32"
                strokeWidth="2"
              />

              {/* Vermilion Torii Sun */}
              <circle cx="230" cy="146" r="68" fill="#AD3F32" />
              {/* Stylized Torii Gate */}
              <rect x="170" y="108" width="120" height="10" fill="#0A0908" />
              <rect x="182" y="124" width="96" height="7" fill="#0A0908" />
              <rect x="196" y="114" width="10" height="72" fill="#0A0908" />
              <rect x="254" y="114" width="10" height="72" fill="#0A0908" />

              {/* River Dragon Flowing Ribbon */}
              <path
                d="M115 268 C155 215, 200 285, 240 232 C275 186, 315 245, 345 198"
                fill="none"
                stroke="#387D75"
                strokeWidth="22"
                strokeLinecap="square"
              />
              <path
                d="M115 268 C155 215, 200 285, 240 232 C275 186, 315 245, 345 198"
                fill="none"
                stroke="#EEE5BC"
                strokeWidth="4"
                strokeDasharray="10 6"
              />

              {/* Woodblock Waves */}
              <path
                d="M87 302 Q130 284 173 302 T259 302 T345 302 L373 302 L373 376 L87 376 Z"
                fill="#3A4E48"
              />
              <path
                d="M87 325 Q130 307 173 325 T259 325 T345 325 L373 325"
                fill="none"
                stroke="#FBF7EE"
                strokeWidth="2"
              />

              {/* Title Block */}
              <text
                x="230"
                y="78"
                textAnchor="middle"
                fill="#0A0908"
                fontFamily="Barlow Condensed, sans-serif"
                fontWeight="800"
                fontSize="26"
                letterSpacing="3"
              >
                SPIRIT RIVER · 2026
              </text>
              <text
                x="230"
                y="356"
                textAnchor="middle"
                fill="#EEE5BC"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="11"
                letterSpacing="2.5"
              >
                SCREENPRINT ARCHIVE · TOKYO
              </text>
            </svg>
          )}

          {activeView === 'blueprint' && (
            <svg
              viewBox="0 0 460 420"
              role="img"
              aria-label="Technical pattern block blueprint for the Drop 04 Heavyweight Jersey"
              className="h-full w-full max-h-[380px] object-contain"
            >
              {/* Grid lines */}
              <defs>
                <pattern id="blueprintGrid" width="24" height="24" patternUnits="userSpaceOnUse">
                  <path
                    d="M 24 0 L 0 0 0 24"
                    fill="none"
                    stroke="#0A0908"
                    strokeOpacity="0.1"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <rect x="30" y="30" width="400" height="360" fill="url(#blueprintGrid)" stroke="#0A0908" strokeWidth="1.5" />

              {/* Technical flat wireframe */}
              <path
                d="M150 92 L190 76 C206 90, 254 90, 270 76 L310 92 L364 146 L330 184 L305 160 L305 338 L155 338 L155 160 L130 184 L96 146 Z"
                fill="#EEE5BC"
                fillOpacity="0.55"
                stroke="#0A0908"
                strokeWidth="2"
                strokeDasharray="6 3"
              />
              {/* Chest Dimension Line */}
              <line x1="155" y1="210" x2="305" y2="210" stroke="#AD3F32" strokeWidth="2" />
              <line x1="155" y1="202" x2="155" y2="218" stroke="#AD3F32" strokeWidth="2" />
              <line x1="305" y1="202" x2="305" y2="218" stroke="#AD3F32" strokeWidth="2" />
              <rect x="192" y="198" width="76" height="22" fill="#FBF7EE" stroke="#0A0908" strokeWidth="1" />
              <text
                x="230"
                y="213"
                textAnchor="middle"
                fill="#0A0908"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="10"
              >
                CHEST 120CM
              </text>

              {/* Length Dimension Line */}
              <line x1="388" y1="76" x2="388" y2="338" stroke="#387D75" strokeWidth="2" />
              <line x1="380" y1="76" x2="396" y2="76" stroke="#387D75" strokeWidth="2" />
              <line x1="380" y1="338" x2="396" y2="338" stroke="#387D75" strokeWidth="2" />
              <text
                x="378"
                y="212"
                textAnchor="end"
                fill="#387D75"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="10"
              >
                LEN 72CM
              </text>

              {/* Shoulder Callout */}
              <line x1="150" y1="54" x2="310" y2="54" stroke="#0A0908" strokeWidth="1.5" />
              <text
                x="230"
                y="47"
                textAnchor="middle"
                fill="#0A0908"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="10"
              >
                DROP SHOULDER · 54CM (SIZE M)
              </text>

              {/* Fabric note */}
              <rect x="52" y="346" width="356" height="28" fill="#0A0908" />
              <text
                x="230"
                y="364"
                textAnchor="middle"
                fill="#FBF7EE"
                fontFamily="IBM Plex Mono, monospace"
                fontWeight="700"
                fontSize="10"
                letterSpacing="1.5"
              >
                320 GSM COTTON MESH · PRE-SHRUNK ENZYME WASH
              </text>
            </svg>
          )}
        </div>
      </div>

      {/* Bottom Artwork Caption */}
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-1">
        <div>
          <p className="font-display text-lg font-bold uppercase tracking-wide text-[#0A0908]">
            {currentCaption.title}
          </p>
          <p className="text-xs text-[#57423E]">{currentCaption.subtitle}</p>
        </div>
        <span className="font-mono-tech text-[11px] font-medium uppercase tracking-wider text-[#0A0908]/75 whitespace-nowrap">
          QC Staging Lock
        </span>
      </div>
    </div>
  );
};
