import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SpellingInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
    maxLength?: number;
    placeholder?: string;
    isCorrect: boolean | null;
    correctWord?: string;
}

const SpellingInput = ({
    value,
    onChange,
    onSubmit,
    disabled = false,
    maxLength = 30,
    placeholder = 'Type the word...',
    isCorrect,
    correctWord
}: SpellingInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [shake, setShake] = useState(false);

    // Enfocar el input automáticamente cuando se monta
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [disabled]);

    // Manejar envío con Enter
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !disabled) {
            onSubmit();

            // Efecto de shake si es incorrecto
            if (isCorrect === false) {
                setShake(true);
                setTimeout(() => setShake(false), 500);
            }
        }
    };

    // Determinar la clase según el estado
    const getInputClass = () => {
        if (isCorrect === null) return 'border-gray-300 focus:border-purple';
        return isCorrect
            ? 'border-green-500 bg-green-50'
            : 'border-red-500 bg-red-50';
    };

    return (
        <div className="w-full max-w-md mx-auto">
            <motion.div
                animate={shake ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                transition={{ duration: 0.5 }}
            >
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    className={`w-full px-4 py-3 text-xl text-center rounded-xl 
                    border-2 outline-none transition-colors
                    ${getInputClass()}
                    ${disabled ? 'bg-gray-100 text-gray-500' : ''}`}
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                />
            </motion.div>

            {isCorrect === false && correctWord && (
                <p className="mt-2 text-center text-red-600">
                    <span className="font-medium">Correct spelling:</span> {correctWord}
                </p>
            )}

            <div className="mt-4 text-center">
                <button
                    onClick={onSubmit}
                    disabled={disabled || value.trim() === ''}
                    className={`px-6 py-2 rounded-lg font-medium
                    ${disabled || value.trim() === ''
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-purple text-white hover:bg-purple/90'
                        }`}
                >
                    Check
                </button>
            </div>
        </div>
    );
};

export default SpellingInput; 