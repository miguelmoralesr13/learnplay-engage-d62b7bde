import { motion } from 'framer-motion';
import { Word } from '../types';

interface WordBlockProps {
    word: Word;
    onClick?: () => void;
    onRemove?: () => void;
    draggable?: boolean;
    isPlaced?: boolean;
}

const WordBlock = ({
    word,
    onClick,
    onRemove,
    draggable = false,
    isPlaced = false
}: WordBlockProps) => {
    // Colores según tipo de palabra
    const getTypeColor = () => {
        switch (word.type) {
            case 'noun': return 'bg-blue-100 border-blue-300';
            case 'verb': return 'bg-red-100 border-red-300';
            case 'adjective': return 'bg-green-100 border-green-300';
            case 'adverb': return 'bg-yellow-100 border-yellow-300';
            case 'preposition': return 'bg-purple-100 border-purple-300';
            case 'article': return 'bg-gray-100 border-gray-300';
            case 'pronoun': return 'bg-pink-100 border-pink-300';
            case 'conjunction': return 'bg-orange-100 border-orange-300';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <motion.div
            className={`${getTypeColor()} px-3 py-2 rounded-lg border-2 shadow-sm
        cursor-pointer select-none relative flex items-center justify-center
        ${isPlaced ? 'opacity-100' : 'opacity-90 hover:opacity-100'}`}
            whileHover={!isPlaced ? { scale: 1.05 } : {}}
            whileTap={!isPlaced ? { scale: 0.98 } : {}}
            onClick={onClick}
            layout
        >
            <span className="font-medium">{word.text}</span>

            {onRemove && isPlaced && (
                <button
                    className="absolute -top-2 -right-2 bg-white rounded-full w-5 h-5 
                     flex items-center justify-center border border-gray-300
                     hover:bg-red-100 hover:border-red-300"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                >
                    <span className="text-xs">×</span>
                </button>
            )}
        </motion.div>
    );
};

export default WordBlock; 