import { motion } from 'framer-motion';
import { WordItem } from '../types';

interface WordCardProps {
    word: WordItem;
    showDefinition?: boolean;
    isCorrect?: boolean | null;
    categories?: { value: string, label: string }[];
}

const WordCard = ({ word, showDefinition = false, isCorrect = null, categories = [] }: WordCardProps) => {
    // Determinar estilos basados en estado
    const getCardStyle = () => {
        if (isCorrect === null) return 'bg-white border-gray-200';
        return isCorrect
            ? 'bg-green-50 border-green-300'
            : 'bg-red-50 border-red-300';
    };
    console.log(categories);

    return (
        <motion.div
            className={`rounded-xl p-6 border-2 shadow-md ${getCardStyle()} 
                 transition-colors w-full max-w-md mx-auto`}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">{word.text}</h2>

                {/* Mostrar la categoría */}
                <div className="flex justify-center mb-3">
                    <span className="text-xs px-2.5 py-0.5 bg-purple/10 text-purple-600 rounded-full">
                        {word.category ? (
                            // Buscar la etiqueta de la categoría si está disponible
                            categories.find(cat => cat.value === word.category)?.label || word.category
                        ) : 'General'}
                    </span>
                </div>

                {showDefinition && (
                    <p className="text-sm text-gray-600 mt-2">
                        {word.definition || 'No definition available'}
                    </p>
                )}
            </div>

            {isCorrect !== null && (
                <div className="mt-4 text-center">
                    <p className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                        {isCorrect ? '¡Correcto!' : `Incorrecto. La respuesta es: ${word.translation}`}
                    </p>
                </div>
            )}
        </motion.div>
    );
};

export default WordCard; 