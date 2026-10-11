import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

/**
 * Trailing sparkles following cursor/touch + double-click heart explosion
 */
export const CursorSparkles = () => {
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    let count = 0;
    const handleMove = (e) => {
      count++;
      if (count % 3 !== 0) return; // throttle slightly

      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : null);
      const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : null);

      if (clientX === null || clientY === null) return;

      const newSparkle = {
        id: Math.random(),
        x: clientX,
        y: clientY,
        size: Math.random() * 8 + 6,
        color: Math.random() > 0.6 ? '#ff7597' : Math.random() > 0.3 ? '#d8b4fe' : '#fde047',
        char: Math.random() > 0.5 ? '✨' : '💖'
      };

      setSparkles((prev) => [...prev.slice(-18), newSparkle]);

      setTimeout(() => {
        setSparkles((prev) => prev.filter((s) => s.id !== newSparkle.id));
      }, 700);
    };

    const handleDblClick = (e) => {
      try {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        confetti({
          particleCount: 35,
          spread: 80,
          origin: { x, y },
          colors: ['#ff7597', '#fb7185', '#d8b4fe', '#fde047']
        });
      } catch (err) {}
    };

    window.addEventListener('mousemove', handleMove, { passive: true });
    window.addEventListener('touchmove', handleMove, { passive: true });
    window.addEventListener('dblclick', handleDblClick);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('dblclick', handleDblClick);
    };
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9999,
        overflow: 'hidden'
      }}
    >
      {sparkles.map((s) => (
        <span
          key={s.id}
          style={{
            position: 'absolute',
            left: s.x,
            top: s.y,
            transform: 'translate(-50%, -50%)',
            fontSize: `${s.size}px`,
            color: s.color,
            filter: 'drop-shadow(0 0 6px currentColor)',
            animation: 'sparkleFade 0.7s forwards ease-out',
            userSelect: 'none'
          }}
        >
          {s.char}
        </span>
      ))}
      <style>{`
        @keyframes sparkleFade {
          0% { opacity: 1; transform: translate(-50%, -50%) scale(0.6); }
          50% { opacity: 0.9; transform: translate(-50%, -60%) scale(1.1); }
          100% { opacity: 0; transform: translate(-50%, -80%) scale(0.2); }
        }
      `}</style>
    </div>
  );
};
