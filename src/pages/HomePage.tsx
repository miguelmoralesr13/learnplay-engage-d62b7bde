
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Book, Gamepad, ChevronRight, Trophy } from 'lucide-react';
import useGameStore from '@/store/gameStore';

const HomePage = () => {
  const { userProgress, games } = useGameStore();
  
  // Calculate progress percentage
  const progressPercentage = Math.round(
    (userProgress.experience / userProgress.nextLevelExperience) * 100
  );
  
  // Recent games (last 4)
  const recentGames = Object.entries(userProgress.completedGames)
    .map(([gameId, stats]) => {
      const game = games.find((g) => g.id === gameId);
      if (!game) return null;
      return {
        ...game,
        lastPlayed: stats.completedAt[stats.completedAt.length - 1],
        bestScore: stats.bestScore
      };
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b!.lastPlayed).getTime() - new Date(a!.lastPlayed).getTime())
    .slice(0, 4);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-8"
    >
      <section className="glass-card rounded-2xl p-8 md:p-12 bg-gradient-to-br from-purple-light/20 to-accent4/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold"
            >
              Aprende inglés <span className="text-purple">jugando</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg text-muted-foreground"
            >
              Mejora tu vocabulario, gramática y habilidades de comunicación 
              con nuestros juegos interactivos y divertidos.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              <Link to="/games" className="btn-primary flex items-center gap-2">
                <Gamepad className="w-4 h-4" />
                <span>Explorar juegos</span>
              </Link>
              
              <Link to="/progress" className="btn-secondary flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                <span>Ver mi progreso</span>
              </Link>
            </motion.div>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="relative aspect-square max-w-md mx-auto"
          >
            <img 
              src="/lovable-uploads/b871120f-9f5f-4e93-b53a-648caaf93c3b.png" 
              alt="Aprender inglés jugando" 
              className="rounded-2xl shadow-lg object-cover w-full h-full"
            />
          </motion.div>
        </div>
      </section>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <section className="glass-card rounded-2xl p-6 col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tu nivel</h2>
            <div className="w-10 h-10 rounded-full bg-purple/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple" />
            </div>
          </div>
          
          <div className="flex items-end gap-2 mb-2">
            <span className="text-3xl font-bold">Nivel {userProgress.level}</span>
            <span className="text-sm text-muted-foreground pb-1">
              {userProgress.experience}/{userProgress.nextLevelExperience} XP
            </span>
          </div>
          
          <div className="w-full bg-muted rounded-full h-2 mb-4">
            <div 
              className="bg-purple h-2 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Juegos completados</span>
              <span className="font-medium">{Object.keys(userProgress.completedGames).length}</span>
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Partidas jugadas</span>
              <span className="font-medium">
                {Object.values(userProgress.completedGames).reduce((acc, game) => acc + game.timesPlayed, 0)}
              </span>
            </div>
          </div>
          
          <Link 
            to="/progress" 
            className="mt-4 text-sm text-purple flex items-center hover:underline"
          >
            Ver detalles completos
            <ChevronRight className="w-4 h-4" />
          </Link>
        </section>
        
        <section className="glass-card rounded-2xl p-6 col-span-1 md:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Juegos recientes</h2>
            <Link 
              to="/games" 
              className="text-sm text-purple flex items-center hover:underline"
            >
              Ver todos
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          {recentGames.length > 0 ? (
            <div className="space-y-3">
              {recentGames.map((game) => (
                <Link
                  key={game!.id}
                  to={game!.path}
                  className="flex items-center p-3 rounded-lg hover:bg-secondary transition-colors"
                >
                  <div className="w-12 h-12 rounded bg-accent flex items-center justify-center mr-4">
                    <Book className="w-6 h-6 text-purple" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{game!.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      Mejor puntuación: {game!.bestScore}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Aún no has jugado ningún juego</p>
              <Link to="/games" className="btn-primary">
                Comenzar a jugar
              </Link>
            </div>
          )}
        </section>
      </div>
      
      <section className="glass-card rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-6">Categorías de juegos</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <Link 
            to="/games?category=vocabulary" 
            className="p-4 rounded-xl bg-accent1 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2">Vocabulario</h3>
            <p className="text-sm text-muted-foreground">
              Amplía tu vocabulario con juegos de palabras y definiciones
            </p>
          </Link>
          
          <Link 
            to="/games?category=grammar" 
            className="p-4 rounded-xl bg-accent4 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2">Gramática</h3>
            <p className="text-sm text-muted-foreground">
              Mejora tu gramática con juegos de construcción de frases
            </p>
          </Link>
          
          <Link 
            to="/games?category=listening" 
            className="p-4 rounded-xl bg-accent2 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2">Escucha</h3>
            <p className="text-sm text-muted-foreground">
              Desarrolla tu comprensión auditiva con juegos de audio
            </p>
          </Link>
          
          <Link 
            to="/games?category=reading" 
            className="p-4 rounded-xl bg-accent3 hover:shadow-md transition-shadow"
          >
            <h3 className="font-medium mb-2">Lectura</h3>
            <p className="text-sm text-muted-foreground">
              Practica la comprensión lectora con textos interactivos
            </p>
          </Link>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
