import React from 'react';

interface TextInputProps {
    name: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    description?: string;
}

const TextInput: React.FC<TextInputProps> = ({
    name,
    label,
    value,
    onChange,
    description
}) => {
    return (
        <div className="form-field">
            <label className="block mb-1 text-sm font-medium">{label}</label>
            <input
                type="text"
                name={name}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
        </div>
    );
};

export default TextInput; 