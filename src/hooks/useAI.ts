import { useEffect } from "react";
import type { Player, GameMode, Board, GameConfig } from "../types/game";
import { getAvailableMoves, checkWinner } from "../utils/gameUtils";

// Optimized minimax with alpha-beta pruning and depth limiting
const minimax = (
  board: Board,
  depth: number,
  isMaximizing: boolean,
  aiPlayer: Player,
  config: GameConfig,
  alpha: number = -Infinity,
  beta: number = Infinity,
  maxDepth: number = 4
): number => {
  const winner = checkWinner(board, config);
  const humanPlayer = aiPlayer === "X" ? "O" : "X";

  // Terminal states
  if (winner === aiPlayer) return 1000 - depth;
  if (winner === humanPlayer) return depth - 1000;
  if (board.flat().every(Boolean)) return 0;

  // Depth limiting to prevent excessive computation
  if (depth >= maxDepth) {
    return evaluateBoard(board, aiPlayer, config);
  }

  const availableMoves = getAvailableMoves(board);

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (const [row, col] of availableMoves) {
      const newBoard = board.map((r: Player[], i: number) =>
        r.map((cell: Player, j: number) =>
          i === row && j === col ? aiPlayer : cell
        )
      );
      const score = minimax(
        newBoard,
        depth + 1,
        false,
        aiPlayer,
        config,
        alpha,
        beta,
        maxDepth
      );
      bestScore = Math.max(bestScore, score);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (const [row, col] of availableMoves) {
      const newBoard = board.map((r: Player[], i: number) =>
        r.map((cell: Player, j: number) =>
          i === row && j === col ? humanPlayer : cell
        )
      );
      const score = minimax(
        newBoard,
        depth + 1,
        true,
        aiPlayer,
        config,
        alpha,
        beta,
        maxDepth
      );
      bestScore = Math.min(bestScore, score);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) break; // Alpha-beta pruning
    }
    return bestScore;
  }
};

// Heuristic evaluation function for non-terminal states
const evaluateBoard = (
  board: Board,
  aiPlayer: Player,
  config: GameConfig
): number => {
  const humanPlayer = aiPlayer === "X" ? "O" : "X";
  const { boardSize, winLength } = config;
  let score = 0;

  // Evaluate rows
  for (let i = 0; i < boardSize; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      score += evaluateLine(
        board,
        i,
        j,
        0,
        1,
        winLength,
        aiPlayer,
        humanPlayer
      );
    }
  }

  // Evaluate columns
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = 0; j < boardSize; j++) {
      score += evaluateLine(
        board,
        i,
        j,
        1,
        0,
        winLength,
        aiPlayer,
        humanPlayer
      );
    }
  }

  // Evaluate diagonals
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = 0; j <= boardSize - winLength; j++) {
      score += evaluateLine(
        board,
        i,
        j,
        1,
        1,
        winLength,
        aiPlayer,
        humanPlayer
      );
    }
  }

  // Evaluate reverse diagonals
  for (let i = 0; i <= boardSize - winLength; i++) {
    for (let j = winLength - 1; j < boardSize; j++) {
      score += evaluateLine(
        board,
        i,
        j,
        1,
        -1,
        winLength,
        aiPlayer,
        humanPlayer
      );
    }
  }

  return score;
};

// Evaluate a line of cells for potential wins
const evaluateLine = (
  board: Board,
  startRow: number,
  startCol: number,
  deltaRow: number,
  deltaCol: number,
  length: number,
  aiPlayer: Player,
  humanPlayer: Player
): number => {
  let aiCount = 0;
  let humanCount = 0;
  let emptyCount = 0;

  for (let i = 0; i < length; i++) {
    const cell = board[startRow + i * deltaRow][startCol + i * deltaCol];
    if (cell === aiPlayer) aiCount++;
    else if (cell === humanPlayer) humanCount++;
    else emptyCount++;
  }

  // Scoring based on potential
  if (humanCount === 0 && aiCount > 0) {
    return Math.pow(10, aiCount); // AI has potential
  } else if (aiCount === 0 && humanCount > 0) {
    return -Math.pow(10, humanCount); // Human has potential
  }

  return 0; // Blocked line
};

// Smart move selection with prioritization
const makeAIMove = (
  board: Board,
  aiPlayer: Player,
  config: GameConfig
): [number, number] => {
  const availableMoves = getAvailableMoves(board);
  if (availableMoves.length === 0) return [0, 0];

  // Check for immediate win
  for (const [row, col] of availableMoves) {
    const testBoard = board.map((r: Player[], i: number) =>
      r.map((cell: Player, j: number) =>
        i === row && j === col ? aiPlayer : cell
      )
    );
    if (checkWinner(testBoard, config) === aiPlayer) {
      return [row, col];
    }
  }

  // Check for blocking opponent's win
  const humanPlayer = aiPlayer === "X" ? "O" : "X";
  for (const [row, col] of availableMoves) {
    const testBoard = board.map((r: Player[], i: number) =>
      r.map((cell: Player, j: number) =>
        i === row && j === col ? humanPlayer : cell
      )
    );
    if (checkWinner(testBoard, config) === humanPlayer) {
      return [row, col];
    }
  }

  // Use minimax for strategic moves (with limited depth)
  const maxDepth = Math.min(4, Math.max(2, 6 - config.boardSize)); // Adaptive depth
  let bestScore = -Infinity;
  let bestMove: [number, number] = availableMoves[0];

  for (const [row, col] of availableMoves) {
    const newBoard = board.map((r: Player[], i: number) =>
      r.map((cell: Player, j: number) =>
        i === row && j === col ? aiPlayer : cell
      )
    );

    const score = minimax(
      newBoard,
      1,
      false,
      aiPlayer,
      config,
      -Infinity,
      Infinity,
      maxDepth
    );
    if (score > bestScore) {
      bestScore = score;
      bestMove = [row, col];
    }
  }

  return bestMove;
};

export const useAI = (
  gameMode: GameMode,
  currentPlayer: Player,
  board: Board,
  winner: Player | null,
  isDraw: boolean,
  config: GameConfig,
  onAIMove: (row: number, col: number) => void
) => {
  useEffect(() => {
    if (gameMode === "ai" && currentPlayer === "O" && !winner && !isDraw) {
      // Faster response time for better UX
      const timer = setTimeout(() => {
        const [aiRow, aiCol] = makeAIMove(board, "O", config);
        onAIMove(aiRow, aiCol);
      }, 200); // Reduced from 500ms to 200ms

      return () => clearTimeout(timer);
    }
  }, [currentPlayer, board, gameMode, winner, isDraw, config, onAIMove]);

  return {
    makeAIMove: (board: Board, aiPlayer: Player) =>
      makeAIMove(board, aiPlayer, config),
  };
};
