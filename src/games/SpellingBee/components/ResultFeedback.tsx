import { motion } from 'framer-motion';
import { SpellingWord } from '../types';
import { Check, X, RefreshCw } from 'lucide-react';

interface ResultFeedbackProps {
    word: SpellingWord;
    isCorrect: boolean;
    userInput: string;
    onNext: () => void;
    onRetry?: () => void;
    attemptsLeft?: number;
}

const ResultFeedback = ({
    word,
    isCorrect,
    userInput,
    onNext,
    onRetry,
    attemptsLeft = 0
}: ResultFeedbackProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white rounded-xl p-6 shadow-md max-w-lg mx-auto"
        >
            <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                    {isCorrect ? (
                        <Check className="w-8 h-8 text-green-600" />
                    ) : (
                        <X className="w-8 h-8 text-red-600" />
                    )}
                </div>
            </div>

            <h3 className="text-xl font-bold text-center mb-2">
                {isCorrect ? 'Correct!' : 'Incorrect'}
            </h3>

            <div className="text-center mb-4">
                <p className="text-gray-600">
                    The word is <span className="font-bold">{word.word}</span>
                </p>

                {!isCorrect && (
                    <div className="mt-2">
                        <div className="text-sm text-gray-500">You typed:</div>
                        <div className="font-mono text-red-600">{userInput}</div>
                    </div>
                )}
            </div>

            <div className="space-y-3 mb-6">
                <div>
                    <div className="text-xs text-gray-500">Phonetic:</div>
                    <div className="font-mono">{word.phonetic}</div>
                </div>

                <div>
                    <div className="text-xs text-gray-500">Definition:</div>
                    <div>{word.definition}</div>
                </div>

                <div>
                    <div className="text-xs text-gray-500">Example:</div>
                    <div className="italic">"{word.example}"</div>
                </div>

                {word.spellingPattern && (
                    <div>
                        <div className="text-xs text-gray-500">Spelling Pattern:</div>
                        <div className="text-sm bg-purple/10 p-2 rounded">
                            {word.spellingPattern}
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-2">
                {!isCorrect && onRetry && attemptsLeft > 0 && (
                    <button
                        onClick={onRetry}
                        className="w-full py-3 rounded-xl bg-secondary text-primary font-medium 
                                hover:bg-secondary/90 transition-colors flex items-center justify-center"
                    >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Try Again ({attemptsLeft} {attemptsLeft === 1 ? 'attempt' : 'attempts'} left)
                    </button>
                )}

                <button
                    onClick={onNext}
                    className="w-full py-3 rounded-xl bg-purple text-white font-medium 
                            hover:bg-purple/90 transition-colors"
                >
                    {isCorrect ? 'Next Word' : 'Continue'}
                </button>
            </div>
        </motion.div>
    );
};

export default ResultFeedback; 