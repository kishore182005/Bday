import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sprout,
  MessageCircleHeart,
  Smile,
  HeartHandshake,
  Moon,
  PartyPopper,
  Calendar,
  ChevronDown,
  ArrowRight,
  Heart,
  Sparkles,
  Camera,
  ZoomIn,
  X,
  Check
} from 'lucide-react';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';

const ICON_MAP = {
  Sprout,
  MessageCircleHeart,
  Smile,
  HeartHandshake,
  Moon,
  PartyPopper
};

const ALL_STORY_PHOTOS = [
  { id: 'temple', title: 'Hand in Hand at Temple 🛕', src: '/images/sharmila-kishore-temple-handinhand.jpg' },
  { id: 'proposal', title: 'Down On One Knee by Lake 💍', src: '/images/sharmila-kishore-knee-proposal.jpg' },
  { id: 'park', title: 'Cozy Park Bench Moments 🌿', src: '/images/sharmila-kishore-park-bench.jpg' },
  { id: 'black-date', title: 'Matching in Black Dinner 🖤', src: '/images/sharmila-kishore-black-date.jpg' },
  { id: 'heart-puppy', title: 'Heart Kiss & Puppy Filter 💖🐶', src: '/images/sharmila-kishore-heart-puppy.jpg' },
  { id: 'stairs', title: 'Sweet Smile on Stairs 🌸', src: '/images/sharmila-stairs-smile.jpg' },
  { id: 'loving-gaze', title: 'Candid Loving Gaze 🥰', src: '/images/sharmila-kishore-loving-gaze.jpg' },
  { id: 'green-trees', title: 'Under the Green Trees 🍃', src: '/images/sharmila-kishore-green-trees.jpg' },
  { id: 'lakeside-rose', title: 'Lakeside with Red Rose 🌹', src: '/images/sharmila-kishore-lakeside-rose.jpg' },
  { id: 'mall-mirror', title: 'Mall Mirror Selfie 🛍️', src: '/images/sharmila-kishore-mall-mirror.jpg' },
  { id: 'evening', title: 'Evening Street Date 🌙', src: '/images/sharmila-kishore-evening.jpg' },
  { id: 'bus-trip', title: 'Bus Trip Together 🚌', src: '/images/sharmila-kishore-bus-trip.jpg' },
  { id: 'pout', title: 'Cute Pout Duo 😚', src: '/images/sharmila-kishore-pout.jpg' },
  { id: 'college', title: 'College Days Together 🎓', src: '/images/sharmila-kishore-college-puppy.jpg' },
  { id: 'lavender', title: 'Lavender Vibes 💜', src: '/images/sharmila-kishore-lavender-vibes.jpg' },
  { id: 'vibes', title: 'Cool Sunglasses Vibes 😎', src: '/images/sharmila-kishore-vibes.jpg' },
  { id: 'nature', title: 'Nature Walk 🌿', src: '/images/sharmila-nature-walk.jpg' }
];

export const OurStory = ({ onNext }) => {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [assigningChapterIndex, setAssigningChapterIndex] = useState(null);
  const [previewPhoto, setPreviewPhoto] = useState(null);
  const { playPopSound, playChimeSound } = useAudio();

  // Load assigned photos directly from loveData or custom override
  const [assignedPhotos, setAssignedPhotos] = useState(() => {
    const initial = {};
    (loveData.story.chapters || []).forEach((ch, idx) => {
      initial[idx] = ch.image;
    });
    try {
      const saved = localStorage.getItem('sharmila_story_assigned_photos_v2');
      if (saved) {
        return { ...initial, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return initial;
  });

  const handleAssignPhoto = (chapterIndex, photoSrc) => {
    playChimeSound();
    const updated = { ...assignedPhotos, [chapterIndex]: photoSrc };
    setAssignedPhotos(updated);
    try {
      localStorage.setItem('sharmila_story_assigned_photos_v2', JSON.stringify(updated));
    } catch (e) {}
    setAssigningChapterIndex(null);
  };

  const toggleExpand = (idx) => {
    playPopSound();
    setExpandedIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '850px',
        margin: '0 auto',
        padding: '90px 20px 60px'
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '40px' }}
      >
        <div className="chapter-badge">
          <Heart size={16} style={{ color: '#f472b6' }} />
          <span>Our Story 📖</span>
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
          Our Journey With Sharmila ❤️
        </h2>
        <p style={{ color: '#f1e6f5', fontSize: '1.05rem', maxWidth: '560px', margin: '12px auto 0' }}>
          "Unna first meet pannadhu oru moment... aana unna love panna start pannadhu oru lifetime feeling."
        </p>
      </motion.div>

      {/* Big Anniversary Milestone Banner: 17 JAN 2024 */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          background: 'linear-gradient(135deg, rgba(255, 117, 151, 0.25) 0%, rgba(168, 85, 247, 0.25) 100%)',
          backdropFilter: 'blur(16px)',
          border: '2px solid rgba(255, 177, 195, 0.5)',
          borderRadius: '24px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 15px 40px rgba(0,0,0,0.6), 0 0 35px rgba(255, 117, 151, 0.3)',
          marginBottom: '50px'
        }}
      >
        <span style={{ fontSize: '0.9rem', color: '#ffb1c3', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 700 }}>
          {loveData.story.startSubtitle}
        </span>
        <h3
          className="font-serif gradient-text-gold"
          style={{ fontSize: 'clamp(2.4rem, 5vw, 3.8rem)', fontWeight: 900, margin: '6px 0' }}
        >
          {loveData.story.startDate}
        </h3>
        <p style={{ color: '#fff', fontSize: '1rem', fontStyle: 'italic' }}>
          "17/01/2024... Andha date enakku just oru date illa. Adhu namma story start aana date. ❤️"
        </p>
      </motion.div>

      {/* Timeline Container */}
      <div style={{ position: 'relative', paddingLeft: '42px' }}>
        {/* Glowing vertical line */}
        <div
          style={{
            position: 'absolute',
            left: '20px',
            top: '20px',
            bottom: '20px',
            width: '3px',
            background: 'linear-gradient(180deg, #ff7597 0%, #c084fc 50%, #fde047 100%)',
            boxShadow: '0 0 18px rgba(255, 117, 151, 0.8)'
          }}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {loveData.story.chapters.map((ch, index) => {
            const IconComponent = ICON_MAP[ch.icon] || Sparkles;
            const isExpanded = expandedIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                style={{ position: 'relative' }}
              >
                {/* Node icon */}
                <div
                  onClick={() => toggleExpand(index)}
                  style={{
                    position: 'absolute',
                    left: '-42px',
                    top: '18px',
                    transform: 'translateX(-50%)',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: isExpanded
                      ? 'linear-gradient(135deg, #ff7597, #a855f7)'
                      : 'rgba(26, 12, 42, 0.95)',
                    border: `2px solid ${isExpanded ? '#ffe4e6' : 'rgba(255, 117, 151, 0.5)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isExpanded ? '#fff' : '#ff7597',
                    boxShadow: isExpanded
                      ? '0 0 25px rgba(255, 117, 151, 0.8)'
                      : '0 0 10px rgba(0, 0, 0, 0.5)',
                    cursor: 'pointer',
                    zIndex: 2,
                    transition: 'all 0.3s ease'
                  }}
                >
                  <IconComponent size={18} />
                </div>

                {/* Chapter Card */}
                <motion.div
                  layout
                  onClick={() => toggleExpand(index)}
                  style={{
                    background: isExpanded
                      ? 'linear-gradient(145deg, rgba(38, 16, 58, 0.9) 0%, rgba(20, 8, 32, 0.96) 100%)'
                      : 'rgba(22, 10, 36, 0.7)',
                    backdropFilter: 'blur(16px)',
                    border: isExpanded
                      ? '1.5px solid rgba(255, 117, 151, 0.5)'
                      : '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '24px',
                    boxShadow: isExpanded
                      ? '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 117, 151, 0.2)'
                      : '0 8px 24px rgba(0, 0, 0, 0.4)',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease'
                  }}
                  whileHover={{ scale: 1.01 }}
                >
                  {/* Top Bar */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="cute-sticker">
                        {ch.tag}
                      </span>
                      <span style={{ fontSize: '0.85rem', color: '#ffb1c3', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} /> {ch.date}
                      </span>
                    </div>

                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      style={{ color: '#c4b5fd' }}
                    >
                      <ChevronDown size={18} />
                    </motion.div>
                  </div>

                  <h3
                    className="font-serif"
                    style={{
                      fontSize: '1.45rem',
                      color: isExpanded ? '#ffe4e6' : '#fff',
                      margin: '12px 0 6px'
                    }}
                  >
                    {ch.title}
                  </h3>

                  <p
                    className="font-script"
                    style={{
                      color: '#fbcfe8',
                      fontSize: '1.35rem',
                      lineHeight: '1.4'
                    }}
                  >
                    "{ch.quote}"
                  </p>

                  {/* Expanded Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div
                          style={{
                            marginTop: '16px',
                            paddingTop: '16px',
                            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
                          }}
                        >
                          <p style={{ color: '#f1e6f5', fontSize: '1.02rem', lineHeight: '1.8' }}>
                            {ch.story}
                          </p>

                          {ch.image && (
                            <div
                              style={{
                                marginTop: '16px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center'
                              }}
                            >
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setPreviewPhoto(ch.image);
                                }}
                                style={{
                                  position: 'relative',
                                  width: '100%',
                                  maxWidth: '260px',
                                  height: '180px',
                                  borderRadius: '16px',
                                  overflow: 'hidden',
                                  border: '2px solid rgba(255, 117, 151, 0.45)',
                                  boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(255, 117, 151, 0.2)',
                                  background: 'rgba(15, 5, 25, 0.85)',
                                  cursor: 'pointer'
                                }}
                                title="Click to view full photo 🔍"
                              >
                                <img
                                  src={ch.image}
                                  alt={ch.title}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    objectPosition: ch.objectPosition || 'top center',
                                    display: 'block'
                                  }}
                                />
                                <div
                                  style={{
                                    position: 'absolute',
                                    bottom: '8px',
                                    right: '8px',
                                    background: 'rgba(0, 0, 0, 0.65)',
                                    backdropFilter: 'blur(6px)',
                                    borderRadius: '9999px',
                                    padding: '4px 8px',
                                    color: '#fff',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <ZoomIn size={11} /> View
                                </div>
                              </motion.div>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Photo Lightbox Preview */}
      <AnimatePresence>
        {previewPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewPhoto(null)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px'
            }}
          >
            <motion.div
              initial={{ scale: 0.85 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'relative',
                maxWidth: '90vw',
                maxHeight: '85vh',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2px solid rgba(255, 117, 151, 0.5)',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
              }}
            >
              <img
                src={previewPhoto}
                alt="Preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '80vh',
                  objectFit: 'contain',
                  display: 'block'
                }}
              />
              <button
                onClick={() => setPreviewPhoto(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: '1px solid rgba(255, 255, 255, 0.4)',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Continue Button */}
      <div style={{ textAlign: 'center', marginTop: '48px' }}>
        <button
          onClick={onNext}
          className="btn-cute"
          style={{ padding: '1.1rem 2.8rem' }}
        >
          <span>Open Sharmila's Love Scrapbook 📸</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
