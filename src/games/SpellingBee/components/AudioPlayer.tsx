import { useEffect } from 'react';
import { Volume2, RotateCcw, Loader2 } from 'lucide-react';
import { useAudioService } from '../hooks/useAudioService';
import { SpellingWord } from '../types';

interface AudioPlayerProps {
    word: SpellingWord | null;
    disabled?: boolean;
}

const AudioPlayer = ({ word, disabled = false }: AudioPlayerProps) => {
    const { pronounceWord, stopPronunciation, isPlaying, isLoading, error } = useAudioService();

    // Detener reproducción cuando se desmonta el componente
    useEffect(() => {
        return () => {
            stopPronunciation();
        };
    }, [stopPronunciation]);

    const handlePlay = async () => {
        if (disabled || isPlaying || isLoading || !word) return;

        try {
            await pronounceWord(word);
        } catch (error) {
            console.error("Error reproduciendo la palabra:", error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <button
                onClick={handlePlay}
                disabled={disabled || isPlaying || isLoading || !word}
                className={`w-16 h-16 rounded-full flex items-center justify-center 
                 ${disabled || !word
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-purple text-white hover:bg-purple/90'
                    }`}
                aria-label="Play pronunciation"
            >
                {isLoading ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                ) : isPlaying ? (
                    <Volume2 className="w-8 h-8" />
                ) : (
                    <RotateCcw className="w-8 h-8" />
                )}
            </button>

            {error && (
                <div className="text-red-500 text-xs mt-2">
                    {error}
                </div>
            )}

            <div className="text-sm mt-2 text-gray-600">
                {isPlaying ? 'Escuchando...' : 'Toca para escuchar'}
            </div>
        </div>
    );
};

export default AudioPlayer; 