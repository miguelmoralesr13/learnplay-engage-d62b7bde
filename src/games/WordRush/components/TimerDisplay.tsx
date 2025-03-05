import { motion } from 'framer-motion';

interface TimerDisplayProps {
    timeLeft: number;
    totalTime: number;
    formattedTime: string;
}

const TimerDisplay = ({ timeLeft, totalTime, formattedTime }: TimerDisplayProps) => {
    // Calcular porcentaje de tiempo restante
    const percentage = (timeLeft / totalTime) * 100;

    // Determinar color basado en tiempo restante
    const getColor = () => {
        if (percentage > 50) return 'bg-green-500';
        if (percentage > 25) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="w-full mb-6">
            <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{formattedTime}</span>
                <span className="text-sm font-medium">
                    {Math.round(percentage)}%
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${getColor()} transition-all duration-300`}
                    initial={{ width: '100%' }}
                    animate={{ width: `${percentage}%` }}
                />
            </div>
        </div>
    );
};

export default TimerDisplay; 