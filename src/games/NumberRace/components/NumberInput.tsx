import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

interface NumberInputProps {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    isCorrect: boolean | null;
    isPlaying: boolean;
}

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    onSubmit,
    isCorrect,
    isPlaying
}) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [shakeEffect, setShakeEffect] = useState(false);

    // Enfocar el input automáticamente cuando el juego está activo
    useEffect(() => {
        if (isPlaying && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isPlaying, value]);

    // Efecto de animación cuando la respuesta es incorrecta
    useEffect(() => {
        if (isCorrect === false) {
            setShakeEffect(true);
            const timer = setTimeout(() => setShakeEffect(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isCorrect]);

    // Manejar el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-md">
            <div className="space-y-4">
                <motion.div
                    animate={shakeEffect ? { x: [-10, 10, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                >
                    <Input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Type the number in words..."
                        className="w-full text-lg"
                        disabled={!isPlaying}
                        aria-invalid={isCorrect === false}
                    />
                </motion.div>

                <Button
                    type="submit"
                    className="w-full"
                    disabled={!isPlaying || !value.trim()}
                >
                    Check Answer
                </Button>

                {isCorrect === false && (
                    <p className="text-destructive text-sm">
                        Try again! Remember to use hyphens for compound numbers.
                    </p>
                )}
            </div>
        </form>
    );
};

export default NumberInput; 