import { useState, useEffect, useCallback } from 'react';
import { calculateStringSimilarity } from '@/lib/audioUtils';
import { getTextToSpeech, TextToSpeech } from '@/lib/textToSpeech';
import { getSpeechRecognizer } from '@/lib/speech/speechRecognizer';
import { useTongueTwistersStore } from '../store';

// Hook principal
export const useTongueTwistersGame = () => {
    const store = useTongueTwistersStore();
    const [tts, setTts] = useState<TextToSpeech | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Inicializar los servicios de voz
    useEffect(() => {
        // Inicializar Text-to-Speech
        const textToSpeech = getTextToSpeech({
            rate: store.parameters.speedMultiplier,
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false),
            onAudioLevels: (levels) => store.setAudioLevels(levels)
        });
        setTts(textToSpeech);

        // Limpiar al desmontar
        return () => {
            if (textToSpeech) {
                textToSpeech.stop();
            }
        };
    }, [store.parameters.speedMultiplier]);

    // Manejar el temporizador
    useEffect(() => {
        if (store.gamePhase !== 'playing' || !store.parameters.useTimer || store.timeRemaining <= 0) {
            return;
        }

        const timer = setInterval(() => {
            const newTimeRemaining = store.timeRemaining - 1;
            if (newTimeRemaining <= 0) {
                clearInterval(timer);
                store.endGame();
            } else {
                useTongueTwistersStore.setState({ timeRemaining: newTimeRemaining });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [store.gamePhase, store.parameters.useTimer, store.timeRemaining]);

    // Reproducir el trabalenguas original
    const handlePlayTwister = useCallback(() => {
        if (!store.currentTwister || !tts) return;

        tts.speak(store.currentTwister.text);
    }, [store.currentTwister, store.parameters.speedMultiplier, tts]);

    // Iniciar grabación
    const handleStartRecording = useCallback(() => {
        const recognizer = getSpeechRecognizer({
            language: 'en-US',
            onStart: () => store.startRecording(),
            onEnd: () => store.stopRecording(),
            onResult: (text, isFinal) => {
                if (isFinal && store.currentTwister) {
                    // Calcular similitud entre lo grabado y el texto original
                    const similarity = calculateStringSimilarity(text, store.currentTwister.text);
                    console.log(`Similitud: ${similarity}%, Texto: "${text}"`);

                    // Actualizar intentos y mostrar feedback
                    const newAttempts = store.attempts + 1;

                    useTongueTwistersStore.setState({
                        attempts: newAttempts,
                        recognizedText: text,
                        textSimilarity: similarity,
                        showRecognitionFeedback: true
                    });
                }
            },
            onAudioLevels: (levels) => store.setAudioLevels(levels),
            onError: (error) => {
                console.error("Error en reconocimiento de voz:", error);
                store.stopRecording();
            }
        });

        recognizer.start();
    }, [store]);

    // Detener grabación
    const handleStopRecording = useCallback(() => {
        const recognizer = getSpeechRecognizer();
        recognizer.stop();
    }, []);

    // Reproducir la grabación - simulado
    const handlePlayRecording = useCallback(() => {
        console.log("Reproduciendo grabación (simulado)");
        setIsPlaying(true);

        // Simular la duración de reproducción
        setTimeout(() => {
            setIsPlaying(false);
        }, 3000);
    }, []);

    return {
        ...store,

        // Controladores de audio
        handlePlayTwister,
        handlePlayRecording,
        handleStartRecording,
        handleStopRecording,
        isPlaying,
        currentTime,
        duration
    };
}; 