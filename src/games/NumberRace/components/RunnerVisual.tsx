import React from 'react';
import { motion } from 'framer-motion';

interface RunnerVisualProps {
    position: number; // 0-100%
    level: number;
}

const RunnerVisual: React.FC<RunnerVisualProps> = ({ position, level }) => {
    return (
        <div className="w-full h-12 bg-secondary/30 rounded-full overflow-hidden mb-8 relative">
            {/* Fondo de la pista con líneas de meta */}
            <div className="absolute inset-0 flex justify-between px-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-full w-px bg-secondary/70"
                        style={{ left: `${i * 10}%` }}
                    />
                ))}
            </div>

            {/* Indicador de posición */}
            <motion.div
                className="h-full bg-gradient-to-r from-primary/70 to-primary flex items-center justify-end px-3"
                style={{ width: `${position}%` }}
                animate={{ width: `${position}%` }}
                transition={{ type: 'spring', stiffness: 100 }}
            >
                {/* Corredor (ícono o avatar) */}
                <motion.div
                    className="bg-background rounded-full p-1 shadow-md"
                    animate={{
                        x: [0, 5, 0, -5, 0],
                        y: [0, -3, 0, -3, 0]
                    }}
                    transition={{
                        repeat: Infinity,
                        duration: 0.5,
                        ease: "linear"
                    }}
                >
                    <span role="img" aria-label="runner" className="text-lg">
                        🏃
                    </span>
                </motion.div>
            </motion.div>

            {/* Nivel actual */}
            <div className="absolute right-2 top-1 bg-primary text-primary-foreground rounded-full px-2 text-xs font-bold">
                Level {level}
            </div>
        </div>
    );
};

export default RunnerVisual; 