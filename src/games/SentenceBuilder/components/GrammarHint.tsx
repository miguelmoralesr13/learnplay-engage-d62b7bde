import { motion } from 'framer-motion';
import { Sentence } from '../types';

interface GrammarHintProps {
    sentence: Sentence | null;
    showHint: boolean;
    translation: string;
}

const GrammarHint = ({ sentence, showHint, translation }: GrammarHintProps) => {
    if (!sentence) return null;

    return (
        <div className="mt-4">
            {showHint && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3"
                >
                    <h4 className="font-medium text-blue-800 mb-1">Regla gramatical: {sentence.grammarFocus}</h4>
                    <p className="text-blue-700">{sentence.grammarHint}</p>
                </motion.div>
            )}

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                <p className="text-purple-700">
                    <span className="font-medium">Traducción:</span> {translation}
                </p>
            </div>
        </div>
    );
};

export default GrammarHint; 