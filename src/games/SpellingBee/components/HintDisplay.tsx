import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, ArrowRight } from 'lucide-react';
import { HintLevel } from '../types';

interface HintDisplayProps {
    hintText: string;
    onRequestHint: (level: HintLevel) => void;
    currentHintLevel: HintLevel;
    disabled?: boolean;
}

const HintDisplay = ({
    hintText,
    onRequestHint,
    currentHintLevel,
    disabled = false
}: HintDisplayProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const hintLevels: { level: HintLevel, label: string, description: string }[] = [
        {
            level: 'first',
            label: 'First Letter',
            description: 'Show the first letter of the word'
        },
        {
            level: 'vowels',
            label: 'Vowels Only',
            description: 'Show all vowels in the word'
        },
        {
            level: 'partial',
            label: 'Partial Reveal',
            description: 'Show about 1/3 of the letters'
        }
    ];

    const toggleHints = () => {
        if (disabled) return;
        setIsOpen(prev => !prev);
    };

    const selectHint = (level: HintLevel) => {
        if (disabled || level === currentHintLevel) return;
        onRequestHint(level);
        setIsOpen(false);
    };

    return (
        <div className="w-full max-w-md mx-auto mt-4">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={toggleHints}
                    disabled={disabled}
                    className={`flex items-center text-sm font-medium
                    ${disabled
                            ? 'text-gray-400 cursor-not-allowed'
                            : 'text-purple hover:text-purple/80'
                        }`}
                >
                    <HelpCircle className="w-4 h-4 mr-1" />
                    Need a hint?
                </button>
                <span className="text-xs text-gray-500">
                    {currentHintLevel !== 'none' && 'Using hint: ' +
                        hintLevels.find(h => h.level === currentHintLevel)?.label}
                </span>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 rounded-lg p-4 mb-4 overflow-hidden"
                    >
                        <p className="text-sm text-gray-600 mb-3">Select a hint type:</p>
                        <div className="space-y-2">
                            {hintLevels.map((hint) => (
                                <button
                                    key={hint.level}
                                    onClick={() => selectHint(hint.level)}
                                    disabled={disabled || hint.level === currentHintLevel}
                                    className={`w-full flex items-center justify-between p-2 rounded 
                            text-left transition-colors
                            ${hint.level === currentHintLevel
                                            ? 'bg-purple/10 text-purple'
                                            : 'hover:bg-gray-200'
                                        }
                            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    <div>
                                        <div className="font-medium">{hint.label}</div>
                                        <div className="text-xs text-gray-500">{hint.description}</div>
                                    </div>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-3">
                            Using hints will reduce your score for this word.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>

            {currentHintLevel !== 'none' && hintText && (
                <div className="bg-gray-100 p-3 rounded-lg text-center">
                    <p className="font-mono text-lg tracking-wider">{hintText}</p>
                </div>
            )}
        </div>
    );
};

export default HintDisplay; 