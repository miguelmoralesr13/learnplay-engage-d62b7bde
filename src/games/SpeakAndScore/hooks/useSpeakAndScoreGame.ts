import { useState, useEffect, useCallback } from 'react';
import { calculateStringSimilarity } from '@/lib/audioUtils';
import { getTextToSpeech, TextToSpeech } from '@/lib/textToSpeech';
import { getSpeechRecognizer } from '@/lib/speech/speechRecognizer';
import { useSpeakAndScoreStore } from '../store';

// Hook principal
export const useSpeakAndScoreGame = () => {
    const store = useSpeakAndScoreStore();
    const [tts, setTts] = useState<TextToSpeech | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Inicializar los servicios de voz
    useEffect(() => {
        const textToSpeech = getTextToSpeech({
            language: 'en-US',
            onStart: () => setIsPlaying(true),
            onEnd: () => setIsPlaying(false),
            onAudioLevels: (levels) => store.setAudioLevels(levels)
        });
        setTts(textToSpeech);

        return () => {
            if (textToSpeech) {
                textToSpeech.stop();
            }
        };
    }, []);

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
                useSpeakAndScoreStore.setState({ timeRemaining: newTimeRemaining });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [store.gamePhase, store.parameters.useTimer, store.timeRemaining]);

    // Reproducir la palabra original
    const handlePlayWord = useCallback(() => {
        if (!store.currentWord || !tts) return;

        // Si tiene URL de audio, reproducirla directamente
        if (store.currentWord.audioUrl) {
            const audio = new Audio(store.currentWord.audioUrl);

            audio.addEventListener('play', () => setIsPlaying(true));
            audio.addEventListener('ended', () => setIsPlaying(false));
            audio.addEventListener('pause', () => setIsPlaying(false));
            audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
            audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));

            audio.play()
                .catch(err => {
                    console.error("Error reproduciendo el audio:", err);
                    // Fallback a síntesis de voz si falla la reproducción del archivo
                    tts.speak(store.currentWord!.text);
                });
        } else {
            // Si no hay URL de audio, usar síntesis de voz
            tts.speak(store.currentWord.text);
        }
    }, [store.currentWord, tts]);

    // Pausar el audio
    const handlePauseAudio = useCallback(() => {
        setIsPlaying(false);
        if (tts && tts.isSpeaking()) {
            tts.pause();
        }
    }, [tts]);

    // Iniciar grabación
    const handleStartRecording = useCallback(() => {
        const recognizer = getSpeechRecognizer({
            language: 'en-US',
            onStart: () => store.startRecording(),
            onEnd: () => store.stopRecording(),
            onResult: (text, isFinal) => {
                if (isFinal && store.currentWord) {
                    // Calcular similitud entre lo grabado y el texto original
                    const similarity = calculateStringSimilarity(text, store.currentWord.text);
                    console.log(`Similitud: ${similarity}%, Texto: "${text}"`);

                    // Actualizar intentos y mostrar feedback
                    const newAttempts = store.attempts + 1;

                    useSpeakAndScoreStore.setState({
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

    return {
        ...store,

        // Controladores de audio
        handlePlayWord,
        handlePauseAudio,
        handleStartRecording,
        handleStopRecording,
        isPlaying,
        currentTime,
        duration
    };
}; 