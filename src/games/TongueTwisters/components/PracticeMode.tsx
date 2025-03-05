import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ChevronRight, Volume2 } from 'lucide-react';

interface PracticeModeProps {
    text: string;
    onPlay: () => void;
    onComplete: () => void;
    isPlaying: boolean;
}

const PracticeMode: React.FC<PracticeModeProps> = ({
    text,
    onPlay,
    onComplete,
    isPlaying
}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const words = text.split(' ');

    const handleNext = () => {
        if (currentStep < words.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="space-y-6">
            <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                    Practice each word carefully
                </p>
                <div className="flex justify-center gap-2 text-xl">
                    {words.map((word, index) => (
                        <motion.span
                            key={index}
                            className={index === currentStep ? 'text-primary font-bold' : 'text-muted-foreground'}
                            animate={{
                                scale: index === currentStep ? 1.1 : 1,
                                opacity: index === currentStep ? 1 : 0.5
                            }}
                        >
                            {word}
                        </motion.span>
                    ))}
                </div>
            </div>

            <div className="flex justify-center gap-4">
                <Button
                    variant="outline"
                    onClick={onPlay}
                    disabled={isPlaying}
                >
                    <Volume2 className="h-4 w-4 mr-2" />
                    Listen
                </Button>
                <Button onClick={handleNext}>
                    {currentStep < words.length - 1 ? (
                        <>
                            Next Word
                            <ChevronRight className="h-4 w-4 ml-2" />
                        </>
                    ) : (
                        'Start Practice'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default PracticeMode; 