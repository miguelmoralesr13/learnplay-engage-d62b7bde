import React from 'react';

interface CheckboxProps {
    name: string;
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    description?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
    name,
    label,
    checked,
    onChange,
    description
}) => {
    return (
        <div className="form-field">
            <label className="flex items-center mb-1">
                <input
                    type="checkbox"
                    name={name}
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="mr-2 h-4 w-4"
                />
                <span className="text-sm font-medium">{label}</span>
            </label>
            {description && (
                <p className="text-xs text-gray-500 mt-1">{description}</p>
            )}
        </div>
    );
};

export default Checkbox; 