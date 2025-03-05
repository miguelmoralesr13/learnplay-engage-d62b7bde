import { motion, AnimatePresence } from 'framer-motion';

interface ComboIndicatorProps {
    combo: number;
    multiplier: number;
}

const ComboIndicator = ({ combo, multiplier }: ComboIndicatorProps) => {
    // Calcular multiplicador actual
    const currentMultiplier = 1 + (combo * multiplier);

    // Solo mostrar si hay combo
    if (combo <= 1) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed top-20 right-8 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
                <div className="text-center">
                    <div className="text-sm uppercase tracking-wide">Combo</div>
                    <div className="text-2xl font-bold">{combo}x</div>
                    <div className="text-xs">
                        Multiplicador: {currentMultiplier.toFixed(1)}x
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ComboIndicator; 