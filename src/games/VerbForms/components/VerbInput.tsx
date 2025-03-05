import { FormEvent, useRef, useEffect } from 'react';
import { Verb, VerbTense } from '../types';
import { getTenseExplanation, getTenseDescription } from '../utils/verbData';

interface VerbInputProps {
    verb: Verb | null;
    tense: { label: string, value: VerbTense };
    userInput: string[];
    isCorrect: boolean | null;
    onInputChange: (input: string) => void;
    onSubmit: () => void;
    disabled?: boolean;
}

const VerbInput = ({
    verb,
    tense,
    userInput,
    isCorrect,
    onInputChange,
    onSubmit,
    disabled = false
}: VerbInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    // Enfocar el input cuando cambie el verbo o el tiempo verbal
    useEffect(() => {
        if (inputRef.current && !disabled) {
            inputRef.current.focus();
        }
    }, [verb, tense, disabled]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!disabled) {
            onSubmit();
        }
    };

    if (!verb) return null;

    return (
        <div className="glass-card rounded-xl p-6 mb-6">
            <div className="text-center mb-6">
                <h3 className="text-lg font-medium text-muted-foreground">
                    Escribe la forma correcta:
                </h3>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-2xl font-bold">{verb.base}</span>
                    <span className="text-xl">→</span>
                    <span className="text-xl font-medium text-purple">
                        {getTenseDescription(tense.value)}
                    </span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input
                        ref={inputRef}
                        type="text"
                        value={userInput[0]}
                        onChange={(e) => onInputChange(e.target.value)}
                        disabled={disabled}
                        className={`w-full p-3 text-lg text-center border rounded-lg focus:outline-none focus:ring-2
              ${isCorrect === true
                                ? 'border-green-500 bg-green-50 text-green-700 focus:ring-green-300'
                                : isCorrect === false
                                    ? 'border-red-500 bg-red-50 text-red-700 focus:ring-red-300'
                                    : 'border-gray-300 focus:ring-purple focus:border-purple'
                            }
              ${disabled ? 'opacity-70 cursor-not-allowed' : ''}
            `}
                        placeholder="Escribe la respuesta..."
                        aria-label={`Forma ${getTenseDescription(tense.value)} de ${verb.base}`}
                    />
                </div>

                <button
                    type="submit"
                    disabled={disabled || !userInput[0].trim()}
                    className={`w-full py-3 rounded-lg text-white font-medium
            ${disabled || !userInput[0].trim()
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-purple hover:bg-purple/90'
                        }
          `}
                >
                    Comprobar
                </button>
            </form>

            {isCorrect === false && (
                <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-700 mb-1">La respuesta correcta es: <strong>{verb[tense.value]}</strong></p>
                    <p className="text-sm text-red-600">{getTenseExplanation(tense.value)}</p>
                </div>
            )}

            {isCorrect === true && (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                    <p className="text-green-700">¡Correcto! Pasando al siguiente verbo...</p>
                </div>
            )}
        </div>
    );
};

export default VerbInput; 