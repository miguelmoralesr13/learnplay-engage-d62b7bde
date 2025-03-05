import React from 'react';
import { MinimalPair } from '../types/game';

interface PairCardProps {
    pair: MinimalPair;
    showPhonetics: boolean;
}

const PairCard: React.FC<PairCardProps> = ({ pair, showPhonetics }) => {
    return (
        <div className="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
            <div className="text-center p-4 bg-white rounded-md shadow-sm">
                <h3 className="text-xl font-bold">{pair.word1.text}</h3>
                {showPhonetics && (
                    <p className="text-gray-500 mt-1">{pair.word1.phonetic}</p>
                )}
            </div>

            <div className="text-center p-4 bg-white rounded-md shadow-sm">
                <h3 className="text-xl font-bold">{pair.word2.text}</h3>
                {showPhonetics && (
                    <p className="text-gray-500 mt-1">{pair.word2.phonetic}</p>
                )}
            </div>
        </div>
    );
};

export default PairCard; 