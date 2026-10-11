import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Copy, Check, Heart, RefreshCw } from 'lucide-react';
import { generateAiBirthdayMessage } from '../services/api';
import { loveData } from '../data/loveData';

export const AiMessageModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedTone, setSelectedTone] = useState('poetic');

  const tones = [
    { id: 'poetic', label: 'Poetic & Cinematic 🌌' },
    { id: 'tender', label: 'Tender & Deeply Emotional 🥹' },
    { id: 'sweet', label: 'Playful & Sweet 💕' }
  ];

  const handleGenerate = async () => {
    setLoading(true);
    setCopied(false);
    try {
      const result = await generateAiBirthdayMessage({
        girlfriendName: loveData.girlfriendName,
        nickname: loveData.nickname,
        tone: selectedTone
      });
      setGeneratedMessage(result.message);
    } catch (err) {
      console.error('Error generating AI message:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!generatedMessage) return;
    navigator.clipboard.writeText(generatedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
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
          background: 'rgba(5, 5, 9, 0.82)',
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
          initial={{ scale: 0.9, y: 25, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 25, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={{
            background: 'linear-gradient(135deg, rgba(20, 10, 35, 0.9) 0%, rgba(10, 6, 18, 0.95) 100%)',
            border: '1px solid rgba(217, 70, 239, 0.35)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(168, 85, 247, 0.25)',
            borderRadius: '24px',
            width: '100%',
            maxWidth: '620px',
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

          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(168, 85, 247, 0.15)',
                border: '1px solid rgba(168, 85, 247, 0.35)',
                color: '#d8b4fe',
                fontSize: '0.85rem',
                fontWeight: 600,
                marginBottom: '12px'
              }}
            >
              <Sparkles size={14} /> Powered by Gemini AI
            </div>

            <h3
              className="font-serif gradient-text-romantic"
              style={{ fontSize: '1.85rem', marginBottom: '8px' }}
            >
              Let The Universe Write For You
            </h3>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto' }}>
              Summoning poetic starlight and our precious memories to compose a one-of-a-kind message for {loveData.girlfriendName}.
            </p>
          </div>

          {/* Tone Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
            {tones.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTone(t.id)}
                style={{
                  background: selectedTone === t.id ? 'rgba(244, 63, 94, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${selectedTone === t.id ? '#fb7185' : 'rgba(255, 255, 255, 0.12)'}`,
                  color: selectedTone === t.id ? '#fff' : '#cbd5e1',
                  borderRadius: '9999px',
                  padding: '6px 14px',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Generate Action Button */}
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="btn-romantic"
              style={{
                width: '100%',
                maxWidth: '380px',
                padding: '14px 28px',
                opacity: loading ? 0.75 : 1
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Weaving starlight into words...</span>
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  <span>{generatedMessage ? 'Compose Another Verse ✨' : 'Let the universe write something for you ✨'}</span>
                </>
              )}
            </button>
          </div>

          {/* Generated Message Display */}
          <AnimatePresence>
            {generatedMessage && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(251, 113, 133, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  position: 'relative',
                  marginTop: '10px'
                }}
              >
                <div
                  className="font-serif"
                  style={{
                    color: '#fdf2f8',
                    fontSize: '1.05rem',
                    lineHeight: '1.8',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-line'
                  }}
                >
                  "{generatedMessage}"
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                  }}
                >
                  <span style={{ fontSize: '0.82rem', color: '#fda4af', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Heart size={13} fill="#fda4af" /> Written for {loveData.girlfriendName}
                  </span>

                  <button
                    onClick={handleCopy}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: copied ? '#4ade80' : '#fff',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Copied with love!' : 'Copy letter'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <style>{`
            .animate-spin {
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
