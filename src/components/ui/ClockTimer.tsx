import React from 'react';

interface ClockTimerProps {
    timeRemaining: number;
    totalTime: number;
    size?: 'small' | 'medium' | 'large';
    position?: 'top-right' | 'center' | 'custom';
    className?: string;
}

const ClockTimer: React.FC<ClockTimerProps> = ({
    timeRemaining,
    totalTime,
    size = 'small',
    position = 'top-right',
    className = ''
}) => {
    // Obtener dimensiones según tamaño
    const getDimensions = () => {
        switch (size) {
            case 'small': return { width: 'w-16 h-16', viewBox: '0 0 50 50', center: 25, radius: 20, stroke: 3 };
            case 'medium': return { width: 'w-24 h-24', viewBox: '0 0 60 60', center: 30, radius: 25, stroke: 4 };
            case 'large': return { width: 'w-32 h-32', viewBox: '0 0 80 80', center: 40, radius: 35, stroke: 5 };
        }
    };

    // Determinar color basado en tiempo restante
    const getColor = () => {
        if (timeRemaining < 10) return '#ef4444'; // rojo
        if (timeRemaining < 30) return '#f59e0b'; // amarillo
        return '#3b82f6'; // azul
    };

    // Formatear tiempo para mostrar
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    // Obtener estilo de posicionamiento
    const getPositionClass = () => {
        switch (position) {
            case 'top-right': return 'flex justify-end -mt-8 mb-2';
            case 'center': return 'flex justify-center my-2';
            case 'custom': return '';
        }
    };

    // Obtener tamaño de texto
    const getTextSize = () => {
        switch (size) {
            case 'small': return 'text-xs';
            case 'medium': return 'text-sm';
            case 'large': return 'text-base';
        }
    };

    const dim = getDimensions();
    const positionClass = position === 'custom' ? '' : getPositionClass();
    const finalClassName = positionClass + ' ' + className;

    return (
        <div className={finalClassName}>
            <div className={`relative ${dim.width}`}>
                {/* SVG del reloj */}
                <svg className="w-full h-full" viewBox={dim.viewBox}>
                    {/* Círculo base */}
                    <circle
                        cx={dim.center}
                        cy={dim.center}
                        r={dim.radius}
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth={dim.stroke}
                    />
                    {/* Círculo de progreso */}
                    <circle
                        cx={dim.center}
                        cy={dim.center}
                        r={dim.radius}
                        fill="none"
                        stroke={getColor()}
                        strokeWidth={dim.stroke}
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * dim.radius}
                        strokeDashoffset={2 * Math.PI * dim.radius * (1 - timeRemaining / totalTime)}
                        transform={`rotate(-90 ${dim.center} ${dim.center})`}
                        className="transition-all duration-1000 ease-linear"
                    />
                    {/* Manecilla de segundos */}
                    <line
                        x1={dim.center}
                        y1={dim.center}
                        x2={dim.center}
                        y2={dim.center - dim.radius + 5}
                        stroke="#333"
                        strokeWidth="1"
                        transform={`rotate(${timeRemaining * 6} ${dim.center} ${dim.center})`}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                {/* Texto del tiempo en el centro */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`${getTextSize()} font-semibold`}>{formatTime(timeRemaining)}</span>
                </div>
            </div>
        </div>
    );
};

export default ClockTimer; 