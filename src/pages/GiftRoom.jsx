import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gift, Heart, Sparkles, X, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';

export const GiftRoom = ({ onNext }) => {
  const { playPopSound, playChimeSound } = useAudio();
  const [openedGifts, setOpenedGifts] = useState(new Set());
  const [activeModalGift, setActiveModalGift] = useState(null);
  const [isWigglingRealSurprise, setIsWigglingRealSurprise] = useState(false);
  const [realSurpriseStep, setRealSurpriseStep] = useState(0); // 0: unclicked, 1: not yet, 2: okay okay revealed

  const handleGiftClick = (gift) => {
    playPopSound();

    if (gift.isRealSurprise) {
      if (realSurpriseStep === 0) {
        setRealSurpriseStep(1);
        setIsWigglingRealSurprise(true);
        setTimeout(() => {
          setIsWigglingRealSurprise(false);
          setRealSurpriseStep(2);
          setOpenedGifts((prev) => new Set([...prev, gift.id]));
          setActiveModalGift(gift);
          playChimeSound();
          try {
            confetti({
              particleCount: 100,
              spread: 100,
              colors: ['#ff7597', '#fde047', '#d8b4fe']
            });
          } catch (e) {}
        }, 2000);
        return;
      }
    }

    setOpenedGifts((prev) => new Set([...prev, gift.id]));
    setActiveModalGift(gift);
    playChimeSound();
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '1050px',
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
        style={{ marginBottom: '40px' }}
      >
        <div className="chapter-badge">
          <Gift size={16} style={{ color: '#f472b6' }} />
          <span>Sharmila's Gift Room 🎁</span>
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
          {loveData.giftRoom.title}
        </h2>
        <p style={{ color: '#f1e6f5', fontSize: '1.05rem', maxWidth: '600px', margin: '12px auto 0' }}>
          {loveData.giftRoom.subtitle}
        </p>
      </motion.div>

      {/* 4 Interactive Gift Boxes Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '28px',
          width: '100%',
          maxWidth: '920px',
          marginBottom: '48px'
        }}
      >
        {loveData.giftRoom.gifts.map((gift, index) => {
          const isOpened = openedGifts.has(gift.id);
          const isReal = gift.isRealSurprise;

          return (
            <motion.div
              key={gift.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ scale: 1.05, y: -6 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleGiftClick(gift)}
              className={isWigglingRealSurprise && isReal ? 'gift-wiggling' : ''}
              style={{
                background: isOpened
                  ? 'linear-gradient(145deg, rgba(45, 18, 65, 0.85) 0%, rgba(22, 8, 35, 0.95) 100%)'
                  : 'linear-gradient(145deg, rgba(30, 12, 45, 0.7) 0%, rgba(16, 6, 26, 0.85) 100%)',
                backdropFilter: 'blur(16px)',
                border: isOpened ? `2px solid ${gift.color}` : '1.5px solid rgba(255, 117, 151, 0.35)',
                borderRadius: '24px',
                padding: '36px 20px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                cursor: 'pointer',
                boxShadow: isOpened
                  ? `0 15px 40px rgba(0, 0, 0, 0.7), 0 0 30px ${gift.color}44`
                  : '0 10px 30px rgba(0,0,0,0.5)',
                position: 'relative'
              }}
            >
              {/* Ribbon Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px'
                }}
              >
                <span className="cute-sticker">
                  {isOpened ? 'Opened ✨' : 'Tap to open 🎀'}
                </span>
              </div>

              {/* Gift 3D Box Icon */}
              <motion.div
                animate={!isOpened ? { y: [0, -8, 0] } : {}}
                transition={{ repeat: Infinity, duration: 3 + index * 0.5, ease: 'easeInOut' }}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '20px',
                  background: `linear-gradient(135deg, ${gift.color}33 0%, rgba(255, 255, 255, 0.1) 100%)`,
                  border: `2px solid ${gift.color}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '18px',
                  boxShadow: `0 0 25px ${gift.color}55`,
                  color: gift.color
                }}
              >
                <span style={{ fontSize: '42px' }}>🎁</span>
              </motion.div>

              <h3 className="font-serif" style={{ fontSize: '1.25rem', color: '#fff', marginBottom: '8px' }}>
                {gift.title}
              </h3>

              {/* Status Message for Real Surprise */}
              {isReal && isWigglingRealSurprise && (
                <div style={{ color: '#fde047', fontWeight: 800, fontSize: '0.9rem', marginTop: '6px' }}>
                  {gift.firstClick}
                </div>
              )}

              {isReal && realSurpriseStep === 2 && (
                <div style={{ color: '#ff7597', fontWeight: 800, fontSize: '0.9rem', marginTop: '6px' }}>
                  {gift.secondClick}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Continue Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{ padding: '1.1rem 2.8rem' }}
        >
          <span>Blow Out Sharmila's Birthday Cake 🎂</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Gift Modal Popup */}
      <AnimatePresence>
        {activeModalGift && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 70,
              background: 'rgba(6, 2, 12, 0.9)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setActiveModalGift(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'linear-gradient(135deg, #280e3c 0%, #120520 100%)',
                border: `2px solid ${activeModalGift.color}`,
                boxShadow: `0 25px 70px rgba(0, 0, 0, 0.9), 0 0 45px ${activeModalGift.color}55`,
                borderRadius: '24px',
                padding: '36px 30px',
                maxWidth: '540px',
                width: '100%',
                textAlign: 'center',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setActiveModalGift(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>

              <span style={{ fontSize: '48px', display: 'block', marginBottom: '14px' }}>
                🎉
              </span>

              <h4 className="font-serif gradient-text-cute" style={{ fontSize: '1.8rem', marginBottom: '12px' }}>
                {activeModalGift.revealedTitle || activeModalGift.title}
              </h4>

              <p
                className="font-script"
                style={{
                  color: '#ffe4e6',
                  fontSize: '1.65rem',
                  lineHeight: '1.5',
                  marginBottom: '20px'
                }}
              >
                "{activeModalGift.content}"
              </p>

              <div style={{ color: '#ffb1c3', fontSize: '0.88rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <Heart size={14} fill="#f43f5e" color="#f43f5e" />
                <span>Wrapped especially for Sharmila • 13.10.2026</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
