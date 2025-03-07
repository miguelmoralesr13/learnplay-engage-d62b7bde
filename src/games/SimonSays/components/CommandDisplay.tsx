import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import { useTextToSpeech } from '../../../lib/textToSpeech';

interface CommandDisplayProps {
    command: string;
    translation?: string;
    showTranslation: boolean;
    useAudio: boolean;
    currentRound: number;
    totalRounds: number;
}

const CommandDisplay: React.FC<CommandDisplayProps> = ({
    command,
    translation,
    showTranslation,
    useAudio,
    currentRound,
    totalRounds
}) => {
    const { speak } = useTextToSpeech();

    const handlePlayAudio = () => {
        speak(command);
    };

    return (
        <div className="w-full max-w-lg mx-auto bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Simon dice...</h2>
                <span className="text-sm font-medium text-gray-500">
                    {currentRound + 1} / {totalRounds}
                </span>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={command}
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="mb-4"
                >
                    <div className="flex justify-between items-center">
                        <p className="text-xl font-bold text-primary">{command}</p>
                        {useAudio && (
                            <button
                                onClick={handlePlayAudio}
                                className="p-2 text-primary hover:bg-primary/10 rounded-full transition-colors"
                                aria-label="Play audio"
                            >
                                <Volume2 size={24} />
                            </button>
                        )}
                    </div>

                    {showTranslation && translation && (
                        <p className="text-sm text-gray-500 mt-2 italic">{translation}</p>
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
};

export default CommandDisplay; 