
import { motion } from 'framer-motion';
import { Trophy, Award, BarChart2, Calendar } from 'lucide-react';
import useGameStore from '@/store/gameStore';

const ProgressPage = () => {
  const { userProgress, games } = useGameStore();
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (userProgress.experience / userProgress.nextLevelExperience) * 100
  );
  
  // Get games with stats
  const gamesWithStats = Object.entries(userProgress.completedGames).map(([gameId, stats]) => {
    const game = games.find((g) => g.id === gameId);
    if (!game) return null;
    return {
      ...game,
      stats
    };
  }).filter(Boolean);
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <h1 className="text-3xl font-bold mb-8">Tu progreso</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="glass-card rounded-2xl p-6 col-span-1">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-purple/10 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Nivel {userProgress.level}</h2>
              <p className="text-sm text-muted-foreground">
                {userProgress.experience}/{userProgress.nextLevelExperience} XP para el siguiente nivel
              </p>
            </div>
          </div>
          
          <div className="w-full bg-muted rounded-full h-4 mb-6">
            <div 
              className="bg-purple h-4 rounded-full relative overflow-hidden"
              style={{ width: `${progressPercentage}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse-subtle"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Juegos jugados</p>
              <p className="text-2xl font-semibold">
                {Object.keys(userProgress.completedGames).length}
              </p>
            </div>
            
            <div className="bg-secondary p-4 rounded-lg text-center">
              <p className="text-sm text-muted-foreground mb-1">Total partidas</p>
              <p className="text-2xl font-semibold">
                {Object.values(userProgress.completedGames).reduce(
                  (acc, game) => acc + game.timesPlayed, 0
                )}
              </p>
            </div>
          </div>
        </section>
        
        <section className="glass-card rounded-2xl p-6 col-span-1 md:col-span-2">
          <h2 className="text-xl font-semibold mb-6">Resumen de actividad</h2>
          
          {gamesWithStats.length > 0 ? (
            <div className="space-y-6">
              {gamesWithStats.map((game) => (
                <div key={game!.id} className="p-4 rounded-lg border">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-medium">{game!.name}</h3>
                      <p className="text-xs text-muted-foreground">Categoría: {game!.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-accent">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Última vez: {formatDate(game!.stats.completedAt[game!.stats.completedAt.length - 1])}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mb-1">
                        <Award className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Mejor puntuación</p>
                      <p className="font-medium">{game!.stats.bestScore}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 mb-1">
                        <BarChart2 className="w-4 h-4 text-blue-600" />
                      </div>
                      <p className="text-xs text-muted-foreground">Veces jugado</p>
                      <p className="font-medium">{game!.stats.timesPlayed}</p>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 mb-1">
                        <Trophy className="w-4 h-4 text-purple" />
                      </div>
                      <p className="text-xs text-muted-foreground">Partidas</p>
                      <p className="font-medium">{game!.stats.completedAt.length}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Aún no has completado ningún juego
              </p>
              <a href="/games" className="btn-primary">
                Comenzar a jugar
              </a>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
};

export default ProgressPage;
