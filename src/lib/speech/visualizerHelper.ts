
// Audio visualization helper for speech recognition
import { getAudioContext, createAnalyzer, getAudioLevels } from '@/lib/audioUtils';

export class AudioVisualizer {
  private analyzer: AnalyserNode | null = null;
  private mediaStream: MediaStream | null = null;
  private visualizerInterval: number | null = null;
  private onAudioLevelsCallback: ((levels: number[]) => void) | null = null;

  // Set up audio visualization
  public async setup(onAudioLevels?: (levels: number[]) => void): Promise<boolean> {
    this.onAudioLevelsCallback = onAudioLevels || null;

    try {
      // Get microphone access
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });

      const audioContext = getAudioContext();
      const source = audioContext.createMediaStreamSource(this.mediaStream);
      this.analyzer = createAnalyzer();
      source.connect(this.analyzer);

      // Start updating audio levels at regular intervals
      this.startUpdates();
      return true;

    } catch (error) {
      console.error('Error accessing microphone:', error);
      return false;
    }
  }

  // Start visualizer updates
  private startUpdates() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
    }

    this.visualizerInterval = window.setInterval(() => {
      if (this.analyzer && this.onAudioLevelsCallback) {
        const levels = getAudioLevels(this.analyzer);
        this.onAudioLevelsCallback(levels);
      }
    }, 50);
  }

  // Stop and clean up
  public cleanup() {
    if (this.visualizerInterval) {
      clearInterval(this.visualizerInterval);
      this.visualizerInterval = null;
    }

    // Stop and clean up media stream
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }

    // Reset audio levels
    if (this.onAudioLevelsCallback) {
      this.onAudioLevelsCallback(Array(20).fill(0));
    }
  }
}
