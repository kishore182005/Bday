import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';
import confetti from 'canvas-confetti';

export const Letter = ({ onNext }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { playPopSound, switchTrack } = useAudio();

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      setIsOpen(true);
      playPopSound();
      switchTrack('romantic'); // Switch to romantic acoustic mood

      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.5 },
          colors: ['#ff7597', '#fb7185', '#d8b4fe']
        });
      } catch (e) {}
    }
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
        alignItems: 'center'
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '32px' }}
      >
        <div className="chapter-badge">
          <Mail size={16} style={{ color: '#f472b6' }} />
          <span>A Letter For Sharmila 💌</span>
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
          {isOpen ? `Written From The Bottom of My Heart ❤️` : `Someone left you a letter... 💌`}
        </h2>
      </motion.div>

      {/* 3D Envelope Container */}
      <div style={{ position: 'relative', width: '100%', maxWidth: '680px', perspective: '1200px' }}>
        <AnimatePresence mode="wait">
          {!isOpen ? (
            /* Closed 3D Glowing Envelope */
            <motion.div
              key="closed-envelope"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.5 }}
              onClick={handleOpenEnvelope}
              style={{
                background: 'linear-gradient(145deg, #2b113a 0%, #15061f 100%)',
                border: '2px solid rgba(255, 117, 151, 0.45)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 45px rgba(255, 117, 151, 0.3)',
                borderRadius: '24px',
                padding: '50px 30px',
                textAlign: 'center',
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden'
              }}
              whileHover={{ scale: 1.02 }}
              className="pulse-glow"
            >
              {/* Wax Seal */}
              <div
                style={{
                  width: '76px',
                  height: '76px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                  border: '3px solid #ffe4e6',
                  boxShadow: '0 0 30px rgba(225, 29, 72, 0.7), inset 0 0 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 24px',
                  color: '#fff'
                }}
              >
                <Heart size={36} fill="#fff" />
              </div>

              <h3 className="font-serif" style={{ fontSize: '1.75rem', color: '#fff', marginBottom: '8px' }}>
                {loveData.letter.envelopeTitle}
              </h3>

              <p style={{ color: '#ffb1c3', fontSize: '1.05rem', fontStyle: 'italic', marginBottom: '24px' }}>
                Sealed with all my love • Tap anywhere to break the seal
              </p>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  padding: '8px 22px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.2)'
                }}
              >
                <Sparkles size={16} color="#fde047" />
                <span>Click to Open Sharmila's Letter</span>
              </div>
            </motion.div>
          ) : (
            /* Open Letter with Animated Handwriting */
            <motion.div
              key="opened-letter"
              initial={{ opacity: 0, y: 35, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              style={{
                background: 'linear-gradient(180deg, rgba(32, 14, 48, 0.9) 0%, rgba(18, 7, 28, 0.96) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1.5px solid rgba(255, 117, 151, 0.4)',
                borderRadius: '24px',
                padding: 'clamp(28px, 5vw, 48px)',
                boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(255, 117, 151, 0.25)',
                position: 'relative'
              }}
            >
              {/* Header inside letter */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 117, 151, 0.2)',
                  paddingBottom: '16px',
                  marginBottom: '28px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ffb1c3' }}>
                  <Heart size={16} fill="#ff7597" color="#ff7597" />
                  <span className="font-serif" style={{ fontStyle: 'italic', fontSize: '0.95rem' }}>
                    {loveData.letter.dateStamp}
                  </span>
                </div>
                <span className="cute-sticker">
                  For Sharmila Only 🎀
                </span>
              </div>

              {/* Salutation */}
              <motion.h3
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="font-script"
                style={{ fontSize: '2.4rem', color: '#ff7597', marginBottom: '16px' }}
              >
                {loveData.letter.salutation}
              </motion.h3>

              {/* Letter Paragraphs in Thanglish */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '32px' }}>
                {loveData.letter.paragraphs.map((paragraph, index) => (
                  <motion.p
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                    className="font-serif"
                    style={{
                      fontSize: index === 0 ? '1.25rem' : '1.1rem',
                      lineHeight: '1.85',
                      color: index === 0 ? '#ffe4e6' : '#f1e6f5',
                      fontWeight: index === 0 ? 600 : 400
                    }}
                  >
                    {paragraph}
                  </motion.p>
                ))}
              </div>

              {/* Signoff */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                style={{
                  textAlign: 'right',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginBottom: '32px'
                }}
              >
                <p style={{ color: '#c4b5fd', fontSize: '0.95rem', fontStyle: 'italic' }}>
                  {loveData.letter.signOff}
                </p>
                <p
                  className="font-script"
                  style={{
                    fontSize: '2.4rem',
                    color: '#ff7597',
                    marginTop: '4px'
                  }}
                >
                  {loveData.letter.signature}
                </p>
              </motion.div>

              {/* Continue button */}
              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={onNext}
                  className="btn-cute"
                  style={{ padding: '1rem 2.6rem' }}
                >
                  <span>{loveData.letter.buttonText}</span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
