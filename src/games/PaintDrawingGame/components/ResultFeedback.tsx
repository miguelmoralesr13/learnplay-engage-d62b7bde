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
        <div className="result-feedback p-6 bg-white rounded-lg shadow-md">
            <div className="flex items-center mb-4">
                <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full mr-3 ${isCorrect ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'
                        }`}
                >
                    {isCorrect ? <Check /> : <X />}
                </div>

                <h2 className="text-xl font-bold">
                    {isCorrect ? '¡Muy bien!' : 'Inténtalo de nuevo'}
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                    <h3 className="text-lg font-medium mb-3">Tu dibujo</h3>
                    {userDrawing && (
                        <img
                            src={userDrawing}
                            alt="Tu dibujo"
                            className="w-full rounded-lg border"
                        />
                    )}
                </div>

                <div>
                    <h3 className="text-lg font-medium mb-3">Colores utilizados</h3>

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

            <div className="flex items-center justify-between pt-4 border-t">
                <div className="text-lg">
                    Puntuación: <span className="font-bold">{score}</span>
                </div>

                <button
                    onClick={onNext}
                    className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Continuar <ChevronRight size={16} className="ml-1" />
                </button>
            </div>
        </div>
    );
};

export default ResultFeedback; 