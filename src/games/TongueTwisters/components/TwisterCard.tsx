import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AudioControls } from './AudioControls';
import { TongueTwister } from '../types';

interface TwisterCardProps {
    twister: TongueTwister;
    showTranslation: boolean;
    recordedAudioUrl: string | null;
    isPlaying: boolean;
    isRecording: boolean;
    currentTime: number;
    duration: number;
    onPlayOriginal: () => void;
    onPauseAudio: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    onPlayRecording: () => void;
    speedMultiplier: number;
    attempts: number;
}

export const TwisterCard: React.FC<TwisterCardProps> = ({
    twister,
    showTranslation,
    recordedAudioUrl,
    isPlaying,
    isRecording,
    currentTime,
    duration,
    onPlayOriginal,
    onPauseAudio,
    onStartRecording,
    onStopRecording,
    onPlayRecording,
    speedMultiplier,
    attempts
}) => {
    return (
        <Card className="w-full max-w-lg mx-auto">
            <CardHeader>
                <div className="flex justify-between items-center">
                    <CardTitle className="text-xl">Tongue Twister</CardTitle>
                    <Badge variant={
                        twister.difficulty === 'beginner' ? 'outline' :
                            twister.difficulty === 'intermediate' ? 'secondary' :
                                'destructive'
                    }>
                        {twister.difficulty}
                    </Badge>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div className="p-4 bg-card border rounded-md text-center">
                    <p className="text-xl font-medium">{twister.text}</p>
                    {showTranslation && twister.translation && (
                        <p className="text-sm text-muted-foreground mt-2 italic">
                            {twister.translation}
                        </p>
                    )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    <AudioControls
                        type="original"
                        isPlaying={isPlaying && !isRecording}
                        isRecording={false}
                        canRecord={false}
                        canPlayback={true}
                        currentTime={currentTime}
                        duration={duration}
                        onPlay={onPlayOriginal}
                        onPause={onPauseAudio}
                        onStartRecording={() => { }}
                        onStopRecording={() => { }}
                        onPlayRecording={() => { }}
                        speedMultiplier={speedMultiplier}
                    />

                    <AudioControls
                        type="recording"
                        isPlaying={isPlaying && !isRecording && !!recordedAudioUrl}
                        isRecording={isRecording}
                        canRecord={!isRecording && !isPlaying}
                        canPlayback={!!recordedAudioUrl}
                        currentTime={isRecording ? 0 : currentTime}
                        duration={isRecording ? 0 : duration}
                        onPlay={() => { }}
                        onPause={onPauseAudio}
                        onStartRecording={onStartRecording}
                        onStopRecording={onStopRecording}
                        onPlayRecording={onPlayRecording}
                    />
                </div>
            </CardContent>

            <CardFooter>
                <div className="w-full flex justify-between items-center">
                    <span className="text-sm">
                        Attempts: {attempts}
                    </span>
                </div>
            </CardFooter>
        </Card>
    );
}; 