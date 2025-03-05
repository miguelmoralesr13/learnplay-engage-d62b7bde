import { MinimalPair } from '../types/game';
import { DifficultyLevel } from '@/types/game';
import { FieldOption } from '@/types/parameterForm';
import data from './data.json';
// mix data
const minimalPairsData: MinimalPair[] = (data.data as MinimalPair[]);
export const getAllMinimalPairs = (): MinimalPair[] => {
    // REVOLVE DATA
    const mixedData = [...minimalPairsData].sort(() => Math.random() - 0.5);
    return mixedData;
};

