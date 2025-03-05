import React from 'react';
import { Button } from '@/components/ui/button';
import { LightbulbIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HintDisplayProps {
    hint: string | null;
    hintLevel: number;
    onRequestHint: () => void;
    isPlaying: boolean;
}

const HintDisplay: React.FC<HintDisplayProps> = ({
    hint,
    hintLevel,
    onRequestHint,
    isPlaying
}) => {
    return (
        <div className="w-full max-w-md mx-auto">
            <div className="mb-2 flex justify-between items-center">
                <span className="text-sm text-gray-500">
                    {hintLevel > 0 ? `Pista ${hintLevel}/3` : "¿Necesitas ayuda?"}
                </span>

                <Button
                    size="sm"
                    variant="outline"
                    onClick={onRequestHint}
                    disabled={!isPlaying || hintLevel >= 3}
                    className="flex items-center gap-1"
                >
                    <LightbulbIcon size={16} />
                    {hintLevel === 0 ? "Obtener pista" : "Más pistas"}
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {hint && (
                    <motion.div
                        key={hint}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="bg-secondary/20 p-3 rounded-md text-sm"
                    >
                        <div className="font-medium mb-1">Pista:</div>
                        <div>{hint}</div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default HintDisplay; 