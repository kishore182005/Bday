import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';
import { loveData } from '../data/loveData';

export const HeroIntro = ({ onEnter }) => {
  const { playMusic } = useAudio();
  const [stage, setStage] = useState(0);

  // Sequential reveal timing
  useEffect(() => {
    // 0: Heart appears
    const t1 = setTimeout(() => setStage(1), 1200); // 1: "pssst... 👀"
    const t2 = setTimeout(() => setStage(2), 2600); // 2: "Someone's birthday is coming..."
    const t3 = setTimeout(() => setStage(3), 4400); // 3: "13 . 10 . 2026"
    const t4 = setTimeout(() => setStage(4), 6200); // 4: "SHARMILA'S DAY ❤️"
    const t5 = setTimeout(() => setStage(5), 7800); // 5: "Welcome to a little world I made for you." + Button

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleEnterWorld = () => {
    // Play sound / music
    playMusic();

    // Grand opening confetti explosion
    try {
      confetti({
        particleCount: 90,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff7597', '#fb7185', '#d8b4fe', '#fde047', '#fff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 70,
          origin: { x: 0 },
          colors: ['#ff7597', '#d8b4fe', '#f43f5e']
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 70,
          origin: { x: 1 },
          colors: ['#ff7597', '#d8b4fe', '#f43f5e']
        });
      }, 250);
    } catch (e) {}

    // Smooth transition into the main world
    setTimeout(() => {
      onEnter();
    }, 700);
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(12px)' }}
      transition={{ duration: 0.9 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#06020a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
        overflow: 'hidden'
      }}
    >
      {/* Floating balloons background when stage >= 3 */}
      {stage >= 3 && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
          {['🎈', '🌸', '✨', '🎈', '💖', '🎈'].map((emoji, i) => (
            <motion.div
              key={i}
              initial={{ y: '110vh', x: `${15 * i + 10}vw`, opacity: 0 }}
              animate={{ y: '-10vh', opacity: [0, 0.8, 0] }}
              transition={{
                duration: 9 + i * 1.5,
                repeat: Infinity,
                delay: i * 0.8,
                ease: 'linear'
              }}
              style={{
                position: 'absolute',
                fontSize: `${28 + (i % 3) * 8}px`
              }}
            >
              {emoji}
            </motion.div>
          ))}
        </div>
      )}

      {/* Tiny Glowing Pulsing Heart */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [0, 1.25, 1], opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="heartbeat-anim"
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255, 117, 151, 0.4) 0%, transparent 70%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          color: '#ff7597'
        }}
      >
        <Heart size={36} fill="#ff7597" />
      </motion.div>

      {/* Stage 1: "pssst... 👀" */}
      <AnimatePresence>
        {stage >= 1 && stage < 3 && (
          <motion.p
            key="pssst"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="font-script"
            style={{
              fontSize: 'clamp(2rem, 5vw, 3.2rem)',
              color: '#ffe4e6',
              marginBottom: '12px'
            }}
          >
            {loveData.introSequence.prompt1}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Stage 2: "Someone's birthday is coming..." */}
      <AnimatePresence>
        {stage >= 2 && stage < 4 && (
          <motion.p
            key="coming"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="font-serif"
            style={{
              fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
              color: '#ffb1c3',
              fontStyle: 'italic',
              marginBottom: '20px'
            }}
          >
            {loveData.introSequence.prompt2}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Stage 3: "13 . 10 . 2026" */}
      <AnimatePresence>
        {stage >= 3 && (
          <motion.div
            key="date"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight: 800,
              letterSpacing: '6px',
              color: '#fde047',
              textShadow: '0 0 25px rgba(253, 224, 71, 0.6)',
              marginBottom: '14px'
            }}
          >
            {loveData.introSequence.dateReveal}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 4: "SHARMILA'S DAY ❤️" */}
      <AnimatePresence>
        {stage >= 4 && (
          <motion.h1
            key="sharmila-day"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              fontSize: 'clamp(2.8rem, 7vw, 4.8rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '16px',
              color: '#ffffff',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)'
            }}
          >
            {loveData.introSequence.headline}
          </motion.h1>
        )}
      </AnimatePresence>

      {/* Stage 5: Welcome message & CTA Button */}
      <AnimatePresence>
        {stage >= 5 && (
          <motion.div
            key="welcome-cta"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', marginTop: '10px' }}
          >
            <p
              style={{
                fontSize: 'clamp(1.1rem, 2.2vw, 1.45rem)',
                color: '#e9d5ff',
                maxWidth: '540px',
                lineHeight: 1.6
              }}
            >
              {loveData.introSequence.welcomeText}
            </p>

            <button
              onClick={handleEnterWorld}
              className="btn-cute pulse-glow"
              style={{
                fontSize: '1.2rem',
                padding: '1.2rem 3.4rem',
                letterSpacing: '1px'
              }}
            >
              <span>{loveData.introSequence.buttonText}</span>
              <Sparkles size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
