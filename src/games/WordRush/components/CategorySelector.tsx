import { WordCategory } from '../types';

interface CategorySelectorProps {
    categories: WordCategory[];
    selectedCategories: WordCategory[];
    onCategoryChange: (categories: WordCategory[]) => void;
}

const CategorySelector = ({
    categories,
    selectedCategories,
    onCategoryChange
}: CategorySelectorProps) => {
    // Mapa de categorías a etiquetas en español
    const categoryLabels: Record<WordCategory, string> = {
        'basic': 'Básico',
        'travel': 'Viajes',
        'food': 'Comida',
        'business': 'Negocios',
        'technology': 'Tecnología',
        'health': 'Salud',
        'education': 'Educación',
        'entertainment': 'Entretenimiento'
    };

    // Manejar cambio de categoría
    const handleCategoryToggle = (category: WordCategory) => {
        if (selectedCategories.includes(category)) {
            // No permitir deseleccionar si es la única categoría seleccionada
            if (selectedCategories.length === 1) return;

            // Quitar la categoría
            onCategoryChange(selectedCategories.filter(c => c !== category));
        } else {
            // Añadir la categoría
            onCategoryChange([...selectedCategories, category]);
        }
    };

    return (
        <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">Categorías de palabras:</h3>
            <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                    <button
                        key={category}
                        onClick={() => handleCategoryToggle(category)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition
                      ${selectedCategories.includes(category)
                                ? 'bg-purple text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {categoryLabels[category]}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CategorySelector; 