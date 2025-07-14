import type { Player, Board, GameConfig } from "../types/game";

export const getInitialBoard = (boardSize: number): Board =>
  Array.from({ length: boardSize }, () => Array(boardSize).fill(null));

export const checkWinner = (board: Board, config: GameConfig): Player => {
  const { boardSize, winLength } = config;

  // Check rows
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      const firstCell = board[i][j];
      if (!firstCell) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i][j + k] !== firstCell) {
          win = false;
          break;
        }
      }
      if (win) return firstCell;
    }
  }

  // Check columns
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = 0; j < boardSize; j++) {
      const firstCell = board[i][j];
      if (!firstCell) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j] !== firstCell) {
          win = false;
          break;
        }
      }
      if (win) return firstCell;
    }
  }

  // Check diagonals (top-left to bottom-right)
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      const firstCell = board[i][j];
      if (!firstCell) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j + k] !== firstCell) {
          win = false;
          break;
        }
      }
      if (win) return firstCell;
    }
  }

  // Check diagonals (top-right to bottom-left)
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = winLength - 1; j < boardSize; j++) {
      const firstCell = board[i][j];
      if (!firstCell) continue;

      let win = true;
      for (let k = 1; k < winLength; k++) {
        if (board[i + k][j - k] !== firstCell) {
          win = false;
          break;
        }
      }
      if (win) return firstCell;
    }
  }

  return null;
};

export const getAvailableMoves = (board: Board): [number, number][] => {
  const moves: [number, number][] = [];
  const boardSize = board.length;

  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j < boardSize; j++) {
      if (!board[i][j]) {
        moves.push([i, j]);
      }
    }
  }
  return moves;
};

export const getDefaultConfig = (
  boardSize: number = 3,
  winLength?: number
): GameConfig => {
  // Default to 4 in a row for boards 4x4 and larger, 3 in a row for 3x3
  const defaultWinLength = winLength || (boardSize >= 4 ? 4 : boardSize);
  return {
    boardSize,
    winLength: defaultWinLength,
  };
};
