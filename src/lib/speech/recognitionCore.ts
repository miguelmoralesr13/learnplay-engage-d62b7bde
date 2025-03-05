
// Core functionality for speech recognition
import { getAudioContext } from '@/lib/audioUtils';

// Types
interface SpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  onResult?: (text: string, isFinal: boolean) => void;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: any) => void;
  onAudioLevels?: (levels: number[]) => void;
}

// Core recognition class
export class SpeechRecognitionCore {
  protected recognition: SpeechRecognition | null = null;
  protected options: SpeechRecognitionOptions;

  constructor(options: SpeechRecognitionOptions = {}) {
    this.options = {
      language: 'es-ES',
      continuous: false,
      interimResults: true,
      ...options
    };

    this.initRecognition();
  }

  protected initRecognition() {
    // Check browser support for SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.error('Speech recognition not supported in this browser');
      return;
    }

    this.recognition = new SpeechRecognition();

    // Configure recognition
    this.recognition.lang = this.options.language || 'es-ES';
    this.recognition.continuous = this.options.continuous || false;
    this.recognition.interimResults = this.options.interimResults || true;
  }

  protected handleStart() {
    console.log('Speech recognition started');
    if (this.options.onStart) {
      this.options.onStart();
    }
  }

  protected handleEnd() {
    console.log('Speech recognition ended');
    if (this.options.onEnd) {
      this.options.onEnd();
    }
  }

  protected handleError(event: any) {
    console.error('Speech recognition error:', event.error);
    if (this.options.onError) {
      this.options.onError(event.error);
    }
  }

  protected handleResult(event: SpeechRecognitionEvent) {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      const transcript = event.results[i][0].transcript;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
      } else {
        interimTranscript += transcript;
      }
    }

    // If we have final results
    if (finalTranscript && this.options.onResult) {
      this.options.onResult(finalTranscript, true);
    }
    // If we have interim results
    else if (interimTranscript && this.options.onResult) {
      this.options.onResult(interimTranscript, false);
    }
  }

  // Public methods
  public setLanguage(language: string) {
    this.options.language = language;
    if (this.recognition) {
      this.recognition.lang = language;
    }
  }
}

export type { SpeechRecognitionOptions };
