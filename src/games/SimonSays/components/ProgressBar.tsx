import React from 'react';

interface ProgressBarProps {
    current: number;
    total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
    const percentage = (current / total) * 100;

    return (
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
            <div
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
            />
        </div>
    );
};

export default ProgressBar; 