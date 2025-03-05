import React from 'react';

interface PhonemeDifferenceProps {
    phoneme1: string;
    phoneme2: string;
    position: 'initial' | 'medial' | 'final';
}

const PhonemeDifference: React.FC<PhonemeDifferenceProps> = ({
    phoneme1,
    phoneme2,
    position
}) => {
    const getPositionText = () => {
        switch (position) {
            case 'initial': return 'al principio';
            case 'medial': return 'en medio';
            case 'final': return 'al final';
            default: return '';
        }
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium text-blue-700">Diferencia de pronunciación</h4>
            <p className="mt-2">
                Escucha la diferencia entre los sonidos{' '}
                <span className="font-bold text-blue-800 p-1 bg-blue-100 rounded">{phoneme1}</span>{' '}
                y{' '}
                <span className="font-bold text-blue-800 p-1 bg-blue-100 rounded">{phoneme2}</span>{' '}
                {getPositionText()} de la palabra.
            </p>
            <p className="mt-2 text-sm text-blue-600">
                Presta atención a cómo cambia la posición de tu lengua y labios al pronunciar estos sonidos.
            </p>
        </div>
    );
};

export default PhonemeDifference; 