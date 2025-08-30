/**
 * 🔊 UI Sounds - TASK-014
 * أصوات واجهة خفيفة للتفاعلات
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: Map<string, AudioBuffer> = new Map();
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    this.initAudioContext();
    this.loadSounds();
  }

  private initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn('🔇 Audio not supported');
    }
  }

  private async loadSounds() {
    const soundDefinitions = {
      success: this.generateTone(800, 0.1, 'sine'),
      error: this.generateTone(300, 0.2, 'sawtooth'),
      click: this.generateTone(1000, 0.05, 'square'),
      notification: this.generateTone(600, 0.15, 'sine'),
      hover: this.generateTone(1200, 0.03, 'sine'),
      complete: this.generateChord([523, 659, 784], 0.3),
      warning: this.generateTone(400, 0.25, 'triangle')
    };

    for (const [name, audioBuffer] of Object.entries(soundDefinitions)) {
      this.sounds.set(name, audioBuffer);
    }
  }

  private generateTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
    if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;

      switch (type) {
        case 'sine':
          sample = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
          break;
        case 'sawtooth':
          sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          sample = 2 * Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) - 1;
          break;
      }

      // تطبيق envelope للتلاشي
      const envelope = Math.exp(-t * 3);
      channelData[i] = sample * envelope * this.volume;
    }

    return buffer;
  }

  private generateChord(frequencies: number[], duration: number): AudioBuffer {
    if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 });

    const sampleRate = this.audioContext.sampleRate;
    const frameCount = sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
    const channelData = buffer.getChannelData(0);

    for (let i = 0; i < frameCount; i++) {
      const t = i / sampleRate;
      let sample = 0;

      frequencies.forEach(freq => {
        sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length;
      });

      const envelope = Math.exp(-t * 2);
      channelData[i] = sample * envelope * this.volume;
    }

    return buffer;
  }

  async play(soundName: string): Promise<void> {
    if (!this.enabled || !this.audioContext || !this.sounds.has(soundName)) {
      return;
    }

    try {
      // استئناف AudioContext إذا كان معلقاً
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const buffer = this.sounds.get(soundName)!;
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();

      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      gainNode.gain.value = this.volume;

      source.start();
    } catch (error) {
      console.warn(`🔇 Failed to play sound: ${soundName}`, error);
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
    localStorage.setItem('ui-sounds-enabled', enabled.toString());
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('ui-sounds-volume', this.volume.toString());
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }

  // تحميل الإعدادات المحفوظة
  loadSettings() {
    const savedEnabled = localStorage.getItem('ui-sounds-enabled');
    const savedVolume = localStorage.getItem('ui-sounds-volume');

    if (savedEnabled !== null) {
      this.enabled = savedEnabled === 'true';
    }

    if (savedVolume !== null) {
      this.volume = parseFloat(savedVolume);
    }
  }
}

// إنشاء مدير الأصوات العام
export const soundManager = new SoundManager();

// تحميل الإعدادات عند البدء
soundManager.loadSettings();

// دوال مساعدة للاستخدام السهل
export const playSounds = {
  success: () => soundManager.play('success'),
  error: () => soundManager.play('error'),
  click: () => soundManager.play('click'),
  notification: () => soundManager.play('notification'),
  hover: () => soundManager.play('hover'),
  complete: () => soundManager.play('complete'),
  warning: () => soundManager.play('warning')
};

// Hook للاستخدام في React
export const useSounds = () => {
  return {
    play: (soundName: string) => soundManager.play(soundName),
    setEnabled: (enabled: boolean) => soundManager.setEnabled(enabled),
    setVolume: (volume: number) => soundManager.setVolume(volume),
    isEnabled: () => soundManager.isEnabled(),
    getVolume: () => soundManager.getVolume(),
    sounds: playSounds
  };
};

// تصدير أنواع الأصوات
export const SoundTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  CLICK: 'click',
  NOTIFICATION: 'notification',
  HOVER: 'hover',
  COMPLETE: 'complete',
  WARNING: 'warning'
} as const;