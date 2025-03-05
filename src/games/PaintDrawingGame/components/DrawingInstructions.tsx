import React from 'react';
import { DrawingObject } from '../types';
import { Volume2, Clock } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface DrawingInstructionsProps {
    object: DrawingObject;
    currentRound: number;
    totalRounds: number;
    objectIndex: number;
    objectsPerRound: number;
    timeRemaining?: number; // Opcional para mostrar tiempo restante
}

const DrawingInstructions: React.FC<DrawingInstructionsProps> = ({
    object,
    currentRound,
    totalRounds,
    objectIndex,
    objectsPerRound,
    timeRemaining
}) => {
    const { speak } = useTextToSpeech();

    // Calcular el objeto actual dentro de la ronda
    const objectInRound = (objectIndex % objectsPerRound) + 1;

    const handleSpeak = () => {
        speak(object.description);
    };

    return (
        <div className="drawing-instructions bg-white p-4 rounded-lg shadow-md mb-4">
            <div className="flex justify-between items-center mb-3">
                <h3 className="text-xl font-bold text-primary">
                    {object.name} <span className="text-gray-500 text-lg">({object.translation})</span>
                </h3>

                <div className="flex items-center gap-4">
                    {/* Información de ronda y objeto */}
                    <div className="text-sm text-gray-600 font-medium">
                        Ronda {currentRound} de {totalRounds} |
                        Objeto {objectInRound} de {objectsPerRound}
                    </div>

                    {/* Mostrar tiempo restante si está disponible */}
                    {timeRemaining !== undefined && (
                        <div className="flex items-center gap-1 text-sm font-medium px-2 py-1 bg-gray-100 rounded-md">
                            <Clock size={16} className="text-primary" />
                            <span>{Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-2">
                <p className="text-gray-700">{object.description}</p>
                <button
                    onClick={handleSpeak}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Escuchar instrucción"
                >
                    <Volume2 size={16} />
                </button>
            </div>

            <div className="mt-3">
                <h4 className="text-sm font-medium mb-1">Colores necesarios:</h4>
                <div className="flex flex-wrap gap-2">
                    {object.requiredColors.map((colorName) => (
                        <span
                            key={colorName}
                            className="px-2 py-1 bg-gray-100 rounded-full text-xs"
                        >
                            {colorName}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DrawingInstructions; 