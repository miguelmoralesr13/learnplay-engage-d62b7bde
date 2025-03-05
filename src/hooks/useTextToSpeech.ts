import { useEffect, useCallback, useState } from 'react';
import { getTextToSpeech, TextToSpeechOptions } from '@/lib/textToSpeech';

export const useTextToSpeech = (options: TextToSpeechOptions = {}) => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [audioLevels, setAudioLevels] = useState<number[]>([]);

    const tts = getTextToSpeech({
        ...options,
        onStart: () => {
            setIsSpeaking(true);
            options.onStart?.();
        },
        onEnd: () => {
            setIsSpeaking(false);
            options.onEnd?.();
        },
        onError: (error) => {
            setIsSpeaking(false);
            options.onError?.(error);
        },
        onAudioLevels: (levels) => {
            setAudioLevels(levels);
            options.onAudioLevels?.(levels);
        }
    });

    const speak = useCallback((text: string, speakOptions?: TextToSpeechOptions) => {
        if (isSpeaking) {
            tts.stop();
        }

        if (speakOptions) {
            tts.setOptions(speakOptions);
        }

        tts.speak(text);
    }, [isSpeaking]);

    const stop = useCallback(() => {
        tts.stop();
    }, []);

    useEffect(() => {
        return () => {
            tts.stop();
        };
    }, []);

    return {
        speak,
        stop,
        isSpeaking,
        audioLevels
    };
}; 