import React from 'react';
import { motion } from 'framer-motion';

interface InstructionsPanelProps {
    instructions: string[];
    onComplete: () => void;
    children?: React.ReactNode;
}

const InstructionsPanel: React.FC<InstructionsPanelProps> = ({
    instructions,
    onComplete,
    children
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Instrucciones</h2>

            <ul className="space-y-3 mb-6">
                {instructions.map((instruction, index) => (
                    <li key={index} className="flex items-start">
                        <span className="inline-block w-2 h-2 mt-2 mr-3 bg-primary rounded-full"></span>
                        <span className="text-gray-700">{instruction}</span>
                    </li>
                ))}
            </ul>

            {children}

            <div className="mt-6 text-center">
                <button
                    onClick={onComplete}
                    className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-8 rounded-lg transition-colors"
                >
                    Siguiente
                </button>
            </div>
        </motion.div>
    );
};

export default InstructionsPanel; 