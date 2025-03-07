import React from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    Play,
    Pause,
    Mic,
    Square,
    Volume2,
    VolumeX
} from 'lucide-react';

interface AudioControlsProps {
    isPlaying: boolean;
    isRecording: boolean;
    canRecord: boolean;
    canPlayback: boolean;
    currentTime: number;
    duration: number;
    onPlay: () => void;
    onPause: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onPlayRecording: () => void;
    type: 'original' | 'recording';
    speedMultiplier?: number;
}

export const AudioControls: React.FC<AudioControlsProps> = ({
    isPlaying,
    isRecording,
    canRecord,
    canPlayback,
    currentTime,
    duration,
    onPlay,
    onPause,
    onStartRecording,
    onStopRecording,
    onPlayRecording,
    type,
    speedMultiplier = 1
}) => {
    // Calcular el progreso
    const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

    // Formatear tiempo (MM:SS)
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-4 p-4 rounded-lg bg-secondary/20">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                    {type === 'original' ? 'Original Twister' : 'Your Recording'}
                </span>
                {type === 'original' && speedMultiplier !== 1 && (
                    <span className="text-xs bg-primary/10 px-2 py-1 rounded">
                        {speedMultiplier}x Speed
                    </span>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
            </div>

            <div className="flex justify-center space-x-2">
                {type === 'original' ? (
                    // Controles para audio original
                    <Button
                        size="icon"
                        variant={isPlaying ? "secondary" : "default"}
                        onClick={isPlaying ? onPause : onPlay}
                        disabled={!canPlayback}
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                ) : (
                    // Controles para grabación
                    <>
                        {!isRecording ? (
                            <>
                                <Button
                                    size="icon"
                                    variant="destructive"
                                    onClick={onStartRecording}
                                    disabled={!canRecord}
                                    aria-label="Start Recording"
                                >
                                    <Mic className="h-4 w-4" />
                                </Button>
                                {canPlayback && (
                                    <Button
                                        size="icon"
                                        variant={isPlaying ? "secondary" : "default"}
                                        onClick={isPlaying ? onPause : onPlayRecording}
                                        aria-label={isPlaying ? "Pause" : "Play Recording"}
                                    >
                                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Button
                                size="icon"
                                variant="destructive"
                                onClick={onStopRecording}
                                aria-label="Stop Recording"
                            >
                                <Square className="h-4 w-4" />
                            </Button>
                        )}
                    </>
                )}

                {type === 'original' && (
                    <Button
                        size="icon"
                        variant="outline"
                        disabled
                        aria-label={speedMultiplier === 0 ? "Muted" : "Sound On"}
                    >
                        {speedMultiplier === 0 ? (
                            <VolumeX className="h-4 w-4" />
                        ) : (
                            <Volume2 className="h-4 w-4" />
                        )}
                    </Button>
                )}
            </div>
        </div>
    );
}; 