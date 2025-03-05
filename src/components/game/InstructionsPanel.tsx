import { useState } from 'react';
import { motion } from 'framer-motion';

interface InstructionsPanelProps {
    instructions: string[];
    onComplete: () => void;
}

const InstructionsPanel = ({ instructions, onComplete }: InstructionsPanelProps) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < instructions.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete();
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-6"
        >
            <h2 className="text-2xl font-bold mb-6">Instrucciones</h2>

            <div className="min-h-[200px] flex items-center justify-center mb-8">
                <motion.p
                    key={currentStep}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-lg text-center"
                >
                    {instructions[currentStep]}
                </motion.p>
            </div>

            <div className="flex justify-between items-center">
                <div className="flex gap-2">
                    {instructions.map((_, index) => (
                        <div
                            key={index}
                            className={`w-2 h-2 rounded-full ${index === currentStep ? 'bg-purple' : 'bg-gray-300'
                                }`}
                        />
                    ))}
                </div>

                <button
                    className="px-6 py-2 rounded-lg bg-purple text-white hover:bg-purple/90"
                    onClick={handleNext}
                >
                    {currentStep < instructions.length - 1 ? 'Siguiente' : 'Comenzar'}
                </button>
            </div>
        </motion.div>
    );
};

export default InstructionsPanel; 