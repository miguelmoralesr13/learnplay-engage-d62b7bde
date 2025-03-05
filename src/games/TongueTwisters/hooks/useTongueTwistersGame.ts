import { useState, useCallback, useRef } from 'react';
import { getTextToSpeech } from '@/lib/textToSpeech';
import { getSpeechRecognizer } from '@/lib/speech/speechRecognizer';
import { calculateStringSimilarity } from '@/lib/audioUtils';
import { TongueTwister, TongueTwistersParameters, TongueTwistersState } from '../types/game';
import { useToast } from '@/hooks/use-toast';

export const useTongueTwistersGame = (
    twisters: TongueTwister[],
    parameters: TongueTwistersParameters
) => {
    const [state, setState] = useState<TongueTwistersState>({
        currentTwisterId: '',
        isPlaying: false,
        isRecording: false,
        score: 0,
        attempts: 0,
        feedback: null,
        history: [],
        metrics: {
            correctAttempts: 0,
            totalAttempts: 0,
            averageAccuracy: 0,
            completionTime: 0
        },
        isPracticeMode: false,
    });

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevels, setAudioLevels] = useState<number[]>([]);

    const tts = getTextToSpeech({
        language: 'en-US',
        rate: parameters.speedMultiplier,
        onStart: () => setIsSpeaking(true),
        onEnd: () => setIsSpeaking(false)
    });

    const recognizer = getSpeechRecognizer({
        language: 'en-US',
        onResult: (text, isFinal) => {
            if (isFinal) {
                handleSpeechResult(text);
            }
        },
        onAudioLevels: setAudioLevels
    });

    const { toast } = useToast();

    const getCurrentTwister = useCallback(() => {
        return twisters.find(t => t.id === state.currentTwisterId);
    }, [state.currentTwisterId, twisters]);

    const playTwister = useCallback(() => {
        const twister = getCurrentTwister();
        if (twister && !isSpeaking) {
            tts.speak(twister.text);
        }
    }, [getCurrentTwister, isSpeaking]);

    const startRecording = useCallback(async () => {
        if (!state.isRecording) {
            const success = await recognizer.start();
            if (success) {
                setState(prev => ({ ...prev, isRecording: true }));
            }
        }
    }, [state.isRecording]);

    const stopRecording = useCallback(() => {
        if (state.isRecording) {
            recognizer.stop();
            setState(prev => ({ ...prev, isRecording: false }));
        }
    }, [state.isRecording]);

    const handleSpeechResult = useCallback((text: string) => {
        const currentTwister = getCurrentTwister();
        if (!currentTwister) return;

        const accuracy = calculateStringSimilarity(text, currentTwister.text);

        setState(prev => ({
            ...prev,
            attempts: prev.attempts + 1,
            feedback: {
                accuracy,
                speed: 1.0, // TODO: Implementar cálculo de velocidad
                clarity: accuracy * 0.8, // Simplificado por ahora
                message: getFeedbackMessage(accuracy)
            },
            history: [
                ...prev.history,
                {
                    twisterId: currentTwister.id,
                    accuracy,
                    timestamp: Date.now()
                }
            ]
        }));
    }, [getCurrentTwister]);

    const selectTwister = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            currentTwisterId: id,
            feedback: null
        }));
    }, []);

    const startPracticeMode = useCallback(() => {
        if (!getCurrentTwister()) {
            selectTwister(twisters[0].id);
        }
        setState(prev => ({
            ...prev,
            isPlaying: true,
            isPracticeMode: true
        }));
    }, [getCurrentTwister, selectTwister, twisters]);

    const startGame = useCallback(() => {
        const firstTwister = twisters[0];
        setState(prev => ({
            ...prev,
            currentTwisterId: firstTwister.id,
            isPlaying: true,
            score: 0,
            attempts: 0,
            feedback: null,
            history: [],
            metrics: {
                correctAttempts: 0,
                totalAttempts: 0,
                averageAccuracy: 0,
                completionTime: 0
            }
        }));
    }, [twisters]);

    return {
        state,
        isSpeaking,
        audioLevels,
        startGame,
        playTwister,
        startRecording,
        stopRecording,
        getCurrentTwister,
        selectTwister,
        startPracticeMode
    };
};

function getFeedbackMessage(accuracy: number): string {
    if (accuracy >= 90) return "¡Excelente pronunciación!";
    if (accuracy >= 70) return "¡Muy bien! Sigue practicando.";
    if (accuracy >= 50) return "Buen intento. Intenta hablar más claro.";
    return "Inténtalo de nuevo, pronunciando cada palabra cuidadosamente.";
} 