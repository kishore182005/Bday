import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, KeyRound, X, Heart, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';

export const SecretVaultModal = ({ isOpen, onClose }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(null);
  const [shake, setShake] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const entered = passwordInput.trim().toLowerCase();
    const secret = (loveData?.secret?.password || 'sharmila').trim().toLowerCase();

    if (entered === secret || entered === 'sharmila' || entered === 'forever') {
      setIsUnlocked(true);
      setFeedbackMessage(null);
      // Grand secret confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#ec4899', '#fde047', '#a855f7']
        });
      } catch (err) {}
    } else {
      // Pick random cute feedback response
      const wrongList = loveData?.secret?.wrongReplies || [
        "Nice try en Chellam 😌 That's not our secret.",
        "Hint: Try typing 'sharmila' or 'forever' 💕"
      ];
      const randomCute = wrongList[Math.floor(Math.random() * wrongList.length)];
      setFeedbackMessage(randomCute);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  const handleReset = () => {
    setIsUnlocked(false);
    setPasswordInput('');
    setFeedbackMessage(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 60,
          background: 'rgba(5, 5, 9, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}
        onClick={onClose}
      >
        <motion.div
          animate={shake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(135deg, rgba(25, 12, 38, 0.95) 0%, rgba(12, 5, 20, 0.98) 100%)',
            border: isUnlocked ? '1px solid rgba(253, 224, 71, 0.5)' : '1px solid rgba(244, 63, 94, 0.3)',
            boxShadow: isUnlocked
              ? '0 20px 60px rgba(0, 0, 0, 0.9), 0 0 50px rgba(253, 224, 71, 0.25)'
              : '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 35px rgba(244, 63, 94, 0.2)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '560px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px',
            position: 'relative'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              color: '#cbd5e1',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <X size={18} />
          </button>

          {!isUnlocked ? (
            /* Locked State */
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'rgba(244, 63, 94, 0.15)',
                  border: '1px solid rgba(244, 63, 94, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  color: '#fb7185',
                  boxShadow: '0 0 25px rgba(244, 63, 94, 0.3)'
                }}
              >
                <Lock size={28} />
              </div>

              <h3 className="font-serif gradient-text-romantic" style={{ fontSize: '1.75rem', marginBottom: '8px' }}>
                Some memories are meant to be unlocked...
              </h3>

              <p style={{ color: '#cbd5e1', fontSize: '0.92rem', marginBottom: '20px', lineHeight: 1.6 }}>
                A private vault created for {loveData.girlfriendName}. Enter our secret word or anniversary code to unlock this hidden chapter.
              </p>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      if (feedbackMessage) setFeedbackMessage(null);
                    }}
                    placeholder="Enter secret word..."
                    autoFocus
                    style={{
                      width: '100%',
                      padding: '14px 44px 14px 18px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: feedbackMessage ? '1px solid #f43f5e' : '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                  <KeyRound
                    size={18}
                    style={{
                      position: 'absolute',
                      right: '16px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: '#fb7185',
                      opacity: 0.7
                    }}
                  />
                </div>

                {/* Cute feedback message on wrong attempt */}
                <AnimatePresence>
                  {feedbackMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      style={{
                        color: '#fda4af',
                        fontSize: '0.88rem',
                        background: 'rgba(244, 63, 94, 0.12)',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid rgba(244, 63, 94, 0.3)'
                      }}
                    >
                      {feedbackMessage}
                    </motion.div>
                  )}
                </AnimatePresence>

                <p style={{ fontSize: '0.82rem', color: '#94a3b8', fontStyle: 'italic' }}>
                  Hint: {loveData.secret.hint}
                </p>

                <button
                  type="submit"
                  className="btn-romantic"
                  style={{ width: '100%', padding: '14px 0', marginTop: '6px' }}
                >
                  <Unlock size={18} />
                  <span>Unlock Memory Vault</span>
                </button>
              </form>
            </div>
          ) : (
            /* Unlocked State */
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'rgba(253, 224, 71, 0.15)',
                    border: '1px solid rgba(253, 224, 71, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px',
                    color: '#fde047',
                    boxShadow: '0 0 25px rgba(253, 224, 71, 0.3)'
                  }}
                >
                  <Sparkles size={28} />
                </div>

                <h3 className="font-serif gradient-text-gold" style={{ fontSize: '1.85rem', marginBottom: '8px' }}>
                  {loveData.secret.unlockedTitle}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.95rem' }}>
                  Only you have the key to this space.
                </p>
              </div>

              {/* Private note */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(253, 224, 71, 0.3)',
                  borderRadius: '16px',
                  padding: '20px',
                  marginBottom: '24px'
                }}
              >
                <p
                  className="font-serif"
                  style={{
                    color: '#fef08a',
                    fontSize: '1.05rem',
                    lineHeight: '1.8',
                    fontStyle: 'italic'
                  }}
                >
                  "{loveData.secret.unlockedNote}"
                </p>
                <div style={{ textAlign: 'right', marginTop: '12px', color: '#fda4af', fontSize: '0.88rem' }}>
                  — Always & Forever, {loveData.senderName} ❤️
                </div>
              </div>

              {/* Secret polaroids */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                {loveData.secret.secretPolaroids.map((item, idx) => (
                  <div
                    key={idx}
                    className="polaroid-card"
                    style={{
                      transform: idx % 2 === 0 ? 'rotate(-2deg)' : 'rotate(2deg)'
                    }}
                  >
                    <div style={{ width: '100%', height: '160px', overflow: 'hidden', borderRadius: '2px', background: '#1e112a' }}>
                      <img
                        src={item.image}
                        alt="Secret Polaroid"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <p
                      className="font-script"
                      style={{
                        marginTop: '10px',
                        fontSize: '1rem',
                        color: '#1e1b4b',
                        textAlign: 'center',
                        fontWeight: 600
                      }}
                    >
                      {item.caption}
                    </p>
                  </div>
                ))}
              </div>

              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <button onClick={handleReset} className="btn-secondary" style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                  Lock Vault Again
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
