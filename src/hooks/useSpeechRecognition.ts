import { useState, useCallback, useRef } from 'react';
import { getSpeechRecognizer, SpeechRecognitionOptions } from '@/lib/speech/speechRecognizer';

interface UseSpeechRecognitionResult {
    isRecording: boolean;
    transcript: string;
    startRecording: () => void;
    stopRecording: () => void;
    audioLevels: number[];
}

export const useSpeechRecognition = (options: SpeechRecognitionOptions = {}): UseSpeechRecognitionResult => {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioLevels, setAudioLevels] = useState<number[]>([]);
    const recognizerRef = useRef(getSpeechRecognizer({
        ...options,
        onResult: (text: string, isFinal: boolean) => {
            if (isFinal) {
                setTranscript(text);
                if (options.onResult) {
                    options.onResult(text, isFinal);
                }
            }
        },
        onAudioLevels: (levels: number[]) => {
            setAudioLevels(levels);
            if (options.onAudioLevels) {
                options.onAudioLevels(levels);
            }
        }
    }));

    const startRecording = useCallback(() => {
        setTranscript('');
        setIsRecording(true);
        recognizerRef.current.start();
    }, []);

    const stopRecording = useCallback(() => {
        setIsRecording(false);
        recognizerRef.current.stop();
    }, []);

    return {
        isRecording,
        transcript,
        startRecording,
        stopRecording,
        audioLevels
    };
};
