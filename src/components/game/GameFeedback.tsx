
import { motion } from 'framer-motion';
import { Award, BarChart2, Clock, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import useGameStore from '@/store/gameStore';

interface GameFeedbackProps {
  gameId: string;
  score: number;
  maxScore: number;
  metrics: {
    correct: number;
    incorrect: number;
    timeSpent: number; // in seconds
  };
  onPlayAgain: () => void;
}

const GameFeedback: React.FC<GameFeedbackProps> = ({
  gameId,
  score,
  maxScore,
  metrics,
  onPlayAgain
}) => {
  const { updateUserProgress } = useGameStore();
  
  // Calculate percentage score
  const percentage = Math.round((score / maxScore) * 100);
  
  // Determine feedback message based on score percentage
  let feedbackMessage = '';
  let feedbackColor = '';
  
  if (percentage >= 90) {
    feedbackMessage = '¡Excelente! Dominas este nivel.';
    feedbackColor = 'text-green-500';
  } else if (percentage >= 70) {
    feedbackMessage = '¡Muy bien! Estás progresando rápidamente.';
    feedbackColor = 'text-blue-500';
  } else if (percentage >= 50) {
    feedbackMessage = 'Buen intento. Sigue practicando para mejorar.';
    feedbackColor = 'text-yellow-500';
  } else {
    feedbackMessage = 'Necesitas más práctica. ¡No te rindas!';
    feedbackColor = 'text-orange-500';
  }
  
  // Format time spent
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Update user progress when component mounts
  React.useEffect(() => {
    updateUserProgress(gameId, score);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto p-6 glass-card rounded-2xl"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Resultado</h2>
        <p className={`text-xl font-semibold ${feedbackColor}`}>{feedbackMessage}</p>
      </div>
      
      <div className="flex justify-center mb-8">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <span className="block text-4xl font-bold">{percentage}%</span>
              <span className="text-sm text-muted-foreground">{score} / {maxScore}</span>
            </div>
          </div>
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="10"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={
                percentage >= 90 ? '#10b981' : 
                percentage >= 70 ? '#3b82f6' : 
                percentage >= 50 ? '#f59e0b' : 
                '#f97316'
              }
              strokeWidth="10"
              strokeDasharray={`${2 * Math.PI * 45 * percentage / 100} ${2 * Math.PI * 45 * (100 - percentage) / 100}`}
            />
          </svg>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <Award className="w-6 h-6 text-green-500" />
          </div>
          <p className="text-sm text-muted-foreground">Correctas</p>
          <p className="text-2xl font-semibold">{metrics.correct}</p>
        </div>
        
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <BarChart2 className="w-6 h-6 text-red-500" />
          </div>
          <p className="text-sm text-muted-foreground">Incorrectas</p>
          <p className="text-2xl font-semibold">{metrics.incorrect}</p>
        </div>
        
        <div className="bg-secondary p-4 rounded-lg text-center">
          <div className="flex justify-center mb-2">
            <Clock className="w-6 h-6 text-blue-500" />
          </div>
          <p className="text-sm text-muted-foreground">Tiempo</p>
          <p className="text-2xl font-semibold">{formatTime(metrics.timeSpent)}</p>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button 
          className="btn-primary flex items-center justify-center gap-2"
          onClick={onPlayAgain}
        >
          <RefreshCw className="w-4 h-4" />
          <span>Jugar de nuevo</span>
        </button>
        
        <Link 
          to="/games" 
          className="btn-secondary"
        >
          Otros juegos
        </Link>
      </div>
    </motion.div>
  );
};

export default GameFeedback;
