import { ReactNode } from 'react';

interface GameWrapperProps {
    title: string;
    children: ReactNode;
}

const GameWrapper = ({ title, children }: GameWrapperProps) => {
    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-center mb-4">{title} Game</h1>
            {children}
        </div>
    );
};

export default GameWrapper; 