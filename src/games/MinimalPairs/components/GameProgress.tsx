import React from 'react';

interface GameProgressProps {
    current: number;
    total: number;
    percentage: number;
}

const GameProgress: React.FC<GameProgressProps> = ({ current, total, percentage }) => {
    return (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">
                    Progreso: {current} de {total} pares
                </span>
                <span className="text-sm font-medium text-gray-700">
                    {percentage}%
                </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                    className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
        </div>
    );
};

export default GameProgress; 