import React from 'react';
import { useVoiceStore } from '@/store/voiceStore';

export const VoiceControl: React.FC = () => {
    const {
        isListening,
        transcript,
        error,
        isSpeaking,
        startListening,
        stopListening,
        resetTranscript,
        speak
    } = useVoiceStore();

    const handleToggleListening = async () => {
        if (isListening) {
            stopListening();
        } else {
            await startListening();
        }
    };

    const handleSpeak = () => {
        speak(transcript, {
            rate: 1.0,
            pitch: 1.0,
            onEnd: () => console.log('Finished speaking')
        });
    };

    return (
        <div className="p-4">
            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleToggleListening}
                    className={`px-4 py-2 rounded ${isListening ? 'bg-red-500' : 'bg-blue-500'
                        } text-white`}
                >
                    {isListening ? 'Stop Listening' : 'Start Listening'}
                </button>
                <button
                    onClick={handleSpeak}
                    disabled={!transcript || isSpeaking}
                    className="px-4 py-2 rounded bg-green-500 text-white disabled:opacity-50"
                >
                    Speak Text
                </button>
                <button
                    onClick={resetTranscript}
                    disabled={!transcript}
                    className="px-4 py-2 rounded bg-gray-500 text-white disabled:opacity-50"
                >
                    Reset
                </button>
            </div>

            {transcript && (
                <div className="mb-4">
                    <h3 className="font-bold">Transcript:</h3>
                    <p className="text-gray-700">{transcript}</p>
                </div>
            )}

            {error && (
                <div className="text-red-500">
                    Error: {error}
                </div>
            )}

            {isSpeaking && (
                <div className="text-green-500">
                    Speaking...
                </div>
            )}
        </div>
    );
}; 