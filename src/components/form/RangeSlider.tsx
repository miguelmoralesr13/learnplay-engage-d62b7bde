import React, { useState, useEffect } from 'react';

interface RangeSliderProps {
    name: string;
    label: string;
    min?: number;
    max?: number;
    step?: number;
    defaultValue?: number;
    value?: number;
    description?: string;
    onChange: (value: number) => void;
}

const RangeSlider: React.FC<RangeSliderProps> = ({
    name,
    label,
    min = 0,
    max = 100,
    step = 1,
    defaultValue,
    value,
    description,
    onChange
}) => {
    // Asegurar que el valor inicial sea válido
    const initialValue = value !== undefined && !isNaN(Number(value))
        ? Number(value)
        : (defaultValue || min);

    // Estado local para mostrar el valor actual
    const [localValue, setLocalValue] = useState<number>(initialValue);

    // Actualizar el estado local cuando cambia el prop value
    useEffect(() => {
        if (value !== undefined && !isNaN(Number(value))) {
            setLocalValue(Number(value));
        }
    }, [value]);

    // Manejar cambio en el slider
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);

        // Actualizar el valor local para la UI
        setLocalValue(newValue);

        // Notificar al componente padre del cambio
        onChange(newValue);
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-2">
                <label htmlFor={name} className="block font-medium text-gray-700">
                    {label}
                </label>
                <span className="text-sm font-medium text-gray-900">
                    {localValue}
                </span>
            </div>

            <input
                type="range"
                id={name}
                name={name}
                min={min}
                max={max}
                step={step}
                value={localValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />

            <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{min}</span>
                <span>{max}</span>
            </div>

            {description && (
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            )}
        </div>
    );
};

export default RangeSlider; 