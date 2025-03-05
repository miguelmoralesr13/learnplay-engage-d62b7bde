import React, { useState, useEffect } from 'react';
import { Field, ErrorMessage } from 'formik';
import { FieldDefinition } from '@/types/parameterForm';
import RangeSlider from './RangeSlider';
import MultiSelectChips from './MultiSelectChips';
import CustomSelect from './CustomSelect';

interface FormFieldProps {
    field: FieldDefinition;
    values?: any;
    value?: any;
    onChange?: (e: React.ChangeEvent<any>) => void;
}

const FormField: React.FC<FormFieldProps> = ({ field, values, value, onChange }) => {
    // Verificar si el campo debe ser visible
    if (field.visible && !field.visible(values)) {
        return null;
    }

    // Usar el valor correcto (compatibilidad con ambas interfaces)
    const fieldValue = value !== undefined ? value : (values ? values[field.name] : '');

    switch (field.type) {
        case 'checkbox':
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                        {field.label}
                    </label>
                    <div className="flex items-center">
                        <Field
                            type="checkbox"
                            id={field.name}
                            name={field.name}
                            className="mr-2 h-4 w-4"
                        />
                        <span>{field.description}</span>
                    </div>
                    <ErrorMessage
                        name={field.name}
                        component="p"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>
            );
        case 'number':
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                        {field.label}
                    </label>
                    <Field
                        type="number"
                        id={field.name}
                        name={field.name}
                        min={field.min}
                        max={field.max}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    <ErrorMessage
                        name={field.name}
                        component="p"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>
            );
        case 'text':
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                        {field.label}
                    </label>
                    <Field
                        type="text"
                        id={field.name}
                        name={field.name}
                        className="w-full px-3 py-2 border rounded-lg"
                    />
                    <ErrorMessage
                        name={field.name}
                        component="p"
                        className="text-red-500 text-xs mt-1"
                    />
                </div>
            );
        case 'select':
            return (
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" htmlFor={field.name}>
                        {field.label}
                    </label>
                    <div className="relative">
                        <select
                            id={field.name}
                            name={field.name}
                            value={values?.[field.name] || field.defaultValue}
                            onChange={onChange}
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
                                    className="py-1"
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
                    </div>
                    {field.description && (
                        <p className="mt-1 text-sm text-gray-500">{field.description}</p>
                    )}
                    <ErrorMessage
                        name={field.name}
                        component="p"
                        className="mt-1 text-sm text-red-500"
                    />
                </div>
            );
        case 'radio':
            return (
                <div className="flex gap-3">
                    {field.options?.map((option) => (
                        <label key={option.value.toString()} className="inline-flex items-center">
                            <Field
                                type="radio"
                                name={field.name}
                                value={option.value}
                                className="mr-2"
                            />
                            <span className="px-4 py-2 rounded-lg bg-secondary hover:bg-secondary/80">
                                {option.label}
                            </span>
                        </label>
                    ))}
                </div>
            );
        case 'range':
            return (
                <RangeSlider
                    name={field.name}
                    label={field.label}
                    min={field.min}
                    max={field.max}
                    step={field.step}
                    defaultValue={field.defaultValue}
                    value={values[field.name]}
                    description={field.description}
                    onChange={(value: number) => onChange?.({
                        target: { name: field.name, value }
                    } as React.ChangeEvent<any>)}
                />
            );
        case 'multiselect':
            return (
                <MultiSelectChips
                    name={field.name}
                    label={field.label}
                    options={field.options || []}
                    defaultValues={field.defaultValue}
                    values={values}
                    description={field.description}
                />
            );
        case 'customSelect':
            return (
                <CustomSelect
                    name={field.name}
                    label={field.label}
                    options={field.options || []}
                    defaultValue={field.defaultValue}
                    values={values}
                    description={field.description}
                />
            );
        default:
            return null;
    }
};

export default FormField; 