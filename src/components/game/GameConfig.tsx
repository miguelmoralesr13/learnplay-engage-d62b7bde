
import { useState } from 'react';
import { Difficulty } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Info, Clock, Volume2 } from 'lucide-react';
import useGameStore from '@/store/gameStore';

interface GameConfigProps {
  gameName: string;
  instructions: string;
  availableDifficulties: Difficulty[];
  onStart: () => void;
}

const GameConfig: React.FC<GameConfigProps> = ({ 
  gameName, 
  instructions, 
  availableDifficulties,
  onStart 
}) => {
  const { gameSettings, updateGameSettings } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(gameSettings.difficulty);
  const [timerEnabled, setTimerEnabled] = useState<boolean>(gameSettings.timerEnabled);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(gameSettings.soundEnabled);

  const handleDifficultyChange = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
  };

  const handleTimerToggle = () => {
    setTimerEnabled(!timerEnabled);
  };

  const handleSoundToggle = () => {
    setSoundEnabled(!soundEnabled);
  };

  const handleStart = () => {
    updateGameSettings({
      difficulty: selectedDifficulty,
      timerEnabled,
      soundEnabled
    });
    onStart();
  };

  const difficultyOptions = {
    beginner: {
      label: 'Principiante',
      description: 'Vocabulario básico y tiempo generoso',
      color: 'bg-green-500'
    },
    intermediate: {
      label: 'Intermedio',
      description: 'Vocabulario más avanzado y menos tiempo',
      color: 'bg-yellow-500'
    },
    advanced: {
      label: 'Avanzado',
      description: 'Vocabulario complejo y tiempo limitado',
      color: 'bg-red-500'
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto p-6 glass-card rounded-2xl"
    >
      <h2 className="text-2xl font-bold mb-2">{gameName}</h2>
      
      <div className="mb-6 bg-accent p-4 rounded-lg flex items-start gap-3">
        <Info className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
        <p className="text-sm">{instructions}</p>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-3">Dificultad</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {availableDifficulties.map((difficulty) => (
            <div
              key={difficulty}
              className={`p-4 rounded-lg border-2 transition-all cursor-pointer
              ${selectedDifficulty === difficulty 
                ? `border-${difficultyOptions[difficulty].color.replace('bg-', '')} bg-${difficultyOptions[difficulty].color.replace('bg-', '')}/10` 
                : 'border-transparent bg-background hover:bg-secondary'}`}
              onClick={() => handleDifficultyChange(difficulty)}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{difficultyOptions[difficulty].label}</span>
                <div className={`w-3 h-3 rounded-full ${difficultyOptions[difficulty].color}`}></div>
              </div>
              <p className="text-xs text-muted-foreground">{difficultyOptions[difficulty].description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-8">
        <h3 className="font-semibold mb-3">Opciones</h3>
        <div className="flex flex-wrap gap-4">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full border
            ${timerEnabled 
              ? 'bg-primary/10 border-primary text-primary' 
              : 'bg-muted border-transparent text-muted-foreground'}`}
            onClick={handleTimerToggle}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Temporizador</span>
          </button>
          
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-full border
            ${soundEnabled 
              ? 'bg-primary/10 border-primary text-primary' 
              : 'bg-muted border-transparent text-muted-foreground'}`}
            onClick={handleSoundToggle}
          >
            <Volume2 className="w-4 h-4" />
            <span className="text-sm font-medium">Sonido</span>
          </button>
        </div>
      </div>
      
      <div className="flex justify-center">
        <button 
          className="btn-primary min-w-[200px]"
          onClick={handleStart}
        >
          Comenzar Juego
        </button>
      </div>
    </motion.div>
  );
};

export default GameConfig;
