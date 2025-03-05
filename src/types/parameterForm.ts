// Tipos de campo que puede tener un formulario
export type FieldType = 'text' | 'number' | 'checkbox' | 'select' | 'radio' | 'range' | 'multiselect' | 'customSelect';

// Agregar el tipo 'range' a FormFieldType
export type FormFieldType = 'text' | 'number' | 'checkbox' | 'radio' | 'select' | 'range' | 'multiselect' | 'customSelect';

// Interfaz para las opciones de un campo select o radio
export interface FieldOption {
    value: string | number;
    label: string;
}

// Definición de un campo de formulario
export interface FieldDefinition {
    name: string;          // Nombre del campo
    label: string;         // Etiqueta visible
    type: FieldType;       // Tipo de campo
    size?: string;
    defaultValue?: any;    // Valor por defecto
    min?: number;         // Para campos number
    max?: number;         // Para campos number
    step?: number;        // Para controlar incrementos en campos number/range
    options?: FieldOption[]; // Para campos select o radio
    description?: string;  // Descripción o ayuda
    required?: boolean;    // Si es obligatorio
    visible?: (values: any) => boolean; // Función que determina si el campo es visible
}

// Definición completa de un formulario de parámetros
export interface FormDefinition {
    id: string;
    title: string;
    fields: FieldDefinition[];
}

export interface FormField {
    name: string;
    label: string;
    type: FormFieldType;
    options?: FieldOption[];
    defaultValue?: any;
    description?: string;
    min?: number;
    max?: number;
    step?: number; // Nuevo campo para controlar los incrementos
    required?: boolean;
    visible?: (values: Record<string, any>) => boolean;
} 