import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Volume2,
  VolumeX,
  Play,
  Pause,
  Heart,
  Music,
  Upload,
  Link,
  Sparkles,
  RotateCcw,
  Check,
  Disc3,
  X,
  SkipForward,
  SkipBack
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';

export const MusicPlayer = () => {
  const {
    isPlaying,
    currentSong,
    currentTrack,
    volume,
    isMuted,
    audioError,
    presetSongs,
    togglePlay,
    setVolume,
    toggleMute,
    changeSong,
    uploadSongFile,
    resetDefaultSong
  } = useAudio();

  const [showMenu, setShowMenu] = useState(false);
  const [showSongModal, setShowSongModal] = useState(false);
  const [activeTab, setActiveTab] = useState('preset'); // 'preset' | 'upload' | 'url'

  const handleNextSong = (e) => {
    e?.stopPropagation();
    const currentIndex = presetSongs.findIndex(
      (s) => s.id === currentSong.id || (s.src && currentSong.src && s.src === currentSong.src)
    );
    const nextIndex = (currentIndex + 1) % presetSongs.length;
    changeSong(presetSongs[nextIndex]);
  };

  const handlePrevSong = (e) => {
    e?.stopPropagation();
    const currentIndex = presetSongs.findIndex(
      (s) => s.id === currentSong.id || (s.src && currentSong.src && s.src === currentSong.src)
    );
    const prevIndex = (currentIndex - 1 + presetSongs.length) % presetSongs.length;
    changeSong(presetSongs[prevIndex]);
  };

  // Custom song form states
  const [customTitle, setCustomTitle] = useState('');
  const [customArtist, setCustomArtist] = useState('');
  const [customUrl, setCustomUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
      const cleanName = file.name.replace(/\.[^/.]+$/, '');
      if (!customTitle) setCustomTitle(cleanName);
      if (!customArtist) setCustomArtist('Sharmila & Kishore');
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setStatusMessage('Please choose an audio file first!');
      return;
    }
    setIsProcessing(true);
    setStatusMessage('Uploading and saving audio...');
    const success = await uploadSongFile(
      selectedFile,
      customTitle || selectedFile.name.replace(/\.[^/.]+$/, ''),
      customArtist || 'Sharmila & Kishore'
    );
    setIsProcessing(false);
    if (success) {
      setStatusMessage('Song changed successfully! 💖');
      setTimeout(() => {
        setStatusMessage('');
        setShowSongModal(false);
      }, 1200);
    } else {
      setStatusMessage('Error saving song. Please try another file.');
    }
  };

  const handleUrlSubmit = async (e) => {
    e.preventDefault();
    if (!customUrl.trim()) {
      setStatusMessage('Please enter a valid audio URL!');
      return;
    }
    setIsProcessing(true);
    await changeSong({
      id: 'custom-url-' + Date.now(),
      title: customTitle.trim() || 'My Favorite Song',
      artist: customArtist.trim() || 'For Sharmila',
      src: customUrl.trim(),
      type: 'audio',
      isCustom: true
    }, true);
    setIsProcessing(false);
    setStatusMessage('Song updated! 💖');
    setTimeout(() => {
      setStatusMessage('');
      setShowSongModal(false);
    }, 1200);
  };

  const handleSelectPreset = async (preset) => {
    await changeSong(preset, true);
    setStatusMessage(`Switched to "${preset.title}" 🎶`);
    setTimeout(() => setStatusMessage(''), 1500);
  };

  const handleReset = async () => {
    await resetDefaultSong();
    setSelectedFile(null);
    setSelectedFileName('');
    setCustomTitle('');
    setCustomArtist('');
    setCustomUrl('');
    setStatusMessage('Reset to default song! 🌸');
    setTimeout(() => setStatusMessage(''), 1500);
  };

  return (
    <>
      {/* Floating Pill Player at Bottom Right */}
      <div
        style={{
          position: 'fixed',
          bottom: '22px',
          right: '22px',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }}
      >
        {/* Quick Popover Menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              style={{
                background: 'rgba(24, 8, 38, 0.95)',
                backdropFilter: 'blur(22px)',
                WebkitBackdropFilter: 'blur(22px)',
                border: '1.5px solid rgba(255, 117, 151, 0.45)',
                borderRadius: '24px',
                padding: '18px',
                width: '290px',
                boxShadow: '0 16px 45px rgba(0,0,0,0.85), 0 0 30px rgba(255, 117, 151, 0.25)',
                marginBottom: '6px'
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Disc3 size={17} color="#ff7597" className={isPlaying ? 'spin-disc' : ''} />
                  <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffb1c3', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Music Player
                  </span>
                </div>
                <button
                  onClick={toggleMute}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: isMuted ? '#94a3b8' : '#ff7597',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '4px'
                  }}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              {/* Active Song Info */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 117, 151, 0.2)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  marginBottom: '14px'
                }}
              >
                <div style={{ fontSize: '0.75rem', color: '#ff9ebb', fontWeight: 700, marginBottom: '2px' }}>
                  CURRENT SONG
                </div>
                <div style={{ fontSize: '0.92rem', fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {currentSong.title}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#c4b5fd' }}>
                  {currentSong.artist}
                </div>
                {audioError && (
                  <div style={{ fontSize: '0.7rem', color: '#fca5a5', marginTop: '4px' }}>
                    {audioError}
                  </div>
                )}
              </div>

              {/* Volume Slider */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: '#c4b5fd' }}>Vol:</span>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  style={{
                    flex: 1,
                    accentColor: '#ff7597',
                    cursor: 'pointer'
                  }}
                />
                <span style={{ fontSize: '11px', color: '#ffe4e6', minWidth: '28px', fontVariantNumeric: 'tabular-nums' }}>
                  {Math.round((isMuted ? 0 : volume) * 100)}%
                </span>
              </div>

              {/* CHANGE SONG BUTTON */}
              <button
                onClick={() => {
                  setShowSongModal(true);
                  setShowMenu(false);
                }}
                className="btn-cute"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  borderRadius: '14px',
                  marginBottom: '6px'
                }}
              >
                <Music size={15} />
                <span>Change Song / Upload MP3 🎵</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Pill Bar */}
        <motion.div
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          style={{
            background: 'rgba(26, 10, 42, 0.9)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1.5px solid rgba(255, 117, 151, 0.45)',
            borderRadius: '9999px',
            padding: '7px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: isPlaying ? '0 0 25px rgba(255, 117, 151, 0.5)' : '0 6px 20px rgba(0,0,0,0.6)',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          onClick={() => setShowMenu((prev) => !prev)}
        >
          {/* Play / Pause Toggle Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7597, #c084fc)',
              border: 'none',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 12px rgba(255, 117, 151, 0.6)',
              flexShrink: 0
            }}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
          </button>

          {/* Next Song Skip Button */}
          <button
            onClick={handleNextSong}
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              color: '#ffb1c3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0
            }}
            title="Next Tamil song ⏭️"
          >
            <SkipForward size={13} />
          </button>

          {/* Track Title & Animated Soundwave */}
          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '140px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#fff',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {currentSong.title}
              </span>
              {isPlaying && (
                <span style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '12px', flexShrink: 0 }}>
                  <span className="wave-bar wave-1" />
                  <span className="wave-bar wave-2" />
                  <span className="wave-bar wave-3" />
                </span>
              )}
            </div>
            <span style={{ fontSize: '10px', color: '#ffb1c3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {isPlaying ? currentSong.artist : 'Paused • Tap to Open'}
            </span>
          </div>

          <Heart size={15} color="#ff7597" fill={isPlaying ? '#ff7597' : 'none'} />
        </motion.div>
      </div>

      {/* CHANGE SONG MODAL */}
      <AnimatePresence>
        {showSongModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backgroundColor: 'rgba(5, 2, 12, 0.82)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)'
            }}
            onClick={() => setShowSongModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              style={{
                width: '100%',
                maxWidth: '520px',
                background: 'linear-gradient(135deg, rgba(30, 10, 48, 0.96) 0%, rgba(20, 5, 34, 0.98) 100%)',
                border: '2px solid rgba(255, 117, 151, 0.5)',
                borderRadius: '28px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 40px rgba(255, 117, 151, 0.3)',
                padding: '28px',
                color: '#fff',
                position: 'relative',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowSongModal(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
              </button>

              {/* Title Header */}
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span style={{ fontSize: '32px' }}>🎵</span>
                <h3 className="font-serif gradient-text-cute" style={{ fontSize: '1.6rem', marginTop: '6px' }}>
                  Change Our Song
                </h3>
                <p style={{ color: '#c4b5fd', fontSize: '0.88rem', marginTop: '4px' }}>
                  Choose or upload the background song that plays for Sharmila ❤️
                </p>
              </div>

              {/* Tabs */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '4px',
                  borderRadius: '16px',
                  gap: '4px',
                  marginBottom: '20px'
                }}
              >
                <button
                  onClick={() => setActiveTab('preset')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeTab === 'preset' ? 'linear-gradient(135deg, #ff7597, #c084fc)' : 'transparent',
                    color: activeTab === 'preset' ? '#fff' : '#c4b5fd',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Sparkles size={14} />
                  <span>Tamil Love Songs 🎵</span>
                </button>

                <button
                  onClick={() => setActiveTab('upload')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeTab === 'upload' ? 'linear-gradient(135deg, #ff7597, #c084fc)' : 'transparent',
                    color: activeTab === 'upload' ? '#fff' : '#c4b5fd',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Upload size={14} />
                  <span>Upload MP3</span>
                </button>

                <button
                  onClick={() => setActiveTab('url')}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: 'none',
                    background: activeTab === 'url' ? 'linear-gradient(135deg, #ff7597, #c084fc)' : 'transparent',
                    color: activeTab === 'url' ? '#fff' : '#c4b5fd',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Link size={14} />
                  <span>Song Link</span>
                </button>
              </div>

              {/* Status feedback message */}
              {statusMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: 'rgba(255, 117, 151, 0.2)',
                    border: '1px solid rgba(255, 117, 151, 0.5)',
                    borderRadius: '12px',
                    padding: '8px 14px',
                    fontSize: '0.85rem',
                    color: '#ffe4e6',
                    textAlign: 'center',
                    marginBottom: '16px'
                  }}
                >
                  {statusMessage}
                </motion.div>
              )}

              {/* TAB 1: UPLOAD MP3 FILE */}
              {activeTab === 'upload' && (
                <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* File Pick Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: '2px dashed rgba(255, 117, 151, 0.5)',
                      borderRadius: '18px',
                      padding: '24px 16px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: selectedFile ? 'rgba(255, 117, 151, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="audio/*,.mp3,.wav,.ogg,.m4a"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <Upload size={32} color="#ff7597" style={{ margin: '0 auto 8px' }} />
                    <p style={{ fontWeight: 700, fontSize: '0.95rem', color: '#ffe4e6' }}>
                      {selectedFileName ? selectedFileName : 'Click to Select Song from Your Device'}
                    </p>
                    <p style={{ fontSize: '0.78rem', color: '#c4b5fd', marginTop: '4px' }}>
                      Supports MP3, WAV, M4A audio files
                    </p>
                  </div>

                  {/* Title & Artist fields */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Song Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kadhal Sadugudu"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 117, 151, 0.3)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Artist / Dedication
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. For Sharmila"
                        value={customArtist}
                        onChange={(e) => setCustomArtist(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 117, 151, 0.3)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <p style={{ fontSize: '0.76rem', color: '#94a3b8', fontStyle: 'italic' }}>
                    💡 Pro tip: Uploaded songs are saved locally in your browser storage so they play every time you open this page!
                  </p>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-cute"
                    style={{
                      padding: '12px',
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '14px',
                      marginTop: '4px'
                    }}
                  >
                    <Check size={16} />
                    <span>{isProcessing ? 'Saving Song...' : 'Set & Play This Song 💖'}</span>
                  </button>
                </form>
              )}

              {/* TAB 2: PRESET SONGS */}
              {activeTab === 'preset' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {presetSongs.map((song) => {
                    const isSelected = currentSong.id === song.id || (song.src && currentSong.src === song.src);
                    return (
                      <button
                        key={song.id}
                        onClick={() => handleSelectPreset(song)}
                        style={{
                          background: isSelected ? 'rgba(255, 117, 151, 0.22)' : 'rgba(255, 255, 255, 0.04)',
                          border: `1.5px solid ${isSelected ? '#ff7597' : 'rgba(255, 255, 255, 0.08)'}`,
                          borderRadius: '14px',
                          padding: '12px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: '#fff',
                          textAlign: 'left',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: isSelected ? '#ffb1c3' : '#fff' }}>
                            {song.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#c4b5fd' }}>
                            {song.artist} • <span style={{ opacity: 0.8 }}>{song.description}</span>
                          </div>
                        </div>
                        {isSelected && (
                          <span style={{ color: '#fde047', fontSize: '11px', fontWeight: 800, padding: '2px 8px', background: 'rgba(253, 224, 71, 0.15)', borderRadius: '9999px' }}>
                            ACTIVE
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* TAB 3: PASTE SONG LINK */}
              {activeTab === 'url' && (
                <form onSubmit={handleUrlSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: '#ffb1c3', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                      Audio Stream / Direct MP3 Link
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/romantic-song.mp3 or /music/our-song.mp3"
                      value={customUrl}
                      onChange={(e) => setCustomUrl(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 117, 151, 0.3)',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        color: '#fff',
                        fontSize: '0.85rem'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Song Title
                      </label>
                      <input
                        type="text"
                        placeholder="Song Name"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 117, 151, 0.3)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={{ fontSize: '0.78rem', color: '#ffb1c3', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Artist
                      </label>
                      <input
                        type="text"
                        placeholder="Artist Name"
                        value={customArtist}
                        onChange={(e) => setCustomArtist(e.target.value)}
                        style={{
                          width: '100%',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 117, 151, 0.3)',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          color: '#fff',
                          fontSize: '0.85rem'
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-cute"
                    style={{
                      padding: '12px',
                      fontSize: '0.92rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      borderRadius: '14px',
                      marginTop: '4px'
                    }}
                  >
                    <Check size={16} />
                    <span>Apply Audio Link & Play</span>
                  </button>
                </form>
              )}

              {/* Bottom Reset & Permanent File Instruction */}
              <div
                style={{
                  marginTop: '22px',
                  paddingTop: '16px',
                  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.74rem', color: '#94a3b8' }}>
                  Permanent song file: <code style={{ color: '#ff7597' }}>public/music/our-song.mp3</code>
                </div>
                <button
                  onClick={handleReset}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#c4b5fd',
                    fontSize: '0.76rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px'
                  }}
                >
                  <RotateCcw size={12} />
                  <span>Reset Default</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .spin-disc {
          animation: spinDisc 4s linear infinite;
        }
        @keyframes spinDisc {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .wave-bar {
          display: inline-block;
          width: 2px;
          background: #ff7597;
          border-radius: 2px;
        }
        .wave-1 { height: 60%; animation: waveAnim 0.8s ease-in-out infinite alternate; }
        .wave-2 { height: 100%; animation: waveAnim 0.8s ease-in-out infinite 0.2s alternate; }
        .wave-3 { height: 40%; animation: waveAnim 0.8s ease-in-out infinite 0.4s alternate; }
        @keyframes waveAnim {
          0% { height: 20%; }
          100% { height: 100%; }
        }
      `}</style>
    </>
  );
};
