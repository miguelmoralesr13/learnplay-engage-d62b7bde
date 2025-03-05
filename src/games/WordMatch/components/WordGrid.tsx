import { motion } from 'framer-motion';

interface WordGridProps {
    words: string[];
    selectedIndex: number | null;
    matchedPairs: number[];
    onSelect: (index: number) => void;
    label: string;
}

const WordGrid = ({ words, selectedIndex, matchedPairs, onSelect, label }: WordGridProps) => {
    return (
        <div className="flex-1 space-y-3">
            <h3 className="font-medium text-center mb-4">{label}</h3>
            {words.map((word, index) => (
                <motion.button
                    key={`${label.toLowerCase()}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        scale: selectedIndex === index ? 1.05 : 1
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full py-3 px-4 rounded-lg border text-left transition-all
            ${matchedPairs.includes(index)
                            ? 'bg-green-100 border-green-200 text-green-800'
                            : selectedIndex === index
                                ? 'bg-purple/10 border-purple text-purple'
                                : 'bg-background hover:bg-secondary'
                        }
            ${matchedPairs.includes(index) ? 'cursor-default' : 'cursor-pointer'}
          `}
                    disabled={matchedPairs.includes(index)}
                    onClick={() => onSelect(index)}
                >
                    {word}
                </motion.button>
            ))}
        </div>
    );
};

export default WordGrid; 