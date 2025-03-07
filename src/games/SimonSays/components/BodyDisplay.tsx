import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BODY_PARTS } from '../config';
import { BodyPart } from '../types';

interface BodyDisplayProps {
    onPartClick: (partId: string) => void;
    highlightedPart: string | null;
    correctPart: string | null;
    incorrectPart: string | null;
    showLabels: boolean;
}

const BodyDisplay: React.FC<BodyDisplayProps> = ({
    onPartClick,
    highlightedPart,
    correctPart,
    incorrectPart,
    showLabels
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [showGrid, setShowGrid] = useState(false);

    // Actualizar dimensiones cuando cambie el tamaño de la ventana
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);

        return () => {
            window.removeEventListener('resize', updateDimensions);
        };
    }, []);

    const getAreaStyle = (part: BodyPart) => {
        const isHighlighted = highlightedPart === part.id;
        const isCorrect = correctPart === part.id;
        const isIncorrect = incorrectPart === part.id;

        let bgColor = 'bg-transparent';
        let borderColor = 'border-transparent';

        if (isHighlighted) {
            bgColor = 'bg-red-100';
            borderColor = 'border-red-500';
        }

        if (isCorrect) {
            bgColor = 'bg-green-100';
            borderColor = 'border-green-500';
        }

        if (isIncorrect) {
            bgColor = 'bg-red-100';
            borderColor = 'border-red-500';
        }

        return {
            left: `${part.area.x - part.area.width / 2}%`,
            top: `${part.area.y - part.area.height / 2}%`,
            width: `${part.area.width}%`,
            height: `${part.area.height}%`,
            className: `absolute border-2 rounded-md cursor-pointer transition-colors ${bgColor} ${borderColor} hover:bg-blue-50 hover:border-blue-400`
        };
    };

    const GridOverlay = () => {
        if (!showGrid) return null;

        return (
            <div className="absolute inset-0">
                {/* Líneas verticales */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={`v-${i}`}
                        className="absolute top-0 bottom-0 border-l border-blue-300 pointer-events-none"
                        style={{ left: `${i * 5}%` }}
                    >
                        <span className="absolute top-0 text-[8px] text-blue-500 bg-white px-1">
                            {i * 5}
                        </span>
                    </div>
                ))}

                {/* Líneas horizontales */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={`h-${i}`}
                        className="absolute left-0 right-0 border-t border-blue-300 pointer-events-none"
                        style={{ top: `${i * 5}%` }}
                    >
                        <span className="absolute left-0 text-[8px] text-blue-500 bg-white px-1">
                            {i * 5}
                        </span>
                    </div>
                ))}

                {/* Mostrar áreas activas */}
                {BODY_PARTS.map((part) => (
                    <div
                        key={`debug-${part.id}`}
                        className="absolute border-2 border-red-500 bg-red-100/20"
                        style={{
                            left: `${part.area.x - part.area.width / 2}%`,
                            top: `${part.area.y - part.area.height / 2}%`,
                            width: `${part.area.width}%`,
                            height: `${part.area.height}%`,
                        }}
                    >
                        <span className="absolute top-0 left-0 text-[8px] bg-red-100 p-1 rounded">
                            {part.id}<br />
                            x:{part.area.x} y:{part.area.y}<br />
                            w:{part.area.width} h:{part.area.height}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowGrid(!showGrid)}
                className="absolute top-0 right-0 z-50 px-2 py-1 text-xs bg-blue-500 text-white rounded m-2"
            >
                {showGrid ? 'Ocultar Grid' : 'Mostrar Grid'}
            </button>

            <div
                ref={containerRef}
                className="relative w-[300px] h-[600px] mx-auto bg-white rounded-lg shadow-md overflow-hidden"
                style={{ aspectRatio: '1/2' }}
            >
                <img
                    src="/images/body/external_front.png"
                    alt="Human body diagram"
                    className="w-full h-full object-contain"
                    style={{ objectPosition: 'center' }}
                />

                <GridOverlay />

                {BODY_PARTS.map((part) => {
                    const areaStyle = getAreaStyle(part);

                    return (
                        <div
                            key={part.id}
                            onClick={() => onPartClick(part.id)}
                            style={{
                                left: areaStyle.left,
                                top: areaStyle.top,
                                width: areaStyle.width,
                                height: areaStyle.height
                            }}
                            className={areaStyle.className}
                            title={part.name}
                        >
                            {showLabels && (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-xs font-bold opacity-70 text-center">
                                        {part.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}

                {/* Feedback de correcto/incorrecto */}
                <AnimatePresence>
                    {correctPart && (
                        <motion.div
                            key="correct-feedback"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute bottom-4 left-0 right-0 flex justify-center"
                        >
                            <div className="px-4 py-2 bg-green-500 text-white font-medium rounded-full shadow-lg">
                                ¡Correcto!
                            </div>
                        </motion.div>
                    )}

                    {incorrectPart && (
                        <motion.div
                            key="incorrect-feedback"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute bottom-4 left-0 right-0 flex justify-center"
                        >
                            <div className="px-4 py-2 bg-red-500 text-white font-medium rounded-full shadow-lg">
                                ¡Incorrecto!
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default BodyDisplay; 