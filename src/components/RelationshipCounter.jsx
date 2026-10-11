import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';
import { loveData } from '../data/loveData';

export const RelationshipCounter = () => {
  const [timeTogether, setTimeTogether] = useState({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    totalDays: 0
  });

  useEffect(() => {
    const startDate = new Date(loveData.relationshipDateObj);

    const calculateTime = () => {
      const now = new Date();
      const diffMs = now - startDate;
      const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      // Calculate calendar difference
      let years = now.getFullYear() - startDate.getFullYear();
      let months = now.getMonth() - startDate.getMonth();
      let days = now.getDate() - startDate.getDate();

      if (days < 0) {
        months -= 1;
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
      }
      if (months < 0) {
        years -= 1;
        months += 12;
      }

      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      setTimeTogether({
        years: Math.max(0, years),
        months: Math.max(0, months),
        days: Math.max(0, days),
        hours,
        minutes,
        seconds,
        totalDays: Math.max(0, totalDays)
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const counterUnits = [
    { label: 'Years', value: timeTogether.years },
    { label: 'Months', value: timeTogether.months },
    { label: 'Days', value: timeTogether.days },
    { label: 'Hours', value: timeTogether.hours },
    { label: 'Mins', value: timeTogether.minutes },
    { label: 'Secs', value: timeTogether.seconds }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'linear-gradient(135deg, rgba(35, 14, 55, 0.75) 0%, rgba(18, 6, 30, 0.85) 100%)',
        backdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 117, 151, 0.35)',
        borderRadius: '24px',
        padding: '24px 20px',
        maxWidth: '680px',
        width: '100%',
        margin: '24px auto',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 117, 151, 0.2)',
        textAlign: 'center'
      }}
    >
      {/* Header Tag */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          borderRadius: '9999px',
          background: 'rgba(255, 117, 151, 0.2)',
          border: '1px solid rgba(255, 117, 151, 0.4)',
          color: '#ffe4e6',
          fontSize: '0.88rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}
      >
        <Heart size={14} fill="#f43f5e" color="#f43f5e" className="heartbeat-anim" />
        <span>Together since 17 January 2024 ❤️</span>
        <Sparkles size={14} color="#fde047" />
      </div>

      {/* Numerical Time Units Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '8px'
        }}
      >
        {counterUnits.map((unit, idx) => (
          <div
            key={idx}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 177, 195, 0.2)',
              borderRadius: '14px',
              padding: '10px 4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span
              className="font-serif gradient-text-gold"
              style={{
                fontSize: 'clamp(1.2rem, 2.8vw, 1.8rem)',
                fontWeight: 800,
                lineHeight: 1.1
              }}
            >
              {String(unit.value).padStart(2, '0')}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                color: '#c4b5fd',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginTop: '4px'
              }}
            >
              {unit.label}
            </span>
          </div>
        ))}
      </div>

      {/* Total Days Ribbon */}
      <div style={{ marginTop: '14px', fontSize: '0.88rem', color: '#ffb1c3' }}>
        ✨ That's <strong style={{ color: '#fff', fontSize: '1rem' }}>{timeTogether.totalDays} days</strong> of loving you, and forever to go! ✨
      </div>
    </motion.div>
  );
};
