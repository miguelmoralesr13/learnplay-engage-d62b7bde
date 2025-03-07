import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Word } from '../types';
import { Volume, Mic, Play, Pause, StopCircle } from 'lucide-react';

interface WordCardProps {
    word: Word;
    showPhonetics: boolean;
    isPlaying: boolean;
    isRecording: boolean;
    currentTime: number;
    duration: number;
    attempts: number;
    audioLevels: number[];
    onPlayOriginal: () => void;
    onPauseAudio: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
}

export const WordCard: React.FC<WordCardProps> = ({
    word,
    showPhonetics,
    isPlaying,
    isRecording,
    currentTime,
    duration,
    attempts,
    audioLevels,
    onPlayOriginal,
    onPauseAudio,
    onStartRecording,
    onStopRecording
}) => {
    // Renderizar los niveles de audio como una forma de onda
    const renderAudioLevels = () => {
        return (
            <div className="flex items-center h-16 space-x-1 my-4 w-full justify-center">
                {audioLevels.map((level, index) => (
                    <div
                        key={index}
                        className="w-2 bg-primary transition-all duration-100"
                        style={{ height: `${Math.max(4, level)}%` }}
                    ></div>
                ))}
            </div>
        );
    };

    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <CardTitle className="text-center text-3xl">
                    {word.text}
                    {showPhonetics && (
                        <span className="block text-base text-muted-foreground mt-1">
                            {word.phonetic}
                        </span>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="text-center text-muted-foreground">
                    {word.meaning}
                </div>

                {/* Audio Waveform Visualization */}
                {renderAudioLevels()}

                {/* Playback Progress */}
                {isPlaying && duration > 0 && (
                    <div className="space-y-1">
                        <Progress value={(currentTime / duration) * 100} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(currentTime)}s</span>
                            <span>{Math.round(duration)}s</span>
                        </div>
                    </div>
                )}

                <div className="flex justify-center space-x-4 mt-4">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={isPlaying ? onPauseAudio : onPlayOriginal}
                        disabled={isRecording}
                    >
                        {isPlaying ? <Pause /> : <Volume />}
                    </Button>
                    <Button
                        variant={isRecording ? "destructive" : "default"}
                        size="icon"
                        onClick={isRecording ? onStopRecording : onStartRecording}
                        disabled={isPlaying}
                    >
                        {isRecording ? <StopCircle /> : <Mic />}
                    </Button>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between text-sm">
                <span>Attempts: {attempts}</span>
                <span>Difficulty: {word.difficulty}</span>
            </CardFooter>
        </Card>
    );
}; 