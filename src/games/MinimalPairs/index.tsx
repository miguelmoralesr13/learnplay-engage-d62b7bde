import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMinimalPairsGame } from './hooks/useMinimalPairsGame';
import PairCard from './components/PairCard';
import AudioButton from './components/AudioButton';
import WordOption from './components/WordOption';
import GameProgress from './components/GameProgress';
import GameComplete from './components/GameComplete';
import ParametersForm from '@/components/game/ParametersForm';
import PhonemeDifference from './components/PhonemeDifference';
import { getAllMinimalPairs } from './data/minimalPairsData';
import MinimalPairsConfig from './config';
import { DifficultyLevel } from '@/types/game';
import { MinimalPairsParameters } from './types/game';
import { Loader2, Volume2 } from 'lucide-react';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import GameWrapper from '@/components/game/GameWrapper';
import { log } from 'console';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

type GameStage = 'parameters' | 'instructions' | 'playing' | 'complete';

const MinimalPairsChallenge: React.FC = () => {
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [gameParameters, setGameParameters] = useState<MinimalPairsParameters>(
        MinimalPairsConfig.parameters as MinimalPairsParameters
    );

    const allPairs = getAllMinimalPairs();

    const {
        gameState,
        isSpeaking,
        startGame,
        playCorrectWordAudio,
        playBothWords,
        selectWord,
        nextPair,
        endGame,
        getCurrentPair,
        getProgress,
        playWordAudio
    } = useMinimalPairsGame(allPairs, gameParameters);

    const handleStartGame = (params: Partial<MinimalPairsParameters>) => {
        console.log('params', params);
        const updatedParams: MinimalPairsParameters = {
            ...gameParameters,
            ...params,
            difficulty: params.difficulty,
            pairCount: Number(params.pairCount) || 10,
            showPhonetics: params.showPhonetics !== undefined ? Boolean(params.showPhonetics) : true,
        };

        setGameParameters(updatedParams);
        setGameStage('instructions');
    };

    const handleInstructionsComplete = () => {
        startGame();
        setGameStage('playing');
    };

    const restartGame = () => {
        setGameStage('parameters');
    };

    useEffect(() => {
        if (gameState.gameComplete) {
            setGameStage('complete');
        }
    }, [gameState.gameComplete]);

    useEffect(() => {
        // Solo ejecutar una vez cuando cambie a 'playing' y sea el primer par
        if (gameStage === 'playing' && gameState.currentPairIndex === 0 && !gameState.feedback) {
            const initialAudioTimeout = setTimeout(() => {
                if (!isSpeaking && !gameState.feedback) {
                    console.log('Playing initial audio');
                    playCorrectWordAudio();
                }
            }, 2000);

            return () => {
                clearTimeout(initialAudioTimeout);
            };
        }
    }, [gameStage]); // Solo dependemos de gameStage para evitar bucles

    const currentPair = getCurrentPair();
    const progressPercentage = getProgress();

    const renderContent = () => {
        switch (gameStage) {
            case 'parameters':
                return (
                    <ParametersForm
                        gameConfig={MinimalPairsConfig}
                        onSubmit={handleStartGame}
                    />
                );

            case 'instructions':
                return (
                    <InstructionsPanel
                        instructions={MinimalPairsConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                );

            case 'complete':
                return (
                    <GameComplete
                        score={gameState.score}
                        metrics={{
                            correctWords: gameState.metrics.correctAnswers,
                            totalAttempts: gameState.metrics.totalAttempts,
                            averageScore: gameState.score / Math.max(1, gameState.metrics.totalAttempts),
                            completionTime: gameState.metrics.completionTime,
                            startTime: gameState.metrics.startTime,
                            endTime: gameState.metrics.endTime || 0
                        }}
                        onRestart={restartGame}
                    />
                );

            case 'playing':
                return currentPair && (
                    <div className="max-w-2xl mx-auto">
                        <GameProgress
                            current={gameState.currentPairIndex + 1}
                            total={gameState.pairs.length}
                            percentage={progressPercentage}
                        />

                        <div className="bg-card rounded-lg shadow-md p-6 mb-6">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentPair.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-semibold">¿Qué palabra escuchas?</h3>
                                        <p className="text-gray-500 text-sm mt-1">
                                            Escucha cuidadosamente y selecciona la palabra correcta
                                        </p>
                                    </div>

                                    <div className="flex justify-center gap-4 mb-6">
                                        <AudioButton
                                            onClick={playCorrectWordAudio}
                                            isPlaying={isSpeaking}
                                            label="Escuchar palabra"
                                            primary
                                        />
                                        <AudioButton
                                            onClick={playBothWords}
                                            isPlaying={isSpeaking}
                                            label="Comparar ambas"
                                        />
                                    </div>

                                    {gameParameters.showPhonetics && (
                                        <PhonemeDifference
                                            phoneme1={currentPair.focusPhoneme.first}
                                            phoneme2={currentPair.focusPhoneme.second}
                                            position={currentPair.focusPhoneme.position}
                                        />
                                    )}

                                    <div className="grid grid-cols-2 gap-6 mt-8">
                                        <WordOption
                                            word={currentPair.word1}
                                            showPhonetics={gameParameters.showPhonetics}
                                            isSelected={gameState.chosenWordIndex === 0}
                                            isCorrect={gameState.feedback && gameState.correctWordIndex === 0}
                                            isIncorrect={gameState.feedback && gameState.chosenWordIndex === 0 && gameState.correctWordIndex !== 0}
                                            disabled={gameState.feedback !== null || isSpeaking}
                                            onClick={() => selectWord(0)}
                                            onPlayAudio={() => playWordAudio(0)}
                                            isPlaying={isSpeaking}
                                        />
                                        <WordOption
                                            word={currentPair.word2}
                                            showPhonetics={gameParameters.showPhonetics}
                                            isSelected={gameState.chosenWordIndex === 1}
                                            isCorrect={gameState.feedback && gameState.correctWordIndex === 1}
                                            isIncorrect={gameState.feedback && gameState.chosenWordIndex === 1 && gameState.correctWordIndex !== 1}
                                            disabled={gameState.feedback !== null || isSpeaking}
                                            onClick={() => selectWord(1)}
                                            onPlayAudio={() => playWordAudio(1)}
                                            isPlaying={isSpeaking}
                                        />
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <AnimatePresence>
                            {gameState.feedback && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`p-6 rounded-lg shadow mb-4 ${gameState.feedback.isCorrect
                                        ? 'bg-green-50 border border-green-200'
                                        : 'bg-red-50 border border-red-200'
                                        }`}
                                >
                                    <div className="flex items-start">
                                        <div className={`rounded-full p-2 mr-4 ${gameState.feedback.isCorrect ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {gameState.feedback.isCorrect ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                        </div>
                                        <div>
                                            <h3 className={`font-bold ${gameState.feedback.isCorrect ? 'text-green-700' : 'text-red-700'
                                                }`}>
                                                {gameState.feedback.isCorrect ? '¡Correcto!' : 'Incorrecto'}
                                            </h3>
                                            <p className="mt-1">{gameState.feedback.message}</p>

                                            <div className="mt-4">
                                                <p>
                                                    <span className="font-medium">La palabra correcta era:</span>{' '}
                                                    <span className="font-bold">{gameState.feedback.correctWord}</span>
                                                </p>
                                                {!gameState.feedback.isCorrect && (
                                                    <p>
                                                        <span className="font-medium">Tu selección:</span>{' '}
                                                        <span className="font-bold">{gameState.feedback.selectedWord}</span>
                                                    </p>
                                                )}
                                            </div>

                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => playCorrectWordAudio()}
                                                    className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors flex items-center"
                                                    disabled={isSpeaking}
                                                >
                                                    {isSpeaking ? (
                                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                    ) : (
                                                        <Volume2 className="h-4 w-4 mr-2" />
                                                    )}
                                                    Escuchar de nuevo
                                                </button>
                                                <button
                                                    onClick={nextPair}
                                                    className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                                                >
                                                    Siguiente par
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                );
        }
    };

    return (
        <GameWrapper title="Minimal Pairs Challenge">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </GameWrapper>
    );
};

export default MinimalPairsChallenge; 