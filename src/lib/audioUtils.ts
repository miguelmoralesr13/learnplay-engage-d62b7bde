/**
 * Audio utilities for handling audio processing and visualization
 */

// Audio context singleton
let audioContext: AudioContext | null = null;

// Get or create audio context
export const getAudioContext = (): AudioContext => {
  // Check for AudioContext or webkitAudioContext
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

  if (!AudioContextClass) {
    console.error('AudioContext is not supported in this browser');
    throw new Error('AudioContext not supported');
  }

  return new AudioContextClass();
};

// Create analyzer node for visualizing audio
export const createAnalyzer = (audioContext = getAudioContext()): AnalyserNode => {
  const analyzer = audioContext.createAnalyser();
  analyzer.fftSize = 256;
  analyzer.smoothingTimeConstant = 0.8;
  return analyzer;
};

// Calculate audio levels from analyzer for visualization
export const getAudioLevels = (analyzer: AnalyserNode, bins = 20): number[] => {
  const dataArray = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(dataArray);

  // Create averaged bins of data
  const binSize = Math.floor(dataArray.length / bins);
  const levels: number[] = [];

  for (let i = 0; i < bins; i++) {
    let sum = 0;
    for (let j = 0; j < binSize; j++) {
      sum += dataArray[i * binSize + j];
    }
    // Normalize to 0-1 range
    const average = sum / binSize / 255;
    levels.push(average);
  }

  return levels;
};

// Resume audio context if it's suspended (needed for some browsers)
export const resumeAudioContext = async (): Promise<void> => {
  const context = getAudioContext();
  if (context.state === 'suspended') {
    await context.resume();
  }
};

// Calculate similarity between two strings (for comparing user input with target phrase)
export const calculateStringSimilarity = (str1: string, str2: string): number => {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();

  if (s1 === s2) return 100;
  if (s1.length === 0 || s2.length === 0) return 0;

  // Simple Levenshtein distance calculation
  const matrix: number[][] = [];

  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[s1.length][s2.length];
  const maxLength = Math.max(s1.length, s2.length);

  // Convert to similarity percentage
  return Math.round((1 - distance / maxLength) * 100);
};
