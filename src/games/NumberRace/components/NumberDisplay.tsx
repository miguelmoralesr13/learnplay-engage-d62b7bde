import React from 'react';
import { motion } from 'framer-motion';
import { numberToWords } from '../utils/numberToWords';

interface NumberDisplayProps {
    number: number;
    isCorrect: boolean | null;
    showCorrectAnswer?: boolean;
}

const NumberDisplay: React.FC<NumberDisplayProps> = ({ number, isCorrect, showCorrectAnswer = false }) => {
    // Determinamos la clase de color basada en el estado de corrección
    const getColorClass = () => {
        if (isCorrect === null) return 'text-primary';
        return isCorrect ? 'text-green-500' : 'text-red-500';
    };

    return (
        <motion.div
            className="flex flex-col items-center justify-center p-8 rounded-lg border-2 shadow-md mb-8 bg-card"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
                scale: 1,
                opacity: 1,
                borderColor: isCorrect === null
                    ? 'hsl(var(--primary))'
                    : isCorrect
                        ? 'hsl(var(--success))'
                        : 'hsl(var(--destructive))'
            }}
            transition={{ duration: 0.3 }}
        >
            <h2 className="text-xl mb-2 font-medium">Write this number in English:</h2>
            <motion.span
                className={`text-5xl font-bold ${getColorClass()}`}
                key={number} // Key para animar cada nuevo número
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500 }}
            >
                {number}
            </motion.span>

            {/* Mostrar la respuesta correcta si agotó los intentos */}
            {showCorrectAnswer && (
                <div className="mt-3 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <p className="text-sm font-medium text-amber-700 mb-1">Respuesta correcta:</p>
                    <p className="text-lg font-bold text-amber-900">{numberToWords(number)}</p>
                </div>
            )}
        </motion.div>
    );
};

export default NumberDisplay; 