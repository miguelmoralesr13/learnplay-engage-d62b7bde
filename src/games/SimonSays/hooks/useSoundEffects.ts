import { useCallback } from 'react';

export const useSoundEffects = () => {
    const playSound = useCallback(async (sound: string) => {
        try {
            const audio = new Audio(sound);
            await audio.play();
        } catch (error) {
            console.warn('Sound not available:', sound);
        }
    }, []);

    const playCorrect = useCallback(() => {
        playSound('/sounds/correct.mp3').catch(() => {
            // Fallback a un beep usando Web Audio API
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 800;
            oscillator.connect(context.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 200);
        });
    }, [playSound]);

    const playIncorrect = useCallback(() => {
        playSound('/sounds/incorrect.mp3').catch(() => {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 300;
            oscillator.connect(context.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 200);
        });
    }, [playSound]);

    const playComplete = useCallback(() => {
        playSound('/sounds/complete.mp3').catch(() => {
            const context = new (window.AudioContext || (window as any).webkitAudioContext)();
            const oscillator = context.createOscillator();
            oscillator.type = 'sine';
            oscillator.frequency.value = 600;
            oscillator.connect(context.destination);
            oscillator.start();
            setTimeout(() => oscillator.stop(), 400);
        });
    }, [playSound]);

    return { playCorrect, playIncorrect, playComplete };
}; 