# Tic Tac Toe React Component

A customizable Tic Tac Toe game component for React with AI opponent, configurable board size, and flexible win conditions.

## Features

- 🎮 **Customizable Board Size**: Play on boards from 3x3 to any size
- 🎯 **Flexible Win Conditions**: Configure how many in a row to win
- 🤖 **AI Opponent**: Built-in AI with smart move selection
- 🎨 **Customizable Styling**: Pass custom CSS classes and styles
- 📱 **Responsive Design**: Adapts to different screen sizes
- 🏆 **Score Tracking**: Keep track of wins, losses, and draws
- 🔄 **Game History**: Undo/redo functionality
- 📦 **TypeScript Support**: Full type definitions included

## Installation

```bash
yarn add @khanhpham/tic-tac-toe-react
```

or

```bash
npm install @khanhpham/tic-tac-toe-react
```

## Quick Start

```tsx
import React from 'react';
import { TicTacToe } from '@khanhpham/tic-tac-toe-react';

function App() {
  return (
    <div>
      <h1>My Tic Tac Toe Game</h1>
      <TicTacToe />
    </div>
  );
}
```

## Basic Usage

### Default Game (3x3 board, 3 in a row to win)

```tsx
import { TicTacToe } from '@khanhpham/tic-tac-toe-react';

<TicTacToe />
```

### Custom Board Size and Win Condition

```tsx
<TicTacToe 
  initialBoardSize={5} 
  initialWinLength={4} 
/>
```

### Custom Styling

```tsx
<TicTacToe 
  className="my-custom-game"
  style={{ 
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '20px'
  }}
/>
```

### Handle Winner Events

```tsx
<TicTacToe 
  onWinner={() => {
    console.log('Player X won!');
    // Add your custom logic here
  }}
/>
```

### Hide Configuration Controls

```tsx
<TicTacToe 
  showConfigControls={false}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `initialBoardSize` | `number` | `10` | Initial size of the game board |
| `initialWinLength` | `number` | `4` | Number of marks in a row needed to win |
| `showConfigControls` | `boolean` | `true` | Whether to show configuration controls |
| `className` | `string` | `""` | Additional CSS class name |
| `style` | `React.CSSProperties` | `{}` | Additional inline styles |
| `onWinner` | `() => void` | `() => {}` | Callback when a player wins |

## Advanced Usage

### Using Individual Hooks

```tsx
import { 
  useGameState, 
  useScore, 
  useAI, 
  useGameMode,
  useBoardSize,
  useWinLength 
} from '@khanhpham/tic-tac-toe-react';

function CustomGame() {
  const { boardSize } = useBoardSize(5);
  const { winLength } = useWinLength(5, 4);
  const { gameMode } = useGameMode();
  const { gameState, makeMove, resetGame } = useGameState(boardSize, winLength);
  const { updateScore, getTotalGames } = useScore();

  // Your custom game logic here
  return (
    <div>
      {/* Custom game UI */}
    </div>
  );
}
```

### Using Types

```tsx
import type { 
  Player, 
  GameMode, 
  Board, 
  GameConfig, 
  GameState, 
  Score 
} from '@khanhpham/tic-tac-toe-react';

// Use types in your custom components
```

## Game Modes

- **Player vs Player**: Two human players take turns
- **Player vs AI**: Human player (X) vs AI opponent (O)

## AI Features

The AI opponent uses a smart algorithm to:
- Block winning moves
- Create winning opportunities
- Play strategically based on board position
- Adapt to different board sizes and win conditions

## Styling

The component is fully customizable through:
- CSS classes via `className` prop
- Inline styles via `style` prop
- Responsive design that adapts to board size

## Browser Support

- React 16.8+ (for hooks support)
- Modern browsers with ES2020 support
- TypeScript 4.0+

## Development

```bash
# Install dependencies
yarn install

# Start development server
yarn dev

# Build for production
yarn build

# Build library for npm
yarn build:lib

# Lint code
yarn lint
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
