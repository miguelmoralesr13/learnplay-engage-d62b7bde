import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GameCompleteProps {
    score: number;
    metrics: {
        correctWords: number;
        totalAttempts: number;
        averageScore: number;
        completionTime: number;
        startTime: number;
        endTime: number;
    };
    onRestart: () => void;
}

const GameComplete: React.FC<GameCompleteProps> = ({ score, metrics, onRestart }) => {
    const accuracy = metrics.totalAttempts > 0
        ? Math.round((metrics.correctWords / metrics.totalAttempts) * 100)
        : 0;

    // Preparar datos para gráfico
    const chartData = [
        { name: 'Correctas', value: metrics.correctWords, fill: '#22c55e' },
        { name: 'Incorrectas', value: metrics.totalAttempts - metrics.correctWords, fill: '#ef4444' }
    ];

    // Formatear segundos a mm:ss
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <motion.div
            className="max-w-2xl mx-auto bg-card rounded-lg shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <h2 className="text-2xl font-bold text-center mb-6">¡Juego completado!</h2>

            <div className="text-center mb-8">
                <div className="text-5xl font-bold text-primary">{score}</div>
                <div className="text-gray-500 mt-1">Puntuación final</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
                    <div className="text-sm text-green-700 mt-1">Precisión</div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">{metrics.correctWords}</div>
                    <div className="text-sm text-blue-700 mt-1">Aciertos</div>
                </div>

                <div className="bg-amber-50 p-4 rounded-lg text-center">
                    <div className="text-3xl font-bold text-amber-600">{formatTime(metrics.completionTime)}</div>
                    <div className="text-sm text-amber-700 mt-1">Tiempo total</div>
                </div>
            </div>

            <div className="h-64 mb-8">
                <h3 className="text-lg font-medium mb-3">Distribución de respuestas</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="text-center mt-8">
                <button
                    onClick={onRestart}
                    className="px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                    Jugar de nuevo
                </button>
            </div>
        </motion.div>
    );
};

export default GameComplete; 