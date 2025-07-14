export type Player = "X" | "O" | null;
export type GameMode = "player" | "ai";
export type Board = Player[][];

export interface GameConfig {
  boardSize: number;
  winLength: number; // How many in a row to win (default: boardSize)
}

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player;
  isDraw: boolean;
  gameHistory: Board[];
  historyIndex: number;
  config: GameConfig;
}

export interface Score {
  X: number;
  O: number;
  draws: number;
}
