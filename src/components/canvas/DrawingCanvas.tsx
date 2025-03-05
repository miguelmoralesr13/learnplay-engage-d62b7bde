import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ColorItem, DrawingObject } from '../../games/PaintDrawingGame/types';
import { Trash2 } from 'lucide-react';

interface DrawingCanvasProps {
    object: DrawingObject;
    selectedColor: ColorItem | null;
    width?: number;
    height?: number;
    onSave?: (dataURL: string) => void;
    onColorUsed?: (colorName: string) => void;
    isDisabled?: boolean;
}

const DrawingCanvas = React.forwardRef<HTMLCanvasElement, DrawingCanvasProps>(({
    object,
    selectedColor,
    width = 500,
    height = 400,
    onSave,
    onColorUsed,
    isDisabled = false
}, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const contextRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [usedColors, setUsedColors] = useState<Set<string>>(new Set());

    // Pasar la referencia externa
    useEffect(() => {
        if (ref && canvasRef.current) {
            if (typeof ref === 'function') {
                ref(canvasRef.current);
            } else {
                ref.current = canvasRef.current;
            }
        }
    }, [ref]);

    // Inicializar el canvas y cargar la imagen
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Configuración del canvas
        canvas.width = width * 2;
        canvas.height = height * 2;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const context = canvas.getContext('2d');
        if (!context) return;

        context.scale(2, 2);
        context.lineCap = 'round';
        context.lineWidth = 5;
        contextRef.current = context;

        // Siempre iniciar con un lienzo en blanco
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, width, height);

        // Dibujar un marco simple con instrucciones
        drawFallbackImage(context, width, height, object.name);
        setIsImageLoaded(true);
    }, [object, width, height]);

    // Función para dibujar SVG path
    const drawSvgPath = (context: CanvasRenderingContext2D, pathData: string) => {
        const commands = pathData.match(/[A-Z][^A-Z]*/g) || [];
        context.beginPath();

        for (const cmd of commands) {
            const command = cmd[0];
            const params = cmd.substring(1).trim().split(/[\s,]+/).map(parseFloat);

            switch (command) {
                case 'M': // Move to
                    context.moveTo(params[0], params[1]);
                    break;
                case 'L': // Line to
                    context.lineTo(params[0], params[1]);
                    break;
                case 'Z': // Close path
                    context.closePath();
                    break;
            }
        }

        context.stroke();
    };

    // Actualizar color del pincel
    useEffect(() => {
        if (contextRef.current && selectedColor) {
            contextRef.current.strokeStyle = selectedColor.hexCode;
        }
    }, [selectedColor]);

    const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
        if (isDisabled || !selectedColor || !isImageLoaded) return;

        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;

        const rect = canvas.getBoundingClientRect();
        let x: number, y: number;

        if ('touches' in e) {
            // Evento touch
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            // Evento mouse
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        contextRef.current.beginPath();
        contextRef.current.moveTo(x, y);
        setIsDrawing(true);

        if (onColorUsed && selectedColor) {
            onColorUsed(selectedColor.name);
        }
    };

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || isDisabled || !selectedColor) return;

        const canvas = canvasRef.current;
        if (!canvas || !contextRef.current) return;

        const rect = canvas.getBoundingClientRect();
        let x: number, y: number;

        if ('touches' in e) {
            e.preventDefault(); // Prevenir scroll en móviles
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }

        contextRef.current.lineTo(x, y);
        contextRef.current.stroke();
    };

    const stopDrawing = () => {
        if (!isDrawing) return;

        if (contextRef.current) {
            contextRef.current.closePath();
        }

        setIsDrawing(false);
    };

    const clearCanvas = useCallback(() => {
        if (!contextRef.current) {
            console.warn("No se puede limpiar el canvas: contexto no disponible");
            return;
        }

        // Limpiar canvas
        contextRef.current.fillStyle = '#FFFFFF';
        contextRef.current.fillRect(0, 0, width, height);

        // Limpiar el registro de colores usados (importante!)
        setUsedColors(new Set());

        // Notificar al componente padre que se ha reiniciado
        if (onColorUsed) {
            // Reiniciar los colores usados en el componente padre
            onColorUsed('reset');
        }

        console.log("Canvas limpiado correctamente");
    }, [width, height, onColorUsed]);

    const saveCanvas = () => {
        if (!canvasRef.current) return;

        const dataUrl = canvasRef.current.toDataURL('image/png');

        if (onSave) {
            onSave(dataUrl);
        }

        // También permite descargar la imagen
        const link = document.createElement('a');
        link.download = `${object.name}-drawing.png`;
        link.href = dataUrl;
        link.click();
    };

    // Simplificar la función de fallback para crear un lienzo de dibujo limpio
    const drawFallbackImage = (
        context: CanvasRenderingContext2D,
        width: number,
        height: number,
        objectName: string
    ) => {
        // Borde sutil
        context.strokeStyle = '#EEEEEE';
        context.lineWidth = 2;
        context.strokeRect(5, 5, width - 10, height - 10);

        // Nombre del objeto como título
        context.fillStyle = '#666666';
        context.font = '18px Arial';
        context.textAlign = 'center';
        context.fillText(`Draw: ${objectName}`, width / 2, 30);
    };

    return (
        <div className="drawing-canvas-container relative">
            <div className="canvas-container relative">
                {!isImageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                        <p>Cargando imagen...</p>
                    </div>
                )}

                <canvas
                    ref={canvasRef}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className={`border rounded shadow-sm cursor-crosshair ${isDisabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                    style={{ touchAction: 'none' }}
                />
            </div>

            {/* Controles del canvas - reposicionados */}
            <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                    onClick={clearCanvas}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full shadow-sm transition-colors"
                    type="button"
                    title="Limpiar lienzo"
                    disabled={isDisabled}
                >
                    <Trash2 size={18} />
                </button>

                <button
                    className="bg-primary hover:bg-primary/90 text-white p-2 rounded-full shadow-sm transition-colors"
                    onClick={saveCanvas}
                    title="Guardar dibujo"
                    disabled={isDisabled}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                        <polyline points="17 21 17 13 7 13 7 21"></polyline>
                        <polyline points="7 3 7 8 15 8"></polyline>
                    </svg>
                </button>
            </div>

            {selectedColor ? (
                <div className="mt-4 text-sm">
                    Color seleccionado: <span className="font-bold">{selectedColor.name}</span>
                </div>
            ) : (
                <div className="mt-4 text-sm text-gray-500">
                    Selecciona un color para empezar a pintar
                </div>
            )}
        </div>
    );
});

export default DrawingCanvas; 