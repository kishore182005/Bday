import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Gift, Mail } from 'lucide-react';
import { loveData } from '../data/loveData';
import { RelationshipCounter } from '../components/RelationshipCounter';
import { useAudio } from '../context/AudioContext';

export const Welcome = ({ onNext }) => {
  const { playPopSound, playHeartCollectSound } = useAudio();
  const [selectedNickname, setSelectedNickname] = useState(loveData.birthdayWorld.cutieNicknames[0]);

  const handleNicknameClick = (item, idx) => {
    playHeartCollectSound(idx);
    setSelectedNickname(item);
  };
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '100px 20px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {/* Floating Crown & Birthday Ribbon Tag */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 20px',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.3) 0%, rgba(168, 85, 247, 0.3) 100%)',
          border: '1.5px solid rgba(255, 177, 195, 0.5)',
          boxShadow: '0 0 25px rgba(255, 117, 151, 0.4)',
          marginBottom: '20px'
        }}
      >
        <span style={{ fontSize: '20px' }}>👑</span>
        <span style={{ color: '#ffe4e6', fontWeight: 800, fontSize: '0.9rem', letterSpacing: '1px' }}>
          TODAY IS SHARMILA'S BIRTHDAY • 13 OCT 2026 🎂
        </span>
        <Sparkles size={16} color="#fde047" />
      </motion.div>

      {/* Main Headline: "HAPPY BIRTHDAY SHARMILA ❤️" */}
      <motion.h1
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2 }}
        style={{
          fontSize: 'clamp(2.8rem, 7vw, 5.2rem)',
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: '16px',
          letterSpacing: '-0.02em',
          color: '#ffffff',
          textShadow: '0 2px 14px rgba(0, 0, 0, 0.6)'
        }}
      >
        {loveData.birthdayWorld.title}
        <br />
        <span style={{ color: '#ff8da1' }}>{loveData.birthdayWorld.name}</span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="font-serif"
        style={{
          fontSize: 'clamp(1.15rem, 2.5vw, 1.6rem)',
          color: '#f1e6f5',
          fontStyle: 'italic',
          maxWidth: '680px',
          lineHeight: 1.6,
          marginBottom: '28px'
        }}
      >
        "{loveData.birthdayWorld.subtitle}"
      </motion.p>

      {/* 💙 Sharmila's Personal Favorites Badges */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '10px',
          margin: '-10px 0 28px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: 'rgba(56, 189, 248, 0.15)',
            border: '1.5px solid rgba(56, 189, 248, 0.5)',
            borderRadius: '9999px',
            color: '#bae6fd',
            fontSize: '0.84rem',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(56, 189, 248, 0.2)'
          }}
        >
          <span>💙</span>
          <span>Fav Colour: Royal Blue</span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: 'rgba(251, 146, 60, 0.15)',
            border: '1.5px solid rgba(251, 146, 60, 0.5)',
            borderRadius: '9999px',
            color: '#fed7aa',
            fontSize: '0.84rem',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(251, 146, 60, 0.2)'
          }}
        >
          <span>🍗</span>
          <span>Fav Food: Aromatic Hot Biriyani</span>
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            background: 'rgba(244, 114, 182, 0.15)',
            border: '1.5px solid rgba(244, 114, 182, 0.5)',
            borderRadius: '9999px',
            color: '#fbcfe8',
            fontSize: '0.84rem',
            fontWeight: 700,
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 15px rgba(244, 114, 182, 0.2)'
          }}
        >
          <span>😋</span>
          <span>Certified #1 Foodie Queen</span>
        </div>
      </motion.div>

      {/* Live Relationship Counter: Together since 17 Jan 2024 */}
      <RelationshipCounter />

      {/* 💖 Interactive Cutie Nicknames for Sharmila */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        style={{
          margin: '28px 0 20px',
          width: '100%',
          maxWidth: '680px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <span
          style={{
            fontSize: '0.82rem',
            color: '#ffb1c3',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span>🎀</span> Tap En Chellam's Nicknames: <span>✨</span>
        </span>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {loveData.birthdayWorld.cutieNicknames.map((item, idx) => {
            const isSelected = selectedNickname?.id === item.id;
            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleNicknameClick(item, idx)}
                style={{
                  background: isSelected
                    ? 'linear-gradient(135deg, #ff7597, #c084fc)'
                    : 'rgba(255, 255, 255, 0.06)',
                  border: `1.5px solid ${isSelected ? '#ffe4e6' : 'rgba(255, 117, 151, 0.4)'}`,
                  color: isSelected ? '#fff' : '#ffe4e6',
                  padding: '8px 16px',
                  borderRadius: '9999px',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: isSelected
                    ? '0 0 20px rgba(255, 117, 151, 0.6)'
                    : '0 4px 12px rgba(0,0,0,0.3)',
                  transition: 'all 0.2s ease',
                  userSelect: 'none'
                }}
              >
                {item.name}
              </motion.button>
            );
          })}
        </div>

        {/* Selected Nickname Note Balloon */}
        <AnimatePresence>
          {selectedNickname && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: -10 }}
              transition={{ type: 'spring', damping: 20, stiffness: 350 }}
              style={{
                marginTop: '16px',
                background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
                border: '1.5px solid rgba(255, 182, 193, 0.6)',
                borderRadius: '18px',
                padding: '12px 22px',
                maxWidth: '480px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4), 0 0 20px rgba(255, 117, 151, 0.3)'
              }}
            >
              <p
                className="font-script"
                style={{
                  fontSize: '1.45rem',
                  color: '#fff',
                  lineHeight: '1.4',
                  margin: 0
                }}
              >
                "{selectedNickname.note}"
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Thanglish Floating Romantic Quote Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 117, 151, 0.3)',
          borderRadius: '20px',
          padding: '16px 28px',
          maxWidth: '540px',
          marginBottom: '36px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.4)'
        }}
      >
        <p
          className="font-script"
          style={{
            fontSize: '1.65rem',
            color: '#fbcfe8',
            lineHeight: 1.4
          }}
        >
          "Un smile-ku naan romba weak. En Thangoo, Chellam, Bujji... En world-la favourite person? Obviously SHARMILA. ❤️"
        </p>
      </motion.div>

      {/* Action CTA: Read Letter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 1 }}
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}
      >
        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{
            fontSize: '1.15rem',
            padding: '1.15rem 3rem'
          }}
        >
          <Mail size={20} />
          <span>Open My Letter To Sharmila 💌</span>
          <ArrowRight size={18} />
        </button>

        <span style={{ color: '#c4b5fd', fontSize: '0.88rem' }}>
          Crafted with endless love for en Chellam! ✨
        </span>
      </motion.div>
    </div>
  );
};
