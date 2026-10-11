import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { loveData } from '../data/loveData';
import { saveAudioToStorage, getAudioFromStorage, clearAudioFromStorage } from '../utils/audioStorage';

const AudioContext = createContext(null);

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [audioError, setAudioError] = useState(null);

  // Active song object: { id, title, artist, src, type: 'audio' | 'synth', synthMood: 'cute', isCustom: boolean }
  const [currentSong, setCurrentSong] = useState(() => {
    try {
      const saved = localStorage.getItem('sharmila_custom_song_meta');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.isCustom) {
          return parsed;
        }
      }
    } catch (e) {}
    return {
      id: 'adiye-en-chellam',
      title: loveData.music.title,
      artist: loveData.music.artist,
      src: loveData.music.src,
      type: 'audio',
      synthMood: 'cute',
      isCustom: false
    };
  });

  const audioElementRef = useRef(null);
  const audioCtxRef = useRef(null);
  const synthIntervalRef = useRef(null);
  const activeBlobUrlRef = useRef(null);

  // Initialize Audio Element
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.volume = isMuted ? 0 : volume;

    audio.onplay = () => setIsPlaying(true);
    audio.onpause = () => setIsPlaying(false);
    audio.onerror = (e) => {
      console.warn('Audio playback error on source:', audio.src, e);
      setAudioError('Could not load audio source. Switched to romantic synth.');
      // Auto fallback to sweet synth loop if file doesn't exist
      if (isPlaying) {
        startSynthLoop(currentSong.synthMood || 'romantic');
      }
    };

    audioElementRef.current = audio;

    // Load saved song from IndexedDB on startup if available
    const initSavedAudio = async () => {
      try {
        const stored = await getAudioFromStorage();
        if (stored && stored.blob) {
          if (activeBlobUrlRef.current) {
            URL.revokeObjectURL(activeBlobUrlRef.current);
          }
          const blobUrl = URL.createObjectURL(stored.blob);
          activeBlobUrlRef.current = blobUrl;
          const updatedSong = {
            id: 'indexeddb-custom',
            title: stored.title || 'Our Special Song',
            artist: stored.artist || 'Sharmila & Kishore',
            src: blobUrl,
            type: 'audio',
            synthMood: 'romantic',
            isCustom: true
          };
          setCurrentSong(updatedSong);
          if (audioElementRef.current) {
            audioElementRef.current.src = blobUrl;
          }
          return;
        }
      } catch (err) {
        console.warn('Error reading saved audio blob:', err);
      }

      // If no indexeddb blob, set initial src to currentSong.src if type === 'audio'
      if (currentSong.type === 'audio' && currentSong.src && audioElementRef.current) {
        audioElementRef.current.src = currentSong.src;
      }
    };

    initSavedAudio();

    return () => {
      audio.pause();
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
      if (synthIntervalRef.current) {
        clearInterval(synthIntervalRef.current);
      }
    };
  }, []);

  // Sync volume & mute to audio element
  useEffect(() => {
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Web Audio Context for Synth & SFX
  const getAudioContext = () => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }
      return audioCtxRef.current;
    } catch (e) {
      return null;
    }
  };

  // Sound effects generator
  const playPopSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      gain.gain.setValueAtTime(volume * 0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    } catch (e) {}
  };

  const playHeartCollectSound = (step = 0) => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const notes = [523.25, 587.33, 659.25, 698.46, 783.99, 880.00, 987.77, 1046.50];
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(notes[step % notes.length], now);
      gain.gain.setValueAtTime(volume * 0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.32);
    } catch (e) {}
  };

  const playChimeSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      [1046.5, 1318.51, 1567.98].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(volume * 0.25, now + i * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.65);
      });
    } catch (e) {}
  };

  const playBlowCandleSound = () => {
    const ctx = getAudioContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch (e) {}
  };

  // Synth loops for procedural music
  const startSynthLoop = (mood = 'romantic') => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
    }
    const ctx = getAudioContext();
    if (!ctx) return;

    let step = 0;
    let notes = [];
    let speedMs = 700;
    let waveType = 'sine';

    if (mood === 'cute') {
      notes = [523.25, 659.25, 783.99, 880.0, 1046.5, 880.0, 783.99, 659.25];
      speedMs = 600;
      waveType = 'triangle';
    } else if (mood === 'romantic') {
      notes = [261.63, 329.63, 392.0, 493.88, 440.0, 523.25, 392.0, 349.23];
      speedMs = 750;
      waveType = 'sine';
    } else if (mood === 'emotional') {
      notes = [220.0, 261.63, 329.63, 440.0, 349.23, 440.0, 523.25, 392.0];
      speedMs = 900;
      waveType = 'sine';
    } else if (mood === 'celebration') {
      notes = [523.25, 523.25, 587.33, 523.25, 698.46, 659.25, 523.25, 783.99];
      speedMs = 450;
      waveType = 'triangle';
    }

    synthIntervalRef.current = setInterval(() => {
      if (isMuted) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(notes[step % notes.length], now);

      const curVol = isMuted ? 0 : volume * 0.15;
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(curVol, now + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (speedMs / 1000) * 1.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + (speedMs / 1000) * 1.6);
      step++;
    }, speedMs);
  };

  const stopSynthLoop = () => {
    if (synthIntervalRef.current) {
      clearInterval(synthIntervalRef.current);
      synthIntervalRef.current = null;
    }
  };

  // Play current song
  const playMusic = async () => {
    setHasInteracted(true);
    setAudioError(null);

    if (currentSong.type === 'synth') {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setIsPlaying(true);
      startSynthLoop(currentSong.synthMood || 'romantic');
      return;
    }

    // Audio file playback
    stopSynthLoop();
    if (!audioElementRef.current) return;

    try {
      if (audioElementRef.current.src !== currentSong.src && currentSong.src) {
        audioElementRef.current.src = currentSong.src;
      }
      audioElementRef.current.volume = isMuted ? 0 : volume;
      await audioElementRef.current.play();
      setIsPlaying(true);
    } catch (err) {
      console.warn('Autoplay or file load failed, falling back to synth:', err);
      // Graceful fallback to procedural synth
      startSynthLoop(currentSong.synthMood || 'romantic');
      setIsPlaying(true);
    }
  };

  // Pause music
  const pauseMusic = () => {
    setIsPlaying(false);
    stopSynthLoop();
    if (audioElementRef.current) {
      audioElementRef.current.pause();
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseMusic();
    } else {
      playMusic();
    }
  };

  // Change to a new song object
  const changeSong = async (songConfig, autoPlay = true) => {
    setAudioError(null);
    const newSong = {
      id: songConfig.id || 'custom-' + Date.now(),
      title: songConfig.title || 'Our Special Song',
      artist: songConfig.artist || 'Sharmila & Kishore',
      src: songConfig.src || '',
      type: songConfig.type || (songConfig.src ? 'audio' : 'synth'),
      synthMood: songConfig.synthMood || 'romantic',
      isCustom: songConfig.isCustom ?? true
    };

    setCurrentSong(newSong);

    // Save metadata to localStorage
    try {
      localStorage.setItem('sharmila_custom_song_meta', JSON.stringify({
        id: newSong.id,
        title: newSong.title,
        artist: newSong.artist,
        src: newSong.src.startsWith('blob:') ? '' : newSong.src,
        type: newSong.type,
        synthMood: newSong.synthMood,
        isCustom: newSong.isCustom
      }));
    } catch (e) {}

    // Setup playback
    if (newSong.type === 'audio' && audioElementRef.current && newSong.src) {
      stopSynthLoop();
      audioElementRef.current.src = newSong.src;
      if (autoPlay || isPlaying) {
        try {
          await audioElementRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn('Playback error:', err);
          startSynthLoop(newSong.synthMood);
          setIsPlaying(true);
        }
      }
    } else if (newSong.type === 'synth') {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      if (autoPlay || isPlaying) {
        setIsPlaying(true);
        startSynthLoop(newSong.synthMood);
      }
    }
  };

  // Upload an MP3/WAV/Audio file from user's machine
  const uploadSongFile = async (file, customTitle, customArtist) => {
    if (!file) return;

    try {
      const cleanFileName = file.name.replace(/\.[^/.]+$/, '');
      const title = customTitle || cleanFileName;
      const artist = customArtist || 'Sharmila & Kishore';

      // Save to IndexedDB for persistent storage across refreshes
      await saveAudioToStorage(file, { title, artist, fileName: file.name });

      // Create instant Object URL
      if (activeBlobUrlRef.current) {
        URL.revokeObjectURL(activeBlobUrlRef.current);
      }
      const blobUrl = URL.createObjectURL(file);
      activeBlobUrlRef.current = blobUrl;

      await changeSong({
        id: 'uploaded-custom',
        title,
        artist,
        src: blobUrl,
        type: 'audio',
        synthMood: 'romantic',
        isCustom: true
      }, true);

      return true;
    } catch (err) {
      console.error('Failed to upload song:', err);
      setAudioError('Failed to process audio file: ' + err.message);
      return false;
    }
  };

  // Reset to default song configuration
  const resetDefaultSong = async () => {
    await clearAudioFromStorage();
    if (activeBlobUrlRef.current) {
      URL.revokeObjectURL(activeBlobUrlRef.current);
      activeBlobUrlRef.current = null;
    }
    localStorage.removeItem('sharmila_custom_song_meta');

    const defaultSong = {
      id: 'default-our-song',
      title: loveData.music.title,
      artist: loveData.music.artist,
      src: loveData.music.src,
      type: 'audio',
      synthMood: 'cute',
      isCustom: false
    };

    await changeSong(defaultSong, isPlaying);
  };

  // Switch mood (for backwards compatibility with section mood transitions)
  const switchTrack = (moodId) => {
    // Only auto-switch if user hasn't explicitly locked in a custom audio file, or if they are in synth mode
    if (currentSong.type === 'synth' || !currentSong.src) {
      setCurrentSong((prev) => ({
        ...prev,
        type: 'synth',
        synthMood: moodId
      }));
      if (isPlaying) {
        startSynthLoop(moodId);
      }
    }
  };

  const setVolume = (val) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioElementRef.current) {
      audioElementRef.current.volume = isMuted ? 0 : clamped;
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        currentSong,
        currentTrack: {
          id: currentSong.synthMood || currentSong.id,
          title: currentSong.title,
          artist: currentSong.artist,
          mood: currentSong.type === 'audio' ? '🎵 Custom Audio Track' : '✨ Ambient Synth Melodies'
        },
        volume,
        isMuted,
        hasInteracted,
        audioError,
        presetSongs: loveData.presetSongs || [],
        playMusic,
        pauseMusic,
        togglePlay,
        switchTrack,
        changeSong,
        uploadSongFile,
        resetDefaultSong,
        setVolume,
        toggleMute,
        playPopSound,
        playHeartCollectSound,
        playChimeSound,
        playBlowCandleSound
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
