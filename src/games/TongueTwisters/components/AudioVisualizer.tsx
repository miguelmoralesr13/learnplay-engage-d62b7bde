import React from 'react';

interface AudioVisualizerProps {
    levels: number[];
    bpm?: number;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ levels, bpm }) => {
    return (
        <div className="flex justify-center items-end gap-1 h-16 mb-4">
            {levels.map((level, i) => (
                <div
                    key={i}
                    className="w-2 bg-primary transition-all duration-50"
                    style={{
                        height: `${level}%`,
                        opacity: bpm ? (i % 2 === 0 ? 1 : 0.6) : 1
                    }}
                />
            ))}
        </div>
    );
};

export default AudioVisualizer; 