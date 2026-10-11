import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, BookOpen, Mail, Gift, Trophy, Cake, Calendar, Camera, Lock } from 'lucide-react';
import { loveData } from '../data/loveData';

const SECTIONS = [
  { id: 'welcome', label: 'Playground', icon: Heart },
  { id: 'letter', label: 'Letter', icon: Mail },
  { id: 'story', label: 'Our Story', icon: BookOpen },
  { id: 'album', label: 'Love Album', icon: Camera },
  { id: 'minigames', label: 'Arcade', icon: Trophy },
  { id: 'gifts', label: 'Gifts', icon: Gift },
  { id: 'cake', label: 'Cake', icon: Cake },
  { id: 'date', label: '13 Oct 🎂', icon: Calendar },
  { id: 'final', label: 'Forever', icon: Sparkles }
];

export const Navbar = ({ activeSection, onNavigate, onLock }) => {

  return (
    <header
      style={{
        position: 'fixed',
        top: '14px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 40,
        width: '94%',
        maxWidth: '1050px'
      }}
    >
      <nav
        style={{
          background: 'rgba(22, 8, 36, 0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1.5px solid var(--glass-border)',
          borderRadius: '9999px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px var(--glass-glow)'
        }}
      >
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('welcome')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            paddingLeft: '4px',
            flexShrink: 0
          }}
        >
          <span
            style={{
              fontSize: '20px',
              filter: 'drop-shadow(0 0 8px var(--pink-soft))'
            }}
          >
            🎀
          </span>
          <span
            className="font-serif gradient-text-cute"
            style={{
              fontSize: '1.05rem',
              fontWeight: 800,
              letterSpacing: '0.5px'
            }}
          >
            {loveData.girlfriendName}’s World
          </span>
        </div>

        {/* Section Navigation Links (Scrollable on small screens) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            overflowX: 'auto',
            padding: '2px 8px',
            maxWidth: '680px'
          }}
          className="hide-scrollbar"
        >
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => onNavigate(sec.id)}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  color: isActive ? '#fff' : '#c4b5fd',
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'color 0.2s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.35) 0%, rgba(168, 85, 247, 0.35) 100%)',
                      border: '1.5px solid rgba(255, 177, 195, 0.6)',
                      borderRadius: '9999px',
                      zIndex: -1,
                      boxShadow: '0 0 16px rgba(255, 117, 151, 0.35)'
                    }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <Icon size={13} color={isActive ? 'var(--pink-soft)' : 'currentColor'} />
                <span className="nav-label">{sec.label}</span>
              </button>
            );
          })}
          {onLock && (
            <button
              onClick={onLock}
              title="Lock Website 🔐"
              style={{
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '9999px',
                padding: '6px 10px',
                color: '#f87171',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap',
                marginLeft: '4px'
              }}
            >
              <Lock size={12} />
              <span className="nav-label">Lock</span>
            </button>
          )}
        </div>
      </nav>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hover-glow-purple:hover {
          transform: scale(1.1);
          box-shadow: 0 0 16px rgba(168, 85, 247, 0.7);
          border-color: #c084fc;
        }
        .hover-glow-rose:hover {
          transform: scale(1.1);
          box-shadow: 0 0 16px rgba(255, 117, 151, 0.7);
          border-color: #ff7597;
        }
        @media (max-width: 820px) {
          .nav-label {
            display: none;
          }
        }
      `}</style>
    </header>
  );
};
