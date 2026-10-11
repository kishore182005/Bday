import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Ambient floating romantic hearts in the background
 */
export const HeartParticles = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate initial ambient hearts
    const initialHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: i,
      x: Math.random() * 95,
      y: Math.random() * 90 + 10,
      size: Math.random() * 14 + 10,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.15,
      rotate: Math.random() * 60 - 30,
      color: Math.random() > 0.6 ? '#fb7185' : Math.random() > 0.3 ? '#f43f5e' : '#c084fc'
    }));

    setHearts(initialHearts);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
    >
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          style={{
            position: 'absolute',
            left: `${heart.x}vw`,
            bottom: '-20px',
            color: heart.color,
            fontSize: `${heart.size}px`,
            filter: 'drop-shadow(0 0 8px currentColor)',
            userSelect: 'none'
          }}
          initial={{ y: 0, opacity: 0, scale: 0.6 }}
          animate={{
            y: '-110vh',
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: [heart.rotate - 15, heart.rotate + 15, heart.rotate - 10],
            scale: [0.6, 1, 1, 0.8]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'linear'
          }}
        >
          ♥
        </motion.div>
      ))}
    </div>
  );
};

/**
 * Helper to trigger a burst of romantic heart particles at coordinates or center
 */
export const triggerHeartBurst = (originX = 0.5, originY = 0.5) => {
  // Use canvas-confetti with heart shapes if available
  if (typeof window !== 'undefined' && window.confetti) {
    window.confetti({
      particleCount: 30,
      spread: 70,
      origin: { x: originX, y: originY },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#d946ef']
    });
  }
};
