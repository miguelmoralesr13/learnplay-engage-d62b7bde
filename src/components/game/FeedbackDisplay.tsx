import React from 'react';
import { motion } from 'framer-motion';
import { GameMetrics } from '@/types/game';
import { Button } from '../ui/button';
import { TrophyIcon, RotateCcw } from 'lucide-react';

interface FeedbackDisplayProps {
    gameId: string;
    score: number;
    maxScore: number;
    metrics: GameMetrics;
    customMetrics?: { label: string; value: string }[];
    onPlayAgain: () => void;
    customFeedback?: React.ReactNode;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
    gameId,
    score,
    maxScore,
    metrics,
    customMetrics,
    onPlayAgain,
    customFeedback
}) => {
    const percentage = Math.round((score / maxScore) * 100);

    // Convertir tiempo de segundos a formato legible
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}m ${secs}s`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-6"
        >
            <div className="flex items-center justify-center mb-6">
                <div className="bg-yellow-100 p-3 rounded-full mr-4">
                    <TrophyIcon className="h-8 w-8 text-yellow-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">¡Juego completado!</h2>
            </div>

            <div className="score-container text-center mb-6">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Puntuación</p>
                <p className="text-4xl font-bold text-primary">{score} puntos</p>
            </div>

            <div className="text-center">
                <div className="text-muted-foreground">
                    {percentage}% de puntuación máxima
                </div>
            </div>

            <div className="metrics-grid grid grid-cols-3 gap-4 mb-8">
                <div className="text-center p-4 rounded-lg bg-secondary">
                    <div className="text-2xl font-medium">{metrics.correct}</div>
                    <div className="text-sm text-muted-foreground">Correctas</div>
                </div>

                <div className="text-center p-4 rounded-lg bg-secondary">
                    <div className="text-2xl font-medium">{metrics.incorrect}</div>
                    <div className="text-sm text-muted-foreground">Incorrectas</div>
                </div>

                <div className="text-center p-4 rounded-lg bg-secondary">
                    <div className="text-2xl font-medium">{formatTime(metrics.timeSpent)}</div>
                    <div className="text-sm text-muted-foreground">Tiempo</div>
                </div>
            </div>

            {/* Mostrar métricas personalizadas si existen */}
            {customMetrics && customMetrics.length > 0 && (
                <div className="custom-metrics-container mb-6">
                    <h3 className="text-md font-medium text-gray-700 mb-2">Estadísticas adicionales</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {customMetrics.map((metric, index) => (
                            <div key={index} className="custom-metric p-2 bg-gray-50 rounded border flex justify-between">
                                <span className="text-sm text-gray-600">{metric.label}:</span>
                                <span className="text-sm font-medium">{metric.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {customFeedback}

            <div className="text-center">
                <Button
                    onClick={onPlayAgain}
                    className="flex items-center bg-primary hover:bg-primary/90"
                >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Jugar de nuevo
                </Button>
            </div>
        </motion.div>
    );
};

export default FeedbackDisplay; 