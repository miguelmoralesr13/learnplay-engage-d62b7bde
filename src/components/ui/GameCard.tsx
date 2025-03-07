import { Link } from 'react-router-dom';
import { Game } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-red-100 text-red-800 border-red-200'
  };

  const categoryColor = {
    vocabulary: 'bg-purple-100 text-purple-800 border-purple-200',
    grammar: 'bg-blue-100 text-blue-800 border-blue-200',
    listening: 'bg-teal-100 text-teal-800 border-teal-200',
    reading: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    speaking: 'bg-pink-100 text-pink-800 border-pink-200'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="card-game h-full"
    >
      <div className="relative w-full aspect-square overflow-hidden rounded-t-lg">
        <img
          src={game.thumbnail}
          alt={game.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg">{game.name}</h3>
          <Badge className={categoryColor[game.category]}>
            {game.category}
          </Badge>
        </div>

        <p className="text-muted-foreground text-sm mb-4 flex-grow">{game.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {game.difficulty.map(diff => (
            <span
              key={diff}
              className={`text-xs px-2 py-0.5 rounded-full border ${difficultyColor[diff]}`}
            >
              {diff}
            </span>
          ))}
        </div>

        <Link
          to={game.path}
          className="btn-primary text-center w-full"
        >
          Jugar
        </Link>
      </div>
    </motion.div>
  );
};

export default GameCard;
