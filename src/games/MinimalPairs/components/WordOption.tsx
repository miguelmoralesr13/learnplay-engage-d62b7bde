import React from 'react';
import { motion } from 'framer-motion';
import { Check, X, Loader2, Volume2 } from 'lucide-react';

interface WordProps {
    text: string;
    phonetic: string;
}

interface WordOptionProps {
    word: WordProps;
    showPhonetics: boolean;
    isSelected: boolean;
    isCorrect: boolean;
    isIncorrect: boolean;
    disabled: boolean;
    onClick: () => void;
    onPlayAudio?: () => void;
    isPlaying?: boolean;
}

const WordOption: React.FC<WordOptionProps> = ({
    word,
    showPhonetics = true,
    isSelected,
    isCorrect,
    isIncorrect,
    disabled,
    onClick,
    onPlayAudio,
    isPlaying
}) => {
    const getBgColor = () => {
        if (isCorrect) return 'bg-green-100 border-green-300';
        if (isIncorrect) return 'bg-red-100 border-red-300';
        if (isSelected) return 'bg-blue-100 border-blue-300';
        return 'bg-white border-gray-200 hover:border-gray-300';
    };

    return (
        <motion.div
            whileHover={!disabled ? { scale: 1.02 } : {}}
            whileTap={!disabled ? { scale: 0.98 } : {}}
            className={`cursor-pointer border-2 rounded-lg p-6 transition-colors ${getBgColor()} ${disabled && !isSelected && !isCorrect && !isIncorrect ? 'opacity-70' : ''
                }`}
            onClick={disabled ? undefined : onClick}
        >
            <div className="text-center">
                <h3 className="text-2xl font-bold">{word.text}</h3>

                {showPhonetics && (
                    <div className="text-sm text-gray-600 mt-1">{word.phonetic}</div>
                )}

                {onPlayAudio && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlayAudio();
                        }}
                        className="mt-3 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                        disabled={isPlaying}
                    >
                        {isPlaying ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </button>
                )}

                {(isCorrect || isIncorrect) && (
                    <div className={`flex justify-center mt-3 ${isCorrect ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {isCorrect ? (
                            <Check className="h-6 w-6" />
                        ) : (
                            <X className="h-6 w-6" />
                        )}
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default WordOption; 