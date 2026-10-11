import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Calendar, Heart, ArrowRight } from 'lucide-react';
import { loveData } from '../data/loveData';

export const DateReveal = ({ onNext }) => {
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
          <Calendar size={16} style={{ color: '#f472b6' }} />
          <span>The Birthday Date 🎂</span>
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
          {loveData.dateReveal.tagline}
        </h2>
      </motion.div>

      {/* Luxury Clock / Calendar Beveled Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, rotateX: 20 }}
        whileInView={{ opacity: 1, scale: 1, rotateX: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, type: 'spring' }}
        style={{
          background: 'linear-gradient(145deg, rgba(45, 18, 65, 0.9) 0%, rgba(20, 8, 30, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '2px solid rgba(253, 224, 71, 0.5)',
          borderRadius: '32px',
          padding: '48px 36px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.9), 0 0 50px rgba(253, 224, 71, 0.25), inset 0 0 30px rgba(255, 117, 151, 0.15)',
          maxWidth: '520px',
          width: '100%',
          position: 'relative',
          marginBottom: '36px'
        }}
      >
        {/* Floating butterfly corner badges */}
        <span style={{ position: 'absolute', top: '-18px', left: '-10px', fontSize: '32px' }} className="cute-float">
          🦋
        </span>
        <span style={{ position: 'absolute', bottom: '-18px', right: '-10px', fontSize: '32px' }} className="cute-float">
          🌸
        </span>

        {/* Day Number: 13 */}
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          className="font-serif gradient-text-gold"
          style={{
            fontSize: 'clamp(5rem, 14vw, 8rem)',
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-2px',
            textShadow: '0 0 40px rgba(253, 224, 71, 0.7)'
          }}
        >
          {loveData.dateReveal.day}
        </motion.div>

        {/* Month: OCTOBER */}
        <div
          style={{
            fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
            fontWeight: 800,
            color: '#ffe4e6',
            letterSpacing: '8px',
            textTransform: 'uppercase',
            margin: '12px 0 6px'
          }}
        >
          {loveData.dateReveal.month}
        </div>

        {/* Year: 2026 */}
        <div
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: '#ff7597',
            letterSpacing: '4px'
          }}
        >
          {loveData.dateReveal.year}
        </div>

        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <p className="font-serif" style={{ color: '#f1e6f5', fontSize: '1.1rem', fontStyle: 'italic' }}>
            "{loveData.dateReveal.quote}"
          </p>
        </div>
      </motion.div>

      {/* Romantic Thanglish quote */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="font-script"
        style={{ fontSize: '1.75rem', color: '#ffb1c3', maxWidth: '580px', marginBottom: '32px' }}
      >
        "Nee en life-la vandhadhukku oru reason irukkum... but nee irukradhe enakku reason-a pochu. ❤️"
      </motion.p>

      {/* Action to Final Page */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{ padding: '1.1rem 2.8rem' }}
        >
          <Heart size={18} fill="#fff" />
          <span>One Last Thing For You, Sharmila 💖</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
