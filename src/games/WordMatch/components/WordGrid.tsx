import { motion } from 'framer-motion';

interface WordGridProps {
    words: string[];
    selectedCards: string[];
    matchedPairs: string[];
    onSelect: (index: number, isTranslation: boolean) => void;
    label: string;
    isTranslation: boolean;
}

const WordGrid = ({ words, selectedCards, matchedPairs, onSelect, label, isTranslation }: WordGridProps) => {
    return (
        <div className="flex-1 space-y-3">
            <h3 className="font-medium text-center mb-4">{label}</h3>
            {words.map((word, index) => {
                const cardId = isTranslation ? `t-${index}` : `w-${index}`;

                return (
                    <motion.button
                        key={`${label.toLowerCase()}-${index}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{
                            opacity: 1,
                            y: 0,
                            scale: selectedCards.includes(cardId) ? 1.05 : 1
                        }}
                        transition={{ delay: index * 0.05 }}
                        className={`w-full py-3 px-4 rounded-lg border text-left transition-all
                            ${matchedPairs.includes(cardId)
                                ? 'bg-green-100 border-green-200 text-green-800'
                                : selectedCards.includes(cardId)
                                    ? 'bg-purple/10 border-purple text-purple'
                                    : 'bg-background hover:bg-secondary'
                            }
                            ${matchedPairs.includes(cardId) ? 'cursor-default' : 'cursor-pointer'}
                        `}
                        disabled={matchedPairs.includes(cardId)}
                        onClick={() => onSelect(index, isTranslation)}
                    >
                        {word}
                    </motion.button>
                );
            })}
        </div>
    );
};

export default WordGrid; 