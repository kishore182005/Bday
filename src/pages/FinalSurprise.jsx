import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Sparkles, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';

export const FinalSurprise = ({ onRestart }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [isIgniting, setIsIgniting] = useState(false);

  const handleOpenSurprise = () => {
    setIsIgniting(true);

    // Heartbeat suspense delay before fireworks
    setTimeout(() => {
      setIsRevealed(true);
      setIsIgniting(false);

      // Grand fireworks & confetti display
      try {
        const duration = 4.5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) {
            return clearInterval(interval);
          }
          const particleCount = 50 * (timeLeft / duration);
          confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random() * 0.4 + 0.1, y: Math.random() - 0.2 },
            colors: ['#f43f5e', '#ec4899', '#fde047', '#a855f7', '#fb7185']
          });
          confetti({
            ...defaults,
            particleCount,
            origin: { x: Math.random() * 0.4 + 0.5, y: Math.random() - 0.2 },
            colors: ['#fda4af', '#f43f5e', '#38bdf8', '#c084fc', '#fde047']
          });
        }, 300);
      } catch (err) {
        console.warn('Confetti animation error:', err);
      }
    }, 1200);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '90px 20px 80px',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          /* Suspense Intro Screen */
          <motion.div
            key="suspense"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
            transition={{ duration: 0.8 }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              maxWidth: '600px'
            }}
          >
            <motion.div
              animate={isIgniting ? { scale: [1, 1.25, 0.95, 1.3, 1] } : {}}
              transition={{ repeat: Infinity, duration: 0.6 }}
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(244, 63, 94, 0.3) 0%, rgba(30, 10, 45, 0.4) 70%)',
                border: '1px solid rgba(251, 113, 133, 0.4)',
                boxShadow: '0 0 35px rgba(244, 63, 94, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fb7185',
                marginBottom: '32px'
              }}
              className={!isIgniting ? 'float-gentle' : ''}
            >
              <Gift size={36} />
            </motion.div>

            <h3
              className="font-serif"
              style={{
                fontSize: 'clamp(1.4rem, 3vw, 2rem)',
                color: '#cbd5e1',
                fontWeight: 300,
                letterSpacing: '1px',
                marginBottom: '14px'
              }}
            >
              {loveData.finalSurprise.teaserTitle}
            </h3>

            <p
              className="font-serif gradient-text-romantic glow-text"
              style={{
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                fontWeight: 700,
                lineHeight: 1.3,
                marginBottom: '40px'
              }}
            >
              {loveData.finalSurprise.teaserSubtitle}
            </p>

            <button
              onClick={handleOpenSurprise}
              disabled={isIgniting}
              className="btn-romantic pulse-glow"
              style={{
                fontSize: '1.2rem',
                padding: '1.2rem 3.2rem',
                opacity: isIgniting ? 0.8 : 1
              }}
            >
              <Gift size={22} className={isIgniting ? 'heartbeat-anim' : ''} />
              <span>{isIgniting ? 'Igniting The Surprise... ❤️' : loveData.finalSurprise.buttonText}</span>
              <Sparkles size={18} />
            </button>
          </motion.div>
        ) : (
          /* Grand Revealed Surprise */
          <motion.div
            key="revealed"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            {/* Crown Heart Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              style={{
                width: '70px',
                height: '70px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #f43f5e, #ec4899)',
                border: '2px solid #fff',
                boxShadow: '0 0 35px rgba(244, 63, 94, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                marginBottom: '24px'
              }}
              className="heartbeat-anim"
            >
              <Heart size={34} fill="#fff" />
            </motion.div>

            {/* Giant Birthday Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="font-serif gradient-text-romantic glow-text"
              style={{
                fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
                fontWeight: 900,
                letterSpacing: '-0.02em',
                lineHeight: 1.15,
                marginBottom: '16px'
              }}
            >
              {loveData.finalSurprise.birthdayHeadline}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="font-serif"
              style={{
                fontSize: 'clamp(1.15rem, 2.5vw, 1.5rem)',
                color: '#fbcfe8',
                fontStyle: 'italic',
                marginBottom: '36px'
              }}
            >
              {loveData.finalSurprise.subheading}
            </motion.p>

            {/* Deep Personal Message Box */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.8 }}
              style={{
                background: 'linear-gradient(145deg, rgba(28, 12, 42, 0.8) 0%, rgba(14, 6, 22, 0.92) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(251, 113, 133, 0.35)',
                borderRadius: '24px',
                padding: 'clamp(28px, 5vw, 44px)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(244, 63, 94, 0.2)',
                maxWidth: '680px',
                width: '100%',
                marginBottom: '36px'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', textAlign: 'center' }}>
                {loveData.finalSurprise.deepMessage.map((line, idx) => (
                  <p
                    key={idx}
                    className="font-serif"
                    style={{
                      fontSize: idx === 1 ? '1.35rem' : '1.1rem',
                      color: idx === 1 ? '#ffe4e6' : '#cbd5e1',
                      fontWeight: idx === 1 ? 600 : 400,
                      lineHeight: '1.8'
                    }}
                  >
                    {line}
                  </p>
                ))}
              </div>

              {/* Wishes List */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '12px',
                  marginTop: '28px',
                  paddingTop: '24px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                {loveData.finalSurprise.wishes.map((wish, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(251, 113, 133, 0.2)',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      color: '#fda4af',
                      fontSize: '0.88rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <Sparkles size={14} color="#fde047" />
                    <span>{wish}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Closing Quote: "Forever starts with another tomorrow." */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              style={{ marginBottom: '40px' }}
            >
              <p
                className="font-serif gradient-text-gold"
                style={{
                  fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
                  fontStyle: 'italic',
                  letterSpacing: '1px'
                }}
              >
                "{loveData.finalSurprise.closingQuote}"
              </p>
              <p
                className="font-script"
                style={{
                  fontSize: '2rem',
                  color: '#fb7185',
                  marginTop: '8px'
                }}
              >
                With all my devotion, {loveData.senderName} ❤️
              </p>
            </motion.div>

            {/* Replay Button */}
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
              onClick={onRestart}
              className="btn-secondary"
              style={{
                padding: '0.9rem 2.2rem',
                fontSize: '1rem',
                gap: '8px'
              }}
            >
              <RotateCcw size={16} />
              <span>{loveData.finalSurprise.restartButton}</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
