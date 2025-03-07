import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import GameWrapper from '@/components/game/GameWrapper';
import InstructionsPanel from '@/components/game/InstructionsPanel';
import FeedbackDisplay from '@/components/game/FeedbackDisplay';
import { gameInstructions, gameConfig } from './config';
import { TwisterCard } from './components/TwisterCard';
import { useTongueTwistersGame } from './hooks/useTongueTwistersGame';
import { Progress } from '@/components/ui/progress';
import { useGameRegistry } from '@/games/registry';
import ParametersForm from '@/components/game/ParametersForm';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useTongueTwistersStore } from './store';

const TongueTwistersGame: React.FC = () => {

    const {
        parameters,
        setParameters,
        gamePhase,
        startGame,
        nextTwister,
        currentTwister,
        isListening,
        isRecording,
        recordedAudioUrl,
        timeRemaining,
        currentScore,
        attempts,
        completedTwisters,
        resetGame,
        endGame,

        // Controladores de audio
        handlePlayTwister,
        handlePlayRecording,
        handleStartRecording,
        handleStopRecording,
        isPlaying,
        currentTime,
        duration,

        // Propiedades adicionales del hook
        recognizedText,
        textSimilarity,
        showRecognitionFeedback,
        hideRecognitionFeedback,
    } = useTongueTwistersGame();

    // Cuando se complete la instrucción, mostrar el primer trabalenguas
    const handleInstructionsComplete = () => {
        nextTwister();
    };
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
            title="Tongue Twisters"
        >
            {gamePhase === 'setup' && (
                <div className="w-full max-w-lg mx-auto space-y-8">
                    <ParametersForm
                        gameConfig={gameConfig}
                        onSubmit={(values) => {
                            console.log(values);
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

            {gamePhase === 'playing' && currentTwister && (
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

                    <TwisterCard
                        twister={currentTwister}
                        showTranslation={parameters.showTranslation}
                        recordedAudioUrl={recordedAudioUrl}
                        isPlaying={isPlaying}
                        isRecording={isRecording}
                        currentTime={currentTime}
                        duration={duration}
                        onPlayOriginal={handlePlayTwister}
                        onPauseAudio={() => { /* Implementar lógica para pausar */ }}
                        onStartRecording={handleStartRecording}
                        onStopRecording={handleStopRecording}
                        onPlayRecording={handlePlayRecording}
                        speedMultiplier={parameters.speedMultiplier}
                        attempts={attempts}
                    />

                    {showRecognitionFeedback && (
                        <Alert className="w-full max-w-lg mx-auto">
                            <AlertTitle className="flex justify-between items-center">
                                <span>Tu pronunciación</span>
                                <Badge
                                    variant={textSimilarity > 80 ? "secondary" :
                                        textSimilarity > 50 ? "outline" : "destructive"}
                                >
                                    {textSimilarity}% similar
                                </Badge>
                            </AlertTitle>
                            <AlertDescription className="mt-2">
                                <p className="text-base italic mb-4">"{recognizedText}"</p>
                                <div className="flex justify-between">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            hideRecognitionFeedback();
                                            handleStartRecording();
                                        }}
                                    >
                                        Intentar de nuevo
                                    </Button>
                                    <Button
                                        variant="default"
                                        size="sm"
                                        onClick={() => {
                                            // Actualizar puntuación antes de avanzar
                                            const pointsEarned = Math.round(textSimilarity / 20); // 0-5 puntos
                                            useTongueTwistersStore.setState({
                                                currentScore: currentScore + pointsEarned,
                                                completedTwisters: [...completedTwisters, currentTwister.id],
                                                showRecognitionFeedback: false
                                            });
                                            nextTwister();
                                        }}
                                    >
                                        {textSimilarity > 70 ? "¡Excelente! Siguiente" : "Continuar"}
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
                                onClick={nextTwister}
                            >
                                Next Twister
                            </Button>
                        </div>
                    )}
                </div>
            )}

            {gamePhase === 'feedback' && (
                <FeedbackDisplay
                    gameId="tongue-twisters"
                    score={currentScore}
                    maxScore={100}
                    metrics={{
                        correct: Math.round(currentScore / 10),  // Estimación de respuestas correctas
                        incorrect: attempts - Math.round(currentScore / 10),  // Intentos incorrectos
                        timeSpent: 120  // Tiempo gastado en segundos
                    }}
                    onPlayAgain={resetGame}
                />
            )}
        </GameWrapper>
    );
};

export default TongueTwistersGame;
