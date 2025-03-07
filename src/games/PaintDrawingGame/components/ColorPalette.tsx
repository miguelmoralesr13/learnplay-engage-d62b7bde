import React, { useState } from 'react';
import { ColorItem } from '../types';
import { Play, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface ColorPaletteProps {
    colors: ColorItem[];
    selectedColor: ColorItem | null;
    onSelectColor: (color: ColorItem) => void;
    showNames: boolean;
    enableAudio: boolean;
}

const ColorPalette: React.FC<ColorPaletteProps> = ({
    colors,
    selectedColor,
    onSelectColor,
    showNames,
    enableAudio
}) => {
    const [hoveredColor, setHoveredColor] = useState<ColorItem | null>(null);
    const { speak, isSpeaking } = useTextToSpeech();
    const [currentPage, setCurrentPage] = useState(0);

    // Configurar colores por página según cantidad total
    const colorsPerPage = colors.length <= 8 ? colors.length : 8;
    const totalPages = Math.ceil(colors.length / colorsPerPage);

    // Calcular colores para la página actual
    const displayColors = colors.slice(
        currentPage * colorsPerPage,
        (currentPage + 1) * colorsPerPage
    );

    const handleColorClick = (color: ColorItem) => {
        onSelectColor(color);
        if (enableAudio) {
            speak(color.name);
        }
    };

    const handlePlayAudio = (e: React.MouseEvent, color: ColorItem) => {
        e.stopPropagation();
        speak(color.name);
    };

    // Determinación del nivel para mostrar en el título
    const determineLevel = (colorCount: number): string => {
        if (colorCount <= 4) return "Colores Básicos";
        if (colorCount <= 8) return "Colores Intermedios";
        return "Colores Avanzados";
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-medium text-lg mb-3">
                Color Palette (Paleta de colores)
            </h3>
            <p className="text-sm text-gray-600 mb-4">
                Select a color to use in your drawing (Selecciona un color para usar en tu dibujo)
            </p>

            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium">
                    {determineLevel(colors.length)} ({colors.length})
                </h3>

                {/* Mostrar paginación solo si hay más de una página */}
                {totalPages > 1 && (
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => setCurrentPage(prev => (prev - 1 + totalPages) % totalPages)}
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label="Página anterior"
                        >
                            <ChevronLeft size={16} />
                        </button>
                        <span className="text-sm">
                            {currentPage + 1}/{totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(prev => (prev + 1) % totalPages)}
                            className="p-1 rounded-full hover:bg-gray-200"
                            aria-label="Página siguiente"
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-4 gap-4 mb-3">
                {displayColors.map((color) => (
                    <div
                        key={color.name}
                        className="relative flex flex-col items-center"
                        onMouseEnter={() => setHoveredColor(color)}
                        onMouseLeave={() => setHoveredColor(null)}
                    >
                        <button
                            className={`w-12 h-12 rounded-full transition-all hover:scale-110 
                                ${selectedColor?.name === color.name
                                    ? 'ring-4 ring-primary shadow-lg scale-110'
                                    : 'border-2 border-gray-200'}`
                            }
                            style={{ backgroundColor: color.hexCode }}
                            onClick={() => handleColorClick(color)}
                            title={color.name}
                        />

                        {(showNames || hoveredColor?.name === color.name) && (
                            <div className="color-name absolute top-full mt-1 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white px-2 py-1 rounded text-xs z-10">
                                {color.name}
                                {enableAudio && (
                                    <button
                                        className="ml-1 p-1 rounded-full hover:bg-gray-700"
                                        onClick={(e) => handlePlayAudio(e, color)}
                                        disabled={isSpeaking}
                                    >
                                        <Play size={10} />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mostrar el color seleccionado de forma destacada */}
            {selectedColor && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center bg-gray-50 p-2 rounded-md">
                        <div
                            className="w-8 h-8 rounded-full mr-2 border-2 border-gray-300"
                            style={{ backgroundColor: selectedColor.hexCode }}
                        ></div>
                        <div>
                            <div className="font-medium text-sm">{selectedColor.name}</div>
                            <div className="text-xs text-gray-500">{selectedColor.translation}</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColorPalette; 