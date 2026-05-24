import { INSTRUMENT_MAP } from "../../../../assets/audio/instrument.map.js";
import { NOTE_FREQUENCIES } from "../../../../assets/audio/musics/notes/noteFrequencies.js";

export class MusicPlayer {
  constructor() {
    this.audioContext = new AudioContext();
    this.isPlaying = false;
    this.oscillators = [];
    this.initialized = false;
  }

  async init() {
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    this.initialized = true;
  }

  ensureAudioReady() {
    if (this.audioContext.state !== "running") {
      this.audioContext.resume();
    }
  }

  playNote(noteName, duration, instrument) {
    const freq = NOTE_FREQUENCIES[noteName];
    if (!freq) return;

    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();

    osc.type = INSTRUMENT_MAP[instrument] ?? "square";
    osc.frequency.value = freq;

    const now = this.audioContext.currentTime;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(1, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.start(now);
    osc.stop(now + duration);
  }

  noteToSeconds(duration, tempo) {
    const beat = 60 / tempo;
    return beat * (duration / 4);
  }

  playSong(song) {
    this.stop();
    this.isPlaying = true;

    song.channels.forEach((channel) => {
      let timeCursor = 0;

      channel.notes.forEach((step) => {
        const durationSec = this.noteToSeconds(step.duration, song.tempo);

        const start = this.audioContext.currentTime + timeCursor;

        this.playNote(step.note, durationSec, channel.instrument, start);

        timeCursor += durationSec;
      });
    });
  }

  stop() {
    this.isPlaying = false;

    this.oscillators.forEach((o) => {
      try {
        o.stop();
        o.disconnect();
      } catch {}
    });

    this.oscillators = [];
  }

  update() {
    for (const ch of this.channels) {
      ch.tick++;

      if (ch.tick >= ch.delay) {
        this.playNextNote(ch);
      }

      this.applyEffects(ch);
    }
  }
}
