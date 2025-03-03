
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GameConfig from '@/components/game/GameConfig';
import GameFeedback from '@/components/game/GameFeedback';
import useGameStore, { Difficulty } from '@/store/gameStore';
import { shuffle } from '@/lib/utils';
import { Timer, RefreshCw } from 'lucide-react';

// Tipos de datos para el juego
interface WordPair {
  word: string;
  translation: string;
}

interface GameData {
  wordPairs: WordPair[];
  timeLimit: number; // in seconds
}

// Datos del juego por dificultad
const gameDataByDifficulty: Record<Difficulty, GameData> = {
  beginner: {
    wordPairs: [
      { word: 'house', translation: 'casa' },
      { word: 'car', translation: 'coche' },
      { word: 'tree', translation: 'árbol' },
      { word: 'book', translation: 'libro' },
      { word: 'dog', translation: 'perro' },
      { word: 'cat', translation: 'gato' },
      { word: 'apple', translation: 'manzana' },
      { word: 'water', translation: 'agua' },
    ],
    timeLimit: 120,
  },
  intermediate: {
    wordPairs: [
      { word: 'knowledge', translation: 'conocimiento' },
      { word: 'beautiful', translation: 'hermoso' },
      { word: 'challenge', translation: 'desafío' },
      { word: 'respect', translation: 'respeto' },
      { word: 'journey', translation: 'viaje' },
      { word: 'imagine', translation: 'imaginar' },
      { word: 'success', translation: 'éxito' },
      { word: 'responsibility', translation: 'responsabilidad' },
    ],
    timeLimit: 90,
  },
  advanced: {
    wordPairs: [
      { word: 'simultaneously', translation: 'simultáneamente' },
      { word: 'indispensable', translation: 'indispensable' },
      { word: 'enthusiasm', translation: 'entusiasmo' },
      { word: 'persistent', translation: 'persistente' },
      { word: 'significant', translation: 'significativo' },
      { word: 'extraordinary', translation: 'extraordinario' },
      { word: 'innovation', translation: 'innovación' },
      { word: 'achievement', translation: 'logro' },
    ],
    timeLimit: 60,
  },
};

type GameStage = 'config' | 'playing' | 'feedback';

const WordMatchGame = () => {
  // Estado del juego
  const { gameSettings } = useGameStore();
  const [gameStage, setGameStage] = useState<GameStage>('config');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(gameSettings.difficulty);
  const [words, setWords] = useState<string[]>([]);
  const [translations, setTranslations] = useState<string[]>([]);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<number | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [incorrectAttempts, setIncorrectAttempts] = useState<number>(0);
  
  // Métricas del juego
  const [gameMetrics, setGameMetrics] = useState({
    correct: 0,
    incorrect: 0,
    timeSpent: 0,
  });
  
  // Configuración del juego
  const startGame = () => {
    const gameData = gameDataByDifficulty[selectedDifficulty];
    
    // Limitar a 8 pares para todas las dificultades
    const selectedPairs = shuffle([...gameData.wordPairs]).slice(0, 8);
    
    // Configurar palabras y traducciones
    const shuffledWords = shuffle(selectedPairs.map(pair => pair.word));
    const shuffledTranslations = shuffle(selectedPairs.map(pair => pair.translation));
    
    setWords(shuffledWords);
    setTranslations(shuffledTranslations);
    setMatchedPairs([]);
    setSelectedWord(null);
    setSelectedTranslation(null);
    setIncorrectAttempts(0);
    setTimeLeft(gameData.timeLimit);
    setGameStartTime(Date.now());
    setGameStage('playing');
  };
  
  // Configurar el temporizador
  useEffect(() => {
    if (gameStage !== 'playing' || !gameSettings.timerEnabled) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStage, gameSettings.timerEnabled]);
  
  // Comprobar si se ha completado el juego
  useEffect(() => {
    if (gameStage !== 'playing') return;
    
    if (matchedPairs.length === words.length) {
      endGame();
    }
  }, [matchedPairs, gameStage]);
  
  // Comprobar si las selecciones coinciden
  useEffect(() => {
    if (selectedWord === null || selectedTranslation === null) return;
    
    const word = words[selectedWord];
    const translation = translations[selectedTranslation];
    
    // Buscar si la traducción coincide con la palabra
    const matchedPair = gameDataByDifficulty[selectedDifficulty].wordPairs
      .find(pair => pair.word === word && pair.translation === translation);
    
    if (matchedPair) {
      // Coincidencia correcta
      setMatchedPairs(prev => [...prev, selectedWord, selectedTranslation]);
      setGameMetrics(prev => ({ ...prev, correct: prev.correct + 1 }));
    } else {
      // Coincidencia incorrecta
      setTimeout(() => {
        setSelectedWord(null);
        setSelectedTranslation(null);
        setIncorrectAttempts(prev => prev + 1);
        setGameMetrics(prev => ({ ...prev, incorrect: prev.incorrect + 1 }));
      }, 1000);
    }
  }, [selectedWord, selectedTranslation]);
  
  // Finalizar el juego
  const endGame = () => {
    const timeSpent = Math.round((Date.now() - gameStartTime) / 1000);
    
    setGameMetrics(prev => ({
      ...prev,
      timeSpent
    }));
    
    setGameStage('feedback');
  };
  
  // Calcular puntuación
  const calculateScore = () => {
    const baseScore = matchedPairs.length / 2 * 100;
    const timePenalty = gameMetrics.timeSpent / 10;
    const mistakePenalty = incorrectAttempts * 20;
    
    return Math.max(0, Math.round(baseScore - timePenalty - mistakePenalty));
  };
  
  // Reiniciar el juego
  const handlePlayAgain = () => {
    setGameStage('config');
  };
  
  // Manejar selección de palabra
  const handleWordSelect = (index: number) => {
    if (matchedPairs.includes(index) || selectedWord === index) return;
    setSelectedWord(index);
  };
  
  // Manejar selección de traducción
  const handleTranslationSelect = (index: number) => {
    if (matchedPairs.includes(index) || selectedTranslation === index) return;
    setSelectedTranslation(index);
  };
  
  // Formatear tiempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {gameStage === 'config' && (
          <GameConfig
            key="config"
            gameName="Word Match"
            instructions="Relaciona cada palabra en inglés con su traducción correcta en español. 
                         Selecciona una palabra de cada columna para hacer una pareja. 
                         El objetivo es encontrar todas las parejas antes de que se acabe el tiempo."
            availableDifficulties={['beginner', 'intermediate', 'advanced']}
            onStart={startGame}
          />
        )}
        
        {gameStage === 'playing' && (
          <motion.div
            key="playing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-card rounded-2xl p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Word Match</h2>
              
              {gameSettings.timerEnabled && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary">
                  <Timer className="w-4 h-4 text-purple" />
                  <span className="font-medium">{formatTime(timeLeft)}</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col md:flex-row gap-8 mb-8">
              <div className="flex-1 space-y-3">
                <h3 className="font-medium text-center mb-4">English</h3>
                {words.map((word, index) => (
                  <motion.button
                    key={`word-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedWord === index ? 1.05 : 1
                    }}
                    transition={{ delay: index * 0.05 }}
                    className={`w-full py-3 px-4 rounded-lg border text-left transition-all
                      ${matchedPairs.includes(index) 
                        ? 'bg-green-100 border-green-200 text-green-800' 
                        : selectedWord === index
                          ? 'bg-purple/10 border-purple text-purple'
                          : 'bg-background hover:bg-secondary'
                      }
                      ${matchedPairs.includes(index) ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    disabled={matchedPairs.includes(index)}
                    onClick={() => handleWordSelect(index)}
                  >
                    {word}
                  </motion.button>
                ))}
              </div>
              
              <div className="flex-1 space-y-3">
                <h3 className="font-medium text-center mb-4">Español</h3>
                {translations.map((translation, index) => (
                  <motion.button
                    key={`translation-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: 1, 
                      y: 0,
                      scale: selectedTranslation === index ? 1.05 : 1
                    }}
                    transition={{ delay: index * 0.05 + 0.4 }}
                    className={`w-full py-3 px-4 rounded-lg border text-left transition-all
                      ${matchedPairs.includes(index) 
                        ? 'bg-green-100 border-green-200 text-green-800' 
                        : selectedTranslation === index
                          ? 'bg-purple/10 border-purple text-purple'
                          : 'bg-background hover:bg-secondary'
                      }
                      ${matchedPairs.includes(index) ? 'cursor-default' : 'cursor-pointer'}
                    `}
                    disabled={matchedPairs.includes(index)}
                    onClick={() => handleTranslationSelect(index)}
                  >
                    {translation}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Parejas: {matchedPairs.length / 2} / {words.length / 2}
              </div>
              
              <button
                className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg text-muted-foreground hover:bg-secondary"
                onClick={endGame}
              >
                <RefreshCw className="w-4 h-4" />
                <span>Terminar juego</span>
              </button>
            </div>
          </motion.div>
        )}
        
        {gameStage === 'feedback' && (
          <GameFeedback
            key="feedback"
            gameId="word-match"
            score={calculateScore()}
            maxScore={words.length / 2 * 100}
            metrics={gameMetrics}
            onPlayAgain={handlePlayAgain}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default WordMatchGame;
