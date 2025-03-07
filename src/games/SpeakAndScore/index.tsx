import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GameWrapper from '@/components/game/GameWrapper';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { Progress } from '@/components/ui/progress';
import { useGameRegistry } from '@/games/registry';
import ParametersForm from '@/components/game/ParametersForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { gameInstructions, gameConfig } from './config';
import { WordCard } from './components/WordCard';
import { useSpeakAndScoreGame } from './hooks/useSpeakAndScoreGame';
import { useSpeakAndScoreStore } from './store';

const SpeakAndScoreGame: React.FC = () => {
    useGameRegistry(); // Registrar el juego en el store global

    const {
        parameters,
        setParameters,
        gamePhase,
        startGame,
        nextWord,
        currentWord,
        isListening,
        isRecording,
        recordedAudioUrl,
        timeRemaining,
        currentScore,
        attempts,
        completedWords,
        audioLevels,
        resetGame,
        endGame,

        // Propiedades adicionales del hook
        recognizedText,
        textSimilarity,
        showRecognitionFeedback,
        hideRecognitionFeedback,

        // Controladores de audio
        handlePlayWord,
        handlePauseAudio,
        handleStartRecording,
        handleStopRecording,
        isPlaying,
        currentTime,
        duration
    } = useSpeakAndScoreGame();

    // Cuando se complete la instrucción, mostrar la primera palabra
    const handleInstructionsComplete = () => {
        nextWord();
    };

    // Debug del estado de reconocimiento
    useEffect(() => {
        console.log(recognizedText, textSimilarity, showRecognitionFeedback);
    }, [recognizedText, textSimilarity, showRecognitionFeedback]);

    // Restablecer el juego cuando el componente se desmonte
    useEffect(() => {
        return () => {
            resetGame();
        };
    }, [resetGame]);

    return (
        <GameWrapper
            title="Speak & Score"
        >
            {gamePhase === 'setup' && (
                <div className="w-full max-w-lg mx-auto space-y-8">
                    <ParametersForm
                        gameConfig={gameConfig}
                        onSubmit={(values) => {
                            setParameters(values);
                            startGame();
                        }}
                    />
                </div>
            )}

            {gamePhase === 'instructions' && (
                <InstructionsPanel
                    instructions={gameInstructions}
                    onComplete={handleInstructionsComplete}
                />
            )}

            {gamePhase === 'playing' && currentWord && (
                <div className="w-full space-y-6">
                    {parameters.useTimer && (
                        <div className="w-full max-w-lg mx-auto space-y-2">
                            <div className="flex justify-between text-sm">
                                <span>Time Remaining</span>
                                <span>{timeRemaining} seconds</span>
                            </div>
                            <Progress
                                value={(timeRemaining / parameters.timeLimitSeconds) * 100}
                                className="h-2"
                            />
                        </div>
                    )}

                    <WordCard
                        word={currentWord}
                        showPhonetics={parameters.showPhonetics}
                        isPlaying={isPlaying}
                        isRecording={isRecording}
                        currentTime={currentTime}
                        duration={duration}
                        attempts={attempts}
                        audioLevels={audioLevels}
                        onPlayOriginal={handlePlayWord}
                        onPauseAudio={handlePauseAudio}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                    />

                    {showRecognitionFeedback && (
                        <Alert className="w-full max-w-lg mx-auto">
                            <AlertTitle className="flex justify-between items-center">
                                <span>Your Pronunciation</span>
                                <Badge
                                    variant={textSimilarity > 80 ? "secondary" :
                                        textSimilarity > 50 ? "outline" : "destructive"}
                                >
                                    {textSimilarity}% accuracy
                                </Badge>
                            </AlertTitle>
                            <AlertDescription className="mt-2">
                                <p className="text-base italic mb-4">You said: "{recognizedText}"</p>
                                <div className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            hideRecognitionFeedback();
                                            handleStartRecording();
                                        }}
                                    >
                                        Try Again
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            // Actualizar puntuación antes de avanzar
                                            const pointsEarned = Math.round(textSimilarity / 10); // 0-10 puntos
                                            useSpeakAndScoreStore.setState({
                                                currentScore: currentScore + pointsEarned,
                                                completedWords: [...completedWords, currentWord.id],
                                                showRecognitionFeedback: false
                                            });
                                            nextWord();
                                        }}
                                    >
                                        {textSimilarity > 70 ? "Perfect! Next Word" : "Continue"}
                                    </Button>
                                </div>
                            </AlertDescription>
                        </Alert>
                    )}

                    {!showRecognitionFeedback && (
                        <div className="flex justify-center space-x-4">
                            <Button
                                variant="outline"
                                onClick={endGame}
                            >
                                End Game
                            </Button>
                            <Button
                                variant="default"
                                onClick={() => {
                                    // Simular reconocimiento para pruebas
                                    useSpeakAndScoreStore.setState({
                                        recognizedText: currentWord.text.toLowerCase(),
                                        textSimilarity: 85,
                                        showRecognitionFeedback: true,
                                        attempts: attempts + 1
                                    });
                                }}
                            >
                                Simulate Recognition
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {gamePhase === 'feedback' && (
                <FeedbackDisplay
                    gameId="speak-and-score"
                    score={currentScore}
                    maxScore={parameters.wordsPerSession * 10}
                    metrics={{
                        correct: Math.round(currentScore / 10),
                        incorrect: completedWords.length - Math.round(currentScore / 10),
                        timeSpent: parameters.useTimer ? parameters.timeLimitSeconds - timeRemaining : 120
                    }}
                    onPlayAgain={resetGame}
                />
            )}
        </GameWrapper>
    );
};

export default SpeakAndScoreGame;
