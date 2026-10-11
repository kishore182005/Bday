import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronUp } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { AudioProvider, useAudio } from './context/AudioContext';
import { StarBackground } from './components/StarBackground';
import { HeartParticles } from './components/HeartParticles';
import { CursorSparkles } from './components/CursorSparkles';
import { CuteFloaters } from './components/CuteFloaters';
import { Navbar } from './components/Navbar';
import { MusicPlayer } from './components/MusicPlayer';
import { AiMessageModal } from './components/AiMessageModal';
import { SecretVaultModal } from './components/SecretVaultModal';
import { PasscodeLock } from './components/PasscodeLock';

// 9 Dedicated Story Pages
import { Welcome } from './pages/Welcome';
import { Letter } from './pages/Letter';
import { OurStory } from './pages/OurStory';
import { LoveAlbum } from './pages/LoveAlbum';
import { MiniGames } from './pages/MiniGames';
import { GiftRoom } from './pages/GiftRoom';
import { BirthdayCake } from './pages/BirthdayCake';
import { DateReveal } from './pages/DateReveal';
import { OneLastThing } from './pages/OneLastThing';

const CHAPTERS = [
  { id: 'welcome', label: 'Playground', title: "Sharmila's World 🎀" },
  { id: 'letter', label: 'Letter', title: "Love Letter 💌" },
  { id: 'story', label: 'Our Story', title: "Our Story 📖" },
  { id: 'album', label: 'Love Album', title: "Love Album 📸" },
  { id: 'minigames', label: 'Arcade', title: "Birthday Arcade 🎮" },
  { id: 'gifts', label: 'Gifts', title: "Gift Room 🎁" },
  { id: 'cake', label: 'Cake', title: "Birthday Cake 🎂" },
  { id: 'date', label: '13.10.2026', title: "13.10.2026 ⏳" },
  { id: 'final', label: 'Forever', title: "Forever & Always ❤️" }
];

const VALID_PAGES = ['welcome', 'letter', 'story', 'album', 'minigames', 'gifts', 'cake', 'date', 'final'];

function getInitialPage() {
  try {
    const hash = window.location.hash.replace('#', '').trim();
    if (hash && VALID_PAGES.includes(hash)) {
      return hash;
    }
    const saved = localStorage.getItem('sharmila_active_section');
    if (saved && VALID_PAGES.includes(saved)) {
      return saved;
    }
  } catch (e) {}
  return 'welcome';
}

function getInitialUnlocked() {
  try {
    // Clear legacy localStorage key if present
    localStorage.removeItem('sharmila_world_unlocked');

    if (window.location.search.includes('lock=true') || window.location.hash === '#lock') {
      sessionStorage.removeItem('sharmila_world_unlocked');
      return false;
    }
    // Return true if unlocked in current tab session (survives refreshes)
    return sessionStorage.getItem('sharmila_world_unlocked') === 'true';
  } catch (e) {
    return false;
  }
}

function MainAppContent() {
  const [hasEnteredWorld, setHasEnteredWorld] = useState(getInitialUnlocked);
  const [activeSection, setActiveSection] = useState(getInitialPage);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isSecretModalOpen, setIsSecretModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Set document title once
  useEffect(() => {
    document.title = "Sharmila's World 🎀 | Happy Birthday Sharmila ❤️";
  }, []);

  const handleUnlock = () => {
    setHasEnteredWorld(true);
    try {
      sessionStorage.setItem('sharmila_world_unlocked', 'true');
    } catch (e) {}
  };

  // Navigate directly to target page
  const navigateTo = (sectionId) => {
    if (!VALID_PAGES.includes(sectionId)) return;
    setActiveSection(sectionId);
    try {
      localStorage.setItem('sharmila_active_section', sectionId);
      window.location.hash = sectionId;
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sync hash changes (e.g. browser back/forward or direct link)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash === 'lock') {
        localStorage.removeItem('sharmila_world_unlocked');
        setHasEnteredWorld(false);
        return;
      }
      if (hash && VALID_PAGES.includes(hash)) {
        setActiveSection(hash);
        try {
          localStorage.setItem('sharmila_active_section', hash);
        } catch (e) {}
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash and localStorage whenever activeSection changes
  useEffect(() => {
    try {
      localStorage.setItem('sharmila_active_section', activeSection);
      if (window.location.hash.replace('#', '') !== activeSection && window.location.hash !== '#lock') {
        window.location.hash = activeSection;
      }
    } catch (e) {}
  }, [activeSection]);

  // Back-to-top button on scroll
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Render current active page
  const renderCurrentPage = () => {
    switch (activeSection) {
      case 'welcome':
        return <Welcome onNext={() => navigateTo('letter')} />;
      case 'letter':
        return <Letter onNext={() => navigateTo('story')} onPrev={() => navigateTo('welcome')} />;
      case 'story':
        return <OurStory onNext={() => navigateTo('album')} onPrev={() => navigateTo('letter')} />;
      case 'album':
        return <LoveAlbum onNext={() => navigateTo('minigames')} onPrev={() => navigateTo('story')} />;
      case 'minigames':
        return <MiniGames onNext={() => navigateTo('gifts')} onPrev={() => navigateTo('album')} />;
      case 'gifts':
        return <GiftRoom onNext={() => navigateTo('cake')} onPrev={() => navigateTo('minigames')} />;
      case 'cake':
        return <BirthdayCake onNext={() => navigateTo('date')} onPrev={() => navigateTo('gifts')} />;
      case 'date':
        return <DateReveal onNext={() => navigateTo('final')} onPrev={() => navigateTo('cake')} />;
      case 'final':
        return <OneLastThing onRestart={() => navigateTo('welcome')} onPrev={() => navigateTo('date')} />;
      default:
        return <Welcome onNext={() => navigateTo('letter')} />;
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        backgroundColor: '#080310',
        color: '#f8fafc',
        overflowX: 'hidden'
      }}
    >
      {/* Birthday Entrance Gatekeeper Task - Passcode 1701 */}
      <AnimatePresence>
        {!hasEnteredWorld && (
          <PasscodeLock onUnlock={handleUnlock} />
        )}
      </AnimatePresence>

      {/* Trailing Cursor Sparkles & Double-Click Heart Burst */}
      <CursorSparkles />

      {/* Dynamic Starfield & Nebula Background */}
      <StarBackground />

      {/* Ambient Floating Hearts */}
      <HeartParticles />

      {/* Top Floating Glassmorphism Navbar for Quick Page Jump */}
      <Navbar
        activeSection={activeSection}
        onNavigate={navigateTo}
        onLock={() => {
          try {
            sessionStorage.removeItem('sharmila_world_unlocked');
          } catch (e) {}
          setHasEnteredWorld(false);
        }}
      />

      {/* Active Page Viewport with Smooth Page-to-Page Transition */}
      <main style={{ position: 'relative', zIndex: 10, width: '100%', minHeight: 'calc(100vh - 100px)' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%' }}
          >
            {renderCurrentPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Floating Scroll Back To Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{
              position: 'fixed',
              bottom: '24px',
              right: '24px',
              zIndex: 35,
              background: 'linear-gradient(135deg, var(--pink-soft), var(--purple-soft))',
              border: '1.5px solid rgba(255, 255, 255, 0.4)',
              borderRadius: '50%',
              width: '46px',
              height: '46px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 20px var(--glass-glow)',
              cursor: 'pointer'
            }}
            title="Scroll to top 🌸"
          >
            <ChevronUp size={22} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Corner Multi-Track Music Player */}
      <MusicPlayer />

      {/* AI Birthday Letter Modal (Gemini AI) */}
      <AiMessageModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

      {/* Secret Love Vault Modal (Password Protected) */}
      <SecretVaultModal
        isOpen={isSecretModalOpen}
        onClose={() => setIsSecretModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AudioProvider>
        <MainAppContent />
      </AudioProvider>
    </ThemeProvider>
  );
}
