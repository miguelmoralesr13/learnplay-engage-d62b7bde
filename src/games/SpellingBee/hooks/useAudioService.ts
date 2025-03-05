import { useState, useEffect, useCallback, useRef } from 'react';
import { SpellingWord } from '../types';

export const useAudioService = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const synth = useRef<SpeechSynthesis | null>(null);
    const voices = useRef<SpeechSynthesisVoice[]>([]);

    // Inicializar el sintetizador de voz
    useEffect(() => {
        if (typeof window !== 'undefined') {
            synth.current = window.speechSynthesis;

            // Cargar voces disponibles
            const loadVoices = () => {
                voices.current = synth.current?.getVoices() || [];
            };

            loadVoices();

            // En algunos navegadores, las voces se cargan de forma asíncrona
            if (synth.current) {
                synth.current.onvoiceschanged = loadVoices;
            }

            return () => {
                if (synth.current) {
                    synth.current.cancel();
                    // @ts-ignore
                    synth.current.onvoiceschanged = null;
                }
            };
        }
    }, []);

    // Pronunciar una palabra
    const pronounceWord = useCallback((word: SpellingWord | string) => {
        return new Promise<void>((resolve, reject) => {
            if (!synth.current) {
                setError('Text-to-speech no disponible en este navegador');
                reject('Text-to-speech no disponible');
                return;
            }

            setIsLoading(true);

            // Detener cualquier pronunciación previa
            synth.current.cancel();

            // Extraer el texto a pronunciar
            const textToSpeak = typeof word === 'string' ? word : word.word;

            // Crear el objeto utterance
            const utterance = new SpeechSynthesisUtterance(textToSpeak);

            // Buscar una voz en inglés
            const englishVoice = voices.current.find(v =>
                v.lang.includes('en-') && v.localService
            );

            if (englishVoice) {
                utterance.voice = englishVoice;
            }

            utterance.lang = 'en-US';
            utterance.rate = 0.9; // Ligeramente más lento para mayor claridad
            utterance.pitch = 1;

            // Manejar eventos
            utterance.onstart = () => {
                setIsLoading(false);
                setIsPlaying(true);
                setError(null);
            };

            utterance.onend = () => {
                setIsPlaying(false);
                resolve();
            };

            utterance.onerror = (event) => {
                setIsPlaying(false);
                setIsLoading(false);
                setError(`Error al reproducir: ${event.error}`);
                reject(event.error);
            };

            // Pronunciar
            synth.current.speak(utterance);
        });
    }, []);

    // Cancelar reproducción
    const stopPronunciation = useCallback(() => {
        if (synth.current) {
            synth.current.cancel();
            setIsPlaying(false);
            setIsLoading(false);
        }
    }, []);

    return {
        pronounceWord,
        stopPronunciation,
        isPlaying,
        isLoading,
        error
    };
}; 