
// Complete speech recognizer with visualization
import { SpeechRecognitionCore, SpeechRecognitionOptions } from './recognitionCore';
import { AudioVisualizer } from './visualizerHelper';

export class SpeechRecognizer extends SpeechRecognitionCore {
  private visualizer: AudioVisualizer;
  
  constructor(options: SpeechRecognitionOptions = {}) {
    super(options);
    this.visualizer = new AudioVisualizer();
    
    // Set up event handlers
    if (this.recognition) {
      this.recognition.onstart = this.handleStart.bind(this);
      this.recognition.onend = this.handleEnd.bind(this);
      this.recognition.onerror = this.handleError.bind(this);
      this.recognition.onresult = this.handleResult.bind(this);
    }
  }
  
  // Override handleEnd to also stop visualizer
  protected handleEnd() {
    super.handleEnd();
    this.visualizer.cleanup();
  }
  
  // Public methods
  public async start() {
    if (!this.recognition) {
      this.initRecognition();
      if (!this.recognition) {
        return false;
      }
    }
    
    try {
      // Set up audio visualization before starting recognition
      await this.visualizer.setup(this.options.onAudioLevels);
      this.recognition.start();
      return true;
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      return false;
    }
  }
  
  public stop() {
    if (this.recognition) {
      try {
        this.recognition.stop();
        this.visualizer.cleanup();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }
}

// Create and export a singleton instance with default options
let recognizerInstance: SpeechRecognizer | null = null;

export const getSpeechRecognizer = (options: SpeechRecognitionOptions = {}): SpeechRecognizer => {
  if (!recognizerInstance) {
    recognizerInstance = new SpeechRecognizer(options);
  } else {
    // Update options if provided
    if (options.language) {
      recognizerInstance.setLanguage(options.language);
    }
  }
  
  return recognizerInstance;
};

export type { SpeechRecognitionOptions };
