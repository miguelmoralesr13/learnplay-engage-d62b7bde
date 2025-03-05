import React from 'react';
import { Volume2, Play, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface AudioButtonProps {
    onClick: () => void;
    isPlaying: boolean;
    label: string;
    primary?: boolean;
}

const AudioButton: React.FC<AudioButtonProps> = ({
    onClick,
    isPlaying,
    label,
    primary = false
}) => {
    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            disabled={isPlaying}
            className={`flex items-center justify-center px-4 py-2 rounded-md
        ${primary
                    ? 'bg-primary text-white hover:bg-primary/90'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'} 
        transition-colors
        ${isPlaying ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
            {isPlaying ? (
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
            ) : (
                primary ? (
                    <Play className="h-5 w-5 mr-2" />
                ) : (
                    <Volume2 className="h-5 w-5 mr-2" />
                )
            )}
            {label}
        </motion.button>
    );
};

export default AudioButton; 