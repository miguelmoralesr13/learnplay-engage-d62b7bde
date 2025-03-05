import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import useGameStore, { GameCategory, Difficulty } from '@/store/gameStore';
import GameCard from '@/components/ui/GameCard';
import { X } from 'lucide-react';
import { useGameRegistry } from '@/games/registry';

const GamesPage = () => {
  // Registrar juegos cuando se carga la página
  useGameRegistry();

  const { games, activeFilters, setFilters, resetFilters } = useGameStore();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Initialize filters from URL params
  useEffect(() => {
    const categoryParam = searchParams.get('category') as GameCategory | null;
    const difficultyParam = searchParams.get('difficulty') as Difficulty | null;

    if (categoryParam || difficultyParam) {
      setFilters({
        category: categoryParam,
        difficulty: difficultyParam
      });
    }
  }, []);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();

    if (activeFilters.category) {
      params.set('category', activeFilters.category);
    }

    if (activeFilters.difficulty) {
      params.set('difficulty', activeFilters.difficulty);
    }

    setSearchParams(params);
  }, [activeFilters]);

  // Filter games based on active filters and search term
  const filteredGames = games.filter(game => {
    // Filter by category
    if (activeFilters.category && game.category !== activeFilters.category) {
      return false;
    }

    // Filter by difficulty
    if (activeFilters.difficulty && !game.difficulty.includes(activeFilters.difficulty)) {
      return false;
    }

    // Filter by search term
    if (searchTerm && !game.name.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    return true;
  });

  const handleCategoryFilter = (category: GameCategory | null) => {
    setFilters({ category });
  };

  const handleDifficultyFilter = (difficulty: Difficulty | null) => {
    setFilters({ difficulty });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleClearFilters = () => {
    resetFilters();
    setSearchTerm('');
  };

  const categories: { value: GameCategory; label: string }[] = [
    { value: 'vocabulary', label: 'Vocabulario' },
    { value: 'grammar', label: 'Gramática' },
    { value: 'listening', label: 'Escucha' },
    { value: 'reading', label: 'Lectura' },
    { value: 'speaking', label: 'Habla' }
  ];

  const difficulties: { value: Difficulty; label: string }[] = [
    { value: 'beginner', label: 'Principiante' },
    { value: 'intermediate', label: 'Intermedio' },
    { value: 'advanced', label: 'Avanzado' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <section>
        <h1 className="text-3xl font-bold mb-2">Juegos de inglés</h1>
        <p className="text-muted-foreground mb-6">
          Explora nuestra colección de juegos interactivos para mejorar tu inglés
        </p>

        <div className="glass-card rounded-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Buscar juegos..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={activeFilters.category || ''}
                onChange={(e) => handleCategoryFilter(e.target.value ? e.target.value as GameCategory : null)}
                className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value="">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={activeFilters.difficulty || ''}
                onChange={(e) => handleDifficultyFilter(e.target.value ? e.target.value as Difficulty : null)}
                className="px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-purple"
              >
                <option value="">Todas las dificultades</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {(activeFilters.category || activeFilters.difficulty || searchTerm) && (
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>

              {activeFilters.category && (
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple/10 text-purple">
                  {categories.find(c => c.value === activeFilters.category)?.label}
                  <button
                    onClick={() => handleCategoryFilter(null)}
                    className="ml-1 hover:bg-purple/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFilters.difficulty && (
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple/10 text-purple">
                  {difficulties.find(d => d.value === activeFilters.difficulty)?.label}
                  <button
                    onClick={() => handleDifficultyFilter(null)}
                    className="ml-1 hover:bg-purple/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {searchTerm && (
                <span className="flex items-center gap-1 text-xs px-3 py-1 rounded-full bg-purple/10 text-purple">
                  Búsqueda: {searchTerm}
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-1 hover:bg-purple/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                onClick={handleClearFilters}
                className="text-xs text-muted-foreground hover:text-purple ml-2"
              >
                Limpiar filtros
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {filteredGames.length} {filteredGames.length === 1 ? 'juego' : 'juegos'} encontrados
            </p>
          </div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-xl">
            <h3 className="text-xl font-medium mb-2">No se encontraron juegos</h3>
            <p className="text-muted-foreground mb-6">
              No hay juegos que coincidan con los filtros seleccionados
            </p>
            <button
              onClick={handleClearFilters}
              className="btn-primary"
            >
              Mostrar todos los juegos
            </button>
          </div>
        )}
      </section>
    </motion.div>
  );
};

export default GamesPage;
