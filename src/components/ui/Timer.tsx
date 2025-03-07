import React from 'react';

interface TimerProps {
    seconds: number;
    variant?: 'default' | 'warning' | 'danger';
}

const Timer: React.FC<TimerProps> = ({ seconds, variant = 'default' }) => {
    // Formatear segundos a formato mm:ss
    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Determinar estilo según variante
    const getTimerStyle = () => {
        switch (variant) {
            case 'warning':
                return 'bg-amber-100 text-amber-800 border-amber-300';
            case 'danger':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-blue-100 text-blue-800 border-blue-300';
        }
    };

    return (
        <div className={`px-3 py-1 rounded-full border ${getTimerStyle()} flex items-center`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">{formatTime(seconds)}</span>
        </div>
    );
};

export default Timer; 