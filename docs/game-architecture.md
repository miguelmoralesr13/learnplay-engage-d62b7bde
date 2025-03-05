# English Learning Games Architecture

## Overview
This document outlines the architecture for implementing various types of educational games in our English learning application. The architecture is designed to support:
- Writing games (text input based)
- Selection games (multiple choice, matching)
- Canvas-based games (drawing, interactive visuals)
- Audio games (listening and speaking)

## Core Game Interface

Each game implements a common interface to ensure consistency:

```typescript
interface IGame {
  type: GameType;               // Writing | Selection | Canvas | Audio
  difficulty: DifficultyLevel;  // Easy | Medium | Hard
  category: GameCategory;       // Grammar | Vocabulary | Pronunciation | etc
  parameters: GameParameters;   // Game-specific configuration
  instructions: string[];       // Array of instruction steps
}
```

## Component Structure

### Base Components
1. **GameWrapper**
   - Handles game lifecycle management
   - Provides common game state
   - Manages transitions between game phases

2. **ParametersForm**
   - Dynamic form generation based on game type
   - Difficulty selection
   - Game-specific settings

3. **InstructionsPanel**
   - Multi-step instruction display
   - Visual aids and examples
   - Practice mode option

4. **FeedbackDisplay**
   - Score presentation
   - Performance metrics
   - Learning suggestions
   - Progress tracking

### Game-Specific Components

1. **Writing Games**
   - TextInput: Enhanced input with spell checking
   - WordSuggestions: Intelligent word completion
   - Grammar Validation: Real-time grammar checking

2. **Selection Games**
   - OptionGrid: Flexible grid for multiple choice
   - DragDrop: Reusable drag and drop functionality
   - MatchingPairs: Pair matching system

3. **Canvas Games**
   - DrawingBoard: Reusable canvas component
   - ShapeRecognition: Drawing validation
   - InteractiveElements: Clickable canvas objects

4. **Audio Games**
   - SoundPlayer: Audio playback controls
   - VoiceRecorder: Voice input handling
   - WaveformDisplay: Audio visualization

## State Management (Zustand)

```typescript
interface GameStore {
  // Common state
  currentGame: IGame;
  gameStatus: GameStatus;
  score: number;
  
  // Game specific state
  parameters: Record<string, any>;
  progress: GameProgress;
  
  // Actions
  initializeGame: (config: GameConfig) => void;
  updateScore: (points: number) => void;
  finishGame: () => void;
}
```

## Game Lifecycle

1. **Parameter Selection**
   - Configure difficulty
   - Set game-specific options
   - Load necessary resources

2. **Instructions Display**
   - Show game rules
   - Provide examples
   - Optional practice round

3. **Game Execution**
   - Core game logic
   - Progress tracking
   - Real-time feedback

4. **Results & Feedback**
   - Final score
   - Performance analysis
   - Learning recommendations

## Adding New Games

### Steps to Add a New Game

1. Create a new directory under `src/games/[GameName]/`
2. Implement the IGame interface
3. Create game-specific components
4. Register in the game registry

### Directory Structure
```
src/games/[GameName]/
  ├── index.tsx           # Main game component
  ├── config.ts          # Game configuration
  ├── types.ts           # Game-specific types
  ├── components/        # Game-specific components
  ├── hooks/            # Custom hooks
  └── utils/            # Helper functions
```

### Registering a New Game in the Store

After creating a new game following the architecture pattern, you must register it in the game store to make it available in the UI:

1. **Create a Game Metadata Object**

```typescript
// src/games/[GameName]/metadata.ts
import { Game } from '@/store/gameStore';

export const gameMetadata: Game = {
  id: 'game-unique-id',
  name: 'Game Display Name',
  description: 'Brief description of the game',
  category: 'vocabulary', // or other category
  difficulty: ['beginner', 'intermediate', 'advanced'], // available difficulties
  thumbnail: '/path/to/thumbnail-image.png',
  path: '/games/game-path-url'
};
```

2. **Register the Game During App Initialization**

```typescript
// src/pages/GamesPage.tsx or similar initialization location
import { useEffect } from 'react';
import useGameStore from '@/store/gameStore';
import { gameMetadata as newGameMetadata } from '@/games/[GameName]/metadata';

// In your component
const { games, registerGame } = useGameStore();

useEffect(() => {
  // Check if the game is already registered
  const isRegistered = games.some(game => game.id === newGameMetadata.id);
  if (!isRegistered) {
    registerGame(newGameMetadata);
  }
}, []);
```

Alternatively, you can use a central registry file to manage all game registrations:

```typescript
// src/games/registry.ts
import { useEffect } from 'react';
import useGameStore from '@/store/gameStore';
import { gameMetadata as wordMatchMetadata } from '@/games/WordMatch/metadata';
import { gameMetadata as newGameMetadata } from '@/games/[GameName]/metadata';

export const useGameRegistry = () => {
  const { games, registerGame } = useGameStore();

  useEffect(() => {
    const gamesList = [wordMatchMetadata, newGameMetadata];
    
    gamesList.forEach(metadata => {
      const isRegistered = games.some(game => game.id === metadata.id);
      if (!isRegistered) {
        registerGame(metadata);
      }
    });
  }, []);
};
```

3. **Update App.tsx Routes**

Finally, add a route for your new game in App.tsx:

```typescript
// src/App.tsx
import NewGame from './games/[GameName]';

// In your routes
<Route path="/games/game-path-url" element={<NewGame />} />
```

By following these steps, your new game will be properly integrated into the application's registry and UI.

## Extensibility

### Plugin System
- Standardized interface for new game types
- Custom difficulty implementations
- Scoring system customization

### Theme Support
- Game-specific visual themes
- Difficulty indicators
- Feedback visualizations

### Analytics
- Performance tracking
- Learning progress monitoring
- Adaptive difficulty adjustment

## Best Practices

1. **Component Reuse**
   - Leverage base components
   - Share common utilities
   - Use consistent patterns

2. **State Management**
   - Keep game state isolated
   - Use actions for state changes
   - Maintain predictable data flow

3. **Performance**
   - Lazy load game resources
   - Optimize rendering cycles
   - Cache game assets

4. **Accessibility**
   - Keyboard navigation
   - Screen reader support
   - Color contrast compliance

## Implementation Guidelines

1. All games should extend the BaseGame class
2. Use TypeScript for type safety
3. Implement error boundaries
4. Include unit tests
5. Document game-specific requirements

This architecture provides a solid foundation for building maintainable and extensible educational games while promoting code reuse and consistent user experience.