import { getAudioContext, createAnalyzer, getAudioLevels } from '@/lib/audioUtils';
import { useCallback } from 'react';

// Add export to the interface
export interface TextToSpeechOptions {
  language?: string;
  voice?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onAudioLevels?: (levels: number[]) => void;
}

export class TextToSpeech {
  private synth: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private options: TextToSpeechOptions;
  private analyzer: AnalyserNode | null = null;
  private audioContext: AudioContext | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private visualizerInterval: number | null = null;
  private audioDestination: MediaStreamAudioDestinationNode | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  constructor(options: TextToSpeechOptions = {}) {
    this.synth = window.speechSynthesis;
    this.options = {
      language: 'en-US',
      rate: 1,
      pitch: 1,
      volume: 0.8,
      ...options
    };

    // Load voices
    this.loadVoices();

    // Handle dynamic voice loading in some browsers
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices() {
    this.voices = this.synth.getVoices();
  }

  private setupAudioAnalysis(utterance: SpeechSynthesisUtterance) {
    // Create audio context for visualization
    this.audioContext = getAudioContext();
    this.audioDestination = this.audioContext.createMediaStreamDestination();
    this.analyzer = createAnalyzer();

    // Start visualization updates
    this.startVisualizerUpdates();
  }

  private startVisualizerUpdates() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
    }

    this.visualizerInterval = window.setInterval(() => {
      if (this.analyzer && this.options.onAudioLevels) {
        const levels = getAudioLevels(this.analyzer);
        this.options.onAudioLevels(levels);
      }
    }, 50);
  }

  private stopVisualizerUpdates() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
      this.visualizerInterval = null;
    }

    // Reset audio levels
    if (this.options.onAudioLevels) {
      this.options.onAudioLevels(Array(20).fill(0));
    }
  }

  private getVoice(): SpeechSynthesisVoice | null {
    if (this.options.voice) {
      const selectedVoice = this.voices.find(voice => voice.name === this.options.voice);
      if (selectedVoice) return selectedVoice;
    }

    // Find a voice matching the language
    const languageVoice = this.voices.find(voice =>
      voice.lang.toLowerCase().includes((this.options.language || 'es-ES').toLowerCase())
    );

    if (languageVoice) return languageVoice;

    // Fallback to the first available voice
    return this.voices.length > 0 ? this.voices[0] : null;
  }

  public speak(text: string): void {
    if (!this.synth) {
      console.error('Speech synthesis not available');
      return;
    }

    // Cancel any ongoing speech
    this.stop();

    // Create utterance
    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    // Set options
    utterance.lang = this.options.language || 'es-ES';
    utterance.rate = this.options.rate || 1;
    utterance.pitch = this.options.pitch || 1;
    utterance.volume = this.options.volume !== undefined ? this.options.volume : 0.8;

    // Set voice if available
    const voice = this.getVoice();
    if (voice) {
      utterance.voice = voice;
    }

    console.log(`Speaking with volume: ${utterance.volume}`);

    // Set up audio visualization
    this.setupAudioAnalysis(utterance);

    // Event handlers
    utterance.onstart = () => {
      console.log('Speech started');
      if (this.options.onStart) {
        this.options.onStart();
      }
    };

    utterance.onend = () => {
      console.log('Speech ended');
      this.stopVisualizerUpdates();
      this.currentUtterance = null;
      if (this.options.onEnd) {
        this.options.onEnd();
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      this.stopVisualizerUpdates();
      this.currentUtterance = null;
      if (this.options.onError) {
        this.options.onError(event);
      }
    };

    // Start speaking
    this.synth.speak(utterance);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.stopVisualizerUpdates();
      this.currentUtterance = null;
    }
  }

  public pause(): void {
    if (this.synth) {
      this.synth.pause();
    }
  }

  public resume(): void {
    if (this.synth) {
      this.synth.resume();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }

  public setOptions(options: TextToSpeechOptions): void {
    this.options = {
      ...this.options,
      ...options
    };
    console.log('Updated TTS options:', this.options);
  }

  public isSpeaking(): boolean {
    return this.synth ? this.synth.speaking : false;
  }
}

// Create and export a singleton instance
let ttsInstance: TextToSpeech | null = null;

export const getTextToSpeech = (options: TextToSpeechOptions = {}): TextToSpeech => {
  if (!ttsInstance) {
    ttsInstance = new TextToSpeech(options);
  } else if (Object.keys(options).length > 0) {
    ttsInstance.setOptions(options);
  }

  return ttsInstance;
};

export const useTextToSpeech = () => {
  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported in this browser');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }, []);

  return { speak };
};
