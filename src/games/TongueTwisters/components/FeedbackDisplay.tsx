import React from 'react';
import { Progress } from '@/components/ui/progress';

interface FeedbackDisplayProps {
    accuracy: number;
    speed: number;
    clarity: number;
    message: string;
}

const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({
    accuracy,
    speed,
    clarity,
    message
}) => {
    return (
        <div className="bg-muted p-4 rounded-lg">
            <p className="text-lg font-medium mb-4">{message}</p>

            <div className="space-y-4">
                <div>
                    <div className="flex justify-between mb-2">
                        <span>Accuracy</span>
                        <span>{accuracy}%</span>
                    </div>
                    <Progress value={accuracy} />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span>Speed</span>
                        <span>{speed}x</span>
                    </div>
                    <Progress value={speed * 100} />
                </div>

                <div>
                    <div className="flex justify-between mb-2">
                        <span>Clarity</span>
                        <span>{clarity}%</span>
                    </div>
                    <Progress value={clarity} />
                </div>
            </div>
        </div>
    );
};

export default FeedbackDisplay; 