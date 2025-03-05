
/**
 * Audio utilities for handling audio processing and visualization
 */

// Audio context singleton
let audioContext: AudioContext | null = null;

// Get or create audio context
export const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioContext;
};

// Create analyzer node for visualizing audio
export const createAnalyzer = (): AnalyserNode => {
  const context = getAudioContext();
  const analyzer = context.createAnalyser();
  analyzer.fftSize = 256;
  analyzer.smoothingTimeConstant = 0.7;
  return analyzer;
};

// Calculate audio levels from analyzer for visualization
export const getAudioLevels = (
  analyzer: AnalyserNode,
  barCount: number = 20
): number[] => {
  const dataArray = new Uint8Array(analyzer.frequencyBinCount);
  analyzer.getByteFrequencyData(dataArray);
  
  // Convert frequency data to visual bar heights
  const levels: number[] = [];
  const step = Math.floor(dataArray.length / barCount);
  
  for (let i = 0; i < barCount; i++) {
    const start = i * step;
    let sum = 0;
    
    // Average values for smoother visualization
    for (let j = 0; j < step && start + j < dataArray.length; j++) {
      sum += dataArray[start + j];
    }
    
    // Normalize to 0-100 range
    const average = sum / step;
    const normalizedValue = Math.min(100, Math.max(0, average));
    levels.push(normalizedValue);
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
