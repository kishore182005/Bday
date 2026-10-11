import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';

export const BirthdayCake = ({ onNext }) => {
  const { playBlowCandleSound, switchTrack } = useAudio();
  const [candles, setCandles] = useState([true, true, true]); // 3 candles with flame state
  const [isWished, setIsWished] = useState(false);

  const handleCandleClick = (index) => {
    if (!candles[index]) return; // already blown

    playBlowCandleSound();
    const updated = [...candles];
    updated[index] = false;
    setCandles(updated);

    // If all candles are extinguished!
    if (updated.every((c) => !c)) {
      setTimeout(() => {
        setIsWished(true);
        switchTrack('celebration'); // switch to festive celebration music!

        // Giant fireworks & confetti
        try {
          const duration = 4000;
          const end = Date.now() + duration;
          const interval = setInterval(() => {
            if (Date.now() > end) return clearInterval(interval);
            confetti({
              particleCount: 50,
              origin: { x: Math.random() * 0.6 + 0.2, y: Math.random() * 0.4 + 0.1 },
              colors: ['#ff7597', '#fde047', '#38bdf8', '#c084fc', '#f43f5e']
            });
          }, 300);
        } catch (e) {}
      }, 600);
    }
  };

  const handleRelight = () => {
    setCandles([true, true, true]);
    setIsWished(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '850px',
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
        style={{ marginBottom: '32px' }}
      >
        <div className="chapter-badge">
          <Sparkles size={16} style={{ color: '#f472b6' }} />
          <span>Make A Wish 🎂</span>
        </div>
        <h2
          style={{
            fontSize: 'clamp(2.1rem, 4.8vw, 3.4rem)',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            margin: '8px 0 6px',
            textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)'
          }}
        >
          {isWished ? loveData.cakePage.celebrationHeadline : loveData.cakePage.title}
        </h2>
        <p style={{ color: '#f1e6f5', fontSize: '1.05rem', maxWidth: '580px', margin: '12px auto 0' }}>
          {isWished ? loveData.cakePage.celebrationSubtext : loveData.cakePage.subtitle}
        </p>
      </motion.div>

      {/* Large Interactive Birthday Cake */}
      <div
        style={{
          position: 'relative',
          width: '320px',
          height: '280px',
          margin: '30px auto 40px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-end'
        }}
      >
        {/* 3 Candles positioned over top layer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            position: 'absolute',
            top: '25px',
            zIndex: 10
          }}
        >
          {candles.map((isLit, idx) => (
            <div
              key={idx}
              onClick={() => handleCandleClick(idx)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: isLit ? 'pointer' : 'default',
                userSelect: 'none'
              }}
              title={isLit ? 'Click to blow out candle!' : 'Blown out!'}
            >
              {/* Flame */}
              {isLit ? (
                <div
                  className="flame-active"
                  style={{
                    width: '16px',
                    height: '24px',
                    background: 'radial-gradient(ellipse at bottom, #fff 0%, #fde047 35%, #f97316 75%, #ef4444 100%)',
                    borderRadius: '50% 50% 35% 35%',
                    boxShadow: '0 0 20px #fde047, 0 0 35px #f43f5e',
                    marginBottom: '2px'
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '6px',
                    height: '14px',
                    background: '#94a3b8',
                    marginBottom: '4px',
                    opacity: 0.6,
                    borderRadius: '2px'
                  }}
                />
              )}

              {/* Candle Body */}
              <div
                style={{
                  width: '12px',
                  height: '36px',
                  background: idx === 1 ? 'linear-gradient(180deg, #ff7597, #f43f5e)' : 'linear-gradient(180deg, #fde047, #f59e0b)',
                  borderRadius: '3px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.4)'
                }}
              />
            </div>
          ))}
        </div>

        {/* Top Cake Tier */}
        <div
          style={{
            width: '180px',
            height: '70px',
            background: 'linear-gradient(180deg, #ffe4e6 0%, #fbcfe8 100%)',
            borderRadius: '20px 20px 8px 8px',
            boxShadow: 'inset 0 -8px 0 rgba(255, 117, 151, 0.4), 0 8px 20px rgba(0,0,0,0.3)',
            border: '3px solid #ff7597',
            position: 'relative',
            zIndex: 3
          }}
        >
          {/* Strawberry Cherries on Top */}
          <div style={{ display: 'flex', justifyContent: 'space-around', padding: '6px 12px' }}>
            <span>🍓</span>
            <span>🌸</span>
            <span>🍓</span>
          </div>
        </div>

        {/* Bottom Cake Tier */}
        <div
          style={{
            width: '260px',
            height: '90px',
            background: 'linear-gradient(180deg, #fce7f3 0%, #f472b6 100%)',
            borderRadius: '20px 20px 12px 12px',
            boxShadow: 'inset 0 -10px 0 rgba(225, 29, 72, 0.3), 0 12px 30px rgba(0,0,0,0.5)',
            border: '3px solid #ff7597',
            position: 'relative',
            zIndex: 2,
            marginTop: '-6px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-around', paddingTop: '16px' }}>
            <span>💖</span>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#831843', letterSpacing: '1px' }}>SHARMILA</span>
            <span>💖</span>
          </div>
        </div>

        {/* Cake Stand Plate */}
        <div
          style={{
            width: '320px',
            height: '16px',
            background: 'linear-gradient(180deg, #f1f5f9 0%, #cbd5e1 100%)',
            borderRadius: '9999px',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            marginTop: '-4px',
            zIndex: 1
          }}
        />
      </div>

      {/* Post-Wish Celebration Reveal */}
      <AnimatePresence>
        {isWished && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            style={{
              background: 'linear-gradient(135deg, rgba(38, 14, 58, 0.85) 0%, rgba(18, 6, 28, 0.95) 100%)',
              backdropFilter: 'blur(16px)',
              border: '2px solid rgba(255, 117, 151, 0.5)',
              borderRadius: '24px',
              padding: '28px',
              maxWidth: '640px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(255, 117, 151, 0.3)',
              marginBottom: '32px'
            }}
          >
            <h3 className="font-serif gradient-text-cute" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
              Your Wish Has Been Sent to the Stars ✨
            </h3>

            <p className="font-script" style={{ fontSize: '1.6rem', color: '#ffb1c3', lineHeight: '1.4', marginBottom: '16px' }}>
              "Nee happy-ah irundha podhum, enakku adhuvum oru periya world happiness. Happy Birthday en Thangom! ❤️"
            </p>

            <button
              onClick={handleRelight}
              className="btn-soft"
              style={{ fontSize: '0.85rem', padding: '6px 16px' }}
            >
              <RotateCcw size={14} /> Relight Candles
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action to Page 9 */}
      <div style={{ textAlign: 'center', marginTop: '16px' }}>
        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{ padding: '1.1rem 2.8rem' }}
        >
          <span>Reveal Sharmila's Special Date 🌸</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
