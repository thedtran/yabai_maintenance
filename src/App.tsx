import { Suspense, lazy, useEffect, useState } from 'react';
import { TopBar, InfoModalTopic } from './components/TopBar';
import { AtelierPosterBoard } from './components/AtelierPosterBoard';
import { PasscodeModal } from './components/PasscodeModal';
import { UnlockedStagingView } from './components/UnlockedStagingView';
import { Footer } from './components/Footer';
import {
  ArtworkView,
  GarmentSize,
  calculateCountdown,
} from './utils/lockPageLogic';

const YuusRushGame = lazy(() => import('./components/YuusRushGame'));

// Matches Stitch reference: 8 hours, 4 minutes, 20 seconds ahead of initial mount
const INITIAL_DURATION_MS = ((8 * 3600) + (4 * 60) + 20) * 1000;

const STORAGE_EMAIL_KEY = 'yabai_drop08_dispatch_email';
const STORAGE_TICKET_KEY = 'yabai_drop08_dispatch_ticket';
const STORAGE_UNLOCK_KEY = 'yabai_drop08_unlocked_code';

export default function App() {
  const [targetMs] = useState<number>(() => Date.now() + INITIAL_DURATION_MS);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  const [currency, setCurrency] = useState<'USD' | 'JPY'>('USD');
  const [activeTopic, setActiveTopic] = useState<InfoModalTopic>(null);
  const [isPasscodeOpen, setIsPasscodeOpen] = useState(false);
  const [isGameOpen, setIsGameOpen] = useState(false);

  const [activeView, setActiveView] = useState<ArtworkView>('front');
  const [selectedSize, setSelectedSize] = useState<GarmentSize>('M');

  const [registeredEmail, setRegisteredEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_EMAIL_KEY);
    } catch {
      return null;
    }
  });

  const [ticketCode, setTicketCode] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_TICKET_KEY);
    } catch {
      return null;
    }
  });

  const [unlockedCode, setUnlockedCode] = useState<string | null>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get('autostart') === '1') {
        return 'YABAI04';
      }
      return localStorage.getItem(STORAGE_UNLOCK_KEY);
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const interval = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const countdown = calculateCountdown(targetMs, nowMs);

  const handleRegisterEmail = (email: string, code: string) => {
    setRegisteredEmail(email);
    setTicketCode(code);
    try {
      localStorage.setItem(STORAGE_EMAIL_KEY, email);
      localStorage.setItem(STORAGE_TICKET_KEY, code);
    } catch {
      // Ignore storage errors
    }
  };

  const handleClearEmail = () => {
    setRegisteredEmail(null);
    setTicketCode(null);
    try {
      localStorage.removeItem(STORAGE_EMAIL_KEY);
      localStorage.removeItem(STORAGE_TICKET_KEY);
    } catch {
      // Ignore storage errors
    }
  };

  const handleUnlockSuccess = (codeUsed: string) => {
    setUnlockedCode(codeUsed);
    setIsPasscodeOpen(false);
    try {
      localStorage.setItem(STORAGE_UNLOCK_KEY, codeUsed);
    } catch {
      // Ignore storage errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLockStorefront = () => {
    setUnlockedCode(null);
    try {
      localStorage.removeItem(STORAGE_UNLOCK_KEY);
    } catch {
      // Ignore storage errors
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fef8f6] text-[#1d1b1a]">
      <TopBar
        currency={currency}
        onToggleCurrency={setCurrency}
        bagCount={unlockedCode ? 1 : 0}
        isUnlocked={Boolean(unlockedCode)}
        onOpenPasscodeModal={() => setIsPasscodeOpen(true)}
        onLockStorefront={handleLockStorefront}
        onOpenTopic={setActiveTopic}
      />

      <main className="flex-1 w-full bg-[#fef8f6]">
        {unlockedCode ? (
          <UnlockedStagingView
            unlockedCode={unlockedCode}
            activeView={activeView}
            onSelectView={setActiveView}
            selectedSize={selectedSize}
            onSelectSize={setSelectedSize}
            onLockVault={handleLockStorefront}
          />
        ) : (
          <AtelierPosterBoard
            countdown={countdown}
            currency={currency}
            registeredEmail={registeredEmail}
            ticketCode={ticketCode}
            onRegisterEmail={handleRegisterEmail}
            onClearEmail={handleClearEmail}
            onOpenPasscodeModal={() => setIsPasscodeOpen(true)}
            onOpenGame={() => setIsGameOpen(true)}
          />
        )}
      </main>

      <Footer
        activeTopic={activeTopic}
        onSelectTopic={setActiveTopic}
        onOpenPasscodeModal={() => setIsPasscodeOpen(true)}
      />

      <PasscodeModal
        isOpen={isPasscodeOpen}
        onClose={() => setIsPasscodeOpen(false)}
        onUnlockSuccess={handleUnlockSuccess}
      />

      {isGameOpen && (
        <div className="fixed inset-0 z-50">
          <Suspense
            fallback={
              <div className="yuus-rush-shell z-50 bg-[#0A0908]/90 flex items-center justify-center">
                <div className="pixel-panel-cream px-6 py-4 font-pixel text-sm uppercase">
                  LOADING YUU&apos;S RUSH...
                </div>
              </div>
            }
          >
            <YuusRushGame onClose={() => setIsGameOpen(false)} />
          </Suspense>
        </div>
      )}
    </div>
  );
}
