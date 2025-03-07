import React, { useState, useEffect } from 'react';
import { ColorItem, ColorLevel } from '../types';
import { Play } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { getColorsByLevel } from '../utils/colorData';

interface ColorLearningPanelProps {
    colors: ColorItem[];
    onContinue: () => void;
    colorLevel?: ColorLevel;
}

const ColorLearningPanel: React.FC<ColorLearningPanelProps> = ({
    colors,
    onContinue,
    colorLevel = 'basic'
}) => {
    const [displayColors, setDisplayColors] = useState<ColorItem[]>(colors);
    const { speak, isSpeaking } = useTextToSpeech();

    // Efecto para obtener colores según el nivel
    useEffect(() => {
        // Obtener colores filtrados según el nivel
        const levelColors = getColorsByLevel(colorLevel);

        // Limitar colores según el nivel
        const maxColors = colorLevel === 'advanced' ? 14 :
            colorLevel === 'intermediate' ? 8 : 4;

        // Si hay más colores de los que debería tener este nivel, recortar
        const limitedColors = levelColors.slice(0, maxColors);

        console.log("ColorLearningPanel - colores filtrados:", {
            level: colorLevel,
            total: levelColors.length,
            limited: limitedColors.length,
            colors: limitedColors.map(c => c.name)
        });

        setDisplayColors(limitedColors);
    }, [colorLevel]);

    // Efectos adicionales para verificar colores
    useEffect(() => {
        console.log("DEBUG - ColorLearningPanel montado con:", {
            propColors: colors.length,
            propColorLevel: colorLevel,
            displayedColors: displayColors.length
        });

        return () => {
            console.log("DEBUG - ColorLearningPanel desmontado");
        };
    }, []);

    // Efecto para verificar cambios en displayColors
    useEffect(() => {
        console.log("DEBUG - displayColors actualizado:", {
            count: displayColors.length,
            names: displayColors.map(c => c.name)
        });
    }, [displayColors]);

    const handlePlayAudio = (color: ColorItem) => {
        speak(color.name);
    };

    const getLevelTitle = (): string => {
        switch (colorLevel) {
            case 'basic':
                return 'Colores Básicos (Nivel Principiante)';
            case 'intermediate':
                return 'Colores Intermedios (Nivel Medio)';
            case 'advanced':
                return 'Colores Avanzados (Nivel Experto)';
            default:
                return 'Aprende los colores en inglés';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-bold mb-4">
                Learn the colors (Aprende los colores)
            </h2>
            <p className="mb-6 text-gray-600">
                Before you start drawing, familiarize yourself with the colors you'll be using.
                (Antes de empezar a dibujar, familiarízate con los colores que usarás.)
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {displayColors.map((color) => (
                    <div
                        key={color.name}
                        className="flex items-center p-3 border rounded-lg hover:bg-gray-50"
                    >
                        <div
                            className="w-10 h-10 rounded-full mr-3"
                            style={{ backgroundColor: color.hexCode }}
                        />
                        <div className="flex flex-col flex-1">
                            <span className="font-medium">{color.name}</span>
                            <span className="text-sm text-gray-500">{color.translation}</span>
                        </div>
                        <button
                            className="p-2 rounded-full hover:bg-gray-200"
                            onClick={() => handlePlayAudio(color)}
                            disabled={isSpeaking}
                            aria-label={`Escuchar pronunciación de ${color.name}`}
                        >
                            <Play size={16} />
                        </button>
                    </div>
                ))}
            </div>

            <button
                onClick={onContinue}
                className="mt-8 w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary/90"
            >
                Continue to drawing (Continuar al dibujo)
            </button>
        </div>
    );
};

export default ColorLearningPanel; 