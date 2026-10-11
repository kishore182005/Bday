import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy,
  Heart,
  Sparkles,
  RotateCcw,
  ArrowRight,
  Gamepad2,
  Gift,
  Star,
  CheckCircle2,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';

/* ==============================================================================
   GAME 1: 🧸 TREAT CATCHER (Catch falling treats for en Chellam)
   ============================================================================== */
const TreatCatcherGame = ({ onWin, isCompleted }) => {
  const { playPopSound, playHeartCollectSound, playChimeSound } = useAudio();
  const [basketX, setBasketX] = useState(50); // percentage 0 to 100
  const [score, setScore] = useState(0);
  const [targetScore] = useState(10);
  const [items, setItems] = useState([]);
  const [gameActive, setGameActive] = useState(false);
  const [comboText, setComboText] = useState('');

  const arenaRef = useRef(null);
  const basketXRef = useRef(50);
  const scoreRef = useRef(0);
  const itemsRef = useRef([]);
  const gameActiveRef = useRef(false);
  const animFrameRef = useRef(null);
  const lastSpawnTimeRef = useRef(0);

  const treatTypes = [
    { emoji: '🍗', points: 3, label: 'Hot Biriyani (+3!) 🤤' },
    { emoji: '🥘', points: 3, label: 'Biriyani Pot (+3!) 🍗' },
    { emoji: '💙', points: 2, label: 'Blue Heart (+2) 💙' },
    { emoji: '🍟', points: 2, label: 'Crispy Fries (+2)' },
    { emoji: '🍓', points: 1, label: 'Strawberry' },
    { emoji: '🧸', points: 2, label: 'Teddy (+2)' },
    { emoji: '🧁', points: 1, label: 'Cupcake' }
  ];

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    gameActiveRef.current = gameActive;
  }, [gameActive]);

  // Smooth position updater (works for mouse, touch, pointer)
  const updateBasketPosition = (clientX) => {
    if (!arenaRef.current || !gameActiveRef.current) return;
    const rect = arenaRef.current.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const clampedX = Math.max(8, Math.min(92, x));
    basketXRef.current = clampedX;
    setBasketX(clampedX);
  };

  const handlePointerMove = (e) => {
    updateBasketPosition(e.clientX);
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches[0]) {
      updateBasketPosition(e.touches[0].clientX);
    }
  };

  // Start / restart game
  const startGame = () => {
    setScore(0);
    scoreRef.current = 0;
    setBasketX(50);
    basketXRef.current = 50;
    setItems([]);
    itemsRef.current = [];
    setGameActive(true);
    gameActiveRef.current = true;
    lastSpawnTimeRef.current = Date.now();
    setComboText('Catch the Biriyani & treats, en Foodie Bujji! 🍗🤤');
  };

  // Ultra-smooth 60 FPS Game Loop with requestAnimationFrame
  useEffect(() => {
    if (!gameActive) return;

    let lastTick = performance.now();

    const loop = (now) => {
      if (!gameActiveRef.current) return;

      const delta = Math.min((now - lastTick) / 1000, 0.1); // seconds elapsed
      lastTick = now;

      // 1. Spawn treats at regular interval
      if (Date.now() - lastSpawnTimeRef.current > 700) {
        if (itemsRef.current.length < 6) {
          const randomType = treatTypes[Math.floor(Math.random() * treatTypes.length)];
          const newItem = {
            id: Math.random(),
            x: Math.random() * 80 + 10,
            y: 0,
            speed: Math.random() * 25 + 35, // fall speed in % per second
            emoji: randomType.emoji,
            points: randomType.points
          };
          itemsRef.current = [...itemsRef.current, newItem];
        }
        lastSpawnTimeRef.current = Date.now();
      }

      // 2. Move items & detect collision
      const nextItems = [];
      const currentBasket = basketXRef.current;
      let scoreGained = 0;

      for (const item of itemsRef.current) {
        const nextY = item.y + item.speed * delta;

        // Basket detection line (y ~78% to 92%)
        if (nextY >= 78 && nextY <= 92 && Math.abs(item.x - currentBasket) < 14) {
          // CAUGHT!
          scoreGained += item.points;
        } else if (nextY < 98) {
          // Keep falling
          nextItems.push({ ...item, y: nextY });
        }
      }

      itemsRef.current = nextItems;
      setItems(nextItems);

      if (scoreGained > 0) {
        const newScore = scoreRef.current + scoreGained;
        scoreRef.current = newScore;
        setScore(newScore);

        playHeartCollectSound(newScore);

        const cheerMsgs = [
          "YUMMM! En Foodie Bujji caught the treat! 🤤 +3!",
          "Extra leg piece for en Chellam! 🥘✨",
          "Super Thangoo caught her fav treat! 💙",
          "Foodie Bujji streak! 🍟🥰",
          "Biriyani & treats love forever! 🍗❤️"
        ];
        setComboText(cheerMsgs[Math.floor(Math.random() * cheerMsgs.length)]);

        if (newScore >= targetScore) {
          setGameActive(false);
          gameActiveRef.current = false;
          playChimeSound();
          onWin();
          try {
            confetti({ particleCount: 70, spread: 80, colors: ['#ff7597', '#fde047', '#a855f7'] });
          } catch (e) {}
          return;
        }
      }

      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [gameActive]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Header bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(30, 10, 48, 0.7)',
          border: '1.5px solid rgba(255, 117, 151, 0.4)',
          borderRadius: '16px',
          padding: '10px 18px',
          marginBottom: '14px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>🧸</span>
          <span style={{ fontWeight: 800, color: '#ffe4e6', fontSize: '0.95rem' }}>
            Treats: <span style={{ color: '#fde047', fontSize: '1.15rem' }}>{score}</span> / {targetScore}
          </span>
        </div>
        <span style={{ fontSize: '0.85rem', color: '#ffb1c3', fontWeight: 600 }}>
          {comboText || 'Slide basket to catch!'}
        </span>
      </div>

      {/* Interactive Play Arena */}
      <div
        ref={arenaRef}
        onPointerMove={handlePointerMove}
        onTouchMove={handleTouchMove}
        onMouseMove={handlePointerMove}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '560px',
          height: '340px',
          background: 'radial-gradient(ellipse at center, rgba(45, 15, 70, 0.85) 0%, rgba(15, 5, 25, 0.95) 100%)',
          border: '2px solid rgba(255, 117, 151, 0.5)',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 16px 40px rgba(0,0,0,0.8), inset 0 0 40px rgba(255, 117, 151, 0.15)',
          cursor: gameActive ? 'none' : 'default',
          touchAction: 'none'
        }}
      >
        {/* Start / Replay Screen */}
        {!gameActive && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 5, 25, 0.85)',
              backdropFilter: 'blur(8px)',
              zIndex: 30,
              padding: '20px'
            }}
          >
            {score >= targetScore ? (
              <>
                <span style={{ fontSize: '48px', marginBottom: '8px' }}>🏆</span>
                <h4 className="font-serif gradient-text-cute" style={{ fontSize: '1.6rem', marginBottom: '4px' }}>
                  Bujji Won The Game! 🎉
                </h4>
                <p style={{ color: '#ffe4e6', fontSize: '0.9rem', marginBottom: '16px' }}>
                  En Thangoo caught all 10 sweet treats!
                </p>
                <button onClick={startGame} className="btn-cute" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                  <RotateCcw size={15} /> Play Again
                </button>
              </>
            ) : (
              <>
                <span style={{ fontSize: '48px', marginBottom: '8px' }}>🧸🍓</span>
                <h4 className="font-serif gradient-text-cute" style={{ fontSize: '1.5rem', marginBottom: '6px' }}>
                  Bujji's Treat Catcher
                </h4>
                <p style={{ color: '#c4b5fd', fontSize: '0.86rem', maxWidth: '320px', marginBottom: '16px' }}>
                  Move your finger or mouse to guide the Teddy Basket and catch 10 sweet items!
                </p>
                <button onClick={startGame} className="btn-cute pulse-glow" style={{ padding: '12px 28px', fontSize: '0.95rem' }}>
                  <Play size={16} /> Start Game 🎮
                </button>
              </>
            )}
          </div>
        )}

        {/* Falling Items */}
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              position: 'absolute',
              left: `${item.x}%`,
              top: `${item.y}%`,
              fontSize: '28px',
              transform: 'translate(-50%, -50%)',
              filter: 'drop-shadow(0 4px 8px rgba(255, 117, 151, 0.6))',
              userSelect: 'none',
              pointerEvents: 'none',
              willChange: 'transform, top'
            }}
          >
            {item.emoji}
          </div>
        ))}

        {/* Player Basket (Teddy) */}
        <div
          style={{
            position: 'absolute',
            left: `${basketX}%`,
            top: '84%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            userSelect: 'none',
            pointerEvents: 'none',
            willChange: 'left'
          }}
        >
          <span style={{ fontSize: '38px', filter: 'drop-shadow(0 0 16px rgba(255, 117, 151, 0.8))' }}>
            🧸
          </span>
          <div
            style={{
              width: '64px',
              height: '8px',
              background: 'linear-gradient(90deg, #ff7597, #fde047)',
              borderRadius: '9999px',
              boxShadow: '0 0 12px #ff7597',
              marginTop: '-4px'
            }}
          />
        </div>
      </div>
    </div>
  );
};

/* ==============================================================================
   GAME 2: 🃏 MEMORY MATCH (Find cute matching pairs for en Chellam)
   ============================================================================== */
const MemoryMatchGame = ({ onWin, isCompleted }) => {
  const { playPopSound, playHeartCollectSound, playChimeSound } = useAudio();

  const initialCards = [
    { id: 1, pairId: 'biriyani', emoji: '🍗', label: 'Biriyani Feast' },
    { id: 2, pairId: 'biriyani', emoji: '🍗', label: 'Biriyani Feast' },
    { id: 3, pairId: 'blueheart', emoji: '💙', label: 'Fav Blue Heart' },
    { id: 4, pairId: 'blueheart', emoji: '💙', label: 'Fav Blue Heart' },
    { id: 5, pairId: 'teddy', emoji: '🧸', label: 'Bujji Teddy' },
    { id: 6, pairId: 'teddy', emoji: '🧸', label: 'Bujji Teddy' },
    { id: 7, pairId: 'cake', emoji: '🎂', label: 'Sweet Cake' },
    { id: 8, pairId: 'cake', emoji: '🎂', label: 'Sweet Cake' },
    { id: 9, pairId: 'crown', emoji: '👑', label: 'Foodie Queen' },
    { id: 10, pairId: 'crown', emoji: '👑', label: 'Foodie Queen' },
    { id: 11, pairId: 'fries', emoji: '🍟', label: 'Crispy Fries' },
    { id: 12, pairId: 'fries', emoji: '🍟', label: 'Crispy Fries' }
  ];

  const [cards, setCards] = useState([]);
  const [flippedIndices, setFlippedIndices] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [moves, setMoves] = useState(0);
  const [matchMessage, setMatchMessage] = useState('Find all 6 cute pairs!');

  const shuffleCards = () => {
    const shuffled = [...initialCards].sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedIndices([]);
    setMatchedPairs([]);
    setMoves(0);
    setMatchMessage('Find all 6 cute pairs, en Chellam!');
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  const handleCardClick = (index) => {
    // Prevent clicking already matched, already flipped, or while 2 cards are showing
    if (flippedIndices.length === 2 || flippedIndices.includes(index) || matchedPairs.includes(cards[index].pairId)) {
      return;
    }

    playPopSound();
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const firstCard = cards[newFlipped[0]];
      const secondCard = cards[newFlipped[1]];

      if (firstCard.pairId === secondCard.pairId) {
        // MATCH!
        playHeartCollectSound(matchedPairs.length + 1);
        const newMatched = [...matchedPairs, firstCard.pairId];
        setMatchedPairs(newMatched);
        setFlippedIndices([]);

        const matchCheers = [
          "Match found! Made for each other! 🥰",
          "Yay en Thangoo! Perfect pair! 💖",
          "Bujji kutty is a genius! 🧸✨",
          "Pattu ma score! 🌸"
        ];
        setMatchMessage(matchCheers[Math.floor(Math.random() * matchCheers.length)]);

        if (newMatched.length === 6) {
          playChimeSound();
          onWin();
          try {
            confetti({ particleCount: 75, spread: 85, colors: ['#ff7597', '#fde047', '#38bdf8'] });
          } catch (e) {}
        }
      } else {
        // NO MATCH: Flip back after short delay
        setTimeout(() => {
          setFlippedIndices([]);
        }, 850);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '560px',
          background: 'rgba(30, 10, 48, 0.7)',
          border: '1.5px solid rgba(255, 117, 151, 0.4)',
          borderRadius: '16px',
          padding: '10px 18px',
          marginBottom: '16px'
        }}
      >
        <div style={{ fontWeight: 800, color: '#ffe4e6', fontSize: '0.92rem' }}>
          Pairs: <span style={{ color: '#fde047', fontSize: '1.15rem' }}>{matchedPairs.length}</span> / 6
          <span style={{ color: '#c4b5fd', fontSize: '0.8rem', marginLeft: '10px' }}>({moves} moves)</span>
        </div>
        <span style={{ fontSize: '0.82rem', color: '#ffb1c3', fontWeight: 600 }}>
          {matchMessage}
        </span>
      </div>

      {/* 4x3 Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '10px',
          width: '100%',
          maxWidth: '560px',
          marginBottom: '16px'
        }}
      >
        {cards.map((card, idx) => {
          const isFlipped = flippedIndices.includes(idx) || matchedPairs.includes(card.pairId);
          const isMatched = matchedPairs.includes(card.pairId);

          return (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleCardClick(idx)}
              style={{
                height: '80px',
                borderRadius: '16px',
                background: isMatched
                  ? 'linear-gradient(135deg, rgba(253, 224, 71, 0.3) 0%, rgba(255, 117, 151, 0.35) 100%)'
                  : isFlipped
                  ? 'linear-gradient(135deg, rgba(255, 117, 151, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)'
                  : 'rgba(255, 255, 255, 0.06)',
                border: `2px solid ${isMatched ? '#fde047' : isFlipped ? '#ff7597' : 'rgba(255, 117, 151, 0.25)'}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: isFlipped ? '34px' : '22px',
                cursor: isMatched ? 'default' : 'pointer',
                boxShadow: isMatched
                  ? '0 0 16px rgba(253, 224, 71, 0.5)'
                  : isFlipped
                  ? '0 0 12px rgba(255, 117, 151, 0.4)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.2s ease',
                userSelect: 'none'
              }}
            >
              {isFlipped ? card.emoji : '🎀'}
            </motion.div>
          );
        })}
      </div>

      <button onClick={shuffleCards} className="btn-soft" style={{ padding: '6px 18px', fontSize: '0.82rem' }}>
        <RotateCcw size={13} /> Reset Cards
      </button>
    </div>
  );
};

/* ==============================================================================
   GAME 3: 🎡 LOVE WHEEL (Spin the wheel for sweet romantic coupons)
   ============================================================================== */
const LoveWheelGame = ({ onWin, isCompleted }) => {
  const { playPopSound, playChimeSound } = useAudio();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState(null);

  const prizes = [
    { label: "Grand Biriyani Date 🍗", note: "Unlimited aromatic Biriyani feast with extra leg piece & raitha on Kishore!" },
    { label: "Ice Cream Feast 🍦", note: "Unlimited ice creams anywhere en Foodie Bujji wants!" },
    { label: "1000 Big Cuddles 🧸", note: "Giant tight hugs whenever you need comfort!" },
    { label: "Movie & Snacks Marathon 🎬🍿", note: "You pick any movie, Kishore brings hot fries, popcorn & snacks!" },
    { label: "Queen For A Month 👑", note: "Your every cute wish is my command, en Chellam!" },
    { label: "Midnight Food Delivery 🍕", note: "Midnight cravings on Kishore's treat anytime!" },
    { label: "Relaxing Head Massage 💆‍♀️", note: "Soothing head massage whenever you feel stressed!" },
    { label: "Forever Pampering 💙", note: "Endless love, loyalty, and care forever & ever!" }
  ];

  const spinWheel = () => {
    if (spinning) return;
    playPopSound();
    setSpinning(true);
    setWonPrize(null);

    const randomDegrees = Math.floor(Math.random() * 360);
    const totalRotation = rotation + 1800 + randomDegrees; // 5 full spins + offset
    setRotation(totalRotation);

    setTimeout(() => {
      setSpinning(false);
      // Calculate which prize it landed on (8 slices = 45 degrees each)
      const normalizedDegree = (360 - (totalRotation % 360) + 22.5) % 360;
      const index = Math.floor(normalizedDegree / 45) % prizes.length;
      const prize = prizes[index];
      setWonPrize(prize);
      playChimeSound();
      onWin();
      try {
        confetti({ particleCount: 75, spread: 85, colors: ['#ff7597', '#fde047', '#a855f7'] });
      } catch (e) {}
    }, 4000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
      {/* Wheel Container */}
      <div
        style={{
          position: 'relative',
          width: '300px',
          height: '300px',
          margin: '10px 0 20px'
        }}
      >
        {/* Top Pointer */}
        <div
          style={{
            position: 'absolute',
            top: '-14px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 20,
            width: 0,
            height: 0,
            borderLeft: '14px solid transparent',
            borderRight: '14px solid transparent',
            borderTop: '24px solid #fde047',
            filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.6))'
          }}
        />

        {/* Rotating Wheel Circle */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 4, ease: [0.15, 0.9, 0.25, 1] }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '5px solid #ff7597',
            boxShadow: '0 0 35px rgba(255, 117, 151, 0.5), inset 0 0 20px rgba(0,0,0,0.5)',
            background: 'conic-gradient(#f43f5e 0deg 45deg, #a855f7 45deg 90deg, #ec4899 90deg 135deg, #38bdf8 135deg 180deg, #f59e0b 180deg 225deg, #10b981 225deg 270deg, #e11d48 270deg 315deg, #8b5cf6 315deg 360deg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden'
          }}
        >
          {/* Inner Wheel Center Pin */}
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7597, #c084fc)',
              border: '3px solid #fff',
              boxShadow: '0 0 16px rgba(0,0,0,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              zIndex: 10
            }}
          >
            🎁
          </div>
        </motion.div>
      </div>

      {/* Spin Button */}
      <button
        onClick={spinWheel}
        disabled={spinning}
        className="btn-cute pulse-glow"
        style={{ padding: '12px 32px', fontSize: '1rem', marginBottom: '16px' }}
      >
        <Sparkles size={16} />
        <span>{spinning ? 'Spinning for Chellam... ✨' : 'SPIN FOR EN THANGOO! 🎡'}</span>
      </button>

      {/* Won Prize Coupon Box */}
      <AnimatePresence>
        {wonPrize && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'linear-gradient(135deg, rgba(253, 224, 71, 0.2) 0%, rgba(255, 117, 151, 0.25) 100%)',
              border: '2px solid #fde047',
              borderRadius: '20px',
              padding: '16px 24px',
              maxWidth: '460px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5), 0 0 25px rgba(253, 224, 71, 0.35)',
              textAlign: 'center'
            }}
          >
            <span style={{ fontSize: '11px', color: '#fde047', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>
              OFFICIAL LOVE COUPON FOR SHARMILA
            </span>
            <h4 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fff', margin: '6px 0' }}>
              {wonPrize.label}
            </h4>
            <p style={{ color: '#ffe4e6', fontSize: '0.88rem', margin: 0 }}>
              "{wonPrize.note}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ==============================================================================
   MAIN MINI GAMES ARENA CONTAINER
   ============================================================================== */
export const MiniGames = ({ onNext }) => {
  const [activeGame, setActiveGame] = useState('catcher'); // 'catcher' | 'match' | 'wheel'
  const [completedGames, setCompletedGames] = useState({
    catcher: false,
    match: false,
    wheel: false
  });

  const handleGameWin = (gameKey) => {
    setCompletedGames((prev) => ({ ...prev, [gameKey]: true }));
  };

  const wonCount = Object.values(completedGames).filter(Boolean).length;

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '920px',
        margin: '0 auto',
        padding: '90px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ marginBottom: '24px' }}
      >
        <div className="chapter-badge">
          <Gamepad2 size={16} style={{ color: '#f472b6' }} />
          <span>Chellam's Birthday Arcade 🎮</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.1rem, 4.8vw, 3.2rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '8px 0 6px',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)'
          }}
        >
          Fun & Games for en Bujji ❤️
        </h2>
        <p style={{ color: '#f1e6f5', fontSize: '1.05rem', maxWidth: '580px', margin: '8px auto 0' }}>
          Play our 3 cute games! Win rewards, find secret pairs, and unlock Sharmila's magical gift room!
        </p>
      </motion.div>

      {/* Game Selector Tabs */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1.5px solid rgba(255, 117, 151, 0.3)',
          borderRadius: '24px',
          padding: '6px',
          marginBottom: '26px'
        }}
      >
        {[
          { id: 'catcher', label: '🍗 Biriyani Catcher', key: 'catcher' },
          { id: 'match', label: '💙 Foodie Pairs', key: 'match' },
          { id: 'wheel', label: '🎡 Foodie Coupon Wheel', key: 'wheel' }
        ].map((tab) => {
          const isActive = activeGame === tab.id;
          const isDone = completedGames[tab.key];
          return (
            <button
              key={tab.id}
              onClick={() => setActiveGame(tab.id)}
              style={{
                background: isActive ? 'linear-gradient(135deg, #ff7597, #c084fc)' : 'transparent',
                color: isActive ? '#fff' : '#c4b5fd',
                border: 'none',
                borderRadius: '18px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isActive ? '0 0 20px rgba(255, 117, 151, 0.5)' : 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{tab.label}</span>
              {isDone && <CheckCircle2 size={15} color="#fde047" />}
            </button>
          );
        })}
      </div>

      {/* Active Game Display */}
      <motion.div
        key={activeGame}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -15 }}
        transition={{ duration: 0.3 }}
        style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {activeGame === 'catcher' && (
          <TreatCatcherGame
            onWin={() => handleGameWin('catcher')}
            isCompleted={completedGames.catcher}
          />
        )}
        {activeGame === 'match' && (
          <MemoryMatchGame
            onWin={() => handleGameWin('match')}
            isCompleted={completedGames.match}
          />
        )}
        {activeGame === 'wheel' && (
          <LoveWheelGame
            onWin={() => handleGameWin('wheel')}
            isCompleted={completedGames.wheel}
          />
        )}
      </motion.div>

      {/* Unlock / Continue CTA to Gift Room */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{
          marginTop: '36px',
          padding: '20px 28px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1.5px solid rgba(255, 117, 151, 0.35)',
          borderRadius: '24px',
          maxWidth: '560px',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Star size={18} color="#fde047" fill="#fde047" />
          <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffe4e6' }}>
            {wonCount > 0
              ? `YAYYY! En Chellam has ${wonCount} Star Badges! 🌟`
              : 'Play any game or enter the Gift Room whenever you are ready!'}
          </span>
        </div>

        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{ padding: '1.1rem 2.8rem', fontSize: '1.05rem' }}
        >
          <span>Enter Sharmila's Magical Gift Room 🎁</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};
