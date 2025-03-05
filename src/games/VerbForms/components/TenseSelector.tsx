import { VerbTense } from '../types';
import { getTenseDescription } from '../utils/verbData';

interface TenseSelectorProps {
    tenses: { label: string, value: VerbTense }[];
    selectedTense: { label: string, value: VerbTense };
    onTenseChange: (tense: VerbTense) => void;
    disabled?: boolean;
}

const TenseSelector = ({
    tenses,
    selectedTense,
    onTenseChange,
    disabled = false
}: TenseSelectorProps) => {
    return (
        <div className="flex flex-wrap gap-2 mb-6">
            {tenses.map((tense) => (
                <button
                    key={tense.value}
                    onClick={() => onTenseChange(tense.value)}
                    disabled={disabled}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
            ${selectedTense.value === tense.value
                            ? 'bg-purple text-white'
                            : 'bg-secondary hover:bg-secondary/80 text-foreground'
                        }
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
                    aria-pressed={selectedTense.value === tense.value}
                >
                    {getTenseDescription(tense.value)}
                </button>
            ))}
        </div>
    );
};

export default TenseSelector; 