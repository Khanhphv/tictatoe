// Main component export
export { default as TicTacToe } from "./components/TicTacToe";

// Button component export
export { default as Button } from "./components/atoms/Button";

// Type exports
export type {
  Player,
  GameMode,
  Board,
  GameConfig,
  GameState,
  Score,
} from "./types/game";

// Hook exports
export { useGameState } from "./hooks/useGameState";
export { useScore } from "./hooks/useScore";
export { useAI } from "./hooks/useAI";
export { useGameMode } from "./hooks/useGameMode";
export { useBoardSize } from "./hooks/useBoardSize";
export { useWinLength } from "./hooks/useWinLength";
