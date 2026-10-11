import fs from 'fs';
import path from 'path';

// Generate a gentle soothing romantic ambient chord progression (WAV format)
// 44100 Hz, 16-bit mono PCM, smooth romantic bell/piano tone
const sampleRate = 44100;
const durationSeconds = 12;
const totalSamples = sampleRate * durationSeconds;
const buffer = Buffer.alloc(44 + totalSamples * 2);

// Standard RIFF WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + totalSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20);  // PCM
buffer.writeUInt16LE(1, 22);  // mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(totalSamples * 2, 40);

// Romantic progression: Cmaj7 -> Am9 -> Fmaj7 -> Gsus4
const chordProgression = [
  [261.63, 329.63, 392.00, 493.88], // Cmaj7
  [220.00, 261.63, 329.63, 392.00], // Am7
  [174.61, 261.63, 329.63, 349.23], // Fmaj7
  [196.00, 261.63, 293.66, 392.00]  // Gsus4
];

const chordDuration = durationSeconds / chordProgression.length;

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;
  const chordIdx = Math.floor(t / chordDuration) % chordProgression.length;
  const chord = chordProgression[chordIdx];
  const localT = t % chordDuration;

  // Gentle bell envelope
  const env = Math.exp(-localT * 0.9) * Math.sin(Math.min(1, localT * 15) * Math.PI * 0.5);

  let sample = 0;
  chord.forEach((freq, idx) => {
    // Pure warmth sine + soft 2nd harmonic
    const wave = Math.sin(2 * Math.PI * freq * t) + 0.25 * Math.sin(4 * Math.PI * freq * t);
    sample += wave * 0.14 * env;
  });

  // Celestial sparkle
  sample += 0.03 * Math.sin(2 * Math.PI * 1046.5 * t) * Math.exp(-localT * 1.5);

  sample = Math.max(-1, Math.min(1, sample));
  buffer.writeInt16LE(Math.floor(sample * 32767), 44 + i * 2);
}

const outDir = path.resolve('public/music');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

fs.writeFileSync(path.join(outDir, 'our-song.wav'), buffer);
// Also save copy as .mp3 fallback link
fs.writeFileSync(path.join(outDir, 'our-song.mp3'), buffer);
console.log('Romantic soundtrack written to public/music/our-song.wav and our-song.mp3');
