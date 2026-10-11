import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { loveData } from '../data/loveData';

export const CuteFloaters = () => {
  const { playPopSound, playChimeSound } = useAudio();
  const [activeSpeech, setActiveSpeech] = useState(null); // { id, text, x, y }

  const teddyQuotes = [
    "Hi Thangoo! 👋 En Bujji kutty Sharmila, I was waiting for you! 🥰",
    "Chellam, you are the cutest girl in the universe! 🧸💖",
    "Pattu ma, un smile paathaale happy aayidum! ✨",
    "Bujji kutty spotted! Sending 1000 cuddles! 🤗❤️"
  ];

  const balloonQuotes = [
    "Pop! 💥 Flying kiss for en Chellam! 🎈💋",
    "Pop! 💥 Thangoo-ku sweet birthday love! ✨",
    "Pop! 💥 Love you to infinity, en Pattu! 💖"
  ];

  const giftQuotes = [
    "Not yet, en Pattu 😌 Lots of surprises waiting for you...",
    "Only for en Bujji ma! 🎁✨",
    "A special treasure for my Thangoo! 💎"
  ];

  const butterflyQuotes = [
    "Azhagiye Sharmila! Fluttering around en Chellam! 🦋✨",
    "Royal Blue is en Chellam Sharmila's favourite colour! 💙✨",
    "Pattu ma, you are prettier than all the flowers! 🌸💖",
    "En Thangoo smile paathu mayangitten! ✨"
  ];

  const biriyaniQuotes = [
    "Hot Biriyani alert! 🍗🤤 Specially made with extra love for en Foodie Bujji Sharmila!",
    "Kishore: 'Thangoo, Biriyani sapdalama?' Sharmila: 'Yessssss!' 🥘😋",
    "Extra leg piece & raitha reserved only for en Chellam! 🍗❤️",
    "Aromatic Biriyani for my favourite foodie in the whole world! ✨"
  ];

  const cupcakeQuotes = [
    "Sweetest treat for en Bujji kutty! 🧁❤️",
    "Sweet like en Thangoo's smile! 😋💖",
    "Extra sprinkles for en Chellam! 🎂✨"
  ];

  const triggerBubble = (id, text, x, y, sound = 'chime') => {
    if (sound === 'pop') playPopSound();
    else playChimeSound();

    setActiveSpeech({ id, text, x, y });
    setTimeout(() => {
      setActiveSpeech((curr) => (curr && curr.id === id ? null : curr));
    }, 3200);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 20,
        overflow: 'hidden'
      }}
    >
      {/* 🧸 Interactive Teddy Bear (Bottom-Left) */}
      <motion.div
        drag
        dragConstraints={{ left: 10, right: 300, top: 100, bottom: 600 }}
        style={{
          position: 'absolute',
          bottom: '80px',
          left: '28px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        whileHover={{ scale: 1.15, rotate: 6 }}
        whileTap={{ scale: 0.9, rotate: -6 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = teddyQuotes[Math.floor(Math.random() * teddyQuotes.length)];
          triggerBubble('teddy', quote, rect.left + 20, rect.top - 60);
        }}
        title="Click the teddy bear!"
      >
        <span style={{ fontSize: '42px', filter: 'drop-shadow(0 6px 14px rgba(255,117,151,0.5))' }}>
          🧸
        </span>
      </motion.div>

      {/* 🎈 Interactive Balloon (Top-Right) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '90px',
          right: '32px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        whileHover={{ scale: 1.2, rotate: -8 }}
        whileTap={{ scale: 0.85 }}
        animate={{ y: [0, -18, 0], x: [0, 6, 0] }}
        transition={{ repeat: Infinity, duration: 5.5, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = balloonQuotes[Math.floor(Math.random() * balloonQuotes.length)];
          triggerBubble('balloon', quote, rect.left - 120, rect.top + 10, 'pop');
        }}
        title="Tap to pop balloon!"
      >
        <span style={{ fontSize: '40px', filter: 'drop-shadow(0 6px 14px rgba(244,63,94,0.4))' }}>
          🎈
        </span>
      </motion.div>

      {/* 🎁 Floating Gift Box (Middle-Left) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '40%',
          left: '20px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        whileHover={{ scale: 1.2, rotate: 12 }}
        whileTap={{ scale: 0.9 }}
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = giftQuotes[Math.floor(Math.random() * giftQuotes.length)];
          triggerBubble('gift', quote, rect.left + 30, rect.top - 50);
        }}
        title="Click the gift!"
      >
        <span style={{ fontSize: '36px', filter: 'drop-shadow(0 6px 14px rgba(168,85,247,0.4))' }}>
          🎁
        </span>
      </motion.div>

      {/* 🦋 Fluttering Butterfly (Top-Left) */}
      <motion.div
        style={{
          position: 'absolute',
          top: '120px',
          left: '12%',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        animate={{
          x: [0, 25, -15, 0],
          y: [0, -20, 10, 0],
          rotate: [0, 15, -10, 0]
        }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = butterflyQuotes[Math.floor(Math.random() * butterflyQuotes.length)];
          triggerBubble('butterfly', quote, rect.left, rect.top - 50);
        }}
      >
        <span style={{ fontSize: '32px', filter: 'drop-shadow(0 4px 10px rgba(216,180,254,0.6))' }}>
          🦋
        </span>
      </motion.div>

      {/* 🧁 Sweet Cupcake (Bottom-Right) */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '180px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        whileHover={{ scale: 1.15, rotate: -5 }}
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = cupcakeQuotes[Math.floor(Math.random() * cupcakeQuotes.length)];
          triggerBubble('cupcake', quote, rect.left - 60, rect.top - 60);
        }}
      >
        <span style={{ fontSize: '32px', filter: 'drop-shadow(0 4px 12px rgba(255,182,193,0.5))' }}>
          🧁
        </span>
      </motion.div>

      {/* 🍗 Floating Hot Biriyani for en Foodie Bujji */}
      <motion.div
        style={{
          position: 'absolute',
          bottom: '220px',
          left: '80px',
          pointerEvents: 'auto',
          cursor: 'pointer',
          userSelect: 'none'
        }}
        whileHover={{ scale: 1.25, rotate: 10 }}
        animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
        transition={{ repeat: Infinity, duration: 4.2, ease: 'easeInOut' }}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const quote = biriyaniQuotes[Math.floor(Math.random() * biriyaniQuotes.length)];
          triggerBubble('biriyani', quote, rect.left, rect.top - 60);
        }}
        title="En Foodie Bujji's Favourite Biriyani! 🍗"
      >
        <span style={{ fontSize: '36px', filter: 'drop-shadow(0 4px 14px rgba(251, 146, 60, 0.7))' }}>
          🍗
        </span>
      </motion.div>

      {/* Speech Bubble Display */}
      <AnimatePresence>
        {activeSpeech && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ type: 'spring', damping: 20, stiffness: 350 }}
            style={{
              position: 'fixed',
              left: Math.max(16, Math.min(window.innerWidth - 260, activeSpeech.x)),
              top: Math.max(60, activeSpeech.y),
              background: 'rgba(255, 255, 255, 0.95)',
              color: '#831843',
              padding: '10px 16px',
              borderRadius: '16px',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 117, 151, 0.5)',
              border: '2px solid #ff7597',
              fontSize: '0.9rem',
              fontWeight: 700,
              maxWidth: '240px',
              textAlign: 'center',
              pointerEvents: 'none',
              zIndex: 9999
            }}
          >
            {activeSpeech.text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
