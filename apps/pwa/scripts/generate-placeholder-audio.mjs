/**
 * Generate placeholder audio files for development
 * These are simple synthesized sounds that will work until real audio assets are added
 */

import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const audioDir = join(__dirname, '../public/audio');

// Ensure directories exist
['wood', 'fabric', 'stone'].forEach(env => {
  mkdirSync(join(audioDir, env), { recursive: true });
});

/**
 * Generate a WAV file buffer with synthesized audio
 */
function generateWav(options) {
  const {
    duration = 1,        // seconds
    sampleRate = 44100,
    frequency = 440,     // Hz
    type = 'sine',       // sine, square, noise, click
    envelope = true,     // apply fade in/out
    volume = 0.5,
  } = options;

  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2); // 16-bit mono

  // WAV header
  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);          // Subchunk1Size
  buffer.writeUInt16LE(1, 20);           // AudioFormat (PCM)
  buffer.writeUInt16LE(1, 22);           // NumChannels
  buffer.writeUInt32LE(sampleRate, 24);  // SampleRate
  buffer.writeUInt32LE(sampleRate * 2, 28); // ByteRate
  buffer.writeUInt16LE(2, 32);           // BlockAlign
  buffer.writeUInt16LE(16, 34);          // BitsPerSample
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  // Generate audio data
  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    switch (type) {
      case 'sine':
        sample = Math.sin(2 * Math.PI * frequency * t);
        break;
      case 'square':
        sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
        break;
      case 'noise':
        sample = Math.random() * 2 - 1;
        break;
      case 'click':
        // Short burst at the start
        if (t < 0.02) {
          sample = Math.sin(2 * Math.PI * frequency * t) * (1 - t / 0.02);
        }
        break;
      case 'rumble':
        // Low frequency with noise
        sample = Math.sin(2 * Math.PI * 60 * t) * 0.7 + (Math.random() * 2 - 1) * 0.3;
        break;
      case 'ambience':
        // Layered low-frequency drones
        sample =
          Math.sin(2 * Math.PI * 80 * t) * 0.3 +
          Math.sin(2 * Math.PI * 120 * t) * 0.2 +
          Math.sin(2 * Math.PI * 180 * t) * 0.1 +
          (Math.random() * 2 - 1) * 0.15;
        break;
    }

    // Apply envelope
    if (envelope) {
      const attackTime = 0.01;
      const releaseTime = 0.1;
      const attackSamples = attackTime * sampleRate;
      const releaseSamples = releaseTime * sampleRate;

      if (i < attackSamples) {
        sample *= i / attackSamples;
      } else if (i > numSamples - releaseSamples) {
        sample *= (numSamples - i) / releaseSamples;
      }
    }

    // Apply volume and convert to 16-bit
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * volume * 32767)));
    buffer.writeInt16LE(intSample, 44 + i * 2);
  }

  return buffer;
}

// Generate audio files for each environment

// Wood sounds
console.log('Generating wood sounds...');
writeFileSync(
  join(audioDir, 'wood/spin-loop.wav'),
  generateWav({ duration: 2, type: 'rumble', frequency: 100, volume: 0.4 })
);
writeFileSync(
  join(audioDir, 'wood/settle.wav'),
  generateWav({ duration: 0.3, type: 'click', frequency: 800, volume: 0.6 })
);
writeFileSync(
  join(audioDir, 'wood/tap-1.wav'),
  generateWav({ duration: 0.1, type: 'click', frequency: 600, volume: 0.5 })
);
writeFileSync(
  join(audioDir, 'wood/tap-2.wav'),
  generateWav({ duration: 0.1, type: 'click', frequency: 700, volume: 0.5 })
);
writeFileSync(
  join(audioDir, 'wood/tap-3.wav'),
  generateWav({ duration: 0.1, type: 'click', frequency: 550, volume: 0.5 })
);
writeFileSync(
  join(audioDir, 'wood/ambience.wav'),
  generateWav({ duration: 10, type: 'ambience', volume: 0.2 })
);

// Fabric sounds (softer)
console.log('Generating fabric sounds...');
writeFileSync(
  join(audioDir, 'fabric/spin-loop.wav'),
  generateWav({ duration: 2, type: 'noise', volume: 0.2 })
);
writeFileSync(
  join(audioDir, 'fabric/settle.wav'),
  generateWav({ duration: 0.2, type: 'click', frequency: 400, volume: 0.4 })
);
writeFileSync(
  join(audioDir, 'fabric/tap-1.wav'),
  generateWav({ duration: 0.08, type: 'click', frequency: 300, volume: 0.3 })
);
writeFileSync(
  join(audioDir, 'fabric/tap-2.wav'),
  generateWav({ duration: 0.08, type: 'click', frequency: 350, volume: 0.3 })
);
writeFileSync(
  join(audioDir, 'fabric/tap-3.wav'),
  generateWav({ duration: 0.08, type: 'click', frequency: 280, volume: 0.3 })
);
writeFileSync(
  join(audioDir, 'fabric/ambience.wav'),
  generateWav({ duration: 10, type: 'ambience', volume: 0.15 })
);

// Stone sounds (harder)
console.log('Generating stone sounds...');
writeFileSync(
  join(audioDir, 'stone/spin-loop.wav'),
  generateWav({ duration: 2, type: 'rumble', frequency: 150, volume: 0.5 })
);
writeFileSync(
  join(audioDir, 'stone/settle.wav'),
  generateWav({ duration: 0.4, type: 'click', frequency: 1200, volume: 0.7 })
);
writeFileSync(
  join(audioDir, 'stone/tap-1.wav'),
  generateWav({ duration: 0.12, type: 'click', frequency: 900, volume: 0.6 })
);
writeFileSync(
  join(audioDir, 'stone/tap-2.wav'),
  generateWav({ duration: 0.12, type: 'click', frequency: 1000, volume: 0.6 })
);
writeFileSync(
  join(audioDir, 'stone/tap-3.wav'),
  generateWav({ duration: 0.12, type: 'click', frequency: 850, volume: 0.6 })
);
writeFileSync(
  join(audioDir, 'stone/ambience.wav'),
  generateWav({ duration: 10, type: 'ambience', volume: 0.25 })
);

console.log('Done! Placeholder audio files generated.');
