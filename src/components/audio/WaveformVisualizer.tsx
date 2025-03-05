import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
    audioData: number[];
    width?: number;
    height?: number;
    barWidth?: number;
    barGap?: number;
    backgroundColor?: string;
    barColor?: string;
    isRecording?: boolean;
}

const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({
    audioData,
    width = 300,
    height = 100,
    barWidth = 2,
    barGap = 1,
    backgroundColor = 'transparent',
    barColor = '#3A86FF',
    isRecording = false
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // Draw waveform
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Set background
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);

        // Calculate number of bars that fit in the canvas
        const totalWidth = barWidth + barGap;
        const numBars = Math.floor(width / totalWidth);

        // Use available data or fill with zeros
        const normalizedData =
            audioData.length > 0 ?
                audioData.slice(0, numBars) :
                Array(numBars).fill(0);

        // Draw bars
        ctx.fillStyle = barColor;

        normalizedData.forEach((value, index) => {
            // Calculate bar height (value is 0-1)
            const barHeight = value * height;

            // Calculate position (center vertically)
            const x = index * totalWidth;
            const y = (height - barHeight) / 2;

            // Draw bar
            ctx.fillRect(x, y, barWidth, barHeight);
        });

        // Add recording indicator if recording
        if (isRecording) {
            ctx.beginPath();
            ctx.arc(15, 15, 8, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF006E';
            ctx.fill();
        }
    }, [audioData, width, height, barWidth, barGap, backgroundColor, barColor, isRecording]);

    const getAudioLevel = (audioData: number[]): number => {
        if (!audioData || audioData.length === 0) return 0;

        // Calcular el nivel promedio (valor absoluto de las muestras)
        const sum = audioData.reduce((acc, val) => acc + Math.abs(val), 0);
        return sum / audioData.length;
    };

    return (
        <div className="relative">
            <canvas
                ref={canvasRef}
                width={width}
                height={height}
                className="waveform-visualizer"
            />
            {isRecording && (
                <div className="absolute top-1 right-2 text-xs text-gray-500 bg-white bg-opacity-75 px-1 rounded">
                    Nivel: {Math.round(getAudioLevel(audioData) * 100)}%
                </div>
            )}
        </div>
    );
};

export default WaveformVisualizer;