import React from 'react';
import { DrawingObject } from '../types';
import { Check, X, ChevronRight } from 'lucide-react';

interface ResultFeedbackProps {
    isCorrect: boolean;
    score: number;
    object: DrawingObject;
    userDrawing: string;
    usedColors: Set<string>;
    onNext: () => void;
}

const ResultFeedback: React.FC<ResultFeedbackProps> = ({
    isCorrect,
    score,
    object,
    userDrawing,
    usedColors,
    onNext
}) => {
    // Convertir Set a Array para renderizar
    const usedColorsArray = Array.from(usedColors);

    // Calcular colores correctos e incorrectos
    const correctColors = object.requiredColors.filter(color => usedColors.has(color));
    const missingColors = object.requiredColors.filter(color => !usedColors.has(color));
    const extraColors = usedColorsArray.filter(color => !object.requiredColors.includes(color));

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className={`text-center mb-6 p-4 rounded-lg ${isCorrect ? 'bg-green-100' : 'bg-amber-100'}`}>
                <h2 className="text-2xl font-bold mb-2">
                    {isCorrect
                        ? 'Great job! (¡Buen trabajo!)'
                        : 'Almost there! (¡Casi lo tienes!)'}
                </h2>
                <p className="text-gray-700">
                    {isCorrect
                        ? 'You used the colors correctly! (¡Usaste los colores correctamente!)'
                        : 'Try to use the right colors for each part. (Intenta usar los colores correctos para cada parte.)'}
                </p>
                <div className="mt-3 text-lg font-bold">
                    Score: +{score} points (puntos)
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-medium mb-2">
                        Your drawing (Tu dibujo)
                    </h3>
                    {userDrawing && (
                        <img
                            src={userDrawing}
                            alt="Tu dibujo"
                            className="w-full rounded-lg border"
                        />
                    )}
                </div>

                <div>
                    <h3 className="font-medium mb-2">
                        Used colors (Colores usados)
                    </h3>

                    {correctColors.length > 0 && (
                        <div className="mb-3">
                            <h4 className="text-sm font-medium text-green-600 mb-1">
                                Colores correctos:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {correctColors.map(color => (
                                    <span
                                        key={color}
                                        className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {missingColors.length > 0 && (
                        <div className="mb-3">
                            <h4 className="text-sm font-medium text-red-600 mb-1">
                                Colores faltantes:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {missingColors.map(color => (
                                    <span
                                        key={color}
                                        className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs"
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {extraColors.length > 0 && (
                        <div>
                            <h4 className="text-sm font-medium text-yellow-600 mb-1">
                                Colores adicionales:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {extraColors.map(color => (
                                    <span
                                        key={color}
                                        className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs"
                                    >
                                        {color}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={onNext}
                className="mt-6 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
                Continue (Continuar)
            </button>
        </div>
    );
};

export default ResultFeedback; 