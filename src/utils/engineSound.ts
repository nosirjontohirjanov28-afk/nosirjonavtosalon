import { EngineSoundType } from '../types';

class EngineAudioService {
  private ctx: AudioContext | null = null;
  private isPlaying = false;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Create an acoustic noise burst for backfires, pops, and crackles
  private triggerExhaustPop(time: number, duration: number, frequency: number, gainValue: number, ctx: AudioContext, destination: AudioNode) {
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Exponential decay noise
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.18));
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(frequency, time);
    filter.Q.setValueAtTime(3.0, time);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(gainValue, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    // Add low thump oscillator for body
    const thud = ctx.createOscillator();
    thud.type = 'triangle';
    thud.frequency.setValueAtTime(frequency * 0.4, time);
    thud.frequency.exponentialRampToValueAtTime(40, time + duration);

    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(gainValue * 0.8, time);
    thudGain.gain.exponentialRampToValueAtTime(0.001, time + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    thud.connect(thudGain);
    thudGain.connect(destination);

    noise.start(time);
    thud.start(time);
    noise.stop(time + duration);
    thud.stop(time + duration);
  }

  playRev(type: EngineSoundType = 'bmw_m5') {
    try {
      this.initContext();
      if (!this.ctx) return;
      const ctx = this.ctx;
      const now = ctx.currentTime;
      const duration = 2.6;

      const masterGain = ctx.createGain();
      masterGain.connect(ctx.destination);
      masterGain.gain.setValueAtTime(0.01, now);
      masterGain.gain.exponentialRampToValueAtTime(0.4, now + 0.3);
      masterGain.gain.exponentialRampToValueAtTime(0.32, now + 1.2);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      // ==========================================
      // 0. CHEVROLET DAMAS (0.8L 3-Cylinder SOHC F8CB)
      // ==========================================
      if (type === 'damas') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(260, now);
        filter.frequency.exponentialRampToValueAtTime(820, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(320, now + duration);
        filter.connect(masterGain);

        // Damas signature 3-cylinder purr (fast, light 55Hz -> 210Hz)
        const osc = ctx.createOscillator();
        const tick = ctx.createOscillator();
        osc.type = 'sawtooth';
        tick.type = 'triangle';

        osc.frequency.setValueAtTime(62, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.55);
        osc.frequency.exponentialRampToValueAtTime(175, now + 1.1);
        osc.frequency.exponentialRampToValueAtTime(60, now + duration);

        tick.frequency.setValueAtTime(186, now);
        tick.frequency.exponentialRampToValueAtTime(660, now + 0.55);
        tick.frequency.exponentialRampToValueAtTime(180, now + duration);

        const tickGain = ctx.createGain();
        tickGain.gain.setValueAtTime(0.12, now);
        tick.connect(tickGain);
        tickGain.connect(filter);

        osc.connect(filter);
        osc.start(now);
        tick.start(now);
        osc.stop(now + duration);
        tick.stop(now + duration);
        return;
      }

      // ==========================================
      // 1. BMW M5 CS (F90 S63 Twin-Turbo V8 + M Popcorn Crackles)
      // ==========================================
      if (type === 'bmw_m5') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(450, now);
        filter.frequency.exponentialRampToValueAtTime(2400, now + 0.65);
        filter.frequency.exponentialRampToValueAtTime(800, now + 1.4);
        filter.frequency.exponentialRampToValueAtTime(400, now + duration);
        filter.connect(masterGain);

        // V8 Screaming harmonics
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();

        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';
        subOsc.type = 'triangle';

        // Bavarian S63 V8 RPM: Idle 75Hz -> Peak 360Hz (~7200 RPM)
        osc1.frequency.setValueAtTime(75, now);
        osc1.frequency.exponentialRampToValueAtTime(360, now + 0.65);
        osc1.frequency.exponentialRampToValueAtTime(310, now + 1.1);
        osc1.frequency.exponentialRampToValueAtTime(70, now + duration);

        osc2.frequency.setValueAtTime(75.8, now);
        osc2.frequency.exponentialRampToValueAtTime(364, now + 0.65);
        osc2.frequency.exponentialRampToValueAtTime(314, now + 1.1);
        osc2.frequency.exponentialRampToValueAtTime(71, now + duration);

        subOsc.frequency.setValueAtTime(38, now);
        subOsc.frequency.exponentialRampToValueAtTime(180, now + 0.65);
        subOsc.frequency.exponentialRampToValueAtTime(35, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        subOsc.connect(filter);

        // Twin-Turbo whistle
        const turbo = ctx.createOscillator();
        const turboGain = ctx.createGain();
        turbo.type = 'sine';
        turbo.frequency.setValueAtTime(1200, now);
        turbo.frequency.exponentialRampToValueAtTime(3400, now + 0.7);
        turbo.frequency.exponentialRampToValueAtTime(1400, now + 1.3);

        turboGain.gain.setValueAtTime(0.001, now);
        turboGain.gain.exponentialRampToValueAtTime(0.08, now + 0.6);
        turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

        turbo.connect(turboGain);
        turboGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        subOsc.start(now);
        turbo.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        subOsc.stop(now + duration);
        turbo.stop(now + duration);

        // BMW M Popcorn exhaust crackles on decel (bang-bang-pop!)
        const pops = [1.18, 1.28, 1.42, 1.55, 1.72, 1.88];
        pops.forEach((popTime, index) => {
          const popPitch = index % 2 === 0 ? 420 : 580;
          const popVol = index < 3 ? 0.38 : 0.25;
          this.triggerExhaustPop(now + popTime, 0.09, popPitch, popVol, ctx, masterGain);
        });
        return;
      }

      // ==========================================
      // 2. MERCEDES-AMG G63 (4.0L Handcrafted Biturbo V8 Baritone Thug)
      // ==========================================
      if (type === 'amg_g63') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, now);
        filter.frequency.exponentialRampToValueAtTime(1250, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(420, now + 1.3);
        filter.frequency.exponentialRampToValueAtTime(260, now + duration);
        filter.connect(masterGain);

        // AMG Deep Bass rumble crossplane
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const deepBass = ctx.createOscillator();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        deepBass.type = 'sine';

        // Deep 50Hz idle -> 220Hz peak (heavy displacement muscle roar)
        osc1.frequency.setValueAtTime(48, now);
        osc1.frequency.exponentialRampToValueAtTime(220, now + 0.6);
        osc1.frequency.exponentialRampToValueAtTime(180, now + 1.1);
        osc1.frequency.exponentialRampToValueAtTime(45, now + duration);

        osc2.frequency.setValueAtTime(96, now);
        osc2.frequency.exponentialRampToValueAtTime(440, now + 0.6);
        osc2.frequency.exponentialRampToValueAtTime(360, now + 1.1);
        osc2.frequency.exponentialRampToValueAtTime(90, now + duration);

        deepBass.frequency.setValueAtTime(35, now);
        deepBass.frequency.exponentialRampToValueAtTime(110, now + 0.6);
        deepBass.frequency.exponentialRampToValueAtTime(32, now + duration);

        // Side-exhaust resonance gain
        const bassGain = ctx.createGain();
        bassGain.gain.setValueAtTime(0.5, now);
        deepBass.connect(bassGain);
        bassGain.connect(masterGain);

        osc1.connect(filter);
        osc2.connect(filter);

        osc1.start(now);
        osc2.start(now);
        deepBass.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        deepBass.stop(now + duration);

        // AMG Heavy bass gargle on decel
        const gPops = [1.25, 1.45, 1.68, 1.95];
        gPops.forEach((pTime) => {
          this.triggerExhaustPop(now + pTime, 0.12, 180, 0.42, ctx, masterGain);
        });
        return;
      }

      // ==========================================
      // 3. TOYOTA GR SUPRA (Inline-6 Turbo + "Stu-tu-tu-tu" Blow-Off Flutter)
      // ==========================================
      if (type === 'supra_turbo') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(500, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + 0.7);
        filter.frequency.exponentialRampToValueAtTime(650, now + duration);
        filter.connect(masterGain);

        // Straight-Six melodic howl
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'triangle';

        // 90Hz -> 420Hz silky Japanese 6-cylinder
        osc1.frequency.setValueAtTime(88, now);
        osc1.frequency.exponentialRampToValueAtTime(410, now + 0.65);
        osc1.frequency.exponentialRampToValueAtTime(340, now + 1.05);
        osc1.frequency.exponentialRampToValueAtTime(85, now + duration);

        osc2.frequency.setValueAtTime(176, now);
        osc2.frequency.exponentialRampToValueAtTime(820, now + 0.65);
        osc2.frequency.exponentialRampToValueAtTime(680, now + 1.05);
        osc2.frequency.exponentialRampToValueAtTime(170, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);

        // Turbo spool-up whine
        const turbo = ctx.createOscillator();
        const turboGain = ctx.createGain();
        turbo.type = 'sine';
        turbo.frequency.setValueAtTime(900, now);
        turbo.frequency.exponentialRampToValueAtTime(2800, now + 0.65);
        turbo.frequency.exponentialRampToValueAtTime(1200, now + 1.05);

        turboGain.gain.setValueAtTime(0.001, now);
        turboGain.gain.exponentialRampToValueAtTime(0.12, now + 0.65);
        turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.05);

        turbo.connect(turboGain);
        turboGain.connect(masterGain);

        osc1.start(now);
        osc2.start(now);
        turbo.start(now);

        osc1.stop(now + duration);
        osc2.stop(now + duration);
        turbo.stop(now + duration);

        // THE LEGENDARY SUPRA COMPRESSOR FLUTTER ("pshh - tsu-tsu-tu-tu!")
        const flutterStartTime = now + 1.08;
        const flutters = [
          { delay: 0.00, freq: 1600, gain: 0.28, len: 0.12 }, // Initial whoosh
          { delay: 0.13, freq: 2200, gain: 0.26, len: 0.08 }, // Tsu
          { delay: 0.22, freq: 1950, gain: 0.22, len: 0.07 }, // Tsu
          { delay: 0.30, freq: 1700, gain: 0.16, len: 0.06 }, // Tu
          { delay: 0.37, freq: 1450, gain: 0.10, len: 0.05 }  // Tu
        ];

        flutters.forEach((fl) => {
          const bufferSize = Math.floor(ctx.sampleRate * fl.len);
          const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
          }
          const src = ctx.createBufferSource();
          src.buffer = buffer;

          const bpf = ctx.createBiquadFilter();
          bpf.type = 'bandpass';
          bpf.frequency.setValueAtTime(fl.freq, flutterStartTime + fl.delay);
          bpf.Q.setValueAtTime(4.5, flutterStartTime + fl.delay);

          const flGain = ctx.createGain();
          flGain.gain.setValueAtTime(fl.gain, flutterStartTime + fl.delay);
          flGain.gain.exponentialRampToValueAtTime(0.001, flutterStartTime + fl.delay + fl.len);

          src.connect(bpf);
          bpf.connect(flGain);
          flGain.connect(masterGain);

          src.start(flutterStartTime + fl.delay);
          src.stop(flutterStartTime + fl.delay + fl.len);
        });
        return;
      }

      // ==========================================
      // 4. NISSAN GT-R NISMO (Godzilla VR38DETT + 2-Step Rev Limiter)
      // ==========================================
      if (type === 'nissan_gtr') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(3200, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(800, now + 1.5);
        filter.connect(masterGain);

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'sawtooth';

        // 80Hz -> 380Hz high-frequency racing V6
        osc1.frequency.setValueAtTime(80, now);
        osc1.frequency.exponentialRampToValueAtTime(390, now + 0.55);
        osc1.frequency.exponentialRampToValueAtTime(370, now + 1.0);
        osc1.frequency.exponentialRampToValueAtTime(80, now + duration);

        osc2.frequency.setValueAtTime(160, now);
        osc2.frequency.exponentialRampToValueAtTime(780, now + 0.55);
        osc2.frequency.exponentialRampToValueAtTime(740, now + 1.0);
        osc2.frequency.exponentialRampToValueAtTime(160, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);

        // 2-Step Launch Control Limiter stutter at peak (TAT-TAT-TAT-TAT!)
        const limiterStart = now + 0.65;
        for (let i = 0; i < 5; i++) {
          this.triggerExhaustPop(limiterStart + i * 0.08, 0.05, 750, 0.45, ctx, masterGain);
        }
        return;
      }

      // ==========================================
      // 5. CHEVROLET GENTRA (1.5L DOHC 16V GM Uzbekistan)
      // ==========================================
      if (type === 'gentra') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(280, now);
        filter.frequency.exponentialRampToValueAtTime(750, now + 0.65);
        filter.frequency.exponentialRampToValueAtTime(350, now + duration);
        filter.connect(masterGain);

        // Smooth 4-cylinder engine (68Hz -> 210Hz)
        const osc1 = ctx.createOscillator();
        const sub = ctx.createOscillator();
        osc1.type = 'triangle';
        sub.type = 'sawtooth';

        osc1.frequency.setValueAtTime(68, now);
        osc1.frequency.exponentialRampToValueAtTime(210, now + 0.65);
        osc1.frequency.exponentialRampToValueAtTime(160, now + 1.2);
        osc1.frequency.exponentialRampToValueAtTime(68, now + duration);

        sub.frequency.setValueAtTime(34, now);
        sub.frequency.exponentialRampToValueAtTime(105, now + 0.65);
        sub.frequency.exponentialRampToValueAtTime(34, now + duration);

        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.25, now);
        sub.connect(subGain);
        subGain.connect(filter);

        osc1.connect(filter);

        osc1.start(now);
        sub.start(now);
        osc1.stop(now + duration);
        sub.stop(now + duration);
        return;
      }

      // ==========================================
      // 6. CHEVROLET COBALT (1.5L B15D2 16V Chain-Drive)
      // ==========================================
      if (type === 'cobalt') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, now);
        filter.frequency.exponentialRampToValueAtTime(850, now + 0.6);
        filter.frequency.exponentialRampToValueAtTime(380, now + duration);
        filter.connect(masterGain);

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(72, now);
        osc.frequency.exponentialRampToValueAtTime(225, now + 0.6);
        osc.frequency.exponentialRampToValueAtTime(70, now + duration);

        // Timing chain metallic purr
        const chain = ctx.createOscillator();
        chain.type = 'triangle';
        chain.frequency.setValueAtTime(280, now);
        chain.frequency.exponentialRampToValueAtTime(780, now + 0.6);
        chain.frequency.exponentialRampToValueAtTime(270, now + duration);

        const chainGain = ctx.createGain();
        chainGain.gain.setValueAtTime(0.08, now);
        chain.connect(chainGain);
        chainGain.connect(masterGain);

        osc.connect(filter);

        osc.start(now);
        chain.start(now);
        osc.stop(now + duration);
        chain.stop(now + duration);
        return;
      }

      // ==========================================
      // 7. CHEVROLET TRACKER 2 (1.2L E-Turbo 3-Cylinder Syncopated Thrum)
      // ==========================================
      if (type === 'tracker') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(360, now);
        filter.frequency.exponentialRampToValueAtTime(1100, now + 0.65);
        filter.frequency.exponentialRampToValueAtTime(420, now + duration);
        filter.connect(masterGain);

        // 3-cylinder distinct firing rhythm
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(58, now);
        osc.frequency.exponentialRampToValueAtTime(260, now + 0.65);
        osc.frequency.exponentialRampToValueAtTime(55, now + duration);

        // Light turbocharger spool
        const turbo = ctx.createOscillator();
        turbo.type = 'sine';
        turbo.frequency.setValueAtTime(800, now);
        turbo.frequency.exponentialRampToValueAtTime(2100, now + 0.65);
        turbo.frequency.exponentialRampToValueAtTime(800, now + 1.3);

        const turboGain = ctx.createGain();
        turboGain.gain.setValueAtTime(0.001, now);
        turboGain.gain.exponentialRampToValueAtTime(0.06, now + 0.65);
        turboGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        turbo.connect(turboGain);
        turboGain.connect(masterGain);

        osc.connect(filter);
        osc.start(now);
        turbo.start(now);
        osc.stop(now + duration);
        turbo.stop(now + duration);
        return;
      }

      // ==========================================
      // 8. CHEVROLET LACETTI (1.8L DOHC Sport Resonator)
      // ==========================================
      if (type === 'lacetti') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(340, now);
        filter.frequency.exponentialRampToValueAtTime(950, now + 0.7);
        filter.frequency.exponentialRampToValueAtTime(360, now + duration);
        filter.connect(masterGain);

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(74, now);
        osc.frequency.exponentialRampToValueAtTime(245, now + 0.7);
        osc.frequency.exponentialRampToValueAtTime(72, now + duration);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + duration);
        return;
      }

      // ==========================================
      // 9. CHEVROLET MALIBU 2 (2.0L Turbo 253 HP American Tone)
      // ==========================================
      if (type === 'malibu') {
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(380, now);
        filter.frequency.exponentialRampToValueAtTime(1450, now + 0.65);
        filter.frequency.exponentialRampToValueAtTime(450, now + duration);
        filter.connect(masterGain);

        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(285, now + 0.65);
        osc.frequency.exponentialRampToValueAtTime(62, now + duration);

        osc.connect(filter);
        osc.start(now);
        osc.stop(now + duration);

        this.triggerExhaustPop(now + 1.2, 0.08, 320, 0.2, ctx, masterGain);
        return;
      }

      // ==========================================
      // 10. BYD SONG PLUS (DM-i Dual Mode Hybrid & EV Inverter Whine)
      // ==========================================
      if (type === 'byd_hybrid') {
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        osc.type = 'sine';
        osc2.type = 'triangle';

        // Electric high-frequency inverter acceleration
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(2600, now + 0.8);
        osc.frequency.exponentialRampToValueAtTime(500, now + duration);

        osc2.frequency.setValueAtTime(840, now);
        osc2.frequency.exponentialRampToValueAtTime(3800, now + 0.8);
        osc2.frequency.exponentialRampToValueAtTime(1000, now + duration);

        const bGain = ctx.createGain();
        bGain.gain.setValueAtTime(0.25, now);
        osc.connect(bGain);
        osc2.connect(bGain);
        bGain.connect(masterGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + duration);
        osc2.stop(now + duration);
        return;
      }

    } catch (e) {
      console.warn('Audio Context error:', e);
    }
  }
}

export function getEngineSoundLabel(type: EngineSoundType): { title: string; subtitle: string; icon: string } {
  switch (type) {
    case 'damas':
      return {
        title: 'Chevrolet Damas 0.8L',
        subtitle: 'Xalqona 0.8L 3-silindrli tejamkor motor tovushi',
        icon: '🚐'
      };
    case 'bmw_m5':
      return {
        title: 'BMW M5 V8 Twin-Turbo',
        subtitle: 'S63 635 ot kuchi + M-Sport Popcorn crackles!',
        icon: '🔥'
      };
    case 'amg_g63':
      return {
        title: 'Mercedes-AMG G63 V8 Biturbo',
        subtitle: 'Handcrafted AMG bariton gumburlagan baquvvat ovoz!',
        icon: '⚡'
      };
    case 'supra_turbo':
      return {
        title: 'Toyota GR Supra 3.0 Turbo',
        subtitle: 'Straight-6 + Blow-off klapan "Stu-tu-tu-tu" flattery!',
        icon: '💨'
      };
    case 'nissan_gtr':
      return {
        title: 'Nissan GT-R Nismo VR38DETT',
        subtitle: 'Godzilla V6 poyga motori + Launch Control 2-Step!',
        icon: '🏎️'
      };
    case 'gentra':
      return {
        title: 'Chevrolet Gentra 1.5 DOHC',
        subtitle: "O'zbekistonning sevimli 1.5L 16V motor tovushi",
        icon: '🚗'
      };
    case 'cobalt':
      return {
        title: 'Chevrolet Cobalt 1.5 LTZ',
        subtitle: 'Zanjirli B15D2 16V tejamkor motor ovozi',
        icon: '🚗'
      };
    case 'tracker':
      return {
        title: 'Chevrolet Tracker 2 E-Turbo',
        subtitle: '1.2 Turbo 3-silindrli baquvvat pulsatsiya',
        icon: '🌀'
      };
    case 'lacetti':
      return {
        title: 'Chevrolet Lacetti CDX 1.8',
        subtitle: 'Afsonaviy E-TEC II 1.8 DOHC kuchli motor',
        icon: '🚘'
      };
    case 'malibu':
      return {
        title: 'Chevrolet Malibu 2 Turbo',
        subtitle: '2.0L Turbo 253 ot kuchi biznes klass baritoni',
        icon: '🚀'
      };
    case 'byd_hybrid':
      return {
        title: 'BYD Song Plus DM-i Gibrid',
        subtitle: 'Elektr invertor va Blade gibrid futuristik ovozi',
        icon: '⚡'
      };
    default:
      return {
        title: 'Avtomobil motori',
        subtitle: 'Dvigatel ovozi',
        icon: '🚗'
      };
  }
}

export const engineSound = new EngineAudioService();
