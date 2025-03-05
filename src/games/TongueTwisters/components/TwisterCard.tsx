import React from 'react';
import { TongueTwister } from '../types/game';
import { Button } from '@/components/ui/button';
import { Loader2, Mic, Volume2 } from 'lucide-react';

interface TwisterCardProps {
    twister: TongueTwister;
    isPlaying: boolean;
    isRecording: boolean;
    showTranslation: boolean;
    onPlay: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
}

const TwisterCard: React.FC<TwisterCardProps> = ({
    twister,
    isPlaying,
    isRecording,
    showTranslation,
    onPlay,
    onStartRecording,
    onStopRecording
}) => {
    return (
        <div className="bg-card rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold mb-4">{twister.text}</h3>

            {showTranslation && twister.translation && (
                <p className="text-muted-foreground mb-4">{twister.translation}</p>
            )}

            <div className="flex gap-4 justify-center">
                <Button
                    onClick={onPlay}
                    disabled={isPlaying || isRecording}
                    variant="outline"
                >
                    {isPlaying ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Volume2 className="h-4 w-4 mr-2" />
                    )}
                    Listen
                </Button>

                <Button
                    onClick={isRecording ? onStopRecording : onStartRecording}
                    variant={isRecording ? "destructive" : "default"}
                >
                    <Mic className="h-4 w-4 mr-2" />
                    {isRecording ? "Stop" : "Start"}
                </Button>
            </div>
        </div>
    );
};

export default TwisterCard; 