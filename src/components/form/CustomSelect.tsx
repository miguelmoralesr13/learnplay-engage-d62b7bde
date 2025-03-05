import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { FieldOption } from '@/types/parameterForm';

interface CustomSelectProps {
    name: string;
    label: string;
    options: FieldOption[];
    defaultValue?: FieldOption;
    values?: Record<string, any>;
    value?: FieldOption;
    onChange?: (name: string, value: FieldOption) => void;
    description?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
    name,
    label,
    options,
    defaultValue,
    values,
    value,
    onChange,
    description
}) => {
    // Determinar el valor inicialmente seleccionado
    const getInitialValue = (): FieldOption => {
        // Si hay un valor explícito, usarlo
        if (value) return value;

        // Si hay un valor en values, convertirlo si es necesario
        if (values && values[name]) {
            const currentValue = values[name];
            // Si ya es un objeto FieldOption, devolverlo directamente
            if (typeof currentValue === 'object' && 'label' in currentValue && 'value' in currentValue) {
                return currentValue as FieldOption;
            }
            // Si es un valor primitivo, buscar la opción correspondiente
            const option = options.find(opt => opt.value === currentValue);
            if (option) return option;
        }

        // Si hay un valor por defecto
        if (defaultValue) return defaultValue;

        // Como último recurso, usar la primera opción
        return options.length > 0 ? options[0] : { label: '', value: '' };
    };

    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<FieldOption>(getInitialValue());
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Actualizar estado local cuando cambian props
    useEffect(() => {
        if (value) {
            setSelectedOption(value);
        } else if (values && values[name]) {
            const currentValue = values[name];
            if (typeof currentValue === 'object' && 'label' in currentValue && 'value' in currentValue) {
                setSelectedOption(currentValue as FieldOption);
            } else {
                const option = options.find(opt => opt.value === currentValue);
                if (option) setSelectedOption(option);
            }
        }
    }, [value, values, name, options]);

    // Cerrar el dropdown cuando se hace clic fuera de él
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Manejar selección de opción
    const handleSelect = (option: FieldOption) => {
        setSelectedOption(option);
        setIsOpen(false);

        // Propagar cambios
        if (onChange) {
            onChange(name, option);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
                {label}
            </label>
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full p-3 rounded-lg border border-gray-300 bg-white/50 focus:outline-none focus:ring-2 focus:ring-purple transition-all"
                >
                    <span className={`${selectedOption.label ? 'text-gray-900' : 'text-gray-500'}`}>
                        {selectedOption.label || 'Seleccionar'}
                    </span>
                    <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    />
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-lg shadow-lg bg-white border border-gray-200 max-h-60 overflow-auto">
                        <ul className="py-1">
                            {options.map(option => (
                                <li
                                    key={option.value.toString()}
                                    className={`px-4 py-2 cursor-pointer hover:bg-purple hover:text-white transition-colors
                                        ${selectedOption.value === option.value ? 'bg-purple/10 text-purple font-medium' : 'text-gray-700'}
                                    `}
                                    onClick={() => handleSelect(option)}
                                >
                                    {option.label}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
            {description && (
                <p className="text-xs text-gray-500 mt-2">{description}</p>
            )}
        </div>
    );
};

export default CustomSelect;