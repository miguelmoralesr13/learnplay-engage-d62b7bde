import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTongueTwistersGame } from './hooks/useTongueTwistersGame';
import TwisterCard from './components/TwisterCard';
import AudioVisualizer from './components/AudioVisualizer';
import FeedbackDisplay from './components/FeedbackDisplay';
import { tongueTwisters } from './data/tongueTwisters';
import TongueTwistersConfig from './config';
import { TongueTwistersParameters } from './types/game';
import GameWrapper from '@/components/game/GameWrapper';
import ParametersForm from '@/components/game/ParametersForm';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import metadata from './metadata';

type GameStage = 'parameters' | 'instructions' | 'playing';

const TongueTwistersChallenge: React.FC = () => {
    const [gameStage, setGameStage] = useState<GameStage>('parameters');
    const [parameters, setParameters] = useState<TongueTwistersParameters>(
        TongueTwistersConfig.parameters as TongueTwistersParameters
    );

    const {
        state,
        isSpeaking,
        audioLevels,
        playTwister,
        startRecording,
        stopRecording,
        getCurrentTwister,
        startGame
    } = useTongueTwistersGame(tongueTwisters, parameters);

    const handleParametersSubmit = (formData: any) => {
        const gameParameters: TongueTwistersParameters = {
            ...TongueTwistersConfig.parameters,
            ...formData
        };

        setParameters(gameParameters);
        setGameStage('instructions');
    };

    const handleInstructionsComplete = () => {
        startGame();
        setGameStage('playing');
    };

    const currentTwister = getCurrentTwister();

    const renderContent = () => {
        switch (gameStage) {
            case 'parameters':
                return (
                    <ParametersForm
                        gameConfig={TongueTwistersConfig}
                        onSubmit={handleParametersSubmit}
                    />
                );

            case 'instructions':
                return (
                    <InstructionsPanel
                        instructions={TongueTwistersConfig.instructions}
                        onComplete={handleInstructionsComplete}
                    />
                );

            case 'playing':
                return currentTwister && (
                    <div className="max-w-2xl mx-auto space-y-6">
                        <AudioVisualizer
                            levels={audioLevels}
                            bpm={parameters.useRhythm ? currentTwister.bpm : undefined}
                        />

                        <TwisterCard
                            twister={currentTwister}
                            isPlaying={isSpeaking}
                            isRecording={state.isRecording}
                            showTranslation={parameters.showTranslation}
                            onPlay={playTwister}
                            onStartRecording={startRecording}
                            onStopRecording={stopRecording}
                        />

                        {state.feedback && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                            >
                                <FeedbackDisplay {...state.feedback} />
                            </motion.div>
                        )}
                    </div>
                );
        }
    };

    return (
        <GameWrapper title={metadata.name}>
            <AnimatePresence mode="wait">
                <motion.div
                    key={gameStage}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    {renderContent()}
                </motion.div>
            </AnimatePresence>
        </GameWrapper>
    );
};

export default TongueTwistersChallenge; 