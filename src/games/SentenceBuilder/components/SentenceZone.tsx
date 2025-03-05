import { motion } from 'framer-motion';
import { Word } from '../types';
import WordBlock from './WordBlock';

interface SentenceZoneProps {
    words: Word[];
    onRemoveWord: (index: number) => void;
    isCorrect: boolean | null;
}

const SentenceZone = ({ words, onRemoveWord, isCorrect }: SentenceZoneProps) => {
    // Estilos según el estado de la validación
    const getValidationStyle = () => {
        if (isCorrect === null) return 'border-dashed border-gray-300';
        if (isCorrect === true) return 'border-solid border-green-500 bg-green-50';
        return 'border-solid border-red-500 bg-red-50';
    };

    return (
        <div
            className={`min-h-[100px] p-4 rounded-lg border-2 ${getValidationStyle()} 
                transition-colors duration-300 flex flex-wrap gap-2 items-center`}
        >
            {words.length === 0 ? (
                <div className="w-full text-center text-gray-400 select-none">
                    Arrastra aquí las palabras para formar la oración
                </div>
            ) : (
                <>
                    {words.map((word, index) => (
                        <WordBlock
                            key={`${word.id}-${index}`}
                            word={word}
                            onRemove={() => onRemoveWord(index)}
                            isPlaced={true}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default SentenceZone; 