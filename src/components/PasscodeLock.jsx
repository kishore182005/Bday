import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Heart, Sparkles, Delete, KeyRound } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../context/AudioContext';
import { loveData } from '../data/loveData';

export const PasscodeLock = ({ onUnlock }) => {
  const { playMusic, playPopSound, playChimeSound } = useAudio();
  const [pin, setPin] = useState('');
  const [errorShake, setErrorShake] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const CORRECT_PASSCODE = '1701';

  // Handle digit press
  const handleDigit = (digit) => {
    if (isSuccess || pin.length >= 4) return;
    playPopSound();
    const newPin = pin + digit;
    setPin(newPin);
    setErrorMessage('');

    if (newPin.length === 4) {
      validatePin(newPin);
    }
  };

  // Handle delete
  const handleDelete = () => {
    if (isSuccess || pin.length === 0) return;
    playPopSound();
    setPin(pin.slice(0, -1));
    setErrorMessage('');
  };

  // Validate entered passcode
  const validatePin = (enteredPin) => {
    if (enteredPin === CORRECT_PASSCODE) {
      setIsSuccess(true);
      playChimeSound();
      playMusic();

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#38bdf8', '#ff7597', '#fde047', '#ffffff', '#818cf8']
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#38bdf8', '#818cf8', '#ffffff']
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#ff7597', '#fde047', '#38bdf8']
          });
        }, 300);
      } catch (e) {}

      // Unlock after celebratory animation
      setTimeout(() => {
        onUnlock();
      }, 1600);
    } else {
      setErrorShake(true);
      setErrorMessage("Wrong Passcode, en Bujji! Try again 🥰");
      setTimeout(() => {
        setErrorShake(false);
        setPin('');
      }, 900);
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isSuccess) return;
      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pin, isSuccess]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
      transition={{ duration: 0.8 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: '#020b18',
        backgroundImage: 'radial-gradient(ellipse at 50% 30%, rgba(56, 189, 248, 0.15) 0%, rgba(2, 11, 24, 0.98) 75%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        overflow: 'hidden'
      }}
    >
      {/* Romantic Ambient Sparkles & Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '320px',
          height: '320px',
          background: isSuccess
            ? 'radial-gradient(circle, rgba(56, 189, 248, 0.35) 0%, transparent 70%)'
            : 'radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none'
        }}
      />

      {/* Main Lock Card */}
      <motion.div
        animate={errorShake ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
        transition={{ duration: 0.5 }}
        style={{
          width: '100%',
          maxWidth: '420px',
          background: 'rgba(8, 24, 52, 0.75)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: isSuccess
            ? '2px solid #38bdf8'
            : errorShake
            ? '2px solid #ef4444'
            : '1.5px solid rgba(56, 189, 248, 0.35)',
          borderRadius: '32px',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          boxShadow: isSuccess
            ? '0 20px 60px rgba(56, 189, 248, 0.4), 0 0 40px rgba(56, 189, 248, 0.25)'
            : '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(56, 189, 248, 0.15)',
          position: 'relative'
        }}
      >
        {/* Animated Lock Icon */}
        <motion.div
          animate={isSuccess ? { scale: [1, 1.25, 1], rotate: [0, -10, 10, 0] } : { scale: 1 }}
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: isSuccess
              ? 'linear-gradient(135deg, #38bdf8, #818cf8)'
              : 'rgba(56, 189, 248, 0.12)',
            border: '2px solid rgba(56, 189, 248, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSuccess ? '#ffffff' : '#38bdf8',
            boxShadow: '0 0 25px rgba(56, 189, 248, 0.4)',
            marginBottom: '18px'
          }}
        >
          {isSuccess ? <Unlock size={32} /> : <Lock size={30} />}
        </motion.div>

        {/* Badge */}
        <div className="chapter-badge" style={{ marginBottom: '8px' }}>
          <Sparkles size={14} style={{ color: '#38bdf8' }} />
          <span>Birthday Task For Sharmila</span>
        </div>

        {/* Title */}
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-0.5px',
            margin: '6px 0 4px',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.6)'
          }}
        >
          {isSuccess ? "Welcome, En Chellam! 💖" : "Enter Secret Passcode 🔐"}
        </h2>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '0.88rem',
            color: '#bae6fd',
            marginBottom: '22px',
            lineHeight: 1.5
          }}
        >
          {isSuccess
            ? "Passcode verified! Opening Sharmila's Birthday World ✨"
            : "Enter our 4-digit secret code to unlock your birthday world ❤️"}
        </p>

        {/* PIN Indicators (4 Circles) */}
        <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          {[0, 1, 2, 3].map((index) => {
            const isFilled = pin.length > index;
            return (
              <motion.div
                key={index}
                animate={isFilled ? { scale: [0.8, 1.2, 1] } : { scale: 1 }}
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: isSuccess
                    ? '#38bdf8'
                    : isFilled
                    ? 'linear-gradient(135deg, #38bdf8, #818cf8)'
                    : 'rgba(255, 255, 255, 0.1)',
                  border: isFilled
                    ? '2px solid #bae6fd'
                    : '2px solid rgba(56, 189, 248, 0.3)',
                  boxShadow: isFilled ? '0 0 16px rgba(56, 189, 248, 0.7)' : 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            );
          })}
        </div>

        {/* Error Feedback */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              color: '#f87171',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '16px',
              padding: '6px 12px',
              background: 'rgba(239, 68, 68, 0.12)',
              borderRadius: '10px',
              border: '1px solid rgba(239, 68, 68, 0.3)'
            }}
          >
            {errorMessage}
          </motion.div>
        )}

        {/* Keypad */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '280px',
            marginBottom: '16px'
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              whileHover={{ scale: 1.08, background: 'rgba(56, 189, 248, 0.25)' }}
              whileTap={{ scale: 0.92 }}
              onClick={() => handleDigit(digit)}
              disabled={isSuccess}
              style={{
                height: '56px',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#ffffff',
                fontSize: '1.45rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'border-color 0.2s ease',
                userSelect: 'none'
              }}
            >
              {digit}
            </motion.button>
          ))}

          {/* Zero Button (Extended across 2 columns) */}
          <motion.button
            whileHover={{ scale: 1.04, background: 'rgba(56, 189, 248, 0.25)' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleDigit('0')}
            disabled={isSuccess}
            style={{
              gridColumn: 'span 2',
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#ffffff',
              fontSize: '1.45rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
          >
            0
          </motion.button>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={handleDelete}
            disabled={isSuccess}
            style={{
              height: '56px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(56, 189, 248, 0.25)',
              color: '#bae6fd',
              fontSize: '1rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              userSelect: 'none'
            }}
            title="Backspace"
          >
            <Delete size={20} />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};
