import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ChipOption {
    value: string | number;
    label: string;
}

interface MultiSelectChipsProps {
    name: string;
    label: string;
    options: ChipOption[];
    defaultValues?: ChipOption[];
    values?: Record<string, any>;
    value?: ChipOption[];
    onChange?: (name: string, selectedValues: ChipOption[]) => void;
    description?: string;
}

const MultiSelectChips: React.FC<MultiSelectChipsProps> = ({
    name,
    label,
    options,
    defaultValues,
    values,
    value,
    onChange,
    description
}) => {
    // Determinar el valor inicial
    const getInitialValue = (): ChipOption[] => {
        if (value) return value;
        if (values && values[name]) return values[name];
        if (defaultValues) return defaultValues;
        return [];
    };

    const [selectedOptions, setSelectedOptions] = useState<ChipOption[]>(getInitialValue());

    // Sincronizar con props externas
    useEffect(() => {
        if (value) {
            setSelectedOptions(value);
        } else if (values && values[name]) {
            setSelectedOptions(values[name]);
        }
    }, [value, values, name]);

    // Comprobar si una opción está seleccionada
    const isOptionSelected = (option: ChipOption): boolean => {
        return selectedOptions.some(selected => selected.value === option.value);
    };

    // Manejar selección/deselección de opción
    const toggleOption = (option: ChipOption) => {
        let newSelection: ChipOption[];

        if (isOptionSelected(option)) {
            // Deseleccionar
            newSelection = selectedOptions.filter(item => item.value !== option.value);
        } else {
            // Seleccionar - guardar el objeto completo
            newSelection = [...selectedOptions, option];
        }

        setSelectedOptions(newSelection);

        // Propagar cambios
        if (onChange) {
            onChange(name, newSelection);
        }
    };

    // Seleccionar todos
    const selectAll = () => {
        setSelectedOptions([...options]);

        if (onChange) {
            onChange(name, [...options]);
        }
    };

    // Deseleccionar todos
    const deselectAll = () => {
        setSelectedOptions([]);

        if (onChange) {
            onChange(name, []);
        }
    };

    return (
        <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium">
                    {label}
                </label>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={selectAll}
                        className="text-xs text-purple hover:text-purple-700 font-medium"
                    >
                        Seleccionar todos
                    </button>
                    <span className="text-xs text-gray-400">|</span>
                    <button
                        type="button"
                        onClick={deselectAll}
                        className="text-xs text-purple hover:text-purple-700 font-medium"
                    >
                        Deseleccionar todos
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 p-3 bg-white/50 border border-gray-300 rounded-lg min-h-[100px]">
                {options.map(option => (
                    <button
                        key={`${name}-${option.value}`}
                        type="button"
                        onClick={() => toggleOption(option)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-colors
                            ${isOptionSelected(option)
                                ? 'bg-purple text-white hover:bg-purple-700'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {option.label}
                        {isOptionSelected(option) && (
                            <X className="w-3 h-3" />
                        )}
                    </button>
                ))}
            </div>

            {description && (
                <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
        </div>
    );
};

export default MultiSelectChips; 