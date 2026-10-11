import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  Heart,
  Sparkles,
  ArrowRight,
  BookOpen,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  Upload,
  Palette,
  X,
  Smile,
  Trash2,
  ZoomIn,
  Flame,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loveData } from '../data/loveData';
import { useAudio } from '../context/AudioContext';
import { useTheme } from '../context/ThemeContext';

export const LoveAlbum = ({ onNext }) => {
  const { playPopSound, playChimeSound, playHeartCollectSound } = useAudio();
  const { theme, setTheme, themes } = useTheme();

  // Mode: 'scrapbook' (3D Book Flip) | 'gallery' (Polaroid Wall)
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('sharmila_album_viewmode') || 'scrapbook';
    } catch (e) {
      return 'scrapbook';
    }
  });
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const saved = localStorage.getItem('sharmila_album_page');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch (e) {
      return 0;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sharmila_album_viewmode', viewMode);
    } catch (e) {}
  }, [viewMode]);

  useEffect(() => {
    try {
      localStorage.setItem('sharmila_album_page', currentPage.toString());
    } catch (e) {}
  }, [currentPage]);
  const [activePhotoModalIndex, setActivePhotoModalIndex] = useState(null);
  const [photosList, setPhotosList] = useState(loveData.album || []);
  const [activeSticker, setActiveSticker] = useState('💖');
  const [placedStickers, setPlacedStickers] = useState({}); // { [photoId]: [{ x, y, emoji, id }] }
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Track likes for each photo
  const [likesMap, setLikesMap] = useState(() => {
    const initial = {};
    (loveData.album || []).forEach((p) => {
      initial[p.id] = p.likes || 1310;
    });
    return initial;
  });

  const fileInputRef = useRef(null);

  const availableStickers = ['💖', '🎀', '👑', '🧸', '🌸', '🍓', '✨', '💌', '🥰', '🐾', '💋'];

  const categories = [
    { id: 'all', label: 'All Memories 💖' },
    { id: 'milestone', label: 'Proposal & Milestones 💍' },
    { id: 'romantic', label: 'Romantic Moments 🌹' },
    { id: 'cute', label: 'Cute & Silly 😜' },
    { id: 'college', label: 'Campus & Mall 🎓🛍️' },
    { id: 'travel', label: 'Travel Diaries 🚌' },
    { id: 'throwback', label: 'Baby Sharmila 👧' }
  ];

  // Filtered list based on category
  const filteredPhotos = selectedCategory === 'all'
    ? photosList
    : photosList.filter((p) => p.category === selectedCategory);

  // Safe current photo in scrapbook mode
  const currentPhoto = filteredPhotos[currentPage] || filteredPhotos[0] || photosList[0];

  // Handle page turn in scrapbook
  const handleNextPage = () => {
    if (currentPage < filteredPhotos.length - 1) {
      playPopSound();
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      playPopSound();
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Stamp a sticker onto a photo
  const handlePhotoClick = (e, photoId) => {
    playHeartCollectSound(1);
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPlacedStickers((prev) => {
      const existing = prev[photoId] || [];
      return {
        ...prev,
        [photoId]: [...existing, { x, y, emoji: activeSticker, id: Date.now() + Math.random() }]
      };
    });

    try {
      confetti({
        particleCount: 16,
        spread: 45,
        origin: { x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight },
        colors: ['#ff7597', '#fde047', '#c084fc', '#38bdf8']
      });
    } catch (err) {}
  };

  // Clear stickers on active photo
  const handleClearStickers = (photoId, e) => {
    e?.stopPropagation();
    playPopSound();
    setPlacedStickers((prev) => ({
      ...prev,
      [photoId]: []
    }));
  };

  // Send a Love Like on a photo
  const handleLikePhoto = (photoId, e) => {
    e?.stopPropagation();
    playPopSound();
    playHeartCollectSound(2);

    setLikesMap((prev) => ({
      ...prev,
      [photoId]: (prev[photoId] || 0) + 1
    }));

    try {
      const rect = e?.currentTarget?.getBoundingClientRect();
      const originX = rect ? (rect.left + rect.width / 2) / window.innerWidth : 0.5;
      const originY = rect ? (rect.top + rect.height / 2) / window.innerHeight : 0.5;

      confetti({
        particleCount: 22,
        spread: 60,
        origin: { x: originX, y: originY },
        colors: ['#ff4d6d', '#ff7597', '#f43f5e']
      });
    } catch (err) {}
  };

  // Upload new photo to album
  const handleUploadPhoto = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const newPhoto = {
          id: Date.now(),
          title: file.name.replace(/\.[^/.]+$/, '') || 'Our Special Memory',
          date: 'Added with Love ❤️',
          category: 'romantic',
          image: event.target.result,
          tag: 'New Memory 📸',
          caption: 'Another beautiful moment with en Chellam.',
          story: 'Every photo is a treasure, and every smile of yours makes my world brighter!',
          rotation: (Math.random() - 0.5) * 6,
          tapeColor: 'rgba(255, 117, 151, 0.55)',
          likes: 520
        };
        setPhotosList((prev) => [...prev, newPhoto]);
        setSelectedCategory('all');
        setCurrentPage(photosList.length);
        playChimeSound();
        try {
          confetti({ particleCount: 50, spread: 70, colors: ['#ff7597', '#fde047'] });
        } catch (err) {}
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal navigation
  const activeModalPhoto = activePhotoModalIndex !== null ? filteredPhotos[activePhotoModalIndex] : null;

  const handleModalPrev = (e) => {
    e?.stopPropagation();
    if (activePhotoModalIndex > 0) {
      playPopSound();
      setActivePhotoModalIndex((prev) => prev - 1);
    }
  };

  const handleModalNext = (e) => {
    e?.stopPropagation();
    if (activePhotoModalIndex < filteredPhotos.length - 1) {
      playPopSound();
      setActivePhotoModalIndex((prev) => prev + 1);
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        zIndex: 5,
        width: '100%',
        maxWidth: '1080px',
        margin: '0 auto',
        padding: '90px 16px 60px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      {/* Title & Subtitle */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: 'center', marginBottom: '20px' }}
      >
        <div className="chapter-badge">
          <Camera size={16} style={{ color: '#f472b6' }} />
          <span>Sharmila's Love Album 📸</span>
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
          Our Little Scrapbook & Memories 📸✨
        </h2>
        <p style={{ color: '#f1e6f5', fontSize: '1.05rem', maxWidth: '640px', margin: '8px auto 0' }}>
          Real moments, silly laughs, romantic dates, and childhood treasures with en Thangoo Sharmila!
        </p>
      </motion.div>

      {/* Control Bar: Theme Switcher + Album View Toggle + Upload */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          width: '100%',
          maxWidth: '880px',
          background: 'rgba(255, 255, 255, 0.04)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid var(--glass-border)',
          borderRadius: '20px',
          padding: '10px 18px',
          marginBottom: '16px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.4)'
        }}
      >
        {/* Left: View Mode Toggle */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => {
              playPopSound();
              setViewMode('scrapbook');
            }}
            style={{
              background: viewMode === 'scrapbook' ? 'linear-gradient(135deg, var(--pink-soft), var(--purple-soft))' : 'transparent',
              color: viewMode === 'scrapbook' ? '#fff' : '#c4b5fd',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 14px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <BookOpen size={14} /> 📖 Scrapbook
          </button>

          <button
            onClick={() => {
              playPopSound();
              setViewMode('gallery');
            }}
            style={{
              background: viewMode === 'gallery' ? 'linear-gradient(135deg, var(--pink-soft), var(--purple-soft))' : 'transparent',
              color: viewMode === 'gallery' ? '#fff' : '#c4b5fd',
              border: 'none',
              borderRadius: '12px',
              padding: '8px 14px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
          >
            <LayoutGrid size={14} /> 📸 Polaroid Wall ({photosList.length})
          </button>
        </div>



        {/* Right: Upload Photo Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleUploadPhoto}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="btn-soft"
            style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Upload size={13} /> Add Photo
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          maxWidth: '880px',
          width: '100%',
          padding: '4px 4px 14px',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}
      >
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? photosList.length
            : photosList.filter((p) => p.category === cat.id).length;

          return (
            <button
              key={cat.id}
              onClick={() => {
                playPopSound();
                setSelectedCategory(cat.id);
                setCurrentPage(0);
              }}
              style={{
                background: isSelected ? 'rgba(255, 117, 151, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                border: `1.5px solid ${isSelected ? 'var(--pink-soft)' : 'rgba(255, 255, 255, 0.1)'}`,
                borderRadius: '9999px',
                padding: '5px 14px',
                color: isSelected ? '#fff' : '#c4b5fd',
                fontSize: '0.78rem',
                fontWeight: isSelected ? 800 : 500,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              <span>{cat.label}</span>
              <span
                style={{
                  background: isSelected ? 'var(--pink-soft)' : 'rgba(255, 255, 255, 0.1)',
                  color: isSelected ? '#fff' : '#c4b5fd',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                  fontSize: '0.68rem',
                  fontWeight: 700
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Sticker Stamp Palette Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '8px',
          marginBottom: '24px',
          background: 'rgba(20, 5, 35, 0.7)',
          padding: '6px 16px',
          borderRadius: '9999px',
          border: '1px solid rgba(255, 117, 151, 0.3)'
        }}
      >
        <span style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>🎨</span> Stamp Cute Stickers on Photos:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {availableStickers.map((stk) => (
            <button
              key={stk}
              onClick={() => {
                playPopSound();
                setActiveSticker(stk);
              }}
              style={{
                background: activeSticker === stk ? 'rgba(255, 117, 151, 0.4)' : 'transparent',
                border: `1.5px solid ${activeSticker === stk ? '#ff7597' : 'transparent'}`,
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px',
                cursor: 'pointer',
                transform: activeSticker === stk ? 'scale(1.2)' : 'scale(1)',
                transition: 'all 0.15s ease'
              }}
              title={`Select ${stk} stamp`}
            >
              {stk}
            </button>
          ))}
        </div>
      </div>

      {/* ==============================================================================
          MODE 1: 📖 3D SCRAPBOOK ALBUM VIEW
          ============================================================================== */}
      {viewMode === 'scrapbook' && currentPhoto && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <motion.div
            key={currentPhoto.id}
            initial={{ opacity: 0, rotateY: -10, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: 10, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            style={{
              position: 'relative',
              width: '100%',
              maxWidth: '860px',
              minHeight: '460px',
              background: 'linear-gradient(135deg, rgba(28, 12, 44, 0.96) 0%, rgba(18, 6, 30, 0.98) 100%)',
              border: '2px solid var(--glass-border)',
              borderRadius: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px var(--glass-glow)',
              display: 'flex',
              flexWrap: 'wrap',
              overflow: 'hidden',
              marginBottom: '20px'
            }}
          >
            {/* Left Page: The Photo with Washi Tape and Placed Stickers */}
            <div
              style={{
                flex: '1 1 380px',
                padding: '28px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.25)',
                borderRight: '1px dashed rgba(255, 117, 151, 0.25)',
                position: 'relative'
              }}
            >
              {/* Cute Washi Tape at Top Corner */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '40px',
                  width: '90px',
                  height: '24px',
                  background: currentPhoto.tapeColor,
                  transform: 'rotate(-4deg)',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
                  zIndex: 10
                }}
              />

              {/* Photo Frame Container */}
              <div
                onClick={(e) => handlePhotoClick(e, currentPhoto.id)}
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '340px',
                  height: '400px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  cursor: 'crosshair',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.6)',
                  border: '4px solid #fff'
                }}
                title="Tap photo to stamp a sticker!"
              >
                <img
                  src={currentPhoto.image}
                  alt={currentPhoto.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: currentPhoto.objectPosition || 'top center',
                    display: 'block'
                  }}
                />

                {/* Placed Stickers on this photo */}
                {(placedStickers[currentPhoto.id] || []).map((stk) => (
                  <motion.div
                    key={stk.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    style={{
                      position: 'absolute',
                      left: `${stk.x}%`,
                      top: `${stk.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '28px',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.6))',
                      userSelect: 'none'
                    }}
                  >
                    {stk.emoji}
                  </motion.div>
                ))}

                {/* Floating sticker badge */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(255, 117, 151, 0.9)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    padding: '4px 12px',
                    borderRadius: '9999px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
                  }}
                >
                  {currentPhoto.tag}
                </div>

                {/* Interactive Heart Like Button Overlay */}
                <button
                  onClick={(e) => handleLikePhoto(currentPhoto.id, e)}
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '4px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: '#e11d48',
                    fontWeight: 800,
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 15
                  }}
                  title="Double tap to send love!"
                >
                  <Heart size={14} fill="#e11d48" />
                  <span>{likesMap[currentPhoto.id] || 0}</span>
                </button>
              </div>

              {/* Action Hint & Clear Stickers button */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '340px',
                  marginTop: '10px'
                }}
              >
                <span style={{ fontSize: '0.72rem', color: '#ffb1c3', fontStyle: 'italic' }}>
                  💡 Tap anywhere on photo to stamp "{activeSticker}"
                </span>
                {(placedStickers[currentPhoto.id] || []).length > 0 && (
                  <button
                    onClick={(e) => handleClearStickers(currentPhoto.id, e)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: 'none',
                      color: '#f43f5e',
                      borderRadius: '8px',
                      padding: '2px 8px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Trash2 size={11} /> Clear
                  </button>
                )}
              </div>
            </div>

            {/* Right Page: Romantic Letter & Story */}
            <div
              style={{
                flex: '1 1 380px',
                padding: '36px 30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#ffb1c3', fontWeight: 700 }}>
                    {currentPhoto.date}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: '#c4b5fd', background: 'rgba(255,255,255,0.08)', padding: '2px 10px', borderRadius: '9999px' }}>
                    Photo {currentPage + 1} of {filteredPhotos.length}
                  </span>
                </div>

                <h3 className="font-serif gradient-text-cute" style={{ fontSize: '1.8rem', marginBottom: '8px' }}>
                  {currentPhoto.title}
                </h3>

                <p
                  className="font-script"
                  style={{
                    fontSize: '1.45rem',
                    color: '#fbcfe8',
                    lineHeight: '1.4',
                    marginBottom: '16px'
                  }}
                >
                  "{currentPhoto.caption}"
                </p>

                <p style={{ color: '#f1e6f5', fontSize: '0.98rem', lineHeight: '1.8' }}>
                  {currentPhoto.story}
                </p>
              </div>

              {/* Page Controls */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  marginTop: '20px'
                }}
              >
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className="btn-soft"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.84rem',
                    opacity: currentPage === 0 ? 0.35 : 1,
                    cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <ChevronLeft size={16} /> Prev Memory
                </button>

                {/* Page Indicator dots */}
                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', maxWidth: '140px', justifyContent: 'center' }}>
                  {filteredPhotos.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        playPopSound();
                        setCurrentPage(i);
                      }}
                      style={{
                        width: currentPage === i ? '16px' : '6px',
                        height: '6px',
                        borderRadius: '9999px',
                        background: currentPage === i ? 'var(--pink-soft)' : 'rgba(255, 255, 255, 0.2)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={handleNextPage}
                  disabled={currentPage === filteredPhotos.length - 1}
                  className="btn-cute"
                  style={{
                    padding: '8px 18px',
                    fontSize: '0.84rem',
                    opacity: currentPage === filteredPhotos.length - 1 ? 0.35 : 1,
                    cursor: currentPage === filteredPhotos.length - 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  Next Memory <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ==============================================================================
          MODE 2: 📸 POLAROID PHOTO WALL (Interactive Rotating Gallery)
          ============================================================================== */}
      {viewMode === 'gallery' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '26px',
            width: '100%',
            maxWidth: '920px',
            marginBottom: '32px'
          }}
        >
          {filteredPhotos.map((photo, index) => (
            <motion.div
              key={photo.id}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
              style={{
                background: '#fff',
                padding: '14px 14px 20px',
                borderRadius: '8px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.6)',
                transform: `rotate(${photo.rotation || 0}deg)`,
                cursor: 'pointer',
                transition: 'transform 0.25s ease',
                position: 'relative'
              }}
              onClick={() => setActivePhotoModalIndex(index)}
            >
              {/* Tape sticker on top */}
              <div
                style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '70px',
                  height: '18px',
                  background: photo.tapeColor || 'rgba(255, 117, 151, 0.45)',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  zIndex: 2
                }}
              />

              {/* Photo Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '240px',
                  overflow: 'hidden',
                  borderRadius: '4px',
                  background: '#f3f4f6'
                }}
              >
                <img
                  src={photo.image}
                  alt={photo.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: photo.objectPosition || 'top center',
                    display: 'block'
                  }}
                />

                {/* Placed stickers overlay on polaroid */}
                {(placedStickers[photo.id] || []).map((stk) => (
                  <div
                    key={stk.id}
                    style={{
                      position: 'absolute',
                      left: `${stk.x}%`,
                      top: `${stk.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '22px',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                    }}
                  >
                    {stk.emoji}
                  </div>
                ))}

                {/* Zoom badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(0,0,0,0.5)',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <ZoomIn size={14} />
                </div>
              </div>

              {/* Polaroid Caption & Likes */}
              <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <p className="font-script" style={{ fontSize: '1.3rem', color: '#831843', margin: '0 0 2px', textAlign: 'center' }}>
                  {photo.title}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 4px', marginTop: '4px' }}>
                  <span style={{ fontSize: '0.72rem', color: '#9ca3af', fontWeight: 600 }}>
                    {photo.date}
                  </span>
                  <button
                    onClick={(e) => handleLikePhoto(photo.id, e)}
                    style={{
                      background: 'rgba(254, 226, 226, 0.8)',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '2px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      color: '#e11d48',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                    title="Send a heart"
                  >
                    <Heart size={12} fill="#e11d48" /> {likesMap[photo.id] || 0}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ==============================================================================
          FULL-SCREEN PHOTO ZOOM MODAL WITH SLIDESHOW
          ============================================================================== */}
      <AnimatePresence>
        {activeModalPhoto && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backgroundColor: 'rgba(5, 2, 12, 0.92)',
              backdropFilter: 'blur(16px)'
            }}
            onClick={() => setActivePhotoModalIndex(null)}
          >
            <motion.div
              key={activeModalPhoto.id}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              style={{
                width: '100%',
                maxWidth: '720px',
                background: 'rgba(26, 10, 42, 0.98)',
                border: '2px solid var(--pink-soft)',
                borderRadius: '28px',
                overflow: 'hidden',
                boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px var(--glass-glow)',
                position: 'relative'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePhotoModalIndex(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer',
                  zIndex: 30
                }}
              >
                <X size={18} />
              </button>

              {/* Prev / Next Modal Arrows */}
              {activePhotoModalIndex > 0 && (
                <button
                  onClick={handleModalPrev}
                  style={{
                    position: 'absolute',
                    top: '210px',
                    left: '14px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 30
                  }}
                >
                  <ChevronLeft size={22} />
                </button>
              )}

              {activePhotoModalIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={handleModalNext}
                  style={{
                    position: 'absolute',
                    top: '210px',
                    right: '14px',
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    cursor: 'pointer',
                    zIndex: 30
                  }}
                >
                  <ChevronRight size={22} />
                </button>
              )}

              {/* Image with Stickers */}
              <div
                onClick={(e) => handlePhotoClick(e, activeModalPhoto.id)}
                style={{
                  width: '100%',
                  height: '420px',
                  overflow: 'hidden',
                  position: 'relative',
                  cursor: 'crosshair',
                  background: '#000'
                }}
                title="Tap photo to stamp stickers!"
              >
                <img
                  src={activeModalPhoto.image}
                  alt={activeModalPhoto.title}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />

                {(placedStickers[activeModalPhoto.id] || []).map((stk) => (
                  <div
                    key={stk.id}
                    style={{
                      position: 'absolute',
                      left: `${stk.x}%`,
                      top: `${stk.y}%`,
                      transform: 'translate(-50%, -50%)',
                      fontSize: '32px',
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.7))'
                    }}
                  >
                    {stk.emoji}
                  </div>
                ))}
              </div>

              {/* Story and Details */}
              <div style={{ padding: '24px 28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="cute-sticker">
                    {activeModalPhoto.tag}
                  </span>
                  <button
                    onClick={(e) => handleLikePhoto(activeModalPhoto.id, e)}
                    style={{
                      background: 'linear-gradient(135deg, #ff7597, #f43f5e)',
                      border: 'none',
                      borderRadius: '9999px',
                      padding: '6px 14px',
                      color: '#fff',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(244, 63, 94, 0.4)'
                    }}
                  >
                    <Heart size={14} fill="#fff" />
                    <span>{likesMap[activeModalPhoto.id] || 0} Loves</span>
                  </button>
                </div>

                <h3 className="font-serif gradient-text-cute" style={{ fontSize: '1.65rem', margin: '8px 0 4px' }}>
                  {activeModalPhoto.title}
                </h3>
                <p className="font-script" style={{ fontSize: '1.4rem', color: '#fbcfe8', marginBottom: '12px' }}>
                  "{activeModalPhoto.caption}"
                </p>
                <p style={{ color: '#f1e6f5', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '12px' }}>
                  {activeModalPhoto.story}
                </p>
                <span style={{ fontSize: '0.75rem', color: '#c4b5fd', fontStyle: 'italic' }}>
                  💡 Tip: Click anywhere on the picture above to stamp "{activeSticker}"!
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Navigation CTA: Move to Mini Games */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        style={{ textAlign: 'center', marginTop: '36px' }}
      >
        <button
          onClick={onNext}
          className="btn-cute pulse-glow"
          style={{ padding: '1.1rem 2.8rem', fontSize: '1.05rem' }}
        >
          <span>Play Chellam's Birthday Arcade 🎮</span>
          <ArrowRight size={18} />
        </button>
      </motion.div>
    </div>
  );
};
