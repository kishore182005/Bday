import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';

export const OneLastThing = ({ onRestart }) => {
  const { switchTrack, playChimeSound, playPopSound } = useAudio();
  const [lineIndex, setLineIndex] = useState(0);

  const lines = loveData.finalEmotional.lines;

  // Trigger celebration confetti on mount
  useEffect(() => {
    switchTrack('emotional');
    playChimeSound();
    try {
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ff7597', '#fde047', '#c084fc', '#38bdf8', '#fb7185']
      });
    } catch (e) {}
  }, []);

  const handleNextLine = () => {
    playPopSound();
    setLineIndex((prev) => (prev + 1) % lines.length);
  };

  const handlePrevLine = () => {
    playPopSound();
    setLineIndex((prev) => (prev - 1 + lines.length) % lines.length);
  };

  const handleCelebrationClick = () => {
    playChimeSound();
    try {
      confetti({
        particleCount: 120,
        spread: 120,
        origin: { y: 0.5 },
        colors: ['#ff7597', '#fde047', '#f43f5e', '#38bdf8']
      });
    } catch (e) {}
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '860px',
        margin: '0 auto',
        padding: '110px 20px 90px',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }}
    >
      {/* Crown Heart Badge (with ample top clearance) */}
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        onClick={handleCelebrationClick}
        style={{
          width: '76px',
          height: '76px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff7597, #e11d48)',
          border: '3px solid #fff',
          boxShadow: '0 0 35px rgba(255, 117, 151, 0.75)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          marginBottom: '16px',
          cursor: 'pointer'
        }}
        className="heartbeat-anim"
        title="Tap for celebration confetti!"
      >
        <Heart size={38} fill="#fff" />
      </motion.div>

      {/* Chapter Tag */}
      <div className="chapter-badge">
        <Sparkles size={16} style={{ color: '#f472b6' }} />
        <span>Forever & Always ❤️</span>
      </div>

      {/* Grand Birthday Headline - Modern, Soft, Beautiful Outfit Font */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          fontSize: 'clamp(2.4rem, 5.5vw, 4.4rem)',
          fontWeight: 800,
          color: '#ffffff',
          letterSpacing: '-0.015em',
          lineHeight: 1.2,
          marginBottom: '18px',
          textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)'
        }}
      >
        {loveData.finalEmotional.headline}
      </motion.h1>

      {/* Infinity Relationship Tag */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          padding: '8px 24px',
          borderRadius: '9999px',
          background: 'rgba(255, 117, 151, 0.18)',
          border: '1.5px solid rgba(255, 177, 195, 0.5)',
          color: '#fde047',
          fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
          fontWeight: 800,
          letterSpacing: '1.5px',
          marginBottom: '32px',
          boxShadow: '0 0 25px rgba(255, 117, 151, 0.35)'
        }}
      >
        <Sparkles size={16} color="#fde047" />
        <span>{loveData.finalEmotional.relationshipInfinity}</span>
        <Sparkles size={16} color="#fde047" />
      </motion.div>

      {/* Interactive Heartfelt Quotes Carousel */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{
          width: '100%',
          maxWidth: '680px',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 117, 151, 0.3)',
          borderRadius: '20px',
          padding: '20px 24px',
          marginBottom: '32px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
            💌 A Little Whisper for Sharmila ({lineIndex + 1}/{lines.length})
          </span>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={handlePrevLine}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleNextLine}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.p
            key={lineIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="font-serif"
            style={{
              fontSize: 'clamp(1.15rem, 3vw, 1.45rem)',
              color: '#fbcfe8',
              lineHeight: 1.5,
              minHeight: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '8px 0 0'
            }}
          >
            "{lines[lineIndex]}"
          </motion.p>
        </AnimatePresence>
      </motion.div>

      {/* Closing Poetic Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{
          background: 'linear-gradient(145deg, rgba(38, 14, 58, 0.85) 0%, rgba(18, 6, 28, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255, 117, 151, 0.4)',
          borderRadius: '24px',
          padding: 'clamp(28px, 5vw, 44px)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85), 0 0 40px rgba(255, 117, 151, 0.25)',
          maxWidth: '680px',
          width: '100%',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'center' }}>
          {loveData.finalEmotional.closingThoughts.map((thought, idx) => (
            <p
              key={idx}
              className="font-serif"
              style={{
                fontSize: idx === 1 ? '1.35rem' : '1.15rem',
                color: idx === 1 ? '#fde047' : '#f1e6f5',
                fontWeight: idx === 1 ? 700 : 400,
                lineHeight: '1.7'
              }}
            >
              "{thought}"
            </p>
          ))}
        </div>

        <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p
            className="font-script"
            style={{
              fontSize: '2.5rem',
              color: '#ff7597'
            }}
          >
            Yours forever and always, {loveData.senderName} ❤️
          </p>
        </div>
      </motion.div>

      {/* Replay / Scroll To Top Button */}
      <motion.button
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        onClick={onRestart}
        className="btn-cute pulse-glow"
        style={{
          padding: '1rem 2.8rem',
          fontSize: '1.05rem',
          gap: '10px'
        }}
      >
        <RotateCcw size={18} />
        <span>Scroll Back To Top 🌸</span>
      </motion.button>
    </div>
  );
};
