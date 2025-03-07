import React, { useState, useEffect } from 'react';
import { DifficultyLevel, IGame } from '@/types/game';
import { FormDefinition, FormField } from '@/types/parameterForm';
import CustomSelect from '../form/CustomSelect';
import RangeSlider from '../form/RangeSlider';
import { ParameterFormFactory } from '@/games/factories/ParameterFormFactory';
import TextInput from '../form/TextInput';
import Checkbox from '../form/Checkbox';
import MultiSelectChips from '../form/MultiSelectChips';

interface ParametersFormProps {
    gameConfig: IGame;
    onSubmit: (formData: any) => void;
    onReset?: () => void;
}

const ParametersForm: React.FC<ParametersFormProps> = ({
    gameConfig,
    onSubmit,
    onReset
}) => {
    // Estado para almacenar la definición del formulario
    const [formDefinition, setFormDefinition] = useState<FormDefinition | null>(null);
    // Estado para almacenar los valores del formulario
    const [formValues, setFormValues] = useState<Record<string, any>>({});

    // Cargar la definición del formulario
    useEffect(() => {
        const definition = ParameterFormFactory.createFormDefinition(gameConfig);
        setFormDefinition(definition);

        // Inicializar valores por defecto
        const initialValues: Record<string, any> = {};
        definition.fields.forEach(field => {
            if (field.defaultValue !== undefined) {
                initialValues[field.name] = field.defaultValue;
            }
        });
        setFormValues(initialValues);

    }, [gameConfig]);

    // Manejar cambios en los valores del formulario
    const handleChange = (name: string, value: any) => {
        console.log('name', name, 'value', value);
        setFormValues(prev => {
            const newValues = { ...prev, [name]: value };
            return newValues;
        });
    };

    // Determinar si un campo debe mostrarse basado en la función 'visible'
    const isFieldVisible = (field: FormField): boolean => {
        if (!field.visible) return true;
        return field.visible(formValues);
    };


    // Manejar el envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formValues);
    };

    if (!formDefinition) {
        return <div>Cargando formulario...</div>;
    }

    return (
        <div className="parameters-form bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">{formDefinition.title}</h2>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-x-6 gap-y-4 place-items-center">
                    {formDefinition.fields.map(field => (
                        isFieldVisible(field) && (
                            <div
                                key={field.name}
                                className={(field.size ? `${field.size}` : 'col-span-2') + ' w-full'}
                            >
                                {field.type === 'customSelect' && (
                                    <CustomSelect
                                        name={field.name}
                                        label={field.label}
                                        value={formValues[field.name] || field.defaultValue}
                                        options={field.options || []}
                                        onChange={handleChange}
                                        description={field.description}
                                    />
                                )}

                                {field.type === 'range' && (
                                    <RangeSlider
                                        name={field.name}
                                        label={field.label}
                                        value={formValues[field.name] || 0}
                                        min={field.min || 0}
                                        max={field.max || 100}
                                        step={field.step || 1}
                                        onChange={value => handleChange(field.name, value)}
                                        description={field.description}
                                    />
                                )}

                                {field.type === 'text' && (
                                    <TextInput
                                        name={field.name}
                                        label={field.label}
                                        value={formValues[field.name] || ''}
                                        onChange={value => handleChange(field.name, value)}
                                        description={field.description}
                                    />
                                )}

                                {field.type === 'checkbox' && (
                                    <Checkbox
                                        name={field.name}
                                        label={field.label}
                                        checked={formValues[field.name] || false}
                                        onChange={checked => handleChange(field.name, checked)}
                                        description={field.description}
                                    />
                                )}

                                {field.type === 'multiselect' && (
                                    <MultiSelectChips
                                        name={field.name}
                                        label={field.label}
                                        value={formValues[field.name] || []}
                                        options={field.options || []}
                                        onChange={handleChange}
                                        description={field.description}
                                    />
                                )}

                                {field.type === 'select' && (
                                    <div className="relative">
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={formValues[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="block w-full px-4 py-2 text-base border border-gray-300 
                                                     bg-white rounded-lg appearance-none focus:outline-none 
                                                     focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        >
                                            <option value="" disabled>
                                                Select {field.label}
                                            </option>
                                            {field.options?.map((option) => (
                                                <option
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                        {field.description && (
                                            <p className="mt-1 text-sm text-gray-500">{field.description}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )
                    ))}
                </div>

                <div className="flex justify-between items-center mt-8">
                    <button
                        type="button"
                        onClick={() => onReset?.()}
                        className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                    >
                        Reiniciar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        Comenzar juego
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ParametersForm; 