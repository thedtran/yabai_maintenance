import React from 'react';
import { X } from 'lucide-react';
import { InfoModalTopic } from './TopBar';

interface FooterProps {
  activeTopic: InfoModalTopic;
  onSelectTopic: (topic: InfoModalTopic) => void;
  onOpenPasscodeModal: () => void;
}

const TOPIC_CONTENT: Record<
  Exclude<InfoModalTopic, null>,
  { kicker: string; title: string; paragraphs: string[] }
> = {
  'drop-open': {
    kicker: 'Edition No. 08 · Preview',
    title: 'Chihiro & Haku Heavyweight Jersey',
    paragraphs: [
      'Crafted in 320 GSM heavyweight cotton eyelet mesh with 6-layer waterbased discharge & puff-ink back artwork and yarn-dyed vermilion rib collar piping.',
      'Public storefront doors open when the Atelier Calibration countdown reaches zero. Enter your email on the Dispatch Memo to get your early unlock link 15 minutes ahead of launch.',
    ],
  },
  shop: {
    kicker: 'Atelier Storefront',
    title: 'Temporarily Sealed For Calibration',
    paragraphs: [
      'Full catalog browsing is paused while we finish serial woven tagging and garment quality checks for Batch 08.',
      'Patrons holding an early access key can unlock the staging vault immediately via the Patron Key button.',
    ],
  },
  about: {
    kicker: 'Everyday Anime Atelier',
    title: 'About Yabai Society',
    paragraphs: [
      'Yabai Society is an independent anime apparel atelier operating between Tokyo and Los Angeles. We produce gallery-grade heavyweight jerseys, screenprints, and garments made gently for ordinary life.',
      'Every run is strictly limited and never reprinted once vaulted.',
    ],
  },
  archive: {
    kicker: 'Past Releases',
    title: 'Vaulted Archive Editions',
    paragraphs: [
      'Editions 01 through 07 are permanently vaulted. Every Yabai Society piece carries a numbered woven hem tag certifying its exact production batch.',
    ],
  },
  help: {
    kicker: 'Support & Dispatch',
    title: 'Atelier Help Desk',
    paragraphs: [
      'Need order assistance or sizing guidance prior to launch? Reach Yuu-chan & the studio crew directly at hello@yabaisociety.com.',
    ],
  },
  sizing: {
    kicker: 'Pattern Block 08',
    title: 'Relaxed Tokyo Boxy Fit Guide',
    paragraphs: [
      'Sizes XS through XL feature a relaxed drop-shoulder cut. Chest widths range from 108 cm (XS) to 132 cm (XL) in 6 cm increments. Take your regular size for an intentional boxy drape.',
    ],
  },
  'preorder-policy': {
    kicker: 'Guarantee & Status',
    title: 'Preorder Policy & Refunds',
    paragraphs: [
      'Batch 08 jerseys are pre-produced and undergoing final studio QC. Unshipped orders can be modified or refunded 100% prior to fulfillment dispatch.',
    ],
  },
  timeline: {
    kicker: 'Batch 08 Schedule',
    title: 'Shipping & Fulfillment Timeline',
    paragraphs: [
      'Domestic US and international orders dispatch tracked from our Los Angeles Atelier hub within 3–5 business days after the vault doors open.',
    ],
  },
  contact: {
    kicker: 'Studio Contact',
    title: 'Contact Yuu-chan & Studio',
    paragraphs: [
      'Direct studio inquiries: hello@yabaisociety.com · Studio hours: Mon–Fri, 09:00–18:00 PST.',
    ],
  },
};

export const Footer: React.FC<FooterProps> = ({
  activeTopic,
  onSelectTopic,
  onOpenPasscodeModal,
}) => {
  const modalCopy = activeTopic ? TOPIC_CONTENT[activeTopic] : null;

  return (
    <>
      <footer className="w-full bg-[#EEE5BC] text-[#0A0908] mt-16">
        {/* Top Obsidian Ticker Strip */}
        <div className="bg-[#0A0908] text-[#FBF7EE] py-1.5 px-4 lg:px-10 text-center font-mono-tech text-[11px] tracking-widest uppercase flex flex-wrap items-center justify-between gap-2">
          <span className="font-display text-[11px] font-extrabold tracking-[0.18em] text-[#E3D8A8]">
            ART DIRECTION · TOKYO / WORLDWIDE
          </span>
          <span className="font-mono-tech text-[11px]">
            LIMITED EDITIONS // NO REPRINTS ONCE VAULTED
          </span>
          <span className="font-display text-[11px] font-extrabold tracking-[0.18em] text-[#F58778]">
            SERIES 2026 // BATCH 08
          </span>
        </div>

        {/* Main Footer Directory */}
        <div className="max-w-7xl mx-auto px-4 lg:px-10 pt-12 pb-10">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-10 pb-10">
            <div className="space-y-4 max-w-sm">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 bg-[#AD3F32] flex items-center justify-center shrink-0">
                  <span className="font-display text-[28px] font-bold text-[#FBF7EE] uppercase leading-none">
                    ヤ
                  </span>
                </div>
                <div>
                  <span className="font-display text-3xl lg:text-[40px] font-bold uppercase tracking-tight block text-[#0A0908] leading-none">
                    Yabai Society
                  </span>
                  <span className="font-mono-tech text-[11px] text-[#57423e] tracking-wider uppercase">
                    Everyday Anime Atelier
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-[#57423e] leading-relaxed">
                Independent apparel atelier crafting gallery-grade heavyweight jerseys,
                screenprints, and artifacts rooted in Tokyo subcultural aesthetics.
              </p>
              <div className="inline-flex items-center gap-2 bg-[#E3D8A8]/70 px-2.5 py-1 text-[#0A0908] font-mono-tech text-[11px]">
                <span className="w-2 h-2 hanko-seal bg-[#387D75]" aria-hidden="true" />
                <span>AUTUMN 2026 VAULT CYCLE [BATCH 08]</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto">
              <div className="space-y-2">
                <span className="font-display text-[14px] font-bold uppercase tracking-wider text-[#0A0908] block pb-1">
                  Drops
                </span>
                <ul className="space-y-1.5 text-[13px] text-[#57423e]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('drop-open')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Current Drop
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('archive')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Past Releases
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={onOpenPasscodeModal}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Staging Preview
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-display text-[14px] font-bold uppercase tracking-wider text-[#0A0908] block pb-1">
                  Brand
                </span>
                <ul className="space-y-1.5 text-[13px] text-[#57423e]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('about')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      About Yabai
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('about')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Yuu-chan Mascot
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('archive')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Manifesto
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-display text-[14px] font-bold uppercase tracking-wider text-[#0A0908] block pb-1">
                  Customer Care
                </span>
                <ul className="space-y-1.5 text-[13px] text-[#57423e]">
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('sizing')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Sizing Guide
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('preorder-policy')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Preorder Policy &amp; Refunds
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('timeline')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Shipping &amp; Timeline
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('help')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      FAQ
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => onSelectTopic('contact')}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Contact Yuu-chan &amp; Studio
                    </button>
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <span className="font-display text-[14px] font-bold uppercase tracking-wider text-[#0A0908] block pb-1">
                  Community
                </span>
                <ul className="space-y-1.5 text-[13px] text-[#57423e]">
                  <li>
                    <a
                      href="https://instagram.com/yabaisociety"
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-[#8d281d]"
                    >
                      Instagram @yabaisociety
                    </a>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => window.scrollTo({ top: document.body.scrollHeight * 0.55, behavior: 'smooth' })}
                      className="hover:text-[#8d281d] cursor-pointer text-left"
                    >
                      Newsletter Dispatch
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="py-4 border-t border-b border-[#0A0908]/16 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="font-mono-tech text-[11px] text-[#57423e] max-w-2xl leading-relaxed">
              Created in independent homage to the cinema of Hayao Miyazaki and the quiet wonder of
              Studio Ghibli. Independent artwork, independently sewn. Not affiliated with Studio
              Ghibli.
            </div>
            <div className="flex items-center gap-2 font-mono-tech text-[11px] text-[#161514] shrink-0">
              <span className="px-2.5 py-1 bg-[#FBF7EE] border border-[#0A0908]/20 uppercase tracking-wider">
                Big Cartel SSL
              </span>
              <span className="px-2.5 py-1 bg-[#FBF7EE] border border-[#0A0908]/20 uppercase tracking-wider">
                Stripe Direct
              </span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 font-mono-tech text-[11px] text-[#57423e]">
            <p>© 2026 Yabai Society. Chase your slice of life. // BE REMARKABLE (自分らしく素晴らしくあれ)</p>
            <p className="tracking-widest uppercase">
              MADE FOR INDEPENDENT TASTEMAKERS // TOKYO — GLOBAL [DISTRICT 08]
            </p>
          </div>
        </div>
      </footer>

      {/* Editorial Info Dialog for Header/Footer Links */}
      {modalCopy && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="atelier-info-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0A0908]/65 p-4"
        >
          <div className="w-full max-w-lg border-2 border-[#0A0908] bg-[#FBF7EE] p-6 shadow-[6px_6px_0px_#0A0908]">
            <div className="flex items-start justify-between gap-4 border-b-2 border-[#0A0908] pb-3">
              <div>
                <span className="font-mono-tech text-[11px] font-bold uppercase tracking-widest text-[#AD3F32]">
                  {modalCopy.kicker}
                </span>
                <h2
                  id="atelier-info-title"
                  className="mt-1 font-display text-3xl font-bold uppercase tracking-wide text-[#0A0908]"
                >
                  {modalCopy.title}
                </h2>
              </div>
              <button
                type="button"
                aria-label="Close studio notice"
                onClick={() => onSelectTopic(null)}
                className="border border-[#0A0908] bg-[#EEE5BC] p-1.5 text-[#0A0908] hover:bg-[#0A0908] hover:text-[#FBF7EE] transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm leading-relaxed text-[#57423E]">
              {modalCopy.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  onSelectTopic(null);
                  onOpenPasscodeModal();
                }}
                className="border border-[#0A0908] bg-[#EEE5BC] px-3.5 py-2 font-display text-sm font-bold uppercase tracking-wider text-[#0A0908] hover:bg-[#E3D8A8] transition-colors cursor-pointer"
              >
                Enter Patron Key
              </button>
              <button
                type="button"
                onClick={() => onSelectTopic(null)}
                className="border-2 border-[#0A0908] bg-[#0A0908] px-4 py-2 font-display text-sm font-bold uppercase tracking-wider text-[#FBF7EE] hover:bg-[#AD3F32] transition-colors cursor-pointer"
              >
                Close Notice
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
