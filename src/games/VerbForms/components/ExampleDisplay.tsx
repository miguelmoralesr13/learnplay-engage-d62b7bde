import { Verb, VerbTense } from '../types';

interface ExampleDisplayProps {
    verb: Verb | null;
    tense: { label: string, value: VerbTense };
}

const ExampleDisplay = ({ verb, tense }: ExampleDisplayProps) => {
    if (!verb) return null;

    // Mapeo de tiempos a ejemplos
    const getExamplesByTense = () => {
        switch (tense.value) {
            case 'past':
                return [
                    { title: 'Pasado Simple', sentence: verb.examples.past },
                    { title: 'Pasado Perfecto', sentence: verb.examples.pastPerfect }
                ];
            case 'pastParticiple':
                return [
                    { title: 'Presente Perfecto', sentence: verb.examples.presentPerfect },
                    { title: 'Pasado Perfecto', sentence: verb.examples.pastPerfect }
                ];
            case 'present':
                return [
                    { title: 'Presente Simple', sentence: verb.examples.present },
                    { title: 'Futuro Simple', sentence: verb.examples.future }
                ];
            case 'gerund':
                // Para el gerundio, creamos ejemplos específicos
                return [
                    { title: 'Gerundio como sujeto', sentence: `${verb.gerund.charAt(0).toUpperCase() + verb.gerund.slice(1)} is a good exercise.` },
                    { title: 'Gerundio después de preposición', sentence: `They are interested in ${verb.gerund}.` }
                ];
            default:
                return [];
        }
    };

    const examples = getExamplesByTense();

    return (
        <div className="glass-card rounded-xl p-4">
            <h3 className="text-lg font-medium mb-4">Ejemplos:</h3>
            <div className="space-y-3">
                {examples.map((example, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3 bg-white/50">
                        <h4 className="text-sm font-medium text-gray-500 mb-1">{example.title}</h4>
                        <p className="text-md">{example.sentence}</p>
                    </div>
                ))}
            </div>

            {verb.isRegular ? (
                <div className="mt-4 text-sm text-green-600 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                    <span>Verbo regular</span>
                </div>
            ) : (
                <div className="mt-4 text-sm text-orange-600 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-orange-500 mr-2"></span>
                    <span>Verbo irregular</span>
                </div>
            )}
        </div>
    );
};

export default ExampleDisplay; 